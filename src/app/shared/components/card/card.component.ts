import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { CartService } from '../../services/cart.service';
import { AnimateProductToCardService } from '../../services/animate-product-to-card.service';
import { WishlistService } from '../../services/wishlist.service';

@Component({
  selector: 'app-card',
  imports: [RouterLink],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css',
})
export class CardComponent {
  private readonly cartService = inject(CartService);
  private readonly toasterService = inject(ToastrService);
  private readonly animateProductToCardService = inject(AnimateProductToCardService);
  private readonly wishlistService = inject(WishlistService);

  readonly product = input.required<IProduct>();

  readonly isWishlisted = computed(() => {
    const productId = this.product().id;

    return productId ? this.wishlistService.isWishlisted(productId) : false;
  });

  addItemToCart(productId: string, event: MouseEvent): void {
    this.animateProductToCardService.animateProductToCart(event);

    this.cartService.addProductToCart(productId).subscribe({
      next: () => {
        this.toasterService.success(`${this.product().title} added to your cart`, '', {
          toastClass: 'ngx-toastr app-toast toast-cart',
        });
      },
    });
  }

  toggleWishlist(): void {
    const productId = this.product().id;

    if (!productId) {
      return;
    }

    const request$ = this.wishlistService.isWishlisted(productId)
      ? this.wishlistService.removeFromWishlist(productId)
      : this.wishlistService.addToWishlist(this.product());

    request$.subscribe({
      next: () => {
        const message = this.wishlistService.isWishlisted(productId)
          ? 'Added to wishlist'
          : 'Removed from wishlist';

        this.toasterService.success(message, 'Wishlist');
      },
    });
  }
  discountPercent(product: IProduct): number {
    if (!product.priceAfterDiscount || product.price <= 0) return 0;

    return Math.round(((product.price - product.priceAfterDiscount) / product.price) * 100);
  }
}
