import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { UtilisateurService } from '../services/utilisateur.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar implements OnInit {
  userName = 'User';
  userEmail = '';

  constructor(
    private authService: AuthService,
    private utilisateurService: UtilisateurService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const email = this.authService.email;
    if (!email) return;

    this.utilisateurService.getByEmail(email).subscribe({
      next: user => {
        this.userName = `${user.prenom ?? ''} ${user.nom ?? ''}`.trim() || 'User';
        this.userEmail = user.email ?? email;
      },
      error: () => {
        this.userEmail = email;
      }
    });
  }

  goToProfile(): void {
    if (this.authService.isAdmin()) {
      this.router.navigate(['/admin-profile']);
      return;
    }

    this.router.navigate(['/user-profile']);
  }
}
