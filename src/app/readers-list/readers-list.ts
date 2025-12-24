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
  pagedUtilisateurs$!: Observable<Utilisateur[]>;
  totalPages$!: Observable<number>;

  searchTerm = '';
  selectedRole = 'ALL';

  private search$ = new BehaviorSubject<string>('');
  private role$ = new BehaviorSubject<string>('ALL');

  currentPage$ = new BehaviorSubject<number>(1);
  pageSize$ = new BehaviorSubject<number>(5);

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

    this.totalPages$ = combineLatest([this.filteredUtilisateurs$, this.pageSize$]).pipe(
      map(([users, size]) => Math.ceil(users.length / size))
    );

    this.pagedUtilisateurs$ = combineLatest([
      this.filteredUtilisateurs$,
      this.currentPage$,
      this.pageSize$
    ]).pipe(
      map(([users, page, size]) => {
        const start = (page - 1) * size;
        return users.slice(start, start + size);
      })
    );

    this.utilisateurService.fetchUtilisateurs();
  }

  onSearchChange(value: string) {
    this.search$.next(value);
    this.currentPage$.next(1);
  }

  onRoleChange(value: string) {
    this.role$.next(value);
    this.currentPage$.next(1);
  }

  goToAddUser() {
    this.router.navigate(['/add-user']);
  }

  goToDetails(id: number) {
    this.router.navigate(['/user-details', id]);
  }

  prevPage() {
    const current = this.currentPage$.value;
    if (current > 1) {
      this.currentPage$.next(current - 1);
    }
  }

  nextPage(totalPages: number) {
    const current = this.currentPage$.value;
    if (current < totalPages) {
      this.currentPage$.next(current + 1);
    }
  }

  goToPage(page: number) {
    this.currentPage$.next(page);
  }

  changePageSize(size: number) {
    this.pageSize$.next(+size);
    this.currentPage$.next(1);
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
