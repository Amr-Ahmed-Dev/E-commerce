import { CurrencyPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { WishlistService } from '../../../shared/services/wishlist.service';
import { CartService } from '../../../shared/services/cart.service';

// Fix this path to wherever your IProduct lives.

type WishlistProduct = IProduct & { _id?: string; id?: string };

@Component({
  selector: 'app-wishlist',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './wishlist.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WishlistComponent implements OnInit {
  private readonly wishlistService = inject(WishlistService);
  private readonly cartService = inject(CartService);
  private readonly toasterService = inject(ToastrService);
  private readonly destroyRef = inject(DestroyRef);

  // The list lives in the service, so removing an item here also updates every heart in the app.
  readonly products = this.wishlistService.items;
  readonly count = computed(() => this.products().length);

  readonly loading = signal(true);
  readonly failed = signal(false);
  readonly busyIds = signal<ReadonlySet<string>>(new Set());
  readonly skeletons = Array.from({ length: 8 });
  readonly stars = [1, 2, 3, 4, 5];

  ngOnInit(): void {
    this.loadWishlist();
  }

  loadWishlist(): void {
    this.loading.set(true);
    this.failed.set(false);

    this.wishlistService
      .getUserWishlist()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.loading.set(false),
        error: () => {
          this.failed.set(true);
          this.loading.set(false);
        },
      });
  }

  removeFromWishlist(product: IProduct): void {
    const id = this.idOf(product);
    if (!id || this.busyIds().has(id)) return;
    this.setBusy(id, true);

    this.wishlistService
      .removeFromWishlist(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.setBusy(id, false);
          this.toasterService.success(
            `${this.shortTitle(product.title)} removed from your wishlist`,
          );
        },
        error: () => {
          this.setBusy(id, false);
          this.toasterService.error('Could not update your wishlist. Please try again.');
        },
      });
  }

  addToCart(product: IProduct): void {
    const id = this.idOf(product);
    if (!id || this.busyIds().has(id)) return;
    this.setBusy(id, true);

    this.cartService
      .addProductToCart(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.setBusy(id, false);
          this.toasterService.success(`${this.shortTitle(product.title)} added to your cart`, '', {
            toastClass: 'ngx-toastr app-toast toast-cart',
          });
        },
        error: () => {
          this.setBusy(id, false);
          this.toasterService.error('Could not add this item to your cart. Please try again.');
        },
      });
  }

  idOf(product: IProduct): string {
    const item = product as WishlistProduct;
    return item._id ?? item.id ?? '';
  }

  shortTitle(title: string): string {
    return title.split(' ').slice(0, 3).join(' ');
  }

  brandName(product: IProduct): string {
    return (product as IProduct & { brand?: { name?: string } }).brand?.name ?? '';
  }

  ratingValue(product: IProduct): number {
    return (product as IProduct & { ratingsAverage?: number }).ratingsAverage ?? 0;
  }

  ratingCount(product: IProduct): number {
    return (product as IProduct & { ratingsQuantity?: number }).ratingsQuantity ?? 0;
  }

  /** Width (0-100) of the gold stars laid over the grey ones, so 4.3 fills 4.3 of 5 stars. */
  ratingPercent(product: IProduct): number {
    return Math.max(0, Math.min(100, (this.ratingValue(product) / 5) * 100));
  }

  categoryName(product: IProduct): string {
    return (product as IProduct & { category?: { name?: string } }).category?.name ?? 'Product';
  }

  discountedPrice(product: IProduct): number {
    return (
      (product as IProduct & { priceAfterDiscount?: number }).priceAfterDiscount ?? product.price
    );
  }

  discountPercent(product: IProduct): number {
    const final = this.discountedPrice(product);
    if (final >= product.price) return 0;
    return Math.round((1 - final / product.price) * 100);
  }

  private setBusy(id: string, busy: boolean): void {
    this.busyIds.update((previous) => {
      const next = new Set(previous);
      if (busy) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  }
}
