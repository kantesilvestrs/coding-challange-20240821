import { useQuery } from '@tanstack/react-query';
import { getCart } from '~/api/cart';

export const useGetCart = () => {
  const { data: cartState } = useQuery({
    initialData: { cart: [] },
    queryKey: ['cart'],
    queryFn: getCart,
  });

  return cartState || { cart: [] };
};
