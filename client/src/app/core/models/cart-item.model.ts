/**
 * A snapshot of a product as it exists in the cart.
 * We copy name/price at the time of adding so the cart still
 * displays correctly even if the product's price changes later
 * (the real price is always re-checked on the server at checkout).
 */
export interface CartItem {
  productId: string;
  name: string;
  priceInKobo: number;
  quantity: number;
}
