import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';

import { OrderService } from '../../../core/services/order';
import { CartService } from '../../../core/services/cart';
import { Order } from '../../../core/models/order.model';

@Component({
  selector: 'app-order-confirmation',
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './order-confirmation.html',
  styleUrl: './order-confirmation.scss',
})
export class OrderConfirmation implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly orderService = inject(OrderService);
  private readonly cartService = inject(CartService);

  protected readonly loading = signal(true);
  protected readonly order = signal<Order | null>(null);
  protected readonly error = signal<string | null>(null);

  ngOnInit(): void {
    // Paystack appends ?reference=xxx to the callback URL after payment
    const reference = this.route.snapshot.queryParamMap.get('reference');

    if (!reference) {
      this.error.set('No payment reference found. If you completed payment, contact support.');
      this.loading.set(false);
      return;
    }

    this.orderService.verifyPayment(reference).subscribe({
      next: (confirmedOrder) => {
        this.order.set(confirmedOrder);
        this.cartService.clear(); // payment confirmed — wipe the local cart
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(
          err.error?.message ?? 'Could not confirm your payment. Please contact support.'
        );
        this.loading.set(false);
      },
    });
  }

  protected toNaira(kobo: number): number {
    return kobo / 100;
  }
}
