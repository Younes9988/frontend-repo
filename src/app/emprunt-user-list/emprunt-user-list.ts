import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';

import { EmpruntService } from '../services/emprunt.service';
import { AuthService } from '../services/auth.service';
import { LivreService } from '../services/livre.service';
import { UtilisateurService } from '../services/utilisateur.service';
import { Emprunt } from '../models/emprunt.model';
import { Livre } from '../models/livre.model';
import { Utilisateur } from '../models/utilisateur.model';

interface EmpruntView extends Emprunt {
  bookTitle: string;
  userName: string;
  statusLabel: string;
  statusClass: string;
}

@Component({
  selector: 'app-emprunt-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './emprunt-user-list.html',
  styleUrls: ['./emprunt-user-list.scss']
})
export class EmpruntUserList implements OnInit {
  emprunts$!: Observable<Emprunt[]>;
  livres$!: Observable<Livre[]>;
  utilisateurs$!: Observable<Utilisateur[]>;
  pagedEmprunts$!: Observable<EmpruntView[]>;
  totalPages$!: Observable<number>;

  search$ = new BehaviorSubject('');
  statut$ = new BehaviorSubject('ALL');
  currentPage$ = new BehaviorSubject(1);
  pageSize$ = new BehaviorSubject(5);

  statuts = [
    { value: 'ALL', label: 'All' },
    { value: 'EN_COURS', label: 'In progress' },
    { value: 'RETOURNE', label: 'Returned' },
    { value: 'EN_RETARD', label: 'Late' }
  ];

  private statusMeta: Record<
    Emprunt['statutEmprunt'],
    { label: string; className: string }
  > = {
    EN_COURS: { label: 'In progress', className: 'status-in-progress' },
    RETOURNE: { label: 'Returned', className: 'status-returned' },
    EN_RETARD: { label: 'Late', className: 'status-late' }
  };

  constructor(
    private empruntService: EmpruntService,
    private auth: AuthService,
    private livreService: LivreService,
    private utilisateurService: UtilisateurService
  ) {}

  ngOnInit(): void {
    this.emprunts$ = this.empruntService.emprunts$;
    this.livres$ = this.livreService.livres$;
    this.utilisateurs$ = this.utilisateurService.utilisateurs$;

    const filtered$ = combineLatest([
      this.emprunts$,
      this.livres$,
      this.utilisateurs$,
      this.search$,
      this.statut$
    ]).pipe(
      map(([list, livres, utilisateurs, s, st]) => {
        const search = s.trim().toLowerCase();
        const livreMap = new Map(livres.map(l => [l.livreId, l]));
        const userMap = new Map(utilisateurs.map(u => [u.id, u]));

        return list
          .map((e): EmpruntView => {
            const livre = livreMap.get(e.livreId);
            const user = userMap.get(e.lecteurId);
            const statusInfo = this.statusMeta[e.statutEmprunt];

            return {
              ...e,
              bookTitle: livre?.titre ?? `Book #${e.livreId}`,
              userName: user ? `${user.nom} ${user.prenom}` : `User #${e.lecteurId}`,
              statusLabel: statusInfo.label,
              statusClass: statusInfo.className
            };
          })
          .filter(e =>
            (st === 'ALL' || e.statutEmprunt === st) &&
            (!search ||
              e.bookTitle.toLowerCase().includes(search) ||
              e.userName.toLowerCase().includes(search))
          );
      })
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

    const email = this.auth.email;
    if (!email) return;

    this.utilisateurService.getByEmail(email).subscribe(user => {
      this.empruntService.fetchEmpruntsByLecteur(user.id);
    });
    this.livreService.fetchLivres();
    this.utilisateurService.fetchUtilisateurs();
  }

  daysLeft(e: Emprunt): number {
    const today = new Date();
    const due = new Date(e.dateRetourPrevue);
    return Math.ceil((due.getTime() - today.getTime()) / 86400000);
  }
}
