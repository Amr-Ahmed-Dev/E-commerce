import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../auth/services/auth.service';

export const handleErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toasterService = inject(ToastrService);
  const authService = inject(AuthService);
  const platformId = inject(PLATFORM_ID);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (!isPlatformBrowser(platformId)) {
        return throwError(() => error);
      }
      const errorMessage = String(error.error?.message || '').toLowerCase();
      switch (error.status) {
        case 0:
          toasterService.error('Please check your internet connection.', 'Network Error');
          break;

        case 400:
          toasterService.error(
            error.error?.message || 'Please check the information you entered.',
            'Invalid Request',
          );
          break;

        case 401:
          authService.token.set(null);
          authService.userEmail.set(null);
          localStorage.removeItem(authService.USER_TOKEN);
          localStorage.removeItem(authService.USER_EMAIL);

          toasterService.error('Incorrect email or password');
          router.navigateByUrl('/login');
          break;

        case 403:
          toasterService.error('You do not have permission to do this.', 'Forbidden');
          break;

        case 404:
          toasterService.error(
            error.error?.message || 'The requested item could not be found.',
            'Not Found',
          );
          break;

        case 408:
          toasterService.error('The request took too long. Please try again.', 'Request Timeout');
          break;

        case 409:
          if (errorMessage.includes('account already exists')) {
            toasterService.error('This account already exists. Please sign in.', 'Account Exists');
          } else {
            toasterService.error(
              error.error?.message || 'This action conflicts with the current data.',
              'Conflict',
            );
          }
          break;

        case 422:
          toasterService.error(
            error.error?.message || 'Some of the information is invalid.',
            'Validation Error',
          );
          break;

        case 429:
          toasterService.error(
            'Too many requests. Please wait a moment and try again.',
            'Try Again Later',
          );
          break;

        case 500:
        case 502:
        case 503:
        case 504:
          toasterService.error(
            'Something went wrong on our end. Please try again later.',
            'Server Error',
          );
          break;

        default:
          toasterService.error(
            error.error?.message || 'An unexpected error occurred. Please try again.',
            'Error',
          );
          break;
      }

      return throwError(() => error);
    }),
  );
};
