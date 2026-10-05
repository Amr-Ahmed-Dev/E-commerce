import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, finalize, tap } from 'rxjs';

import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/auth/services/auth.service';
import { skipGlobalLoaderContext } from '../../core/interceptors/http-context';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);

  private readonly cartUrl = `${environment.BASE_URL}/cart`;
  private readonly ordersUrl = `${environment.BASE_URL}/orders`;

  private readonly emptyCart: ICartResponse = {
    status: 'success',
    numOfCartItems: 0,
    cartId: '',
    data: {
      _id: '',
      cartOwner: '',
      products: [],
      createdAt: '',
      updatedAt: '',
      __v: 0,
      totalCartPrice: 0,
    },
  };

  // Shared cart state used by components across the application.
  readonly cartdetail = signal<ICartResponse>(this.emptyCart);

  // Indicates whether a cart request is currently in progress.
  readonly isLoading = signal(false);

  // Get the current user's cart and update the shared cart state.
  getCartItems(): Observable<ICartResponse> {
    this.isLoading.set(true);

    return this.http.get<ICartResponse>(this.cartUrl).pipe(
      tap((res) => this.cartdetail.set(res)),
      finalize(() => this.isLoading.set(false)),
    );
  }

  // Add a product to the cart and update the shared cart state.
  addProductToCart(productId: string): Observable<IAddToCartResponse> {
    return this.http
      .post<IAddToCartResponse>(this.cartUrl, { productId })
      .pipe(tap((res) => this.cartdetail.set(res)));
  }

  // Remove a product from the cart and update the shared cart state.
  removeProductFromCart(productId: string): Observable<ICartResponse> {
    return this.http
      .delete<ICartResponse>(`${this.cartUrl}/${productId}`)
      .pipe(tap((res) => this.cartdetail.set(res)));
  }

  // Clear the cart and reset the shared cart state.
  clearCartItems(): Observable<void> {
    return this.http
      .delete<void>(this.cartUrl)
      .pipe(tap(() => this.cartdetail.set(this.emptyCart)));
  }

  // Update the quantity of a product and refresh the shared cart state.
  updateCartItemQuantity(count: number, productId: string): Observable<ICartResponse> {
    return this.http
      .put<ICartResponse>(
        `${this.cartUrl}/${productId}`,
        { count },
        {
          context: skipGlobalLoaderContext(),
        },
      )
      .pipe(tap((res) => this.cartdetail.set(res)));
  }

  checkoutSession(
    cartId: string,
    shippingAddress?: IShippingAddress,
    url?: string,
  ): Observable<any> {
    return this.http.post(`${this.ordersUrl}/checkout-session/${cartId}?url=${url}`, {
      shippingAddress,
    });
  }

  cashOrder(cartId: string, shippingAddress?: IShippingAddress): Observable<any> {
    return this.http.post(`${this.ordersUrl}/${cartId}`, { shippingAddress });
  }

  getUserOrders(userId: string): Observable<any> {
    return this.http.get(`${this.ordersUrl}/user/${userId}`);
  }
}
