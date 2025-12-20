import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LivreService } from '../services/livre.service';
import { Livre } from '../models/livre.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bibliothecaire-book-list.html',
  styleUrls: ['./bibliothecaire-book-list.scss']
})
export class BibliothecaireBookList implements OnInit {

  livres$!: Observable<Livre[]>;

  constructor(
    private router: Router,
    private livreService: LivreService
  ) {}

  ngOnInit(): void {
    this.livres$ = this.livreService.livres$;
    this.livreService.fetchLivres(); // 🔥 ALWAYS reload
  }

  goToAddBook() {
    this.router.navigate(['/add-book']);
  }

  goToDetails(id: number) {
    this.router.navigate(['/book-details', id]);
  }
}
