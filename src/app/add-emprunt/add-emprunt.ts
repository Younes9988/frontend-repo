import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import {
  BehaviorSubject,
  combineLatest,
  map,
  Observable,
  of,
  debounceTime,
  distinctUntilChanged
} from 'rxjs';

import { EmpruntService } from '../services/emprunt.service';
import { LivreService } from '../services/livre.service';
import { UtilisateurService } from '../services/utilisateur.service';

import { Livre } from '../models/livre.model';
import { Utilisateur } from '../models/utilisateur.model';

@Component({
  selector: 'app-add-emprunt',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './add-emprunt.html',
  styleUrls: ['./add-emprunt.scss']
})
export class AddEmprunt implements OnInit {

  // ------------------------------------------------------------------
  // 1️⃣ STREAMS (INITIALIZED SAFELY — NEVER UNDEFINED)
  // ------------------------------------------------------------------
  livres$: Observable<Livre[]> = of([]);
  utilisateurs$: Observable<Utilisateur[]> = of([]);

  filteredLivres$: Observable<Livre[]> = of([]);
  filteredUtilisateurs$: Observable<Utilisateur[]> = of([]);

  // ------------------------------------------------------------------
  // 2️⃣ SEARCH INPUTS
  // ------------------------------------------------------------------
  livreSearch$ = new BehaviorSubject<string>('');
  utilisateurSearch$ = new BehaviorSubject<string>('');

  // ------------------------------------------------------------------
  // 3️⃣ SELECTED VALUES
  // ------------------------------------------------------------------
  selectedLivre?: Livre;
  selectedUtilisateur?: Utilisateur;

  // ------------------------------------------------------------------
  // 4️⃣ UI STATE
  // ------------------------------------------------------------------
  saving = false;
  errorMessage = '';

  constructor(
    private empruntService: EmpruntService,
    private livreService: LivreService,
    private utilisateurService: UtilisateurService,
    private router: Router
  ) { }

  // ------------------------------------------------------------------
  // 5️⃣ INITIALIZATION (ORDER MATTERS)
  // ------------------------------------------------------------------
  ngOnInit(): void {

    // Streams from services
    this.livres$ = this.livreService.livres$;
    this.utilisateurs$ = this.utilisateurService.utilisateurs$;

    // Filtered books
    this.filteredLivres$ = combineLatest([
      this.livres$,
      this.livreSearch$.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        map(v => v.trim().toLowerCase())
      )
    ]).pipe(
      map(([livres, search]) => {
        if (!search) return []; // 🔴 hide list if empty
        return livres.filter(l =>
          l.titre.toLowerCase().includes(search)
        );
      })
    );


    // Filtered users
    this.filteredUtilisateurs$ = combineLatest([
      this.utilisateurs$,
      this.utilisateurSearch$.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        map(v => v.trim().toLowerCase())
      )
    ]).pipe(
      map(([users, search]) => {
        if (!search) return []; // 🔴 hide list if empty
        return users.filter(u =>
          `${u.nom} ${u.prenom}`.toLowerCase().includes(search)
        );
      })
    );


    // Trigger backend calls
    this.livreService.fetchLivres();
    this.utilisateurService.fetchUtilisateurs();
  }
  clearSelectedLivre(): void {
    this.selectedLivre = undefined;
    this.livreSearch$.next('');
  }

  clearSelectedUtilisateur(): void {
    this.selectedUtilisateur = undefined;
    this.utilisateurSearch$.next('');
  }
  // ------------------------------------------------------------------
  // 6️⃣ SUBMIT
  // ------------------------------------------------------------------
  submit(): void {
    if (!this.selectedLivre || !this.selectedUtilisateur) {
      this.errorMessage = 'Veuillez sélectionner un livre et un utilisateur';
      return;
    }

    this.saving = true;
    this.errorMessage = '';

    this.empruntService
      .creerEmprunt(
        this.selectedUtilisateur.id,
        this.selectedLivre.livreId
      )
      .subscribe({
        next: () => {
          this.saving = false;
          this.router.navigate(['/emprunt-list']);
        },
        error: err => {
          this.saving = false;
          this.errorMessage =
            err?.error?.message ||
            'Erreur lors de la création de l’emprunt';
        }
      });
  }

  // ------------------------------------------------------------------
  // 7️⃣ CANCEL
  // ------------------------------------------------------------------
  cancel(): void {
    this.router.navigate(['/emprunt-list']);
  }
}
