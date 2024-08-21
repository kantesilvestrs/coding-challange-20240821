// In future this should be a package or TRPC, or something that does not refer to mock-server implementation
import type { CartState } from 'mock-server/routes/cart';

const API_ENDPOINT = 'http://localhost:4000';

export const getCart = async () => {
  try {
    const response = await fetch(`${API_ENDPOINT}/cart`);
    const result = (await response.json()) as CartState;
    return result;
  } catch (error) {
    // Replace this with Sentry
    console.error(error);
    return null;
  }
};
