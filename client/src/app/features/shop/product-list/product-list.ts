import { Component, inject } from '@angular/core';
import { CurrencyPipe, TitleCasePipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';

import { ProductService } from '../../../core/services/product';
import { CartService } from '../../../core/services/cart';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-product-list',
  imports: [CurrencyPipe, TitleCasePipe],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList {
  private readonly productService = inject(ProductService);
  private readonly cartService = inject(CartService);

  // toSignal converts the products$ Observable into a reactive Signal,
  // so the template re-renders automatically once data arrives.
  protected readonly products = toSignal(this.productService.getAll(), {
    initialValue: [],
  });

  // Money is stored in kobo (smallest unit). Convert to Naira for display.
  protected toNaira(priceInKobo: number): number {
    return priceInKobo / 100;
  }

  protected addToCart(product: Product): void {
    this.cartService.add(product);
  }
}
