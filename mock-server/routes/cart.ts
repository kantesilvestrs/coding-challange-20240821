import cart from '../data/cart_data.json';
import type { Product } from './items';

export interface CartState {
  cart: CartItem[];
}

export interface CartItem {
  sku: Product['sku'];
  qty: number;
}

export function GET(): CartState {
  return cart;
}
