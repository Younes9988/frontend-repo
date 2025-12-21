import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../services/auth.service';

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
    private authService: AuthService,
    private router: Router
  ) {}

  submit() {
    this.errorMessage = '';
    this.saving = true;

    this.authService.register({
      email: this.form.email,
      password: this.form.motDePasse,
      nom: this.form.nom,
      prenom: this.form.prenom
    }).subscribe({
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
