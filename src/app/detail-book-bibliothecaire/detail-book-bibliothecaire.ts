import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription, switchMap, tap } from 'rxjs';
import { LivreService } from '../services/livre.service';
import { Livre } from '../models/livre.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-detail-book-bibliothecaire',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './detail-book-bibliothecaire.html',
  styleUrl: './detail-book-bibliothecaire.scss',
})
export class DetailBookBibliothecaire implements OnInit, OnDestroy {

  livre: Livre | null = null;
  form: Partial<Livre> = {};

  edit = false;
  saving = false;

  private sub?: Subscription;

  // ✅ token to ignore late/stale GET responses
  private loadToken = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private livreService: LivreService
  ) {}
ngOnInit(): void {
  this.route.paramMap.subscribe(params => {
    const id = Number(params.get('id'));
    if (!id) return;

    this.livreService.getLivreById(id).subscribe({
      next: data => {
        this.livre = data;
        this.form = { ...data };
      },
      error: err => console.error(err)
    });
  });
}



  enableEdit(): void {
    if (!this.livre) return;
    this.edit = true;
    this.form = { ...this.livre };
  }

  cancelEdit(): void {
    this.edit = false;
    this.saving = false;
    if (this.livre) this.form = { ...this.livre };
  }

saveEdit(): void {
  if (!this.livre) return;

  this.edit = false;

  const payload = {
    ...this.form,
    image: this.livre.image
  };

  this.livreService.updateLivre(this.livre.livreId, payload).subscribe({
    next: () => {
      // 🔥 NOTHING ELSE
    }
  });
}



  onDelete(): void {
    if (!this.livre) return;

    const ok = confirm(`Delete "${this.livre.titre}" ?`);
    if (!ok) return;

    // ✅ invalidate in-flight GET too
    this.loadToken++;

    this.livreService.deleteLivre(this.livre.livreId).subscribe({
      next: () => {
        this.livre = null;
        this.router.navigate(['/adminbooklist']);
      },
      error: (err: any) => console.error('Error deleting book', err)
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
