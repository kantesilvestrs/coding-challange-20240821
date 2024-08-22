import {
  json,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react';
import { getItems } from './api/items';
import { getCart } from './api/cart';
import { CartProvider } from './providers/cart-provider';
import ClientStyleContext from './mui/ClientStyleContext';
import { withEmotionCache } from '@emotion/react';
import { useContext } from 'react';
import { useEnhancedEffect } from './utils/use-enhanced-effect';

export const Layout = withEmotionCache(
  ({ children }: { children: React.ReactNode }, emotionCache) => {
    const clientStyleData = useContext(ClientStyleContext);

    // Only executed on client
    useEnhancedEffect(() => {
      // re-link sheet container
      emotionCache.sheet.container = document.head;
      // re-inject tags
      const tags = emotionCache.sheet.tags;
      emotionCache.sheet.flush();
      tags.forEach((tag) => {
        // @ts-expect-error -- _insertTag is a private method
        emotionCache.sheet._insertTag(tag);
      });
      // reset cache to reapply global styles
      clientStyleData.reset();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <Meta />
          <Links />
        </head>
        <body>
          {children}
          <ScrollRestoration />
          <Scripts />
        </body>
      </html>
    );
  }
);

export async function loader() {
  const products = (await getItems()) || [];
  const { cart = [] } = (await getCart()) || {};

  type CartProductItem = (typeof products)[number] & (typeof cart)[number];

  const cartItems = cart.reduce<CartProductItem[]>((acc, cV) => {
    const product = products.find((product) => product.sku === cV.sku);
    if (!product) return acc;

    acc.push({
      ...product,
      ...cV,
      qty: cV.qty > product.basketLimit ? product.basketLimit : cV.qty,
    });

    return acc;
  }, []);

  return json(cartItems);
}

export default function App() {
  const data = useLoaderData<typeof loader>();
  return (
    <CartProvider initialValue={data}>
      <Outlet />
    </CartProvider>
  );
}
