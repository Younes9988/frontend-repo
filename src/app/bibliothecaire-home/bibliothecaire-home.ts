import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { map, Observable } from 'rxjs';

import { LivreService } from '../services/livre.service';
import { UtilisateurService } from '../services/utilisateur.service';
import { EmpruntService } from '../services/emprunt.service';

@Component({
  selector: 'app-bibliothecaire-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './bibliothecaire-home.html',
  styleUrl: './bibliothecaire-home.scss',
})
export class BibliothecaireHome implements OnInit {
  availableBooks$!: Observable<number>;
  readersCount$!: Observable<number>;
  currentLoans$!: Observable<number>;
  lateLoans$!: Observable<number>;

  constructor(
    private livreService: LivreService,
    private utilisateurService: UtilisateurService,
    private empruntService: EmpruntService
  ) {}

  ngOnInit(): void {
    this.availableBooks$ = this.livreService.livres$.pipe(
      map(livres =>
        livres.reduce((sum, livre) => sum + (livre.nombreCopies || 0), 0)
      )
    );

    this.readersCount$ = this.utilisateurService.utilisateurs$.pipe(
      map(utilisateurs => utilisateurs.filter(u => u.role === 'LECTEUR').length)
    );

    this.currentLoans$ = this.empruntService.emprunts$.pipe(
      map(emprunts => emprunts.filter(e => e.statutEmprunt === 'EN_COURS').length)
    );

    this.lateLoans$ = this.empruntService.emprunts$.pipe(
      map(emprunts => emprunts.filter(e => e.statutEmprunt === 'EN_RETARD').length)
    );

    this.livreService.fetchLivres();
    this.utilisateurService.fetchUtilisateurs();
    this.empruntService.fetchEmprunts();
  }
}
