'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { Product } from '@/types/product';

interface WatchlistContextType {
  watchlist: Product[];
  checkedItems: string[];
  toggleProduct: (product: Product) => void;
  isInWatchlist: (productId: string) => boolean;
  clearWatchlist: () => void;
  toggleChecked: (productId: string) => void;
  clearChecked: () => void;
}

const WatchlistContext = createContext<WatchlistContextType>({
  watchlist: [],
  checkedItems: [],
  toggleProduct: () => {},
  isInWatchlist: () => false,
  clearWatchlist: () => {},
  toggleChecked: () => {},
  clearChecked: () => {},
});

export function WatchlistProvider({ children }: { children: React.ReactNode }) {
  const [watchlist, setWatchlist] = useState<Product[]>([]);
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    try {
      const savedWatchlist = localStorage.getItem('froogo_watchlist');
      const savedChecked = localStorage.getItem('froogo_checked_items');
      if (savedWatchlist) setWatchlist(JSON.parse(savedWatchlist));
      if (savedChecked) setCheckedItems(JSON.parse(savedChecked));
    } catch (e) {
      console.error('Failed to load watchlist from local storage', e);
    }
    setIsLoaded(true);
  }, []);

  // Save to local storage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('froogo_watchlist', JSON.stringify(watchlist));
      localStorage.setItem('froogo_checked_items', JSON.stringify(checkedItems));
    }
  }, [watchlist, checkedItems, isLoaded]);

  const toggleProduct = (product: Product) => {
    if (!product.id) return;
    
    setWatchlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        // Also remove from checked if we remove from watchlist
        setCheckedItems(current => current.filter(id => id !== product.id));
        return prev.filter((p) => p.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  const isInWatchlist = (productId: string) => {
    return watchlist.some((p) => p.id === productId);
  };

  const clearWatchlist = () => {
    setWatchlist([]);
    setCheckedItems([]);
  };

  const toggleChecked = (productId: string) => {
    setCheckedItems(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const clearChecked = () => {
    // Remove checked items from the main watchlist as well
    setWatchlist(prev => prev.filter(p => !p.id || !checkedItems.includes(p.id)));
    setCheckedItems([]);
  };

  return (
    <WatchlistContext.Provider
      value={{ 
        watchlist, 
        checkedItems, 
        toggleProduct, 
        isInWatchlist, 
        clearWatchlist,
        toggleChecked,
        clearChecked
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
}

export const useWatchlist = () => useContext(WatchlistContext);
