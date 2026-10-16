import { Component, effect, inject, PLATFORM_ID } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../../../shared/services/cart.service';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../../../auth/services/auth.service';
import { ProfileService } from '../../../services/profile.service';

@Component({
  imports: [RouterLink, RouterLinkActive],
  selector: 'app-sidebar',
  styleUrl: './sidebar.component.css',
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  private cartService = inject(CartService);
  readonly authService = inject(AuthService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  profileService = inject(ProfileService);

  cartDetail = this.cartService.cartdetail;

  constructor() {
    effect(() => {
      if (!this.isBrowser) return;

      if (this.authService.token()) {
        this.cartService.getCartItems().subscribe();
      } else {
        this.cartService.resetCart();
      }
    });
  }
}
