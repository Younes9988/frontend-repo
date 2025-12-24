import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, forkJoin, map, of, take } from 'rxjs';

import { EmpruntService } from '../services/emprunt.service';
import { UtilisateurService } from '../services/utilisateur.service';
import { LivreService } from '../services/livre.service';
import { Emprunt } from '../models/emprunt.model';
import { Utilisateur } from '../models/utilisateur.model';
import { Livre } from '../models/livre.model';

@Component({
  selector: 'app-emprunt-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './emprunt-detail.html',
  styleUrl: './emprunt-detail.scss',
})
export class EmpruntDetail implements OnInit {
  emprunt: Emprunt | null = null;
  user: Utilisateur | null = null;
  book: Livre | null = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private empruntService: EmpruntService,
    private utilisateurService: UtilisateurService,
    private livreService: LivreService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const query = this.route.snapshot.queryParamMap;
    if (!id) {
      this.router.navigate(['/emprunt-list']);
      return;
    }

    this.empruntService.getEmpruntById(id).subscribe({
      next: emprunt => {
        this.emprunt = emprunt;
        const livreId = Number(query.get('livreId') ?? emprunt.livreId);
        const lecteurId = Number(query.get('lecteurId') ?? emprunt.lecteurId);
        this.livreService.fetchLivres();

        forkJoin({
          user: this.utilisateurService
            .getUtilisateur(lecteurId)
            .pipe(catchError(() => of(null))),
          book: this.livreService
            .getLivreById(livreId)
            .pipe(
              catchError(() =>
                this.livreService.livres$.pipe(
                  map(livres => livres.find(l => l.livreId === livreId) ?? null),
                  take(1)
                )
              )
            )
        }).subscribe(({ user, book }) => {
          this.user = user;
          this.book = book;
          this.loading = false;
          this.cdr.detectChanges();
        });
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
        this.router.navigate(['/emprunt-list']);
      }
    });
  }
}
