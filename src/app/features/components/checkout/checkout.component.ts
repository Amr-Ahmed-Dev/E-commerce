import { Component, computed, inject, signal } from '@angular/core';
import { CartService } from '../../../shared/services/cart.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

const shippingAdressDefult = {
  details: 'details',
  phone: '01010700999',
  city: 'Cairo',
};

@Component({
  imports: [RouterLink],
  selector: 'app-checkout',
  styleUrl: './checkout.component.css',
  templateUrl: './checkout.component.html',
})
export class CheckoutComponent {
  private readonly cartService = inject(CartService);
  private loaderService = inject(NgxSpinnerService);
  private toasterService = inject(ToastrService);
  private activeService = inject(ActivatedRoute);
  private routerService = inject(Router);

  cartdetail = this.cartService.cartdetail;
  isLoading = this.cartService.isLoading;
  shippingFee = signal<number>(50);
  subtotal = computed(() => this.cartdetail()?.data?.totalCartPrice ?? 0);
  total = computed(() => this.subtotal() + this.shippingFee());
  isPayOnline = signal<boolean>(false);

  checkoutSession() {
    let cartId: string | null = '';
    let shippingAdress = shippingAdressDefult;
    let url = 'http://localhost:4200';
    cartId = this.activeService.snapshot.paramMap.get('cartId');

    if (cartId) {
      this.cartService.checkoutSession(cartId, shippingAdress, url).subscribe({
        next: (response: ICheckoutSessionResponse) => {
          this.loaderService.hide();
          window.open(response.session.url, '_self');
        },
      });
    } else {
      this.routerService.navigate(['/']);
    }
  }
  cashOrder() {
    let cartId: string | null = '';
    this.activeService.paramMap.subscribe((param) => {
      cartId = param.get('cartId');
    });
    if (cartId) {
      this.cartService.cashOrder(cartId).subscribe({
        next: () => {
          this.routerService.navigate(['allorders']);
        },
      });
    }
  }
}
