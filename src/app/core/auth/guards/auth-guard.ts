import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { isPlatformBrowser } from '@angular/common';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const routerService = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // على السيرفر: سيبه يعدي عادي (متعملش redirect)
  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  if (authService.token()) {
    return true;
  }

  return routerService.parseUrl('/login');
};
