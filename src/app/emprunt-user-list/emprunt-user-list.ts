import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';

import { EmpruntService } from '../services/emprunt.service';
import { AuthService } from '../services/auth.service';
import { UtilisateurService } from '../services/utilisateur.service';
import { Emprunt } from '../models/emprunt.model';

@Component({
  selector: 'app-emprunt-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './emprunt-user-list.html',
  styleUrls: ['./emprunt-user-list.scss']
})
export class EmpruntUserList implements OnInit {

  emprunts$!: Observable<Emprunt[]>;
  pagedEmprunts$!: Observable<Emprunt[]>;
  totalPages$!: Observable<number>;

  search$ = new BehaviorSubject('');
  statut$ = new BehaviorSubject('ALL');
  currentPage$ = new BehaviorSubject(1);
  pageSize$ = new BehaviorSubject(5);

  statuts = [
    { value: 'ALL', label: 'All' },
    { value: 'EN_COURS', label: 'En cours' },
    { value: 'RETOURNE', label: 'Retourné' },
    { value: 'EN_RETARD', label: 'En retard' }
  ];

  constructor(
    private empruntService: EmpruntService,
    private auth: AuthService,
    private utilisateurService: UtilisateurService
  ) {}

  ngOnInit(): void {

    // ✅ assign injected service streams HERE
    this.emprunts$ = this.empruntService.emprunts$;

    const filtered$ = combineLatest([
      this.emprunts$,
      this.search$,
      this.statut$
    ]).pipe(
      map(([list, s, st]) =>
        list.filter(e =>
          (st === 'ALL' || e.statutEmprunt === st) &&
          e.livreId.toString().includes(s)
        )
      )
    );

    this.totalPages$ = combineLatest([filtered$, this.pageSize$]).pipe(
      map(([l, size]) => Math.ceil(l.length / size))
    );

    this.pagedEmprunts$ = combineLatest([
      filtered$,
      this.currentPage$,
      this.pageSize$
    ]).pipe(
      map(([l, p, s]) => l.slice((p - 1) * s, p * s))
    );

    // 🔥 Fetch data AFTER pipelines exist
    const email = this.auth.email;
    if (!email) return;

    this.utilisateurService.getByEmail(email).subscribe(user => {
      this.empruntService.fetchEmpruntsByLecteur(user.id);
    });
  }

  daysLeft(e: Emprunt): number {
    const today = new Date();
    const due = new Date(e.dateRetourPrevue);
    return Math.ceil((due.getTime() - today.getTime()) / 86400000);
  }
}

