import { Routes } from '@angular/router';
import { authGuard } from './core/auth/guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../app/features/components/home/home.component').then((f) => f.HomeComponent),
  },
  {
    path: 'shop',
    loadComponent: () =>
      import('../app/features/components/shop/shop.component').then((f) => f.ShopComponent),
  },
  {
    path: 'wishlist',
    loadComponent: () =>
      import('../app/features/components/wishlist/wishlist.component').then(
        (f) => f.WishlistComponent,
      ),
  },
  {
    path: 'product-detail/:id',
    loadComponent: () =>
      import('../app/features/components/product-details/product-details.component').then(
        (f) => f.ProductDetailsComponent,
      ),
  },

  {
    path: 'cart',
    loadComponent: () =>
      import('../app/features/components/cart/cart.component').then((f) => f.CartComponent),
    canActivate: [authGuard],
  },
  {
    path: 'checkout/:cartId',
    loadComponent: () =>
      import('../app/features/components/checkout/checkout.component').then(
        (f) => f.CheckoutComponent,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'register',
    loadComponent: () =>
      import('../app/core/auth/components/register/register.component').then(
        (f) => f.RegisterComponent,
      ),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('../app/core/auth/components/login/login.component').then((f) => f.LoginComponent),
  },
  {
    path: 'allorders',
    loadComponent: () =>
      import('./features/components/account/components/orders/orders.component').then(
        (m) => m.OrdersComponent,
      ),
  },
  {
    path: 'account',
    loadComponent: () =>
      import('./features/components/account/account.component').then((m) => m.AccountComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/components/account/components/account-overview/account-overview.component').then(
            (m) => m.AccountOverviewComponent,
          ),
      },

      {
        path: 'profile',
        loadComponent: () =>
          import('./features/components/account/components/profile/profile.component').then(
            (m) => m.ProfileComponent,
          ),
      },

      {
        path: 'security',
        loadComponent: () =>
          import('./features/components/account/components/security/security.component').then(
            (m) => m.SecurityComponent,
          ),
      },
    ],
  },

  {
    path: '**',
    loadComponent: () =>
      import('../app/features/components/notfound/notfound.component').then(
        (f) => f.NotfoundComponent,
      ),
  },
];
