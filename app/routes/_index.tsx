import {
  Box,
  Button,
  Paper,
  Stack,
  Table,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material';
import type { MetaFunction } from '@remix-run/node';
import { json, Link, useLoaderData } from '@remix-run/react';
import { Product } from 'mock-server/routes/items';
import { useCallback } from 'react';
import { getItems } from '~/api/items';
import { CartSummary } from '~/components/cart-summary';
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
    <Paper style={{ width: 500 }}>
      <Stack spacing={2} gap={2} direction="column">
        <Typography pl={2} pt={2} variant="h4" textAlign="center">
          Items List
        </Typography>
        <CartSummary />
        <Table>
          {products.map((product) => (
            <TableRow
              data-testid={`items-list-item-${product.sku}`}
              key={product.sku}
            >
              <TableCell>
                <div>
                  <span>{product.name}</span>
                  <br />
                  <span>{product.descr}</span>
                </div>
              </TableCell>
              <TableCell>${product.price}</TableCell>
              <TableCell>
                <Stack spacing={2} direction="row" justifyContent="end">
                  <Button
                    variant="contained"
                    data-testid="add-to-cart-button"
                    onClick={() => handleOnAddItem(product)}
                  >
                    Add item
                  </Button>
                  <Button
                    variant="contained"
                    data-testid="remove-from-cart-button"
                    disabled={!cart.some((item) => item.sku === product.sku)}
                    onClick={() => handleOnRemoveItem(product)}
                  >
                    Remove
                  </Button>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </Table>
        <Box pb={2} pr={2}>
          <Stack direction="row" justifyContent="end">
            <Link to={'/cart'}>
              <Button variant="contained" data-testid="navigate-to-cart-button">
                Checkout
              </Button>
            </Link>
          </Stack>
        </Box>
      </Stack>
    </Paper>
  );
}
