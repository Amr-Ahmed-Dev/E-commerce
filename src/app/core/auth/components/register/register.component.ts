import { Component, computed, inject, signal } from '@angular/core';
import {
  email,
  form,
  minLength,
  pattern,
  required,
  FormField,
  maxLength,
  validate,
} from '@angular/forms/signals';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { LoaderService } from '../../../../shared/services/loader.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  imports: [FormField, TranslatePipe],
  selector: 'app-register',
  styleUrl: './register.component.css',
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private routerService = inject(Router);
  private loaderService = inject(LoaderService);

  registerModel = signal<IRegister>({
    name: '',
    email: '',
    password: '',
    rePassword: '',
    phone: '',
  });

  registerForm = form(this.registerModel, (schemaPass) => {
    // Name
    required(schemaPass.name, { message: 'Name is required.' });
    minLength(schemaPass.name, 3, { message: 'Name must be at least 3 characters long.' });
    maxLength(schemaPass.name, 15, { message: 'Name must be less than 15 characters long.' });

    // Email
    required(schemaPass.email, { message: 'Email is required.' });
    email(schemaPass.email, { message: 'Please enter a valid email address.' });

    // Password
    required(schemaPass.password, { message: 'Password is required.' });
    minLength(schemaPass.password, 8, { message: 'Password must be at least 8 characters long.' });
    pattern(schemaPass.password, /[0-9]/, {
      message: 'Password must contain at least one number.',
    });
    pattern(schemaPass.password, /[!@#$%^&*(),.?":{}|<>]/, {
      message: 'Password must contain at least one special character.',
    });

    // RePassword (must match Password)
    required(schemaPass.rePassword, { message: 'Please confirm your password.' });
    validate(schemaPass.rePassword, ({ value, valueOf, stateOf }) => {
      if (!stateOf(schemaPass.password).touched()) {
        return null;
      }
      if (value() !== valueOf(schemaPass.password)) {
        return { kind: 'passwordMismatch', message: 'Passwords do not match.' };
      }
      return null;
    });

    // Phone (Egyptian mobile numbers only)
    required(schemaPass.phone, { message: 'Phone number is required.' });
    pattern(schemaPass.phone, /^01[0125][0-9]{8}$/, {
      message:
        'Please enter a valid Egyptian phone number (e.g. 010/011/012/015 followed by 8 digits).',
    });
  });

  passwordStrength = computed(() => {
    const value = this.registerForm.password().value() ?? '';
    if (!value) {
      return { level: 0, label: '', barClass: 'bg-stone-200', textClass: 'text-stone-400' };
    }

    let score = 0;
    if (value.length >= 8) score++;
    if (/[0-9]/.test(value)) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(value)) score++;
    if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score++;

    if (score <= 1) {
      return { level: 1, label: 'Weak', barClass: 'bg-rose-500', textClass: 'text-rose-500' };
    }
    if (score <= 2) {
      return { level: 2, label: 'Medium', barClass: 'bg-orange-500', textClass: 'text-orange-500' };
    }
    return { level: 3, label: 'Strong', barClass: 'bg-emerald-600', textClass: 'text-emerald-600' };
  });

  passwordChecks = computed(() => {
    const value = this.registerForm.password().value() ?? '';
    return [
      { label: 'At least 8 characters', met: value.length >= 8 },
      { label: 'Contains a number', met: /[0-9]/.test(value) },
      { label: 'Contains a special character', met: /[!@#$%^&*(),.?":{}|<>]/.test(value) },
    ];
  });

  // Show/hide password toggles
  showPassword = signal(false);
  showRePassword = signal(false);

  togglePasswordVisibility(): void {
    this.showPassword.update((v) => !v);
  }

  toggleRePasswordVisibility(): void {
    this.showRePassword.update((v) => !v);
  }

  onSubmit(event: Event) {
    event.preventDefault();
    const credentials = this.registerModel();
    console.log('Register in with:', credentials);

    if (this.registerForm().invalid()) {
      this.registerForm().markAsTouched();
      return;
    }
    this.loaderService.show();

    this.authService.register(credentials).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token);
        this.authService.token.set(response.token);
        this.routerService.navigate(['/']);
        this.loaderService.hide();
      },
    });
  }
}
