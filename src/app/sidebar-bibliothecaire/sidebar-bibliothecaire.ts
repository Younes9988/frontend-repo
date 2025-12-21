import { Component } from '@angular/core';
import { Router,RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
@Component({
  selector: 'app-sidebar-bibliothecaire',
  imports: [RouterModule],
  standalone: true,
  templateUrl: './sidebar-bibliothecaire.html',
  styleUrl: './sidebar-bibliothecaire.scss',
})
export class SidebarBibliothecaire {
        constructor(
    private auth: AuthService,
    private router: Router
  ) {}
  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
