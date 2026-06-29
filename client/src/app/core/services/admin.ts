import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Product } from '../models/product.model';
import { Order } from '../models/order.model';

export interface AdminProduct extends Product {
  _count?: { orderItems: number };
}

export interface AdminOrder extends Order {
  user: { name: string; email: string };
}

export interface ProductPayload {
  name: string;
  description: string;
  category: string;
  texture?: string;
  lengthInches?: number | null;
  priceInKobo: number;
  stockQuantity: number;
  images: string[];
}

@Service()
export class AdminService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/admin`;

  // Products
  getProducts(): Observable<AdminProduct[]> {
    return this.http.get<AdminProduct[]>(`${this.apiUrl}/products`);
  }

  createProduct(payload: ProductPayload): Observable<AdminProduct> {
    return this.http.post<AdminProduct>(`${this.apiUrl}/products`, payload);
  }

  updateProduct(id: string, payload: Partial<ProductPayload>): Observable<AdminProduct> {
    return this.http.put<AdminProduct>(`${this.apiUrl}/products/${id}`, payload);
  }

  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/products/${id}`);
  }

  // Orders
  getOrders(): Observable<AdminOrder[]> {
    return this.http.get<AdminOrder[]>(`${this.apiUrl}/orders`);
  }

  updateOrderStatus(id: string, status: string): Observable<AdminOrder> {
    return this.http.patch<AdminOrder>(`${this.apiUrl}/orders/${id}/status`, { status });
  }
}
