"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

type PlatformContextType = {
  isDesktop: boolean;
};

const PlatformContext = createContext<PlatformContextType>({ isDesktop: false });

export const PlatformProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    // Initial check
    const mql = window.matchMedia('(min-width: 1024px)');
    
    // Set initial value
    setIsDesktop(mql.matches);

    // Event listener for changes
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    
    // Support modern and legacy event listener
    if (mql.addEventListener) {
      mql.addEventListener('change', handler);
      return () => mql.removeEventListener('change', handler);
    } else {
      // Fallback for older browsers
      mql.addListener(handler);
      return () => mql.removeListener(handler);
    }
  }, []);

  return (
    <PlatformContext.Provider value={{ isDesktop }}>
      {children}
    </PlatformContext.Provider>
  );
};

export const usePlatform = () => useContext(PlatformContext);
