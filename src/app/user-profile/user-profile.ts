import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { UtilisateurService } from '../services/utilisateur.service';
import { Utilisateur } from '../models/utilisateur.model';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.scss',
})
export class UserProfile implements OnInit {
  user: Utilisateur | null = null;
  loading = true;
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';
  saving = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private authService: AuthService,
    private utilisateurService: UtilisateurService,
    private router: Router,
     private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const email = this.authService.email;
    if (!email) {
      this.router.navigate(['/user-home']);
      return;
    }

    this.utilisateurService.getByEmail(email).subscribe({
      next: user => {
        this.user = user;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.router.navigate(['/user-home']);
      }
    });
  }

  changePassword() {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.currentPassword || !this.newPassword || !this.confirmPassword) {
      this.errorMessage = 'Please fill all password fields.';
      return;
    }

    if (this.newPassword.length < 6) {
      this.errorMessage = 'New password must be at least 6 characters.';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    if (!this.user?.email) {
      this.errorMessage = 'User email is missing.';
      return;
    }

    this.saving = true;

    this.authService.changePassword({
      email: this.user.email,
      currentPassword: this.currentPassword,
      newPassword: this.newPassword
    }).subscribe({
      next: () => {
        this.saving = false;
        this.successMessage = 'Password updated successfully.';
        this.currentPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';
      },
      error: err => {
        this.saving = false;
        this.errorMessage =
          err?.error?.message || 'Failed to update password.';
      }
    });
  }
}
