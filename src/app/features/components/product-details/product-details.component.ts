import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { ProductsService } from '../../../shared/services/products.service';
import { CartService } from '../../../shared/services/cart.service';
import { AnimateProductToCardService } from '../../../shared/services/animate-product-to-card.service';

@Component({
  imports: [],
  selector: 'app-product-details',
  styleUrl: './product-details.component.css',
  templateUrl: './product-details.component.html',
})
export class ProductDetailsComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  private readonly activeRoute = inject(ActivatedRoute);
  private readonly toasterService = inject(ToastrService);
  private readonly animateProductToCardService = inject(AnimateProductToCardService);
  private readonly cartService = inject(CartService);

  productId: string = '';

  readonly productDetail: WritableSignal<IProductDetail> = signal({} as IProductDetail);

  ngOnInit(): void {
    this.activeRoute.paramMap.subscribe((params) => {
      this.productId = params.get('id') ?? '';
      this.getProductById();
    });
  }

  getProductById(): void {
    this.productsService.getProductById(this.productId).subscribe({
      next: (response: IProductDetailResponse) => {
        this.productDetail.set(response.data);
      },
    });
  }

  addItemToCart(productId: string, event: MouseEvent): void {
    this.animateProductToCardService.animateProductToCart(event);

    this.cartService.addProductToCart(productId).subscribe({
      next: (response: IResponseAddItemToCart) => {
        this.toasterService.success(response.message, 'Added To Cart');
      },
    });
  }

  discountPercent(product: IProductDetail): number {
    if (!product.priceAfterDiscount) return 0;
    return Math.round(((product.price - product.priceAfterDiscount) / product.price) * 100);
  }
}
