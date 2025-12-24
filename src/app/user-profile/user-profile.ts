import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { UtilisateurService } from '../services/utilisateur.service';
import { Utilisateur } from '../models/utilisateur.model';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.scss',
})
export class UserProfile implements OnInit {
  user: Utilisateur | null = null;
  loading = true;

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
}
