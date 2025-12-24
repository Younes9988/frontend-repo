import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';

import { EmpruntService } from '../services/emprunt.service';
import { LivreService } from '../services/livre.service';
import { UtilisateurService } from '../services/utilisateur.service';
import { Emprunt } from '../models/emprunt.model';
import { Livre } from '../models/livre.model';
import { Utilisateur } from '../models/utilisateur.model';
import { Router, RouterModule } from '@angular/router';

interface EmpruntView extends Emprunt {
  bookTitle: string;
  userName: string;
  statusLabel: string;
  statusClass: string;
}

@Component({
  selector: 'app-emprunts-list',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './emprunt-list.html',
  styleUrls: ['./emprunt-list.scss']
})
export class EmpruntsList implements OnInit {
  emprunts$!: Observable<Emprunt[]>;
  livres$!: Observable<Livre[]>;
  utilisateurs$!: Observable<Utilisateur[]>;
  pagedEmprunts$!: Observable<EmpruntView[]>;
  totalPages$!: Observable<number>;

  currentPage$ = new BehaviorSubject<number>(1);
  pageSize$ = new BehaviorSubject<number>(5);

  searchTerm = '';
  selectedStatut = 'ALL';

  private search$ = new BehaviorSubject<string>('');
  private statut$ = new BehaviorSubject<string>('ALL');

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
    private livreService: LivreService,
    private utilisateurService: UtilisateurService,
    private router: Router
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
      map(([emprunts, livres, utilisateurs, search, statut]) => {
        const term = search.trim().toLowerCase();
        const livreMap = new Map(livres.map(l => [l.livreId, l]));
        const userMap = new Map(utilisateurs.map(u => [u.id, u]));

        return emprunts
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
            (statut === 'ALL' || e.statutEmprunt === statut) &&
            (!term ||
              e.bookTitle.toLowerCase().includes(term) ||
              e.userName.toLowerCase().includes(term))
          );
      })
    );

    this.totalPages$ = combineLatest([filtered$, this.pageSize$]).pipe(
      map(([emprunts, size]) => Math.ceil(emprunts.length / size))
    );

    this.pagedEmprunts$ = combineLatest([
      filtered$,
      this.currentPage$,
      this.pageSize$
    ]).pipe(
      map(([emprunts, page, size]) => {
        const start = (page - 1) * size;
        return emprunts.slice(start, start + size);
      })
    );

    this.empruntService.fetchEmprunts();
    this.livreService.fetchLivres();
    this.utilisateurService.fetchUtilisateurs();
  }

  onSearchChange(v: string) {
    this.search$.next(v);
  }

  onStatutChange(v: string) {
    this.statut$.next(v);
  }

  retourner(emprunt: Emprunt) {
    this.empruntService
      .retournerEmprunt(emprunt.id)
      .subscribe(() => this.empruntService.fetchEmprunts());
  }

  goToDetails(emprunt: Emprunt) {
    this.router.navigate(['/emprunt-details', emprunt.id], {
      queryParams: {
        livreId: emprunt.livreId,
        lecteurId: emprunt.lecteurId
      }
    });
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
}
