import {
  ApplicationConfig,
  importProvidersFrom,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter, withInMemoryScrolling, withViewTransitions } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { provideTranslateService } from '@ngx-translate/core';
import { handleHeaderInterceptor } from './core/interceptors/handle-header-interceptor';
import { handleGlobalLoaderInterceptor } from './core/interceptors/handle-global-loader-interceptor';
import { handleErrorInterceptor } from './core/interceptors/handle-error-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' }),
      withViewTransitions(),
    ),
    provideClientHydration(),
    provideHttpClient(
      withInterceptors([
        handleHeaderInterceptor,
        handleErrorInterceptor,
        handleGlobalLoaderInterceptor,
      ]),
    ),
    provideToastr({
      positionClass: 'toast-bottom-center',
      toastClass: 'ngx-toastr app-toast',
      titleClass: 'app-toast-title',
      messageClass: 'app-toast-message',
      timeOut: 2400,
      extendedTimeOut: 200,
      disableTimeOut: false,
      closeButton: true,
      preventDuplicates: true,
    }),
    importProvidersFrom(NgxSpinnerModule),
    provideTranslateService({
      loader: provideTranslateHttpLoader({
        prefix: '/assets/i18n/',
        suffix: '.json',
      }),
      fallbackLang: 'en',
      lang: 'en',
    }),
  ],
};
