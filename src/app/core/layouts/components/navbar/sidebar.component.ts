import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../../../shared/services/cart.service';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  imports: [RouterLink, RouterLinkActive],
  selector: 'app-sidebar',
  styleUrl: './sidebar.component.css',
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit {
  private cartService = inject(CartService);
  readonly authService = inject(AuthService);

  cartDetail = this.cartService.cartdetail;
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  ngOnInit(): void {
    if (this.isBrowser) {
      this.getCartCount();
    }
  }

  getCartCount(): void {
    this.cartService.getCartItems().subscribe({
      next: (response) => {
        this.cartService.cartdetail.set(response);
      },
    });
  }
}
