'use client';

import { useState, useMemo } from 'react';
import { Search, X, SearchX } from 'lucide-react';
import { useOffers } from '@/contexts/offers-context';
import { StoreSectionCard } from '@/components/store-section-card';
import { ProductCard } from '@/components/product-card';
import { FilterChips } from '@/components/ui/filter-chips';
import { Product } from '@/types/product';
import { useRouter } from 'next/navigation';
import { usePlatform } from '@/components/providers/platform-provider';

export default function HomePage() {
  const { offersData, loading, error } = useOffers();
  const router = useRouter();
  const { isDesktop } = usePlatform();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStores, setSelectedStores] = useState<Set<string>>(new Set());
  const [selectedSections, setSelectedSections] = useState<Set<string>>(new Set());

  // Filtering metadata
  const { storeNames, sectionNames } = useMemo(() => {
    if (!offersData) return { storeNames: [], sectionNames: [] };

    const stores = new Set<string>();
    const sections = new Set<string>();

    offersData.stores.forEach((store) => {
      stores.add(store.name);
      store.sections.forEach((section) => sections.add(section.name));
    });

    return {
      storeNames: Array.from(stores).sort(),
      sectionNames: Array.from(sections).sort(),
    };
  }, [offersData]);

  // Active filter results
  const filteredProducts = useMemo(() => {
    if (!offersData) return [];

    let results: { product: Product; storeName: string }[] = [];

    offersData.stores.forEach((store) => {
      if (selectedStores.size > 0 && !selectedStores.has(store.name)) return;

      store.sections.forEach((section) => {
        if (selectedSections.size > 0 && !selectedSections.has(section.name)) return;

        section.products.forEach((product) => {
          results.push({ product, storeName: store.name });
        });
      });
    });

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        (item) =>
          item.product.title?.toLowerCase().includes(query) ||
          item.product.subtitle?.toLowerCase().includes(query),
      );
    }

    return results;
  }, [offersData, searchQuery, selectedStores, selectedSections]);

  const handleProductTap = (product: Product) => {
    if (product.id) {
      router.push(`/products/${product.id}`);
    }
  };

  const toggleStore = (store: string) => {
    const newSet = new Set(selectedStores);
    if (newSet.has(store)) newSet.delete(store);
    else newSet.add(store);
    setSelectedStores(newSet);
  };

  const toggleSection = (section: string) => {
    const newSet = new Set(selectedSections);
    if (newSet.has(section)) newSet.delete(section);
    else newSet.add(section);
    setSelectedSections(newSet);
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-4 text-center">
        <div className="text-red-500">
          <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <p className="text-secondary">Eroare: {error.message}</p>
      </div>
    );
  }

  const isFiltering = isDesktop && (searchQuery || selectedStores.size > 0 || selectedSections.size > 0);

  return (
    <div className="flex flex-col gap-8 pb-8 min-h-screen">
      {/* Header Area with Asymmetric Padding */}
      <div className="pl-6 pr-4 pt-8 pb-2">
        <h1 className="text-[2rem] font-bold text-on-surface font-display leading-tight mb-6">
          Bună,<br />
          Ce oferte cauți azi?
        </h1>
        
        {/* Responsive Search Interaction */}
        {isDesktop ? (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 rounded-2xl bg-surface-container-low px-5 py-4 transition-colors border-b-2 border-transparent focus-within:border-primary ghost-border">
              <Search className="text-secondary" size={24} />
              <input
                type="text"
                placeholder="Caută produse..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent outline-none placeholder:text-secondary text-on-surface font-medium text-lg"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-secondary hover:text-on-surface transition-colors"
                >
                  <X size={20} />
                </button>
              )}
            </div>

            {/* Desktop Filters (only visible when typing or filtering) */}
            {isFiltering && (
              <div className="flex flex-col gap-2 mt-2 w-full min-w-0">
                {storeNames.length > 0 && (
                  <FilterChips
                    options={storeNames}
                    selectedOptions={selectedStores}
                    onToggle={toggleStore}
                    onClear={selectedStores.size > 0 ? () => setSelectedStores(new Set()) : undefined}
                  />
                )}
                {sectionNames.length > 0 && (
                  <FilterChips
                    options={sectionNames}
                    selectedOptions={selectedSections}
                    onToggle={toggleSection}
                    onClear={selectedSections.size > 0 ? () => setSelectedSections(new Set()) : undefined}
                  />
                )}
              </div>
            )}
          </div>
        ) : (
          <div 
            onClick={() => router.push('/search')}
            className="flex cursor-pointer items-center gap-3 rounded-2xl bg-surface-container-low px-5 py-4 transition-colors hover:bg-surface-container-high"
          >
            <Search className="text-secondary" size={24} />
            <span className="text-secondary text-lg font-medium">Caută produse...</span>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {isFiltering ? (
        <div className="px-4">
          <p className="mb-6 text-sm font-medium text-secondary px-2">
            {filteredProducts.length} {filteredProducts.length === 1 ? "produs găsit" : "produse găsite"}
          </p>

          {filteredProducts.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center text-center">
               <SearchX size={64} className="mb-6 text-outline-variant" />
               <h2 className="text-xl font-medium text-secondary">
                 Nu s-au găsit produse
               </h2>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
               <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                 {filteredProducts.map((item, idx) => (
                   <div key={`${item.product.id}-${idx}`} className="h-full">
                     <ProductCard
                       product={item.product}
                       storeName={item.storeName}
                       onTap={() => handleProductTap(item.product)}
                     />
                   </div>
                 ))}
               </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-10">
          {offersData?.stores.map((store) => {
            // Flatten all products from all sections to get a preview of ~6 products
            const previewProducts = store.sections.flatMap(s => s.products).slice(0, 6);
            
            return (
              <StoreSectionCard
                key={store.name}
                storeName={store.name}
                products={previewProducts}
                onProductTap={(product) => handleProductTap(product)}
              />
            );
          })}

          {(!offersData || offersData.stores.length === 0) && (
            <p className="text-center text-sm text-secondary">Nu au fost găsite oferte.</p>
          )}
        </div>
      )}
    </div>
  );
}
