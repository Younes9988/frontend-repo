import { Component } from '@angular/core';
import { Navbar } from '../navbar/navbar';
import { SidebarBibliothecaire } from '../sidebar-bibliothecaire/sidebar-bibliothecaire';

@Component({
  selector: 'app-readers-detail',
  imports: [Navbar,SidebarBibliothecaire],
  templateUrl: './readers-detail.html',
  styleUrl: './readers-detail.scss',
})
export class ReadersDetail {
    
}
