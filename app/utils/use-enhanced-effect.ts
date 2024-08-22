import { useLayoutEffect, useEffect } from 'react';

/**
 * This wrapper is so that we don't get SSR wrning when trying to useLayoutEffect on server.
 */
export const useEnhancedEffect: typeof useLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;
