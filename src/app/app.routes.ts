import { Routes } from '@angular/router';
import { Login } from './login/login';
import { BibliothecaireLayout } from './bibliothecaire-layout/bibliothecaire-layout';

import { BibliothecaireBookList } from './bibliothecaire-book-list/bibliothecaire-book-list';
import { AddBook } from './add-book/add-book';
import { DetailBookBibliothecaire } from './detail-book-bibliothecaire/detail-book-bibliothecaire';
import { ReadersList } from './readers-list/readers-list';
import { ReadersDetail } from './readers-detail/readers-detail';
import { AddReaders } from './add-readers/add-readers';
import { EmpruntsList } from './emprunt-list/emprunt-list';
import { AddEmprunt } from './add-emprunt/add-emprunt';
import { adminGuard } from './guards/admin.guard';
import { UserBookList } from './userbooklist/userbooklist';
import { authGuard } from './guards/auth.guard';
import { UserLayout } from './user-layout/user-layout';
import { DetailBookUser } from './detail-book-user/detail-book-user';
import { EmpruntUserList } from './emprunt-user-list/emprunt-user-list';
import { UserHome } from './user-home/user-home';
import { UserProfile } from './user-profile/user-profile';
import { BibliothecaireHome } from './bibliothecaire-home/bibliothecaire-home';
import { EmpruntDetail } from './emprunt-detail/emprunt-detail';
import { Settings } from './settings/settings';
export const routes: Routes = [

  // 🔹 Login (ONLY exact root)
  { path: '', component: Login, pathMatch: 'full' },

  // 🔹 Layout with sidebar + navbar
{
  path: '',
  component: BibliothecaireLayout,
  canActivate: [adminGuard],   // 🔐 HERE
  children: [
    { path: 'admin-profile', component: UserProfile },
    { path: 'admin-settings', component: Settings },
    { path: 'adminbooklist', component: BibliothecaireBookList },
    { path: 'add-book', component: AddBook },
    { path: 'book-details/:id', component: DetailBookBibliothecaire },
    { path: 'users-list', component: ReadersList },
    { path: 'user-details/:id', component: ReadersDetail },
    { path: 'add-user', component: AddReaders },
    { path: 'emprunt-list', component: EmpruntsList },
    { path: 'emprunt-details/:id', component: EmpruntDetail },
    { path: 'add-emprunt', component: AddEmprunt },
    { path: 'Bhome', component: BibliothecaireHome },
  ]
},
{
  path: '',
  component: UserLayout,   // your user sidebar layout
  canActivateChild: [authGuard],
  children: [
    { path: 'user-home', component: UserHome },
    { path: 'user-profile', component: UserProfile },
    { path: 'user-settings', component: Settings },
    { path: 'userbooklist', component: UserBookList },
    { path: 'user-book-details/:id', component: DetailBookUser },
    {path:'user-emprunt-list',component:EmpruntUserList}
  ]
}
];
