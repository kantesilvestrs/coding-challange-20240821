import type { MetaFunction } from '@remix-run/node';
import { useMemo } from 'react';
import { getCart } from '~/api/cart';
import { getItems } from '~/api/items';
import { useGetCart } from '~/queries/use-get-cart';
import { useGetProducts } from '~/queries/use-get-products';

// showing off my ts skills 🤣
type CartItem = NonNullable<
  Awaited<ReturnType<typeof getCart>>
>['cart'][number];
type Product = NonNullable<Awaited<ReturnType<typeof getItems>>>[number];

export const meta: MetaFunction = () => {
  return [
    { title: 'Local Products' },
    { name: 'description', content: 'Local Product listing' },
  ];
};

export default function Index() {
  const products = useGetProducts();
  const { cart } = useGetCart();

  const cartItems = useMemo(
    () =>
      cart.reduce<(CartItem & Product)[]>((acc, cV) => {
        const product = products.find((product) => product.sku === cV.sku);
        if (!product) return acc;

        acc.push({
          ...product,
          ...cV,
        });

        return acc;
      }, []),
    [cart, products]
  );

  return (
    <main>
      <h1>Checkout</h1>
      <ul>
        {cartItems.map(({ sku, name }) => (
          <li key={sku}>{name}</li>
        ))}
      </ul>
    </main>
  );
}
