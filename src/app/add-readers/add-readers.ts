import { Component } from '@angular/core';
import { Navbar } from '../navbar/navbar';
import { SidebarBibliothecaire } from '../sidebar-bibliothecaire/sidebar-bibliothecaire';

@Component({
  selector: 'app-add-readers',
  imports: [Navbar,SidebarBibliothecaire],
  templateUrl: './add-readers.html',
  styleUrl: './add-readers.scss',
})
export class AddReaders {

}
