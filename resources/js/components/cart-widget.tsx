import React from 'react';
import { Link } from '@inertiajs/react';
import { useCart } from '@/contexts/CartContext';

/**
 * CartWidget — badge panier dans la navigation.
 * Affiche le nombre total d'articles. N'est rendu que si l'user est connecté
 * (géré par le parent SiteLayout).
 *
 * WHY composant séparé : le widget peut être réutilisé dans n'importe quel layout
 * (site-layout, app-header, etc.) sans dupliquer la logique de contexte.
 */
export function CartWidget() {
    const { cartCount, loading } = useCart();

    return (
        <Link
            href="/shop"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl text-gray-700 transition hover:bg-indigo-50 hover:text-indigo-600"
            aria-label="Voir le panier"
        >
            {/* Icône panier */}
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
                stroke="currentColor"
                className="h-6 w-6"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z"
                />
            </svg>

            {/* Badge nombre d'articles */}
            {!loading && cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-black text-white shadow">
                    {cartCount > 99 ? '99+' : cartCount}
                </span>
            )}
        </Link>
    );
}
