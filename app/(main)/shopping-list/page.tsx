"use client";

import { useMemo } from "react";
import { ShoppingCart, Trash2, CheckCircle2 } from "lucide-react";
import { useWatchlist } from "@/contexts/watchlist-context";
import { useOffers } from "@/contexts/offers-context";
import { Product } from "@/types/product";
import { clsx } from "clsx";

export default function ShoppingListPage() {
  const {
    watchlist,
    checkedItems,
    toggleChecked,
    clearWatchlist,
    clearChecked,
  } = useWatchlist();

  const { offersData, loading } = useOffers();

  const { itemsByStore, checkedProducts } = useMemo(() => {
    const grouped = new Map<string, Product[]>();
    const checked: Product[] = [];

    if (!offersData) return { itemsByStore: grouped, checkedProducts: checked };

    watchlist.forEach((product) => {
      if (!product.id) return;

      if (checkedItems.includes(product.id)) {
        checked.push(product);
        return; // Don't group checked items by store
      }

      // Find store for this product
      let storeName = "Necunoscut";
      for (const store of offersData.stores) {
        for (const section of store.sections) {
          if (section.products.some((p) => p.id === product.id)) {
            storeName = store.name;
            break;
          }
        }
        if (storeName !== "Necunoscut") break;
      }

      if (!grouped.has(storeName)) {
        grouped.set(storeName, []);
      }
      grouped.get(storeName)!.push(product);
    });

    return { itemsByStore: grouped, checkedProducts: checked };
  }, [watchlist, checkedItems, offersData]);

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (watchlist.length === 0) {
    return (
      <div className="flex h-[70vh] flex-col items-center justify-center text-center p-4 bg-surface">
        <ShoppingCart
          size={80}
          className="mb-6 text-outline-variant opacity-50"
        />
        <h2 className="text-2xl font-bold text-on-surface font-display mb-2">
          Lista ta este goală
        </h2>
        <p className="mt-2 text-secondary text-base">
          Adaugă produse la listă pentru a le urmări
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col pb-8 min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between bg-surface/90 px-6 py-6 backdrop-blur-xl">
        <h1 className="text-[1.75rem] font-bold font-display text-on-surface">
          Lista ta
        </h1>
        <div className="flex items-center gap-3">
          {checkedProducts.length > 0 && (
            <button
              onClick={() => {
                if (confirm("Ștergi produsele cumpărate?")) clearChecked();
              }}
              className="rounded-full p-2 text-secondary hover:bg-surface-container-low transition-colors"
              title="Șterge produsele cumpărate"
            >
              <CheckCircle2 size={24} className="text-primary" />
            </button>
          )}
          <button
            onClick={() => {
              if (confirm("Sigur vrei să ștergi toate produsele din listă?"))
                clearWatchlist();
            }}
            className="rounded-full p-2 text-secondary hover:bg-surface-container-low transition-colors"
            title="Șterge toată lista"
          >
            <Trash2 size={24} />
          </button>
        </div>
      </header>

      {/* Unchecked Items Grouped by Store */}
      <div className="p-4 space-y-8">
        {Array.from(itemsByStore.entries()).map(([storeName, products]) => {
          if (products.length === 0) return null;

          // Calculate total savings for this store's unchecked items
          const totalSavings = products.reduce((acc, p) => {
            if (p.oldPrice && p.oldPrice > p.price) {
              return acc + (p.oldPrice - p.price);
            }
            return acc;
          }, 0);

          return (
            <div
              key={storeName}
              className="space-y-4 rounded-3xl bg-surface-container-low p-5"
            >
              <div className="flex items-center justify-between pl-1 pr-1 mb-2">
                <h2 className="font-bold text-xl text-on-surface font-display">
                  {storeName}
                </h2>
                {totalSavings > 0 && (
                  <div className="rounded-full bg-tertiary-container px-3 py-1 text-sm font-bold text-on-tertiary-container shadow-sm">
                    -{totalSavings} RON
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-3">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="flex flex-row items-center gap-4 rounded-2xl bg-surface-container-lowest p-4 transition-all hover:bg-surface-bright"
                  >
                    <input
                      type="checkbox"
                      checked={false}
                      onChange={() => product.id && toggleChecked(product.id)}
                      className="h-6 w-6 rounded-md border-outline-variant text-primary focus:ring-primary focus:ring-offset-0 bg-surface shadow-sm cursor-pointer"
                    />
                    <div className="flex flex-1 flex-col overflow-hidden">
                      <span className="truncate font-medium text-on-surface text-base">
                        {product.title || product.subtitle}
                      </span>
                      {product.title && (
                        <span className="truncate text-sm text-secondary mt-0.5">
                          {product.subtitle}
                        </span>
                      )}
                    </div>
                    <div className="text-right font-bold text-primary font-display flex items-baseline gap-1">
                      <span className="text-[1.125rem]">{product.price}</span>
                      <span className="text-[10px]">RON</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Checked Items Section */}
        {checkedProducts.length > 0 && (
          <div className="mt-8 space-y-4 opacity-60">
            <div className="flex items-center gap-2 px-6">
              <CheckCircle2 size={24} className="text-secondary" />
              <h2 className="font-bold text-xl text-secondary font-display">
                Cumpărate
              </h2>
            </div>
            <div className="space-y-3 px-4">
              {checkedProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-4 rounded-2xl bg-surface-container-low p-4"
                >
                  <input
                    type="checkbox"
                    checked={true}
                    onChange={() => product.id && toggleChecked(product.id)}
                    className="h-6 w-6 rounded-md border-outline-variant text-secondary focus:ring-secondary bg-surface cursor-pointer"
                  />
                  <div className="flex flex-1 flex-col overflow-hidden">
                    <span className="truncate font-medium text-secondary line-through text-base">
                      {product.title || product.subtitle}
                    </span>
                  </div>
                  <div className="text-right font-bold text-outline-variant line-through font-display">
                    {product.price}
                    <span className="text-[10px] ml-1">RON</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
