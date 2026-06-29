import { Service, signal, computed, effect } from '@angular/core';

import { Product } from '../models/product.model';
import { CartItem } from '../models/cart-item.model';

const STORAGE_KEY = 'licious-hair-empire-cart';

@Service()
export class CartService {
  // The cart's source of truth. Private so nothing outside this
  // service can change it directly — they must go through our methods.
  private readonly items = signal<CartItem[]>(loadFromStorage());

  // Read-only view for templates/other components.
  readonly cartItems = this.items.asReadonly();

  // computed() values automatically recalculate whenever `items` changes.
  readonly itemCount = computed(() =>
    this.items().reduce((sum, item) => sum + item.quantity, 0)
  );

  readonly subtotalInKobo = computed(() =>
    this.items().reduce((sum, item) => sum + item.priceInKobo * item.quantity, 0)
  );

  // effect() re-runs automatically whenever any signal it reads changes.
  // Here, every time `items` changes, we save the new cart to localStorage.
  private readonly persistToStorage = effect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items()));
  });

  add(product: Product, quantity = 1): void {
    this.items.update((items) => {
      const existing = items.find((item) => item.productId === product.id);

      if (existing) {
        return items.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [
        ...items,
        {
          productId: product.id,
          name: product.name,
          priceInKobo: product.priceInKobo,
          quantity,
        },
      ];
    });
  }

  updateQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.remove(productId);
      return;
    }

    this.items.update((items) =>
      items.map((item) => (item.productId === productId ? { ...item, quantity } : item))
    );
  }

  remove(productId: string): void {
    this.items.update((items) => items.filter((item) => item.productId !== productId));
  }

  clear(): void {
    this.items.set([]);
  }
}

function loadFromStorage(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}
