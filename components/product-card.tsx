import Image from "next/image";
import { ShoppingCart, Plus } from "lucide-react";
import { Product } from "@/types/product";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useWatchlist } from "@/contexts/watchlist-context";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ProductCardProps {
  product: Product;
  storeName: string;
  onTap?: () => void;
}

export function ProductCard({ product, storeName, onTap }: ProductCardProps) {
  const { isInWatchlist, toggleProduct } = useWatchlist();
  const isSaved = product.id ? isInWatchlist(product.id) : false;

  const handleToggleWatchlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleProduct(product);
  };

  return (
    <div
      onClick={onTap}
      className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl bg-surface-container-lowest transition-all duration-300 lg:hover:shadow-ambient active:scale-[0.98]"
    >
      {/* Product Image Container */}
      <div className="relative aspect-square w-full bg-surface-container-lowest p-2">
        {product.imageUrl ? (
          <div className="relative h-full w-full overflow-hidden rounded-xl">
            <Image
              src={product.imageUrl}
              alt={product.title || "missing-image"}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
              className="object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        ) : (
          <div className="flex h-full w-full rounded-xl items-center justify-center bg-surface-container-low">
            <ShoppingCart className="text-secondary" size={40} />
          </div>
        )}

        {/* Store Badge */}
        <div className="absolute left-3 top-3 rounded-full bg-secondary-container px-3 py-1 text-[10px] font-bold tracking-wide text-on-secondary-container">
          {storeName}
        </div>

        {/* Discount Badge */}
        {product.discount && (
          <div className="absolute right-3 top-3 rounded-md bg-tertiary-container px-2 py-1 text-[11px] font-bold text-on-tertiary-container shadow-sm">
            {product.discount}
          </div>
        )}

        {/* Add to Watchlist Button */}
        <button
          onClick={handleToggleWatchlist}
          className={cn(
            "absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full shadow-sm transition-all",
            isSaved
              ? "bg-linear-to-br from-primary to-primary-container text-on-primary shadow-ambient transition-transform hover:scale-110 active:scale-95"
              : "bg-surface-container-lowest text-on-surface hover:bg-surface-container-low",
          )}
        >
          {isSaved ? <ShoppingCart size={20} /> : <Plus size={20} />}
        </button>
      </div>

      {/* Product Info */}
      <div className="flex flex-1 flex-col p-4 gap-4">
        <div className="flex-1">
          <h3 className="line-clamp-2 text-[1.125rem] font-medium leading-tight text-on-surface">
            {product.title || product.subtitle}
          </h3>
          {product.title && (
            <p className="mt-1 line-clamp-1 text-sm text-on-surface-variant">
              {product.subtitle}
            </p>
          )}
        </div>

        <div className="flex flex-col">
          <div className="flex items-baseline gap-1 font-display">
            <span className="text-xl font-bold text-primary">
              {product.price}
            </span>
            <span className="text-[12px] font-bold text-primary">RON</span>
          </div>
          {product.oldPrice && product.oldPrice > 0 && (
            <span className="text-[12px] text-secondary line-through">
              {product.oldPrice} RON
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
