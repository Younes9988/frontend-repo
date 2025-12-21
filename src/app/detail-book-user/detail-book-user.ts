import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { LivreService } from '../services/livre.service';
import { Livre } from '../models/livre.model';

@Component({
  selector: 'app-detail-book-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detail-book-user.html',
  styleUrl: './detail-book-user.scss',
})
export class DetailBookUser implements OnInit, OnDestroy {

  livre: Livre | null = null;
  loading = true;

  private paramSubscription?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private livreService: LivreService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.paramSubscription = this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (!id) {
        this.loading = false;
        return;
      }

      this.loading = true;
      this.loadBook(id);
    });
  }

  ngOnDestroy(): void {
    this.paramSubscription?.unsubscribe();
  }

  private loadBook(id: number): void {
    this.livreService.getLivreById(id).subscribe({
      next: livre => {
        this.livre = livre;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: err => {
        console.error('Error loading book', err);
        this.loading = false;
      }
    });
  }

  get isAvailable(): boolean {
    return (this.livre?.nombreCopies ?? 0) > 0;
  }

  reserve(): void {
    if (!this.livre) return;

    // 🔹 Placeholder (you’ll connect it to emprunt later)
    alert(`Reservation requested for "${this.livre.titre}"`);
  }
}
