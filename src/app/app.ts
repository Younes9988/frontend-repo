import { Component, Inject, PLATFORM_ID, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('gestion-bibliotheque');

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    if (!isPlatformBrowser(platformId)) return;
    const storedTheme = localStorage.getItem('theme');
    const mode = storedTheme === 'dark' ? 'dark' : 'light';
    document.body.classList.toggle('theme-dark', mode === 'dark');
    document.body.classList.toggle('theme-light', mode === 'light');
  }
}
