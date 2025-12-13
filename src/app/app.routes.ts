import { Routes } from '@angular/router';
import { Login } from './login/login';
import {SidebarBibliothecaire} from './sidebar-bibliothecaire/sidebar-bibliothecaire'
import {BibliothecaireBookList} from './bibliothecaire-book-list/bibliothecaire-book-list'
import {AddBook} from './add-book/add-book'
import {Navbar} from './navbar/navbar'
import { DetailBookBibliothecaire } from './detail-book-bibliothecaire/detail-book-bibliothecaire';
import { ReadersList } from './readers-list/readers-list';
import { ReadersDetail } from './readers-detail/readers-detail';
import { AddReaders } from './add-readers/add-readers';
export const routes: Routes = [
  { path: '', component: Login },
  { path: 'adminbooklist', component: BibliothecaireBookList},
  { path: 'add-book', component: AddBook },
  { path: 'book-details', component: DetailBookBibliothecaire } ,
  { path:'users-list', component:ReadersList},
  { path:'user-details', component:ReadersDetail},
  {path:'add-user',component:AddReaders}
];
