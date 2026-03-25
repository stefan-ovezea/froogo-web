import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Product } from '@/types/product';
import { ProductCard } from './product-card';

interface StoreSectionCardProps {
  storeName: string;
  products: Product[];
  onProductTap?: (product: Product) => void;
  onToggleWatchlist?: (product: Product) => void;
}

export function StoreSectionCard({
  storeName,
  products,
  onProductTap,
  onToggleWatchlist,
}: StoreSectionCardProps) {
  return (
    <div className="flex flex-col gap-5 pl-6">
      {/* Header - Asymmetric */}
      <div className="flex items-center justify-between pr-6">
        <h2 className="text-[1.5rem] font-bold text-on-surface font-display">
          {storeName}
        </h2>
        <Link
          href={`/stores/${encodeURIComponent(storeName)}`}
          className="flex items-center gap-1 text-sm font-bold text-primary hover:text-primary-container transition-colors"
        >
          Vezi tot
          <ArrowRight size={18} />
        </Link>
      </div>

      {/* Horizontal Scroll Area */}
      <div className="flex w-full snap-x snap-mandatory gap-4 overflow-x-auto pb-6 pr-6 scrollbar-hide">
        {products.length === 0 ? (
          <div className="flex w-full items-center justify-center py-10 text-secondary">
            Nu sunt produse disponibile
          </div>
        ) : (
          products.map((product, idx) => (
            <div key={`${product.id}-${idx}`} className="w-[160px] shrink-0 h-full">
              <ProductCard product={product} storeName={storeName} onTap={() => onProductTap?.(product)} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
