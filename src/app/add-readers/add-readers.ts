import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { UtilisateurService } from '../services/utilisateur.service';

@Component({
  selector: 'app-add-readers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-readers.html',
  styleUrls: ['./add-readers.scss']
})
export class AddReaders {

  form = {
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    adresse: '',
    motDePasse: ''
  };

  saving = false;
  errorMessage = '';

  constructor(
    private utilisateurService: UtilisateurService,
    private router: Router
  ) {}

  submit() {
    this.errorMessage = '';
    this.saving = true;

    this.utilisateurService.createLecteur(this.form).subscribe({
      next: () => {
        this.router.navigate(['/users-list']);
      },
      error: err => {
        this.errorMessage = err?.error?.message || 'Erreur lors de la création';
        this.saving = false;
      }
    });
  }

  cancel() {
    this.router.navigate(['/users-list']);
  }
}
