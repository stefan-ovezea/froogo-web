"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowLeft, X, SearchX } from "lucide-react";
import { useOffers } from "@/contexts/offers-context";
import { ProductCard } from "@/components/product-card";
import { FilterChips } from "@/components/ui/filter-chips";
import { Product } from "@/types/product";

export default function SearchPage() {
  const router = useRouter();
  const { offersData, loading } = useOffers();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStores, setSelectedStores] = useState<Set<string>>(new Set());
  const [selectedSections, setSelectedSections] = useState<Set<string>>(
    new Set(),
  );

  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

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
    if (!offersData) return [];

    let results: { product: Product; storeName: string }[] = [];

    offersData.stores.forEach((store) => {
      // Filter by store
      if (selectedStores.size > 0 && !selectedStores.has(store.name)) return;

      store.sections.forEach((section) => {
        // Filter by section
        if (selectedSections.size > 0 && !selectedSections.has(section.name))
          return;

        section.products.forEach((product) => {
          results.push({ product, storeName: store.name });
        });
      });
    });

    // Filter by query
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

  return (
    <div className="flex min-h-screen w-full min-w-0 overflow-x-hidden flex-col pb-8">
      {/* Header with Search */}
      <header className="sticky top-0 z-20 bg-surface/90 pb-4 pt-4 backdrop-blur-xl">
        <div className="flex items-center gap-3 px-4 pb-2">
          <button
            onClick={() => router.back()}
            className="rounded-full p-2 text-secondary hover:bg-surface-container-low transition-colors"
          >
            <ArrowLeft size={24} />
          </button>

          <div className="flex flex-1 items-center gap-2 rounded-t-xl bg-surface-container-low px-4 py-3 border-b-2 border-transparent focus-within:border-primary transition-colors ghost-border">
            <Search className="text-secondary" size={20} />
            <input
              ref={inputRef}
              type="text"
              placeholder="Caută produse..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent outline-none placeholder:text-secondary text-on-surface font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-secondary hover:text-on-surface transition-colors"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        {!loading && (
          <div className="mt-2 flex flex-col gap-2">
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
      </header>

      {/* Results */}
      <main className="flex-1 p-4">
        {loading ? (
          <div className="flex h-32 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : (
          <>
            {(searchQuery ||
              selectedStores.size > 0 ||
              selectedSections.size > 0) && (
              <p className="mb-6 text-sm font-medium text-secondary px-2">
                {filteredProducts.length}{" "}
                {filteredProducts.length === 1
                  ? "produs găsit"
                  : "produse găsite"}
              </p>
            )}

            {filteredProducts.length === 0 ? (
              <div className="flex h-64 flex-col items-center justify-center text-center">
                {searchQuery ? (
                  <SearchX
                    size={64}
                    className="mb-6 text-outline-variant"
                  />
                ) : (
                  <Search
                    size={64}
                    className="mb-6 text-outline-variant"
                  />
                )}
                <h2 className="text-xl font-medium text-secondary">
                  {searchQuery
                    ? "Nu s-au găsit produse"
                    : "Începe să cauți produse"}
                </h2>
              </div>
            ) : (
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
            )}
          </>
        )}
      </main>
    </div>
  );
}
