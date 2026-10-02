import { isPlatformBrowser } from '@angular/common';
import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';

import { CartService } from '../../../shared/services/cart.service';

@Component({
  selector: 'app-cart',
  imports: [RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit {
  private readonly cartService = inject(CartService);
  private readonly loaderService = inject(NgxSpinnerService);
  private readonly platformId = inject(PLATFORM_ID);

  // Shared cart state managed by CartService.
  readonly cartdetail = this.cartService.cartdetail;
  readonly updatingItem = signal<{
    productId: string;
    action: 'increase' | 'decrease';
  } | null>(null);

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.getCartItems();
    }
  }

  private getCartItems(): void {
    this.loaderService.show();

    this.cartService
      .getCartItems()
      .pipe(
        // Always hide the spinner when the request completes or fails.
        finalize(() => this.loaderService.hide()),
      )
      .subscribe();
  }

  updateCartItemQuantity(count: number, productId: string, action: 'increase' | 'decrease'): void {
    this.updatingItem.set({
      productId,
      action,
    });

    this.cartService
      .updateCartItemQuantity(count, productId)
      .pipe(finalize(() => this.updatingItem.set(null)))
      .subscribe();
  }

  removeItemFromCart(productId: string, productName: string): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    Swal.fire({
      title: 'Are you sure?',
      text: `Remove "${productName}" from your cart?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#065f46',
      cancelButtonColor: '#dc2626',
      confirmButtonText: 'Yes, remove it',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      this.cartService.removeProductFromCart(productId).subscribe();
    });
  }

  clearCartItems(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    Swal.fire({
      title: 'Clear entire cart?',
      text: 'All items will be removed from your cart.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, clear it',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      this.loaderService.show();

      this.cartService
        .clearCartItems()
        .pipe(
          // Keep the loading state correct even when the request fails.
          finalize(() => this.loaderService.hide()),
        )
        .subscribe();
    });
  }
}
