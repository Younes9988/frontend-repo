import { Routes } from '@angular/router';
import { Login } from './login/login';
import { BibliothecaireLayout } from './bibliothecaire-layout/bibliothecaire-layout';

import { BibliothecaireBookList } from './bibliothecaire-book-list/bibliothecaire-book-list';
import { AddBook } from './add-book/add-book';
import { DetailBookBibliothecaire } from './detail-book-bibliothecaire/detail-book-bibliothecaire';
import { ReadersList } from './readers-list/readers-list';
import { ReadersDetail } from './readers-detail/readers-detail';
import { AddReaders } from './add-readers/add-readers';

export const routes: Routes = [

  // 🔹 Login (ONLY exact root)
  { path: '', component: Login, pathMatch: 'full' },

  // 🔹 Layout with sidebar + navbar
  {
    path: '',
    component: BibliothecaireLayout,
    children: [
      { path: 'adminbooklist', component: BibliothecaireBookList },
      { path: 'add-book', component: AddBook },
      { path: 'book-details/:id', component: DetailBookBibliothecaire },
      { path: 'users-list', component: ReadersList },
      { path: 'user-details', component: ReadersDetail },
      { path: 'add-user', component: AddReaders }
    ]
  }
];
