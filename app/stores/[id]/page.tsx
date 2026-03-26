"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Search, ChevronLeft, ShoppingBag } from "lucide-react";
import { useOffers } from "@/contexts/offers-context";
import { StoreLogo } from "@/components/store-logo";
import { ProductCard } from "@/components/product-card";
import { FilterChips } from "@/components/ui/filter-chips";
import { Product } from "@/types/product";
import { useDebounce } from "@/hooks/useDebounce";

export default function StoreDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { offersData, loading } = useOffers();

  // params.id will be URL encoded
  const storeName = decodeURIComponent(params.id as string);

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [selectedSections, setSelectedSections] = useState<Set<string>>(
    new Set(),
  );

  const store = useMemo(() => {
    return offersData?.stores.find((s) => s.name === storeName);
  }, [offersData, storeName]);

  const sections = useMemo(() => {
    return store?.sections.map((s) => s.name) || [];
  }, [store]);

  // Flatten products ONCE when store changes, not on every keystroke
  const allStoreProducts = useMemo(() => {
    if (!store) return [];
    return store.sections.flatMap((section) =>
      section.products.map((product) => ({
        ...product,
        sectionName: section.name,
      })),
    );
  }, [store]);

  const filteredProducts = useMemo(() => {
    if (allStoreProducts.length === 0) return [];

    let results = [...allStoreProducts];

    // Filter by selected sections
    if (selectedSections.size > 0) {
      results = results.filter((p) =>
        selectedSections.has(p.sectionName),
      );
    }

    // Filter by debounced search query
    if (debouncedSearchQuery.trim().length > 0) {
      const query = debouncedSearchQuery.toLowerCase();
      results = results.filter(
        (p) =>
          p.title?.toLowerCase().includes(query) ||
          p.subtitle?.toLowerCase().includes(query),
      );
    }

    // Sort by discount percent
    return results.sort((a, b) => {
      const aDiscount =
        a.oldPrice && a.oldPrice > 0 ? (a.oldPrice - a.price) / a.oldPrice : 0;
      const bDiscount =
        b.oldPrice && b.oldPrice > 0 ? (b.oldPrice - b.price) / b.oldPrice : 0;
      return bDiscount - aDiscount;
    });
  }, [allStoreProducts, selectedSections, debouncedSearchQuery]);

  const toggleSection = (section: string) => {
    const newSet = new Set(selectedSections);
    if (newSet.has(section)) {
      newSet.delete(section);
    } else {
      newSet.add(section);
    }
    setSelectedSections(newSet);
  };

  const handleProductTap = (product: Product) => {
    if (product.id) {
      router.push(`/products/${product.id}`);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!store) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4 text-center">
        <h1 className="text-2xl font-bold">Magazinul nu a fost găsit</h1>
        <button
          onClick={() => router.back()}
          className="rounded-xl bg-primary px-6 py-3 font-semibold text-white"
        >
          Înapoi la oferte
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
      {/* App Bar equivalent */}
      <header className="sticky top-0 z-10 bg-white/80 pb-2 pt-3 backdrop-blur-md dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center px-4">
          <button
            onClick={() => router.back()}
            className="mr-3 rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="flex items-center gap-3">
            <StoreLogo storeName={storeName} size={32} />
            <h1 className="text-lg font-bold">{storeName}</h1>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-3 px-4">
          <div className="flex items-center gap-3 rounded-full bg-slate-100 px-4 py-2.5 dark:bg-slate-800">
            <Search className="text-slate-400" size={20} />
            <input
              type="text"
              placeholder={`Caută în ${storeName}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent outline-none placeholder:text-slate-500 dark:text-white"
            />
          </div>
        </div>

        {/* Section Filters */}
        {sections.length > 0 && (
          <div className="mt-3">
            <FilterChips
              options={sections}
              selectedOptions={selectedSections}
              onToggle={toggleSection}
              onClear={
                selectedSections.size > 0
                  ? () => setSelectedSections(new Set())
                  : undefined
              }
            />
          </div>
        )}
      </header>

      {/* Products Grid */}
      <main className="flex-1 p-4 pb-24">
        {filteredProducts.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center pt-20 text-slate-400">
            <ShoppingBag size={64} className="mb-4 opacity-50" />
            <p className="text-lg font-medium text-slate-500">
              Nu s-au găsit produse
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-8">
            {filteredProducts.map((product, idx) => (
              <div key={`${product.id}-${idx}`} className="h-full">
                <ProductCard
                  product={product}
                  storeName={storeName}
                  onTap={() => handleProductTap(product)}
                />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
