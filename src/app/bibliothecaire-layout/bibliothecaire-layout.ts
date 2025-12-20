import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarBibliothecaire } from '../sidebar-bibliothecaire/sidebar-bibliothecaire';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-bibliothecaire-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarBibliothecaire, Navbar],
  templateUrl: './bibliothecaire-layout.html',
  styleUrls: ['./bibliothecaire-layout.scss']
})
export class BibliothecaireLayout {}
