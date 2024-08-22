import { Paper, Stack, styled } from '@mui/material';
import { useCart } from '~/providers/cart-provider';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export const CartSummary = () => {
  const { cart } = useCart();

  const [totalItems, totalCost] = cart.reduce<[number, number]>(
    (acc, cV) => {
      acc[0] += cV.qty;
      acc[1] += Math.floor(cV.qty * cV.price * 100) / 100;
      return acc;
    },
    [0, 0]
  );

  return (
    <Stack direction="row" gap={2} justifyContent="center">
      <Item>Items: {totalItems}</Item>
      <Item>Cost: ${totalCost}</Item>
    </Stack>
  );
};
