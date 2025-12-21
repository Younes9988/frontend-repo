import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';

import { EmpruntService } from '../services/emprunt.service';
import { Emprunt } from '../models/emprunt.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-emprunts-list',
  standalone: true,
  imports: [   RouterModule ,CommonModule, FormsModule],
  templateUrl: './emprunt-list.html',
  styleUrls: ['./emprunt-list.scss']
})
export class EmpruntsList implements OnInit {

  emprunts$!: Observable<Emprunt[]>;
  filteredEmprunts$!: Observable<Emprunt[]>;

  //pagination
  currentPage$ = new BehaviorSubject<number>(1);
  pageSize$ = new BehaviorSubject<number>(5);
  totalPages$!: Observable<number>;
  pagedEmprunts$!: Observable<Emprunt[]>;

  searchTerm = '';
  selectedStatut = 'ALL';

  private search$ = new BehaviorSubject<string>('');
  private statut$ = new BehaviorSubject<string>('ALL');

  statuts = [
    { value: 'ALL', label: 'All' },
    { value: 'EN_COURS', label: 'En cours' },
    { value: 'RETOURNE', label: 'Retourné' },
    { value: 'EN_RETARD', label: 'En retard' }
  ];

  constructor(private empruntService: EmpruntService) {}

ngOnInit(): void {
  this.emprunts$ = this.empruntService.emprunts$;

  // 1️⃣ FILTERED STREAM (search + statut)
  const filtered$ = combineLatest([
    this.emprunts$,
    this.search$,
    this.statut$
  ]).pipe(
    map(([emprunts, search, statut]) =>
      emprunts.filter(e =>
        this.matchesSearch(e, search) &&
        this.matchesStatut(e, statut)
      )
    )
  );

  // 2️⃣ TOTAL PAGES
  this.totalPages$ = combineLatest([filtered$, this.pageSize$]).pipe(
    map(([emprunts, size]) => Math.ceil(emprunts.length / size))
  );

  // 3️⃣ PAGINATED DATA
  this.pagedEmprunts$ = combineLatest([
    filtered$,
    this.currentPage$,
    this.pageSize$
  ]).pipe(
    map(([emprunts, page, size]) => {
      const start = (page - 1) * size;
      return emprunts.slice(start, start + size);
    })
  );

  this.empruntService.fetchEmprunts();
}


  onSearchChange(v: string) {
    this.search$.next(v);
  }

  onStatutChange(v: string) {
    this.statut$.next(v);
  }

  retourner(emprunt: Emprunt) {
    this.empruntService.retournerEmprunt(emprunt.id)
      .subscribe(() => this.empruntService.fetchEmprunts());
  }
  //pagination methodes
    // ⬅ Previous page
  prevPage() {
    const current = this.currentPage$.value;
    if (current > 1) {
      this.currentPage$.next(current - 1);
    }
  }

  // ➡ Next page
  nextPage(totalPages: number) {
    const current = this.currentPage$.value;
    if (current < totalPages) {
      this.currentPage$.next(current + 1);
    }
  }

  // 🔢 Go to specific page
  goToPage(page: number) {
    this.currentPage$.next(page);
  }

  // 📏 Change page size
  changePageSize(size: number) {
    this.pageSize$.next(+size);
    this.currentPage$.next(1); // reset to first page
  }


  private matchesSearch(e: Emprunt, s: string) {
    if (!s) return true;
    return (
      e.lecteurId.toString().includes(s) ||
      e.livreId.toString().includes(s)
    );
  }

  private matchesStatut(e: Emprunt, statut: string) {
    return statut === 'ALL' || e.statutEmprunt === statut;
  }
}
