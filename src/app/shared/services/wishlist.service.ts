import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { environment } from '../../../environments/environment.development';

@Injectable({ providedIn: 'root' })
export class WishlistService {
  private readonly http = inject(HttpClient);
  private readonly wishlistUrl = `${environment.BASE_URL}/wishlist`;

  readonly items = signal<IProduct[]>([]);

  getUserWishlist(): Observable<any> {
    return this.http
      .get<any>(this.wishlistUrl)
      .pipe(tap((response) => this.items.set(response.data ?? [])));
  }

  addToWishlist(product: IProduct): Observable<any> {
    const productId = this.getProductId(product);
    if (!productId) throw new Error('A product ID is required to add an item to the wishlist.');

    return this.http.post<any>(this.wishlistUrl, { productId }).pipe(
      tap(() => {
        this.items.update((items) =>
          items.some((item) => this.getProductId(item) === productId) ? items : [...items, product],
        );
      }),
    );
  }

  removeFromWishlist(productId: string): Observable<any> {
    return this.http.delete<any>(`${this.wishlistUrl}/${productId}`).pipe(
      tap(() => {
        this.items.update((items) => items.filter((item) => this.getProductId(item) !== productId));
      }),
    );
  }

  isWishlisted(productId: string): boolean {
    return this.items().some((item) => this.getProductId(item) === productId);
  }

  private getProductId(product: IProduct): string {
    const item = product as IProduct & { id?: string; _id?: string };
    return item._id ?? item.id ?? '';
  }
}
