'use client';

import { useEffect, useState } from 'react';

export function useHydration() {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return isHydrated;
}

export function useIsomorphicLayoutEffect(callback: () => void, deps: any[]) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      callback();
    }
  }, deps);
}