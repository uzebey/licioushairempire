import { TestBed } from '@angular/core/testing';

import { CartService } from './cart';
import { Product } from '../models/product.model';

const sampleProduct: Product = {
  id: '1',
  name: 'Brazilian Straight Bundle',
  description: 'Test product',
  category: 'brazilian',
  texture: 'straight',
  lengthInches: 18,
  priceInKobo: 2500000,
  currency: 'NGN',
  stockQuantity: 25,
  images: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe('CartService', () => {
  let service: CartService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartService);
  });

  it('should be created with an empty cart', () => {
    expect(service.cartItems()).toEqual([]);
    expect(service.itemCount()).toBe(0);
  });

  it('should add a product to the cart', () => {
    service.add(sampleProduct);

    expect(service.cartItems().length).toBe(1);
    expect(service.itemCount()).toBe(1);
    expect(service.subtotalInKobo()).toBe(2500000);
  });

  it('should increase quantity when adding the same product again', () => {
    service.add(sampleProduct);
    service.add(sampleProduct);

    expect(service.cartItems().length).toBe(1);
    expect(service.cartItems()[0].quantity).toBe(2);
    expect(service.itemCount()).toBe(2);
  });

  it('should update quantity directly', () => {
    service.add(sampleProduct);
    service.updateQuantity('1', 5);

    expect(service.cartItems()[0].quantity).toBe(5);
    expect(service.subtotalInKobo()).toBe(2500000 * 5);
  });

  it('should remove an item when quantity drops to 0', () => {
    service.add(sampleProduct);
    service.updateQuantity('1', 0);

    expect(service.cartItems()).toEqual([]);
  });

  it('should clear the cart', () => {
    service.add(sampleProduct);
    service.clear();

    expect(service.cartItems()).toEqual([]);
  });
});
