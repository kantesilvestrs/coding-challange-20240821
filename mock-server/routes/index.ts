import * as items from './items';
import * as cart from './cart';

const routes = {
  items: items.GET(),
  cart: cart.GET(),
} as const;

export default routes;
