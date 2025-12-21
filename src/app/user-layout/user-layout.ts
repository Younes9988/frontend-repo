import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Navbar } from '../navbar/navbar';
import { SidebarLecteur } from '../sidebar-lecteur/sidebar-lecteur';

@Component({
  selector: 'app-user-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarLecteur, Navbar],
  templateUrl: './user-layout.html',
  styleUrls: ['./user-layout.scss']
})
export class UserLayout {}
