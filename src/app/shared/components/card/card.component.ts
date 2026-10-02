import { isPlatformBrowser } from '@angular/common';
import { Component, inject, input, PLATFORM_ID } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ToastrService } from 'ngx-toastr';

import { CartService } from '../../services/cart.service';
import { AnimateProductToCardService } from '../../services/animate-product-to-card.service';

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

  readonly product = input.required<IProduct>();

  addItemToCart(productId: string, event: MouseEvent): void {
    this.animateProductToCardService.animateProductToCart(event);

    this.cartService.addProductToCart(productId).subscribe({
      next: (response: IResponseAddItemToCart) => {
        this.toasterService.success(response.message, 'Added to cart');
      },
    });
  }

  discountPercent(product: IProduct): number {
    if (!product.priceAfterDiscount || product.price <= 0) {
      return 0;
    }

    return Math.round(((product.price - product.priceAfterDiscount) / product.price) * 100);
  }
}
