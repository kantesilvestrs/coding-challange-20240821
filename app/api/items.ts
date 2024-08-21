// In future this should be a package or TRPC, or something that does not refer to mock-server implementation
import type { Product } from 'mock-server/routes/items';

const API_ENDPOINT = 'http://localhost:4000';

export const getItems = async () => {
  try {
    const response = await fetch(`${API_ENDPOINT}/items`);
    const result = (await response.json()) as Product[];
    return result;
  } catch (error) {
    // Replace this with Sentry
    console.error(error);
    return null;
  }
};
