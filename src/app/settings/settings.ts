import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AuthService } from '../services/auth.service';

type ThemeMode = 'light' | 'dark';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './settings.html',
  styleUrl: './settings.scss'
})
export class Settings implements OnInit {
  profileRoute = '/user-profile';
  theme: ThemeMode = 'light';
  private isBrowser: boolean;

  constructor(
    private auth: AuthService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.profileRoute = this.auth.isAdmin() ? '/admin-profile' : '/user-profile';
    this.theme = this.getStoredTheme();
    this.applyTheme(this.theme);
  }

  setTheme(mode: ThemeMode) {
    this.theme = mode;
    this.applyTheme(mode);
    if (this.isBrowser) {
      localStorage.setItem('theme', mode);
    }
  }

  private getStoredTheme(): ThemeMode {
    if (!this.isBrowser) return 'light';
    const stored = localStorage.getItem('theme');
    return stored === 'dark' ? 'dark' : 'light';
  }

  private applyTheme(mode: ThemeMode) {
    if (!this.isBrowser) return;
    const body = document.body;
    body.classList.toggle('theme-dark', mode === 'dark');
    body.classList.toggle('theme-light', mode === 'light');
  }
}
