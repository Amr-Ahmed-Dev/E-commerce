import { DOCUMENT } from '@angular/common';
import { Injectable, inject, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DarkModeService {
  private readonly document = inject(DOCUMENT);

  readonly isDarkMode = signal(false);

  constructor() {
    const savedTheme = localStorage.getItem('theme');

    const isDark =
      savedTheme === 'dark' ||
      (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);

    this.isDarkMode.set(isDark);
    this.applyTheme(isDark);
  }

  toggle(): void {
    this.setDarkMode(!this.isDarkMode());
  }

  setDarkMode(isDark: boolean): void {
    this.isDarkMode.set(isDark);
    this.applyTheme(isDark);

    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }

  private applyTheme(isDark: boolean): void {
    this.document.documentElement.classList.toggle('dark', isDark);
  }
}
