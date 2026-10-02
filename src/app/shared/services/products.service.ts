import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private readonly http = inject(HttpClient);

  // Base URL for all product-related API requests.
  private readonly productsUrl = `${environment.BASE_URL}/products`;

  // Stores fetched products and exposes them as reactive state.
  readonly products = signal<IProduct[]>([]);

  getProducts(page = 1, limit = 12): Observable<IResponse<IProduct>> {
    return this.http.get<IResponse<IProduct>>(this.productsUrl, { params: { page, limit } });
  }

  getProductById(id: string): Observable<IProductDetailResponse> {
    return this.http.get<IProductDetailResponse>(`${this.productsUrl}/${id}`);
  }
}
