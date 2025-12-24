import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
@Injectable({ providedIn: 'root' })
export class AuthService {

  private API = 'http://localhost:5050/AUTH/auth';
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  login(data: { email: string; password: string }) {
    return this.http.post<any>(`${this.API}/login`, data).pipe(
      tap(res => {
        if (this.isBrowser) {
          localStorage.setItem('token', res.accessToken);
          localStorage.setItem('role', res.role);
          localStorage.setItem('email', data.email);
        }
      })
    );
  }

  changePassword(data: {
    email: string;
    currentPassword: string;
    newPassword: string;
  }) {
    return this.http.post(`${this.API}/change-password`, data);
  }

  // ✅ THIS METHOD MUST EXIST
  register(data: {
    email: string;
    password: string;
    nom: string;
    prenom: string;
    telephone: string;
    adresse: string;
  }) {
    return this.http.post(`${this.API}/register`, data);
  }

  logout() {
    if (this.isBrowser) {
      localStorage.clear();
    }
  }

  get token(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem('token');
  }

  get role(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem('role');
  }
  get email(): string | null {
  if (!this.isBrowser) return null;
  return localStorage.getItem('email');
}

  isLoggedIn(): boolean {
    return !!this.token;
  }

  isAdmin(): boolean {
    return this.role === 'BIBLIOTHECAIRE';
  }
}
