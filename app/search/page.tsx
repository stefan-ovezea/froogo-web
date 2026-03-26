"use client";

import { useState, useMemo, useRef, useEffect, useDeferredValue, memo } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowLeft, X, SearchX } from "lucide-react";
import { useOffers } from "@/contexts/offers-context";
import { ProductCard } from "@/components/product-card";
import { FilterChips } from "@/components/ui/filter-chips";
import { Product } from "@/types/product";
import { useDebounce } from "@/hooks/useDebounce";

// 1. Memoize the Product Card to prevent unnecessary re-paints
const MemoizedProductCard = memo(ProductCard);

export default function SearchPage() {
  const router = useRouter();
  const { offersData, loading } = useOffers();

  // The "Source of Truth" for the list update (Debounced)
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  
  // The local state for the input field (Immediate)
  const [inputValue, setInputValue] = useState("");

  const [selectedStores, setSelectedStores] = useState<Set<string>>(new Set());
  const [selectedSections, setSelectedSections] = useState<Set<string>>(
    new Set(),
  );

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Update the actual search query when local input changes (managed by useDebounce)
  useEffect(() => {
    setSearchQuery(inputValue);
  }, [inputValue]);

  // Pre-flatten products (remains optimized)
  const allProductsFlattened = useMemo(() => {
    if (!offersData) return [];
    let results: { product: Product; storeName: string; sectionName: string }[] = [];
    offersData.stores.forEach((store) => {
      store.sections.forEach((section) => {
        section.products.forEach((product) => {
          results.push({ product, storeName: store.name, sectionName: section.name });
        });
      });
    });
    return results;
  }, [offersData]);

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

  const filteredProducts = useMemo(() => {
    if (allProductsFlattened.length === 0) return [];
    let results = allProductsFlattened;

    if (selectedStores.size > 0) {
      results = results.filter(item => selectedStores.has(item.storeName));
    }
    if (selectedSections.size > 0) {
      results = results.filter(item => selectedSections.has(item.sectionName));
    }
    if (debouncedSearchQuery.trim()) {
      const query = debouncedSearchQuery.toLowerCase();
      results = results.filter(
        (item) =>
          item.product.title?.toLowerCase().includes(query) ||
          item.product.subtitle?.toLowerCase().includes(query),
      );
    }
    return results;
  }, [allProductsFlattened, debouncedSearchQuery, selectedStores, selectedSections]);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950 pb-8">
      <header className="sticky top-0 z-20 bg-white/95 pb-2 pt-3 backdrop-blur-md dark:bg-slate-900/95 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 px-4 pb-2">
          <button onClick={() => router.back()} className="rounded-full p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
            <ArrowLeft size={24} />
          </button>

          <div className="flex flex-1 items-center gap-2 rounded-2xl bg-slate-100 px-4 py-3 dark:bg-slate-800 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
            <Search className="text-slate-400" size={20} />
            <input
              ref={inputRef}
              type="text"
              placeholder="Caută produse..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full bg-transparent outline-none placeholder:text-slate-500 dark:text-white font-medium"
            />
            {inputValue && (
              <button onClick={() => setInputValue("")} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {!loading && (
          <div className="mt-2 flex flex-col gap-1">
            <FilterChips options={storeNames} selectedOptions={selectedStores} onToggle={(s) => {
              const next = new Set(selectedStores);
              if (next.has(s)) next.delete(s); else next.add(s);
              setSelectedStores(next);
            }} onClear={selectedStores.size > 0 ? () => setSelectedStores(new Set()) : undefined} />
            <FilterChips options={sectionNames} selectedOptions={selectedSections} onToggle={(s) => {
              const next = new Set(selectedSections);
              if (next.has(s)) next.delete(s); else next.add(s);
              setSelectedSections(next);
            }} onClear={selectedSections.size > 0 ? () => setSelectedSections(new Set()) : undefined} />
          </div>
        )}
      </header>

      <main className="flex-1 p-4">
        {loading ? (
          <div className="flex h-32 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : (
          <>
            {(debouncedSearchQuery || selectedStores.size > 0 || selectedSections.size > 0) && (
              <p className="mb-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'produs găsit' : 'produse găsite'}
              </p>
            )}

            {filteredProducts.length === 0 ? (
              <div className="flex h-64 flex-col items-center justify-center text-center">
                <Search size={64} className="mb-4 text-slate-300 dark:text-slate-700" />
                <h2 className="text-xl font-medium text-slate-500">
                  {inputValue ? 'Nu s-au găsit produse' : 'Începe să cauți produse'}
                </h2>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
                {filteredProducts.map((item, idx) => (
                  <div key={`${item.product.id}-${idx}`} className="h-full">
                    <MemoizedProductCard
                      product={item.product}
                      storeName={item.storeName}
                      onTap={() => router.push(`/products/${item.product.id}`)}
                    />
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
