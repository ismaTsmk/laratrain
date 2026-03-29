import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import type { Product } from '@/types/shop';

interface UseProductsOptions {
    limit?: number;
    search?: string;
}

interface UseProductsResult {
    products: Product[];
    loading: boolean;
    error: string | null;
}

/**
 * Custom hook to fetch products from the API.
 *
 * WHY: Encapsule la logique de fetch pour éviter de répéter
 * useState + useEffect + axios dans chaque composant/page.
 *
 * `useMemo` est utilisé pour construire les query params afin d'éviter
 * de créer un nouvel objet à chaque render, ce qui déclencherait
 * inutilement le useEffect.
 */
export function useProducts({ limit, search }: UseProductsOptions = {}): UseProductsResult {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // useMemo: stabilise les params pour ne pas re-déclencher l'effect si les valeurs n'ont pas changé
    const params = useMemo(() => {
        const p: Record<string, string | number> = {};
        if (limit !== undefined) p.limit = limit;
        if (search) p.search = search;
        return p;
    }, [limit, search]);

    useEffect(() => {
        let cancelled = false; // cleanup flag pour éviter les setState sur un composant démonté
        setLoading(true);
        setError(null);

        axios
            .get<{ data: Product[] }>('/api/products', { params })
            .then((res) => {
                if (!cancelled) setProducts(res.data.data);
            })
            .catch(() => {
                if (!cancelled) setError('Impossible de charger les produits.');
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true; // cleanup: si le composant se démonte avant la résolution
        };
    }, [params]);

    return { products, loading, error };
}
