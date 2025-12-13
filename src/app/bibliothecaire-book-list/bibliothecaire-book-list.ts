import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarBibliothecaire } from '../sidebar-bibliothecaire/sidebar-bibliothecaire';
import { Navbar } from '../navbar/navbar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [
    CommonModule,      // <-- REQUIRED for *ngFor, *ngIf
    SidebarBibliothecaire,  // <-- Import your sidebar
    Navbar    // <-- Import navbar
  ],
  templateUrl: './bibliothecaire-book-list.html',
  styleUrls: ['./bibliothecaire-book-list.scss']
})
export class BibliothecaireBookList {
  constructor(private router: Router) {}

  goToAddBook() {
    this.router.navigate(['/add-book']);
  }
  goToDetails() {
    this.router.navigate(['/book-details']);  // always same page
  }
}
