import type { MetaFunction } from '@remix-run/node';
import { useGetProducts } from '~/queries/use-get-products';

export const meta: MetaFunction = () => {
  return [
    { title: 'Items List' },
    { name: 'description', content: 'Local Product listing' },
  ];
};

export default function Index() {
  const productItems = useGetProducts();

  return (
    <main>
      <h1>Items List</h1>
      <ul>
        {productItems.map(({ sku, name }) => (
          <li key={sku}>{name}</li>
        ))}
      </ul>
    </main>
  );
}
