import products from '../data/items_data.json';

export interface Product {
  sku: number;
  name: string;
  descr: string;
  price: number;
  basketLimit: number;
}

export function GET(): Product[] {
  return products;
}
