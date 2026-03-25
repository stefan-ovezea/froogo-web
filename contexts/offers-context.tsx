'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { getCachedOffers } from '@/services/offers';
import { OffersData } from '@/types/offers-data';

interface OffersContextType {
  offersData: OffersData | null;
  loading: boolean;
  error: Error | null;
}

const OffersContext = createContext<OffersContextType>({
  offersData: null,
  loading: true,
  error: null,
});

export function OffersProvider({ children }: { children: React.ReactNode }) {
  const [offersData, setOffersData] = useState<OffersData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getCachedOffers();
        setOffersData(data);
      } catch (err: any) {
        console.error('Offers fetch failed:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <OffersContext.Provider value={{ offersData, loading, error }}>
      {children}
    </OffersContext.Provider>
  );
}

export const useOffers = () => useContext(OffersContext);
