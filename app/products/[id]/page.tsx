"use client";


import { useParams, useRouter } from "next/navigation";
import { useOffers } from "@/contexts/offers-context";
import { useWatchlist } from "@/contexts/watchlist-context";
import { StoreLogo } from "@/components/store-logo";
import { ChevronLeft, ShoppingCart, ShoppingBasket, Plus } from "lucide-react";
import { Product } from "@/types/product";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { offersData, loading } = useOffers();
  const { isInWatchlist, toggleProduct } = useWatchlist();

  const id = params.id as string;

  const { product, storeName } = (() => {
    if (!offersData || !id) return { product: null, storeName: null };

    for (const store of offersData.stores) {
      for (const section of store.sections) {
        const found = section.products.find((p: Product) => p.id === id);
        if (found) {
          return { product: found, storeName: store.name };
        }
      }
    }
    return { product: null, storeName: null };
  })();

  const isSaved = product && product.id ? isInWatchlist(product.id) : false;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!product || !storeName) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4 text-center">
        <h1 className="text-2xl font-bold">Produsul nu a fost găsit</h1>
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
    <div className="min-h-screen bg-slate-50 pb-24 dark:bg-slate-950">
      {/* App Bar equivalent */}
      <header className="sticky top-0 z-10 flex items-center bg-white/80 px-4 py-3 backdrop-blur-md dark:bg-slate-900/80">
        <button
          onClick={() => router.back()}
          className="mr-3 rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-lg font-bold">Detalii produs</h1>
      </header>

      <main className="mx-auto max-w-2xl">
        {/* Product Image */}
        <div className="aspect-square w-full bg-white p-8 dark:bg-slate-900">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.title}
              className="h-full w-full object-contain"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
              <ShoppingBasket
                size={100}
                className="text-slate-300 dark:text-slate-600"
              />
            </div>
          )}
        </div>

        <div className="p-5">
          {/* Store Info & Discount */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <StoreLogo storeName={storeName} />
              <span className="text-lg font-bold text-slate-900 dark:text-white">
                {storeName}
              </span>
            </div>
            {product.discount && (
              <div className="rounded-full bg-red-600 px-4 py-1.5 text-sm font-bold text-white shadow-sm">
                {product.discount}
              </div>
            )}
          </div>

          {/* Title & Subtitle */}
          <div className="mt-6">
            <h1 className="text-2xl font-extrabold leading-tight text-slate-900 dark:text-white">
              {product.title || product.subtitle}
            </h1>
            {product.title && product.subtitle && (
              <p className="mt-2 text-base text-slate-500 dark:text-slate-400">
                {product.subtitle}
              </p>
            )}
          </div>

          {/* Price Card */}
          <div className="mt-8 rounded-2xl bg-white p-5 shadow-sm dark:bg-slate-900">
            <p className="text-sm font-medium text-slate-500">Preț</p>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-4xl font-black text-primary">
                {product.price}
              </span>
              <span className="text-xl font-bold text-primary">RON</span>
              {product.unit && (
                <span className="ml-1 text-slate-500">/ {product.unit}</span>
              )}
            </div>
            {product.oldPrice && product.oldPrice > 0 && (
              <div className="mt-2 text-sm text-slate-400 line-through">
                Preț vechi: {product.oldPrice} RON
              </div>
            )}
          </div>

          {/* Add to Watchlist Button */}
          <button
            className={`mt-8 flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-lg font-bold shadow-lg transition-all focus:ring-4 ${
              isSaved
                ? "bg-slate-200 text-slate-800 hover:bg-slate-300 focus:ring-slate-200/50 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                : "bg-primary text-white hover:bg-primary/90 focus:ring-primary/20"
            }`}
            onClick={() => toggleProduct(product)}
          >
            {isSaved ? <ShoppingCart size={24} /> : <Plus size={24} />}
            {isSaved ? "Elimină din listă" : "Adaugă la listă"}
          </button>
        </div>
      </main>
    </div>
  );
}
