'use client';

import { useEffect, useState } from 'react';

export function useHydration() {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return isHydrated;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useIsomorphicLayoutEffect(callback: () => void, deps: any[]) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      callback();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}