import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { skipAuthContext } from '../../interceptors/http-context';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);

  readonly USER_TOKEN = 'token';
  readonly USER_EMAIL = 'userEmail';

  readonly token: WritableSignal<string | null> = signal(null);
  readonly userEmail = signal<string | null>(null);

  initAuth(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.token.set(localStorage.getItem(this.USER_TOKEN));
      this.userEmail.set(localStorage.getItem(this.USER_EMAIL));
      return;
    }

    this.token.set(null);
    this.userEmail.set(null);
  }

  register(data: IRegister): Observable<any> {
    return this.http
      .post(`${environment.BASE_URL}/auth/signup`, data, {
        context: skipAuthContext(),
      })
      .pipe(tap(() => this.saveUserEmail(data.email)));
  }

  login(data: { email: string; password: string }): Observable<any> {
    return this.http
      .post(`${environment.BASE_URL}/auth/signin`, data, {
        context: skipAuthContext(),
      })
      .pipe(tap(() => this.saveUserEmail(data.email)));
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.USER_TOKEN);
      localStorage.removeItem(this.USER_EMAIL);
    }

    this.token.set(null);
    this.userEmail.set(null);
  }

  private saveUserEmail(email: string): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const normalizedEmail = email.trim();

    localStorage.setItem(this.USER_EMAIL, normalizedEmail);
    this.userEmail.set(normalizedEmail);
  }
}
