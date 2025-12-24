import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { map, Observable } from 'rxjs';

import { Livre } from '../models/livre.model';
import { Emprunt } from '../models/emprunt.model';
import { LivreService } from '../services/livre.service';
import { EmpruntService } from '../services/emprunt.service';
import { UtilisateurService } from '../services/utilisateur.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-user-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-home.html',
  styleUrl: './user-home.scss',
})
export class UserHome implements OnInit {
  booksForYou$!: Observable<Livre[]>;
  lateLoans$!: Observable<Emprunt[]>;
  userName = 'Reader';
  userEmail = '';

  constructor(
    private livreService: LivreService,
    private empruntService: EmpruntService,
    private utilisateurService: UtilisateurService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.booksForYou$ = this.livreService.livres$.pipe(
      map(livres => livres.slice(0, 3))
    );

    this.lateLoans$ = this.empruntService.emprunts$.pipe(
      map(emprunts => emprunts.filter(e => e.statutEmprunt === 'EN_RETARD'))
    );

    this.livreService.fetchLivres();

    const email = this.authService.email;
    if (email) {
      this.utilisateurService.getByEmail(email).subscribe({
        next: user => {
          this.userName = `${user.prenom ?? ''} ${user.nom ?? ''}`.trim() || 'Reader';
          this.userEmail = user.email ?? email;
          if (user.id) {
            this.empruntService.fetchEmpruntsByLecteur(user.id);
          } else {
            this.empruntService.fetchEmprunts();
          }
        },
        error: () => {
          this.userEmail = email;
          this.empruntService.fetchEmprunts();
        }
      });
    } else {
      this.empruntService.fetchEmprunts();
    }
  }
}
