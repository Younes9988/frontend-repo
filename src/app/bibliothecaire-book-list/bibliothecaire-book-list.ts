import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';

import { LivreService } from '../services/livre.service';
import { Livre } from '../models/livre.model';

@Component({
  selector: 'app-bibliothecaire-book-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bibliothecaire-book-list.html',
  styleUrls: ['./bibliothecaire-book-list.scss']
})

export class BibliothecaireBookList implements OnInit {
  categories = [
  { value: 'ALL', label: 'Toutes les catégories' },
  { value: 'Littérature et fiction', label: 'Littérature et fiction' },
  { value: 'Sciences et techniques', label: 'Sciences et techniques' },
  { value: 'Histoire et géographie', label: 'Histoire et géographie' },
  { value: 'Arts et culture', label: 'Arts et culture' },
  { value: 'Loisirs et pratiques', label: 'Loisirs et pratiques' },
  { value: 'Références et dictionnaires', label: 'Références et dictionnaires' },
  { value: 'Religion et philosophie', label: 'Religion et philosophie' },
  { value: 'Bande dessinée et mangas', label: 'Bande dessinée et mangas' }
];
  livres$!: Observable<Livre[]>;
  filteredLivres$!: Observable<Livre[]>;

  searchTerm = '';
  selectedCategory = 'ALL';

  private search$ = new BehaviorSubject<string>('');
  private category$ = new BehaviorSubject<string>('ALL');

  constructor(
    private livreService: LivreService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // ✅ SAFE: service is initialized here
    this.livres$ = this.livreService.livres$;

    this.filteredLivres$ = combineLatest([
      this.livres$,
      this.search$,
      this.category$
    ]).pipe(
      map(([livres, search, category]) =>
        livres.filter(l =>
          this.matchesSearch(l, search) &&
          this.matchesCategory(l, category)
        )
      )
    );

    this.livreService.fetchLivres();
  }

  onSearchChange(value: string) {
    this.search$.next(value);
  }

  onCategoryChange(value: string) {
    this.category$.next(value);
  }

  goToAddBook() {
    this.router.navigate(['/add-book']);
  }

  goToDetails(id: number) {
    this.router.navigate(['/book-details', id]);
  }

  private matchesSearch(livre: Livre, search: string): boolean {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      livre.titre?.toLowerCase().includes(s) ||
      livre.auteur?.toLowerCase().includes(s) ||
      livre.isbn?.toLowerCase().includes(s)
    );
  }

  private matchesCategory(livre: Livre, category: string): boolean {
    return category === 'ALL' || livre.category === category;
  }
}
