import {
  Box,
  Button,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
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
    <Paper style={{ width: 700 }}>
      <Stack gap={2} direction="column">
        <Box pt={2} pl={2}>
          <Stack
            direction="row"
            gap={2}
            justifyContent="start"
            alignContent="center"
          >
            <Link to={'/'}>
              <Button
                variant="contained"
                data-testid="go-back-home-button"
                type="button"
              >
                Back
              </Button>
            </Link>
            <Typography variant="h4">Checkout</Typography>
          </Stack>
        </Box>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Item</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Qty</TableCell>
              <TableCell>Total</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cart.map(({ sku, name, price, qty }) => (
              <TableRow data-testid={`checkout-item-${sku}`} key={sku}>
                <TableCell data-testid={`checkout-item-${sku}-name`}>
                  {name}
                </TableCell>
                <TableCell data-testid={`checkout-item-${sku}-price`}>
                  {price}
                </TableCell>
                <TableCell data-testid={`checkout-item-${sku}-qty`}>
                  {qty}
                </TableCell>
                <TableCell data-testid={`checkout-item-${sku}-total`}>
                  {Math.floor(qty * price * 100) / 100}
                </TableCell>
                <TableCell>
                  <Stack direction="row" gap={2} justifyContent="end">
                    <Button
                      variant="contained"
                      data-testid="remove-item-from-checkout-button"
                      onClick={() => changeQty(sku, qty + 1)}
                    >
                      Add item
                    </Button>
                    <Button
                      variant="contained"
                      data-testid="remove-item-from-checkout-button"
                      onClick={() =>
                        qty === 1 ? removeItem(sku) : changeQty(sku, qty - 1)
                      }
                    >
                      Remove
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Box pb={2} pr={2}>
          <Stack direction="row" justifyContent="end">
            <Button
              variant="contained"
              data-testid="submit-basket-button"
              type="button"
            >
              Checkout
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Paper>
  );
}
