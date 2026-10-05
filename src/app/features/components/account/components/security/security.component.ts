import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../../../../core/auth/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-security',
  standalone: true,
  imports: [],
  templateUrl: './security.component.html',
  styleUrl: './security.component.css',
})
export class SecurityComponent {
  private authService = inject(AuthService);
  private routerService = inject(Router);

  // ----- Password fields -----
  showCurrentPassword = signal(false);
  showNewPassword = signal(false);
  showConfirmPassword = signal(false);

  toggleCurrentPassword(): void {
    this.showCurrentPassword.update((v) => !v);
  }
  toggleNewPassword(): void {
    this.showNewPassword.update((v) => !v);
  }
  toggleConfirmPassword(): void {
    this.showConfirmPassword.update((v) => !v);
  }

  // ----- Two-factor authentication -----
  readonly twoFactorEnabled = signal(false);

  toggleTwoFactor(): void {
    this.twoFactorEnabled.update((v) => !v);
  }

  // ----- Active sessions -----
  readonly sessions: IUserSession[] = [
    {
      id: '1',
      device: 'Chrome on Windows',
      icon: 'desktop',
      location: 'Cairo, Egypt',
      lastActive: 'Active now',
      current: true,
    },
    {
      id: '2',
      device: 'Safari on iPhone',
      icon: 'mobile',
      location: 'Giza, Egypt',
      lastActive: '2 days ago',
      current: false,
    },
    {
      id: '3',
      device: 'Chrome on Android',
      icon: 'mobile',
      location: 'Alexandria, Egypt',
      lastActive: '1 week ago',
      current: false,
    },
  ];

  revokeSession(): void {
    this.authService.logout();
    this.authService.userEmail.set(null);
    this.routerService.navigate(['/']);
  }
}
