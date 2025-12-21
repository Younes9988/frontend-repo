import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { UtilisateurService } from '../services/utilisateur.service';
import { Utilisateur } from '../models/utilisateur.model';

@Component({
  selector: 'app-readers-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './readers-detail.html',
  styleUrls: ['./readers-detail.scss']
})
export class ReadersDetail implements OnInit {

  user!: Utilisateur;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private utilisateurService: UtilisateurService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.router.navigate(['/users-list']);
      return;
    }

    this.utilisateurService.getUtilisateur(id).subscribe({
      next: user => {
        this.user = user;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => this.router.navigate(['/users-list'])
    });
  }

  deleteUser() {
    if (!confirm('Are you sure you want to delete this user?')) return;

    this.utilisateurService.deleteUtilisateur(this.user.id).subscribe(() => {
      this.router.navigate(['/users-list']);
    });
  }

  updateUser() {
    // next step (we’ll do it later)
    alert('Update coming next');
  }
}
