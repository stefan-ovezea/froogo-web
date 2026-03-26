"use client";

import React, { createContext, useContext, useSyncExternalStore } from 'react';

type PlatformContextType = {
  isDesktop: boolean;
};

const PlatformContext = createContext<PlatformContextType>({ isDesktop: false });

const subscribe = (callback: () => void) => {
  const mql = window.matchMedia('(min-width: 1024px)');
  
  if (mql.addEventListener) {
    mql.addEventListener('change', callback);
    return () => mql.removeEventListener('change', callback);
  } else {
    mql.addListener(callback);
    return () => mql.removeListener(callback);
  }
};

const getSnapshot = () => {
  return window.matchMedia('(min-width: 1024px)').matches;
};

const getServerSnapshot = () => false;

export const PlatformProvider = ({ children }: { children: React.ReactNode }) => {
  const isDesktop = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <PlatformContext.Provider value={{ isDesktop }}>
      {children}
    </PlatformContext.Provider>
  );
};

export const usePlatform = () => useContext(PlatformContext);
