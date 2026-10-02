import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { I18nService } from '../../../../../core/services/i18n.service';
import { AuthService } from '../../../../../core/auth/services/auth.service';

@Component({
  imports: [RouterLink, TranslatePipe, RouterLinkActive],
  selector: 'app-account-overview',
  styleUrl: './account-overview.component.css',
  templateUrl: './account-overview.component.html',
})
export class AccountOverviewComponent {
  i18nService = inject(I18nService);
  authService = inject(AuthService);
}
