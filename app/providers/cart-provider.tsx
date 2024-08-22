import type { CartItem } from 'mock-server/routes/cart';
import type { Product } from 'mock-server/routes/items';
import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

type CartProductItem = CartItem & Product;

interface ICartContext {
  cart: CartProductItem[];
  addItem: (item: CartProductItem) => void;
  removeItem: (sku: CartItem['sku']) => void;
  changeQty: (sku: CartItem['sku'], qty: CartItem['qty']) => void;
}

const initialState: ICartContext = {
  cart: [],
  addItem: () => {},
  removeItem: () => {},
  changeQty: () => {},
};

export const CartContext = createContext(initialState);

export const CartProvider = ({
  initialValue = [],
  children,
}: {
  initialValue?: CartProductItem[];
  children: ReactNode;
}) => {
  const [cart, setCart] = useState<CartProductItem[]>(initialValue);

  const value = useMemo<ICartContext>(() => {
    const addItem: ICartContext['addItem'] = (item) => {
      setCart((state) => [...state, item]);
    };

    const removeItem: ICartContext['removeItem'] = (sku) =>
      setCart((state) => state.filter((cartItem) => cartItem.sku !== sku));

    /**
     * This method changes the qty of the product in the cart. This does not remove the item
     * if qty is specified below 1.
     *
     * The reason we accept aboslute qty instead of using relative in-/decrement is because
     * we will allow implementation decide how to update qty, e.g. step 1, step 5 or max allowed.
     *
     * Implementation has all the necessary information to make these decisions.
     */
    const changeQty: ICartContext['changeQty'] = (sku, qty) => {
      setCart((state) =>
        state.map((item) => {
          if (item.sku !== sku) return item;
          return {
            ...item,
            /**
             * If qty below 1 - we lock at 1
             * If qty higher basketLimit - we lock at {basketLimit}
             * Otherwise use provided qty
             */
            qty: qty < 1 ? 1 : qty > item.basketLimit ? item.basketLimit : qty,
          };
        })
      );
    };

    return {
      cart,
      addItem,
      removeItem,
      changeQty,
    };
  }, [cart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const cartContext = useContext(CartContext);

  if (!cartContext) {
    throw new Error('useCart can only be used with CartProvider!');
  }

  return cartContext;
};
