import { Component, inject, signal, OnInit } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { OrderService } from '../../../core/services/order';
import { AuthService } from '../../../core/services/auth';
import { Order } from '../../../core/models/order.model';

@Component({
  selector: 'app-orders-page',
  imports: [CurrencyPipe, DatePipe, RouterLink],
  templateUrl: './orders-page.html',
  styleUrl: './orders-page.scss',
})
export class OrdersPage implements OnInit {
  private readonly orderService = inject(OrderService);
  protected readonly authService = inject(AuthService);

  protected readonly loading = signal(true);
  protected readonly orders = signal<Order[]>([]);
  protected readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.orderService.getUserOrders().subscribe({
      next: (orders) => {
        this.orders.set(orders);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Could not load your orders. Please try again.');
        this.loading.set(false);
      },
    });
  }

  protected toNaira(kobo: number): number {
    return kobo / 100;
  }

  protected statusLabel(status: string): string {
    return status === 'paid' ? 'Paid' : status === 'cancelled' ? 'Cancelled' : 'Pending';
  }
}
