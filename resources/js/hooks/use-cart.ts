import { useCallback, useState } from 'react';
import axios from 'axios';
import type { Cart } from '@/types/shop';

interface UseCartResult {
    cart: Cart | null;
    cartCount: number;
    loading: boolean;
    error: string | null;
    fetchCart: () => Promise<void>;
    addToCart: (productId: number, quantity?: number) => Promise<void>;
    checkout: () => Promise<void>;
}

/**
 * Hook interne (non exporté directement aux pages) qui encapsule toute la
 * logique métier du panier. Il est utilisé par CartContext pour fournir l'état
 * à l'ensemble de l'arbre de composants.
 *
 * WHY useCallback: chaque fonction (fetchCart, addToCart, checkout) est mémoïsée
 * pour éviter de recréer de nouvelles références à chaque render du provider,
 * ce qui provoquerait des re-renders inutiles dans tous les consumers.
 */
export function useCart(): UseCartResult {
    const [cart, setCart] = useState<Cart | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchCart = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get<{ data: Cart }>('/api/cart');
            setCart(res.data.data);
        } catch {
            setCart(null); // 404 = pas de panier actif, c'est OK
        } finally {
            setLoading(false);
        }
    }, []);

    const addToCart = useCallback(async (productId: number, quantity: number = 1) => {
        setLoading(true);
        setError(null);
        try {
            await axios.post('/api/cart/add', { product_id: productId, quantity });
            await fetchCart(); // re-sync le panier après ajout
        } catch (err: any) {
            const status = err.response?.status;
            if (status === 401) setError('session_expired');
            else if (status === 419) setError('csrf_invalid');
            else setError('add_failed');
        } finally {
            setLoading(false);
        }
    }, [fetchCart]);

    const checkout = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            await axios.post('/api/checkout');
            setCart(null); // vide l'état local après commande
        } catch {
            setError('checkout_failed');
        } finally {
            setLoading(false);
        }
    }, []);

    // useMemo-like: calcul dérivé depuis cart.items
    const cartCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

    return { cart, cartCount, loading, error, fetchCart, addToCart, checkout };
}
