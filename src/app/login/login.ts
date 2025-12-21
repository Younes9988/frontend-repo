import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {

  email = '';
  password = '';
  errorMessage = '';
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

 submit() {
  if (!this.email || !this.password) {
    this.errorMessage = 'Email and password are required';
    return;
  }

  this.loading = true;
  this.errorMessage = '';

  this.authService.login({
    email: this.email,
    password: this.password
  }).subscribe({
    next: () => {
      this.loading = false;

      // ✅ ROLE-BASED REDIRECT
      if (this.authService.isAdmin()) {
        this.router.navigate(['/adminbooklist']);
      } else {
        this.router.navigate(['/userbooklist']);
      }
    },
    error: () => {
      this.loading = false;
      this.errorMessage = 'Invalid email or password';
    }
  });
}

}
