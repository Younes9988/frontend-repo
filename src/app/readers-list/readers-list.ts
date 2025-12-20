import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';

import { UtilisateurService } from '../services/utilisateur.service';
import { Utilisateur } from '../models/utilisateur.model';

@Component({
  selector: 'app-readers-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './readers-list.html',
  styleUrls: ['./readers-list.scss']
})
export class ReadersList implements OnInit {

  utilisateurs$!: Observable<Utilisateur[]>;
  filteredUtilisateurs$!: Observable<Utilisateur[]>;

  searchTerm = '';
  selectedRole = 'ALL';

  private search$ = new BehaviorSubject<string>('');
  private role$ = new BehaviorSubject<string>('ALL');

  roles = [
    { value: 'ALL', label: 'All roles' },
    { value: 'LECTEUR', label: 'Reader' },
    { value: 'ADMIN', label: 'Admin' },
    { value: 'BIBLIOTHECAIRE', label: 'Librarian' }
  ];

  constructor(
    private utilisateurService: UtilisateurService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.utilisateurs$ = this.utilisateurService.utilisateurs$;

    this.filteredUtilisateurs$ = combineLatest([
      this.utilisateurs$,
      this.search$,
      this.role$
    ]).pipe(
      map(([users, search, role]) =>
        users.filter(u =>
          this.matchesSearch(u, search) &&
          this.matchesRole(u, role)
        )
      )
    );

    this.utilisateurService.fetchUtilisateurs();
  }

  onSearchChange(value: string) {
    this.search$.next(value);
  }

  onRoleChange(value: string) {
    this.role$.next(value);
  }

  goToAddUser() {
    this.router.navigate(['/add-user']);
  }

  goToDetails(id: number) {
    this.router.navigate(['/user-details', id]);
  }

  private matchesSearch(u: Utilisateur, search: string): boolean {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      u.nom.toLowerCase().includes(s) ||
      u.prenom.toLowerCase().includes(s) ||
      u.email.toLowerCase().includes(s)
    );
  }

  private matchesRole(u: Utilisateur, role: string): boolean {
    return role === 'ALL' || u.role === role;
  }
}
