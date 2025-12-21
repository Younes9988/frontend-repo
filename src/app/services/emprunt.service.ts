import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Emprunt } from '../models/emprunt.model';


@Injectable({ providedIn: 'root' })
export class EmpruntService {

  private apiUrl =
    `http://localhost:5050/MSEMPRUNT/api/emprunts`;

  private empruntsSubject = new BehaviorSubject<Emprunt[]>([]);
  emprunts$ = this.empruntsSubject.asObservable();

  constructor(private http: HttpClient) {}

fetchEmprunts() {
  this.http.get<Emprunt[]>(this.apiUrl)
    .subscribe({
      next: e => this.empruntsSubject.next(e),
      error: err => {
        console.error('Erreur chargement emprunts', err);
        this.empruntsSubject.next([]);
      }
    });
}


  creerEmprunt(lecteurId: number, livreId: number) {
    return this.http.post<Emprunt>(
      `${this.apiUrl}?lecteurId=${lecteurId}&livreId=${livreId}`,
      null
    );
  }

  retournerEmprunt(id: number) {
    return this.http.put<Emprunt>(
      `${this.apiUrl}/${id}/retour`,
      null
    );
  }
}
