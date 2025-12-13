import { Component } from '@angular/core';
import { Navbar } from '../navbar/navbar';
import { SidebarBibliothecaire } from '../sidebar-bibliothecaire/sidebar-bibliothecaire';

@Component({
  selector: 'app-detail-book-bibliothecaire',
  imports: [Navbar,SidebarBibliothecaire],
  standalone:true,
  templateUrl: './detail-book-bibliothecaire.html',
  styleUrl: './detail-book-bibliothecaire.scss',
})
export class DetailBookBibliothecaire {

}
