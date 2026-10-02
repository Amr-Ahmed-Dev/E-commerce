import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class I18nService {
  private readonly translateService = inject(TranslateService);
  private readonly platformId = inject(PLATFORM_ID);

  currentLang = 'en';

  toggleLang(): void {
    const nextLang = this.currentLang === 'en' ? 'ar' : 'en';
    this.changeLang(nextLang);
  }

  changeLang(lang: string): void {
    this.currentLang = lang;
    this.translateService.use(lang);

    if (isPlatformBrowser(this.platformId)) {
      document.documentElement.setAttribute('lang', lang);
      document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    }
  }
}
