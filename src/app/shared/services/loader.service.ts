import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoaderService {
  isLoading = signal<boolean>(false);

  private readonly minDuration = 500;
  private showTime = 0;

  show(): void {
    this.showTime = Date.now();
    this.isLoading.set(true);
  }

  hide(): void {
    const elapsed = Date.now() - this.showTime;
    const remaining = this.minDuration - elapsed;

    if (remaining > 0) {
      setTimeout(() => this.isLoading.set(false), remaining);
    } else {
      this.isLoading.set(false);
    }
  }
}
