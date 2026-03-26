import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { OffersData } from "@/types/offers-data";
import { Store } from "@/types/store";
import { Product } from "@/types/product";

const CACHE_KEY = "froogo_offers_cache";
const CACHE_TIMESTAMP_KEY = "froogo_offers_timestamp";
const CACHE_EXPIRY = 12 * 60 * 60 * 1000; // 12 hours

/**
 * Fetches offers from Firestore with a strict 12-hour local cache.
 */
export const getCachedOffers = async (): Promise<OffersData> => {
  // 1. Check for valid cache
  if (typeof window !== "undefined") {
    const cached = localStorage.getItem(CACHE_KEY);
    const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);

    if (cached && timestamp) {
      const age = Date.now() - parseInt(timestamp);
      if (age < CACHE_EXPIRY) {
        return JSON.parse(cached);
      }
    }
  }

  // 2. Cache miss: Fetch and Transform
  const querySnapshot = await getDocs(collection(db, "offers"));

  const generateId = (storeName: string, productTitle: string) => {
    const base = `${storeName}-${productTitle}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-");
    return base.replace(/(^-|-$)/g, "");
  };

  const stores: Store[] = querySnapshot.docs.map((doc) => {
    const data = doc.data();
    const storeName = doc.id;
    
    // Map sections and products in one pass
    const sections = (data.sections || []).map((section: any) => ({
      name: section.section || "General",
      products: (section.products || []).map((product: any) => ({
        ...product,
        id: generateId(storeName, product.title || product.subtitle || "product"),
      })),
    }));

    // Pre-calculate preview for Home Screen (first 6 products across all sections)
    const previewProducts: Product[] = [];
    for (const section of sections) {
      for (const product of section.products) {
        if (previewProducts.length < 6) {
          previewProducts.push(product);
        } else {
          break;
        }
      }
      if (previewProducts.length >= 6) break;
    }

    return {
      name: storeName,
      sections,
      previewProducts
    };
  });

  const offersData: OffersData = {
    lastUpdated: new Date().toISOString(),
    stores,
  };

  // 3. Update the local cache
  if (typeof window !== "undefined") {
    localStorage.setItem(CACHE_KEY, JSON.stringify(offersData));
    localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
  }

  return offersData;
};
