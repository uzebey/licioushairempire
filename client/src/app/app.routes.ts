import { Routes } from '@angular/router';

import { ProductList } from './features/shop/product-list/product-list';
import { CartPage } from './features/cart/cart-page/cart-page';
import { LoginPage } from './features/auth/login-page/login-page';
import { RegisterPage } from './features/auth/register-page/register-page';
import { OrderConfirmation } from './features/checkout/order-confirmation/order-confirmation';
import { OrdersPage } from './features/account/orders-page/orders-page';
import { AdminLayout } from './features/admin/admin-layout/admin-layout';
import { ProductsManager } from './features/admin/products-manager/products-manager';
import { OrdersManager } from './features/admin/orders-manager/orders-manager';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  { path: '', component: ProductList, title: 'Shop - Licious Hair Empire' },
  { path: 'cart', component: CartPage, title: 'Your Cart - Licious Hair Empire' },
  { path: 'login', component: LoginPage, title: 'Sign In - Licious Hair Empire' },
  { path: 'register', component: RegisterPage, title: 'Create Account - Licious Hair Empire' },

  {
    path: 'order-confirmation',
    component: OrderConfirmation,
    title: 'Order Confirmed - Licious Hair Empire',
    canActivate: [authGuard],
  },

  {
    path: 'account/orders',
    component: OrdersPage,
    title: 'My Orders - Licious Hair Empire',
    canActivate: [authGuard],
  },

  // Admin section — nested routes share the AdminLayout shell (sidebar)
  {
    path: 'admin',
    component: AdminLayout,
    canActivate: [adminGuard],
    children: [
      { path: '', redirectTo: 'products', pathMatch: 'full' },
      { path: 'products', component: ProductsManager, title: 'Products - Admin' },
      { path: 'orders', component: OrdersManager, title: 'Orders - Admin' },
    ],
  },
];
