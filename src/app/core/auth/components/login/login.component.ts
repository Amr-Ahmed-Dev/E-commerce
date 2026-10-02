import { isPlatformBrowser } from '@angular/common';
import { Component, inject, PLATFORM_ID, signal } from '@angular/core';
import { FormField, email, form, minLength, required } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';

import { AuthService } from '../../services/auth.service';
import { LoaderService } from '../../../../shared/services/loader.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormField, RouterLink, TranslatePipe],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toasterService = inject(ToastrService);
  private readonly loaderService = inject(LoaderService);
  private readonly platformId = inject(PLATFORM_ID);

  readonly showPassword = signal(false);

  readonly loginModel = signal<ILogin>({
    email: '',
    password: '',
  });

  readonly loginForm = form(this.loginModel, (schema) => {
    required(schema.email, { message: 'Email is required.' });
    email(schema.email, { message: 'Please enter a valid email address.' });

    required(schema.password, { message: 'Password is required.' });
    minLength(schema.password, 8, {
      message: 'Password must be at least 8 characters long.',
    });
  });

  togglePasswordVisibility(): void {
    this.showPassword.update((value) => !value);
  }

  onSubmit(event: Event): void {
    event.preventDefault();

    if (this.loginForm().invalid()) {
      return;
    }

    this.loaderService.show();

    this.authService
      .login(this.loginModel())
      .pipe(finalize(() => this.loaderService.hide()))
      .subscribe({
        next: (response) => {
          const token = response?.token;

          if (!token) {
            console.error('The login response does not contain a token.');
            this.toasterService.error('Something went wrong. Please try again.', 'Login failed');
            return;
          }

          this.authService.token.set(token);

          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem(this.authService.USER_TOKEN, token);
          }

          this.toasterService.success('Welcome back!', 'Login successful');
          this.router.navigateByUrl('/');
        },
      });
  }
}
