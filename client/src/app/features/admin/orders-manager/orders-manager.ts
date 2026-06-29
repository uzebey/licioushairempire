import { Component, inject, signal, OnInit } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';

import { AdminService, AdminOrder } from '../../../core/services/admin';

const STATUSES = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'];

@Component({
  selector: 'app-orders-manager',
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './orders-manager.html',
  styleUrl: './orders-manager.scss',
})
export class OrdersManager implements OnInit {
  private readonly adminService = inject(AdminService);

  protected readonly statuses = STATUSES;
  protected readonly orders = signal<AdminOrder[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.adminService.getOrders().subscribe({
      next: (orders) => { this.orders.set(orders); this.loading.set(false); },
      error: () => { this.error.set('Failed to load orders.'); this.loading.set(false); },
    });
  }

  protected updateStatus(order: AdminOrder, status: string): void {
    if (status === order.status) return;

    this.adminService.updateOrderStatus(order.id, status).subscribe({
      next: (updated) =>
        this.orders.update((list) => list.map((o) => (o.id === updated.id ? updated : o))),
      error: () => this.error.set(`Failed to update order ${order.id.slice(-6)}.`),
    });
  }

  protected toNaira(kobo: number): number {
    return kobo / 100;
  }
}
