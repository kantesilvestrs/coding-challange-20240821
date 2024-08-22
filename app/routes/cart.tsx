import type { MetaFunction } from '@remix-run/node';
import { Link } from '@remix-run/react';
import { useCart } from '~/providers/cart-provider';

export const meta: MetaFunction = () => {
  return [
    { title: 'Local Products' },
    { name: 'description', content: 'Local Product listing' },
  ];
};

export default function Index() {
  const { cart, changeQty, removeItem } = useCart();

  return (
    <main>
      <div>
        <Link to={'/'}>
          <button data-testid="go-back-home-button" type="button">
            Back
          </button>
        </Link>
        <h1>Checkout</h1>
      </div>
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Price</th>
            <th>Qty</th>
            <th>Total</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {cart.map(({ sku, name, price, qty }) => (
            <tr data-testid={`checkout-item-${sku}`} key={sku}>
              <td data-testid={`checkout-item-${sku}-name`}>{name}</td>
              <td data-testid={`checkout-item-${sku}-price`}>{price}</td>
              <td data-testid={`checkout-item-${sku}-qty`}>{qty}</td>
              <td data-testid={`checkout-item-${sku}-total`}>
                {Math.floor(qty * price * 100) / 100}
              </td>
              <td>
                <button
                  data-testid="remove-item-from-checkout-button"
                  onClick={() => changeQty(sku, qty + 1)}
                >
                  Add item
                </button>
                <button
                  data-testid="remove-item-from-checkout-button"
                  onClick={() =>
                    qty === 1 ? removeItem(sku) : changeQty(sku, qty - 1)
                  }
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button data-testid="submit-basket-button" type="button">
        Checkout
      </button>
    </main>
  );
}
