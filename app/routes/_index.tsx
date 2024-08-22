import type { MetaFunction } from '@remix-run/node';
import { json, Link, useLoaderData } from '@remix-run/react';
import { Product } from 'mock-server/routes/items';
import { useCallback } from 'react';
import { getItems } from '~/api/items';
import { useCart } from '~/providers/cart-provider';

export const meta: MetaFunction = () => {
  return [
    { title: 'Items List' },
    { name: 'description', content: 'Local Product listing' },
  ];
};

export async function loader() {
  const products = (await getItems()) || [];
  return json(products);
}

export default function Index() {
  const products = useLoaderData<typeof loader>();
  const { cart, addItem, changeQty, removeItem } = useCart();

  /**
   * Increase qty or add item if it doesn't exist
   */
  const handleOnAddItem = useCallback(
    (product: Product) => {
      const existingCartItem = cart.find((item) => item.sku === product.sku);
      if (existingCartItem) {
        changeQty(product.sku, existingCartItem.qty + 1);
      } else {
        addItem({
          ...product,
          qty: 1,
        });
      }
    },
    [addItem, cart, changeQty]
  );

  /**
   * Reduce qty or remove item if the qty is 1, i.e. the last item of that product
   */
  const handleOnRemoveItem = useCallback(
    (product: Product) => {
      const existingCartItem = cart.find((item) => item.sku === product.sku);
      if (!existingCartItem) return;

      if (existingCartItem.qty === 1) {
        removeItem(product.sku);
      } else {
        changeQty(product.sku, existingCartItem.qty - 1);
      }
    },
    [cart, changeQty, removeItem]
  );

  return (
    <main>
      <h1>Items List</h1>
      <table>
        {products.map((product) => (
          <tr data-testid={`items-list-item-${product.sku}`} key={product.sku}>
            <td>
              <div>
                <span>{product.name}</span>
                <br />
                <span>{product.descr}</span>
              </div>
            </td>
            <td>{product.price}</td>
            <td>
              <button
                data-testid="add-to-cart-button"
                onClick={() => handleOnAddItem(product)}
              >
                Add item
              </button>
              <button
                data-testid="remove-from-cart-button"
                disabled={!cart.some((item) => item.sku === product.sku)}
                onClick={() => handleOnRemoveItem(product)}
              >
                Remove
              </button>
            </td>
          </tr>
        ))}
      </table>
      <Link to={'/cart'}>
        <button>Checkout</button>
      </Link>
    </main>
  );
}
