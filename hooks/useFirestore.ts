import { useState, useEffect } from "react";
import {
  collection,
  query,
  onSnapshot,
  getDocs,
  QueryConstraint,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";

export function useFirestore<T>(
  collectionName: string,
  queryConstraints: QueryConstraint[] = [],
) {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // We intentionally omit setLoading(true) here.
    // Calling setState synchronously inside an effect triggers cascading renders.
    // By omitting it, the hook will use the initial `true` state for the first load,
    // and for subsequent query updates it will display the stale data until the new snapshot resolves 
    // (which is the recommended UX pattern, similar to React Query).
    
    const q = query(collection(db, collectionName), ...queryConstraints);
    
    // For read-only fast fetching (use onSnapshot for real-time updates)
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const results = snapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() }) as T
        );
        setData(results);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [collectionName, queryConstraints]);

  return { data, loading, error };
}
