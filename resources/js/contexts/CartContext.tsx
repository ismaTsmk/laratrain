import React, { createContext, useContext, useEffect } from 'react';
import { useCart as useCartLogic } from '@/hooks/use-cart';
import type { Cart } from '@/types/shop';

interface CartContextValue {
    cart: Cart | null;
    cartCount: number;
    loading: boolean;
    error: string | null;
    addToCart: (productId: number, quantity?: number) => Promise<void>;
    checkout: () => Promise<void>;
    refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);

/**
 * CartProvider — placé dans withApp (app.tsx) pour partager l'état du panier.
 *
 * IMPORTANT: usePage() NE PEUT PAS être appelé ici car withApp() s'exécute
 * EN DEHORS de l'arbre Inertia. On tente fetchCart() directement au montage ;
 * si l'utilisateur n'est pas connecté, le backend retourne 401 et use-cart.ts
 * capture silencieusement l'erreur en laissant cart = null.
 *
 * WHY Context et pas Zustand/Redux ?
 * État simple, pas besoin de middleware ni devtools. Si la complexité augmente,
 * migrer vers Zustand serait trivial car l'interface exposée reste la même.
 */
export function CartProvider({ children }: { children: React.ReactNode }) {
    const { cart, cartCount, loading, error, fetchCart, addToCart, checkout } = useCartLogic();

    useEffect(() => {
        // Tente de charger le panier au montage.
        // Silencieux si non connecté (401 → catch → cart reste null).
        fetchCart();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <CartContext.Provider
            value={{
                cart,
                cartCount,
                loading,
                error,
                addToCart,
                checkout,
                refreshCart: fetchCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

/**
 * Hook useCart — doit être utilisé dans un composant enfant de CartProvider.
 * Lève une erreur explicite si utilisé en dehors du provider.
 */
export function useCart(): CartContextValue {
    const ctx = useContext(CartContext);
    if (!ctx) {
        throw new Error('useCart must be used within a <CartProvider>');
    }
    return ctx;
}
