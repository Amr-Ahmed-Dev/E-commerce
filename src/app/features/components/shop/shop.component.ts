import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ProductsService } from '../../../shared/services/products.service';
import { CardComponent } from '../../../shared/components/card/card.component';

@Component({
  imports: [RouterLink, CardComponent],
  selector: 'app-shop',
  styleUrl: './shop.component.css',
  templateUrl: './shop.component.html',
})
export class ShopComponent {
  private readonly productsService = inject(ProductsService);

  // Products are managed reactively by ProductsService.

  constructor() {
    this.getAllProducts();
  }
  readonly products = signal<IProduct[]>([]);

  private getAllProducts(): void {
    this.productsService.getProducts(1, 48).subscribe({
      next: (res) => {
        this.products.set(res.data);
      },
    });
  }
}
