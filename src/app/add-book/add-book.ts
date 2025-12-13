import { Component } from '@angular/core';
import { SidebarBibliothecaire } from '../sidebar-bibliothecaire/sidebar-bibliothecaire';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-add-book',
  imports: [     // <-- REQUIRED for *ngFor, *ngIf
    SidebarBibliothecaire,  // <-- Import your sidebar
    Navbar    // <-- Import navbar
  ],
  standalone:true,
  templateUrl: './add-book.html',
  styleUrl: './add-book.scss',

})
export class AddBook {

}
