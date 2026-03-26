import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { OffersData } from "@/types/offers-data";
import { Store } from "@/types/store";

const CACHE_KEY = "froogo_offers_cache";
const CACHE_TIMESTAMP_KEY = "froogo_offers_timestamp";
const CACHE_EXPIRY = 12 * 60 * 60 * 1000; // 12 hours

/**
 * Fetches offers from Firestore with a strict 12-hour local cache.
 * There is no public "force refresh" to prevent excessive database reads.
 */
export const getCachedOffers = async (): Promise<OffersData> => {
  // 1. Check if we have a valid cache
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

  // 2. Fetch from Firestore (Cache is missing or expired)
  const querySnapshot = await getDocs(collection(db, "offers"));

  // Helper for unique ID generation
  const generateId = (storeName: string, productTitle: string) => {
    const base = `${storeName}-${productTitle}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-");
    return base.replace(/(^-|-$)/g, "");
  };

  const formatPrice = (price: string | number) => {
    if (typeof price === "string" && price.includes(",")) {
      return parseFloat(price.replace(",", ".")).toFixed(2);
    }
    return price;
  };

  const stores: Store[] = querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      name: doc.id,
      sections: (data.sections || []).map((section: any) => ({
        name: section.section || "General", // Map 'section' field to 'name'
        products: (section.products || []).map((product: any) => ({
          ...product,
          price: formatPrice(product.price),
          oldPrice: formatPrice(product.oldPrice),
          id: generateId(
            doc.id,
            product.title || product.subtitle || "product",
          ),
        })),
      })),
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
