import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { LivreService } from '../services/livre.service';
import { Livre } from '../models/livre.model';

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

  loading = true;
  edit = false;
  saving = false;

  private paramSubscription?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private livreService: LivreService,
     private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit(): void {
    // Subscribe to route param changes
    this.paramSubscription = this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (!id) {
        this.loading = false;
        return;
      }

      // Reset ALL state on every navigation
      this.resetState();
      
      // Load the book
      this.loadBook(id);
    });
  }

  ngOnDestroy(): void {
    // Clean up subscription
    if (this.paramSubscription) {
      this.paramSubscription.unsubscribe();
    }
  }

  private resetState(): void {
    this.loading = true;
    this.livre = null;
    this.form = {};
    this.edit = false;
    this.saving = false;
  }

  private loadBook(id: number): void {
    this.livreService.getLivreById(id).subscribe({
      next: livre => {
        this.livre = livre;
        this.form = { ...livre };
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: err => {
        console.error('Error loading book', err);
        this.loading = false;
      }
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

    this.saving = true;

    const payload = {
      ...this.form,
      image: this.livre.image
    };

    this.livreService.updateLivre(this.livre.livreId, payload).subscribe({
      next: updatedLivre => {
        this.edit = false;
        this.saving = false;
        // Update with the response from server
        this.livre = updatedLivre || { ...this.livre!, ...this.form };
        this.form = { ...this.livre };
      },
      error: err => {
        console.error('Error updating book:', err);
        this.saving = false;
        alert('Failed to update book. Please try again.');
      }
    });
  }

  onDelete(): void {
    if (!this.livre) return;

    const ok = confirm(`Delete "${this.livre.titre}"?`);
    if (!ok) return;

    this.livreService.deleteLivre(this.livre.livreId).subscribe({
      next: () => {
        this.router.navigate(['/adminbooklist']);
      },
      error: err => {
        console.error('Error deleting book:', err);
        alert('Failed to delete book. Please try again.');
      }
    });
  }
}