import { Component } from '@angular/core';
import { Navbar } from '../navbar/navbar';
import { SidebarBibliothecaire } from '../sidebar-bibliothecaire/sidebar-bibliothecaire';
import { Router } from '@angular/router';

@Component({
  selector: 'app-readers-list',
  imports: [],
  standalone:true,
  templateUrl: './readers-list.html',
  styleUrl: './readers-list.scss',
})
export class ReadersList {
  constructor(private router: Router) {}

  goToAddUser() {
  this.router.navigate(['/add-user']);
  }
  goToDetails() {
  this.router.navigate(['/user-details']);
  }
}
