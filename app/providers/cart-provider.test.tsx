import { render, renderHook } from '@testing-library/react';
import { CartProvider, useCart } from './cart-provider';
import { ReactNode } from 'react';

const MOCK_ITEM = {
  sku: 1,
  price: 2,
  qty: 3,
  name: 'TEST_ITEM',
  descr: 'TEST_ITEM_DESCRIPTION',
  basketLimit: 4,
};

const wrapper = ({ children }: { children: ReactNode }) => (
  <CartProvider initialValue={[MOCK_ITEM]}>{children}</CartProvider>
);

describe('<CartProvider />', () => {
  it('should render children', () => {
    const TEST_TEXT = 'TEST_CHILD';
    const { queryByText } = render(
      <CartProvider>
        <div>{TEST_TEXT}</div>
      </CartProvider>
    );

    const result = queryByText(TEST_TEXT);
    expect(result).toBeInTheDocument();
  });

  it('should read provided initial data', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(result.current.cart[0]!.name).toBe('TEST_ITEM');
  });

  it('should add/remove items', () => {
    const { result, rerender } = renderHook(() => useCart(), { wrapper });

    result.current.removeItem(1);
    rerender();
    result.current.addItem({
      ...MOCK_ITEM,
      sku: 2,
      name: 'TEST_ITEM_2',
    });
    rerender();
    expect(result.current.cart[0]!.name).toBe('TEST_ITEM_2');
  });

  it('should change qty and apply correct rules', () => {
    const { result, rerender } = renderHook(() => useCart(), { wrapper });
    result.current.changeQty(1, 5);
    rerender();
    expect(result.current.cart[0]!.qty).toBe(4);
    result.current.changeQty(1, 0);
    rerender();
    expect(result.current.cart[0]!.qty).toBe(1);
  });
});
