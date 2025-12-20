import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Livre } from '../models/livre.model';

@Injectable({
  providedIn: 'root'
})
export class LivreService {

  private apiUrl = '/MSLIVRE/api/livres';

  private livresSubject = new BehaviorSubject<Livre[]>([]);
  livres$ = this.livresSubject.asObservable();

  constructor(private http: HttpClient) {}

  // 🔹 ALWAYS fetch fresh list
  fetchLivres(): void {
    this.http.get<Livre[]>(this.apiUrl).subscribe({
      next: data => this.livresSubject.next(data),
      error: err => console.error(err)
    });
  }

  // 🔹 Needed by AddBook
  addLivre(formData: FormData): Observable<Livre> {
    return this.http.post<Livre>(this.apiUrl, formData);
  }

  // 🔹 CRUD
  getLivreById(id: number): Observable<Livre> {
    return this.http.get<Livre>(`${this.apiUrl}/${id}`);
  }

  updateLivre(id: number, livre: Partial<Livre>): Observable<Livre> {
    return this.http.put<Livre>(`${this.apiUrl}/updateLivre/${id}`, livre);
  }

  deleteLivre(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deleteLivre/${id}`);
  }
}
