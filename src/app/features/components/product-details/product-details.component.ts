import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';

import { ProductsService } from '../../../shared/services/products.service';
import { CartService } from '../../../shared/services/cart.service';
import { AnimateProductToCardService } from '../../../shared/services/animate-product-to-card.service';
import { WishlistService } from '../../../shared/services/wishlist.service';
import { CardComponent } from '../../../shared/components/card/card.component';

@Component({
  selector: 'app-product-details',
  imports: [RouterLink, CardComponent],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
})
export class ProductDetailsComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  private readonly activeRoute = inject(ActivatedRoute);
  private readonly toasterService = inject(ToastrService);
  private readonly animateProductToCardService = inject(AnimateProductToCardService);
  private readonly cartService = inject(CartService);
  private readonly wishlistService = inject(WishlistService);

  readonly productDetail = signal<IProductDetail | null>(null);
  readonly products = signal<IProduct[]>([]);
  readonly selectedImage = signal<string | null>(null);
  readonly quantity = signal(1);

  readonly updatingItem = signal<{
    productId: string;
    action: 'increase' | 'decrease';
  } | null>(null);

  readonly isWishlisted = computed(() => {
    const productId = this.productDetail()?.id;

    return productId ? this.wishlistService.isWishlisted(productId) : false;
  });

  ngOnInit(): void {
    this.loadRelatedProducts();
    this.loadWishlist();

    this.activeRoute.paramMap.subscribe((params) => {
      const productId = params.get('id');

      if (productId) {
        this.loadProduct(productId);
      }
    });
  }

  private loadRelatedProducts(): void {
    this.productsService.getProducts(2, 8).subscribe({
      next: (response) => {
        this.products.set(response.data);
      },
    });
  }

  private loadWishlist(): void {
    this.wishlistService.getUserWishlist().subscribe();
  }

  private loadProduct(productId: string): void {
    this.productsService.getProductById(productId).subscribe({
      next: (response: IProductDetailResponse) => {
        const product = response.data;

        this.productDetail.set(product);
        this.selectedImage.set(product.imageCover);
        this.quantity.set(1);
      },
    });
  }

  selectImage(image: string): void {
    this.selectedImage.set(image);
  }

  toggleWishlist(): void {
    const product = this.productDetail();

    if (!product?.id) {
      return;
    }

    const isCurrentlyWishlisted = this.wishlistService.isWishlisted(product.id);

    const request$ = isCurrentlyWishlisted
      ? this.wishlistService.removeFromWishlist(product.id)
      : this.wishlistService.addToWishlist(product as IProduct);

    request$.subscribe({
      next: () => {
        this.toasterService.success(
          isCurrentlyWishlisted ? 'Removed from wishlist' : 'Added to wishlist',
          'Wishlist',
        );
      },
    });
  }

  addItemToCart(productId: string, event: MouseEvent): void {
    this.animateProductToCardService.animateProductToCart(event);

    this.cartService.addProductToCart(productId).subscribe({
      next: (response: IAddToCartResponse) => {
        this.toasterService.success(response.message, 'Added To Cart');
      },
    });
  }

  updateCartItemQuantity(count: number, productId: string, action: 'increase' | 'decrease'): void {
    if (count < 1) {
      return;
    }

    this.updatingItem.set({
      productId,
      action,
    });

    this.cartService
      .updateCartItemQuantity(count, productId)
      .pipe(
        finalize(() => {
          this.updatingItem.set(null);
        }),
      )
      .subscribe({
        next: () => {
          this.quantity.set(count);
        },
      });
  }

  discountPercent(product: IProductDetail): number {
    if (!product.priceAfterDiscount || product.price <= 0) {
      return 0;
    }

    return Math.round(((product.price - product.priceAfterDiscount) / product.price) * 100);
  }

  getRatingStars(rating: number | undefined): number[] {
    return Array.from({ length: 5 }, (_, index) => index + 1);
  }

  getStarType(star: number, rating: number | undefined): 'full' | 'half' | 'empty' {
    const value = rating ?? 0;
    const floorRating = Math.floor(value);

    if (star <= floorRating) {
      return 'full';
    }

    if (star - value <= 0.5) {
      return 'half';
    }

    return 'empty';
  }
}
