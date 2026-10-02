import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../auth/services/auth.service';
import { SKIP_AUTH } from './http-context';

export const handleHeaderInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.token();

  if (!token || req.context.get(SKIP_AUTH)) {
    return next(req);
  }

  return next(req.clone({ setHeaders: { token } }));
};
