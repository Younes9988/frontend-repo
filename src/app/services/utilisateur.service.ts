import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Utilisateur } from '../models/utilisateur.model';

@Injectable({ providedIn: 'root' })
export class UtilisateurService {
private apiUrl = 'http://localhost:5050/MSUTILISATEUR/api/utilisateurs';


  private utilisateursSubject = new BehaviorSubject<Utilisateur[]>([]);
  utilisateurs$ = this.utilisateursSubject.asObservable();

  constructor(private http: HttpClient) {}

  fetchUtilisateurs() {
    this.http.get<Utilisateur[]>(this.apiUrl)
      .subscribe(users => this.utilisateursSubject.next(users));
  }
  createLecteur(data: any) {
  return this.http.post(
    `${this.apiUrl}/lecteur`,
    data
  );
}
  getUtilisateur(id: number) {
    return this.http.get<Utilisateur>(`${this.apiUrl}/${id}`);
  }

  deleteUtilisateur(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
