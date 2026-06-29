import { Component, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { CartService } from '../../../core/services/cart';
import { AuthService } from '../../../core/services/auth';
import { OrderService } from '../../../core/services/order';

@Component({
  selector: 'app-cart-page',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './cart-page.html',
  styleUrl: './cart-page.scss',
})
export class CartPage {
  protected readonly cartService = inject(CartService);
  private readonly authService = inject(AuthService);
  private readonly orderService = inject(OrderService);
  private readonly router = inject(Router);

  protected readonly checkoutLoading = signal(false);
  protected readonly checkoutError = signal<string | null>(null);

  protected toNaira(priceInKobo: number): number {
    return priceInKobo / 100;
  }

  protected increment(productId: string, currentQuantity: number): void {
    this.cartService.updateQuantity(productId, currentQuantity + 1);
  }

  protected decrement(productId: string, currentQuantity: number): void {
    this.cartService.updateQuantity(productId, currentQuantity - 1);
  }

  protected remove(productId: string): void {
    this.cartService.remove(productId);
  }

  protected checkout(): void {
    // If the user is not logged in, send them to login first.
    // We don't silently redirect after login here — the user will
    // just return to the cart and click Checkout again.
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.checkoutLoading.set(true);
    this.checkoutError.set(null);

    const items = this.cartService.cartItems().map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    }));

    this.orderService.createOrder({ items }).subscribe({
      next: ({ authorizationUrl }) => {
        // Redirect the browser to Paystack's hosted payment page.
        // After payment, Paystack redirects back to /order-confirmation?reference=xxx
        window.location.href = authorizationUrl;
      },
      error: (err) => {
        this.checkoutError.set(
          err.error?.message ?? 'Could not start checkout. Please try again.'
        );
        this.checkoutLoading.set(false);
      },
    });
  }
}
