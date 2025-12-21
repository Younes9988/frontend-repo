import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-sidebar-lecteur',
  imports: [RouterModule],
  standalone: true,
  templateUrl: './sidebar-lecteur.html',
  styleUrl: './sidebar-lecteur.scss',
})
export class SidebarLecteur {
    constructor(
    private auth: AuthService,
    private router: Router
  ) {}
  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
