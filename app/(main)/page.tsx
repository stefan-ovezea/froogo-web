"use client";

import { useState, useMemo, useCallback } from "react";
import { Search, X, SearchX } from "lucide-react";
import { useOffers } from "@/contexts/offers-context";
import { StoreSectionCard } from "@/components/store-section-card";
import { ProductCard } from "@/components/product-card";
import { FilterChips } from "@/components/ui/filter-chips";
import { Product } from "@/types/product";
import { useRouter } from "next/navigation";
import { usePlatform } from "@/components/providers/platform-provider";
import { SearchInput } from "@/components/search-input";

export default function HomePage() {
  const { offersData, loading, error } = useOffers();
  const router = useRouter();
  const { isDesktop } = usePlatform();

  // The actual search query that triggers filtering (Debounced inside SearchInput)
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStores, setSelectedStores] = useState<Set<string>>(new Set());
  const [selectedSections, setSelectedSections] = useState<Set<string>>(
    new Set(),
  );

  const maxProductsPreview = 10;

  // Pre-flatten ALL products ONCE when offersData changes
  const allProductsFlattened = useMemo(() => {
    if (!offersData) return [];
    let results: { product: Product; storeName: string; sectionName: string }[] = [];
    offersData.stores.forEach((store) => {
      store.sections.forEach((section) => {
        section.products.forEach((product) => {
          results.push({ 
            product, 
            storeName: store.name, 
            sectionName: section.name 
          });
        });
      });
    });
    return results;
  }, [offersData]);

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
    if (allProductsFlattened.length === 0) return [];

    let results = allProductsFlattened;

    if (selectedStores.size > 0) {
      results = results.filter(item => selectedStores.has(item.storeName));
    }

    if (selectedSections.size > 0) {
      results = results.filter(item => selectedSections.has(item.sectionName));
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        (item) =>
          item.product.title?.toLowerCase().includes(query) ||
          item.product.subtitle?.toLowerCase().includes(query),
      );
    }

    return results;
  }, [allProductsFlattened, searchQuery, selectedStores, selectedSections]);

  const handleProductTap = (product: Product) => {
    if (product.id) {
      router.push(`/products/${product.id}`);
    }
  };

  const toggleStore = useCallback((store: string) => {
    setSelectedStores((prev) => {
      const next = new Set(prev);
      if (next.has(store)) next.delete(store);
      else next.add(store);
      return next;
    });
  }, []);

  const toggleSection = useCallback((section: string) => {
    setSelectedSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) next.delete(section);
      else next.add(section);
      return next;
    });
  }, []);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

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
          <svg
            className="h-12 w-12"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <p className="text-secondary">Eroare: {error.message}</p>
      </div>
    );
  }

  const isFiltering =
    isDesktop &&
    (searchQuery || selectedStores.size > 0 || selectedSections.size > 0);

  return (
    <div className="flex flex-col gap-8 pb-8 min-h-screen">
      {/* Header Area with Asymmetric Padding */}
      <div className="pl-6 pr-4 pt-8 pb-2">
        <h1 className="text-[2rem] font-bold text-on-surface font-display leading-tight mb-6">
          Bună,
          <br />
          Ce oferte cauți azi?
        </h1>

        {/* Responsive Search Interaction */}
        {isDesktop ? (
          <div className="flex flex-col gap-4">
            <SearchInput onSearch={handleSearch} />

            {/* Desktop Filters (only visible when typing or filtering) */}
            {isFiltering && (
              <div className="flex flex-col gap-2 mt-2 w-full min-w-0">
                {storeNames.length > 0 && (
                  <FilterChips
                    options={storeNames}
                    selectedOptions={selectedStores}
                    onToggle={toggleStore}
                    onClear={
                      selectedStores.size > 0
                        ? () => setSelectedStores(new Set())
                        : undefined
                    }
                  />
                )}
                {sectionNames.length > 0 && (
                  <FilterChips
                    options={sectionNames}
                    selectedOptions={selectedSections}
                    onToggle={toggleSection}
                    onClear={
                      selectedSections.size > 0
                        ? () => setSelectedSections(new Set())
                        : undefined
                    }
                  />
                )}
              </div>
            )}
          </div>
        ) : (
          <div
            onClick={() => router.push("/search")}
            className="flex cursor-pointer items-center gap-3 rounded-2xl bg-surface-container-low px-5 py-4 transition-colors hover:bg-surface-container-high"
          >
            <Search className="text-secondary" size={24} />
            <span className="text-secondary text-lg font-medium">
              Caută produse...
            </span>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {isFiltering ? (
        <div className="px-4">
          <p className="mb-6 text-sm font-medium text-secondary px-2">
            {filteredProducts.length}{" "}
            {filteredProducts.length === 1 ? "produs găsit" : "produse găsite"}
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
            // Pre-calculate preview for Home Screen
            const previewProducts: Product[] = [];
            for (const section of store.sections) {
              for (const product of section.products) {
                if (previewProducts.length < maxProductsPreview) {
                  previewProducts.push(product);
                } else break;
              }
              if (previewProducts.length >= maxProductsPreview) break;
            }

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
            <p className="text-center text-sm text-secondary">
              Nu au fost găsite oferte.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
