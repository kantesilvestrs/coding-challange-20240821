import { useQuery } from '@tanstack/react-query';
import { getItems } from '~/api/items';

export const useGetProducts = () => {
  const { data: productItems } = useQuery({
    initialData: [],
    queryKey: ['productItems'],
    queryFn: getItems,
  });

  return productItems || [];
};
