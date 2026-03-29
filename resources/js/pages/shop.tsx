import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { Head, usePage } from '@inertiajs/react';
import SiteLayout from '@/layouts/site-layout';
import { useProducts } from '@/hooks/use-products';
import { useCart } from '@/contexts/CartContext';
import type { Notification } from '@/types/shop';

/**
 * Page Shop — utilise SiteLayout + hooks customs + CartContext.
 *
 * BEFORE : axios + useState partout, nav dupliquée, logique panier en local.
 * AFTER  : useProducts(), useCart() depuis le contexte, SiteLayout partagé.
 *
 * `useCallback` sur showNotification pour éviter de recréer la fonction à chaque render
 * (la fonction est passée en prop à des sous-composants futurs potentiels).
 */
export default function Shop() {
    const { auth } = usePage<{ auth: { user: any } }>().props;
    const { products, loading: productsLoading } = useProducts();
    const { cart, loading: cartLoading, error: cartError, addToCart, checkout } = useCart();

    const [processing, setProcessing] = useState<number | null>(null);
    const [notification, setNotification] = useState<Notification | null>(null);

    // Convertir les codes d'erreur du contexte en messages lisibles
    useEffect(() => {
        if (!cartError) return;
        const messages: Record<string, string> = {
            session_expired: 'Session expirée. Veuillez vous reconnecter.',
            csrf_invalid: 'Token invalide. Rafraîchissez la page.',
            add_failed: "Erreur lors de l'ajout au panier.",
            checkout_failed: 'Erreur lors de la commande.',
        };
        showNotification(messages[cartError] ?? 'Une erreur est survenue.', 'error');
    }, [cartError]);

    const showNotification = useCallback((message: string, type: 'success' | 'error' = 'success') => {
        setNotification({ message, type });
        const timer = setTimeout(() => setNotification(null), 3500);
        return () => clearTimeout(timer); // nettoyage si le composant se démonte
    }, []);

    const handleAddToCart = useCallback(
        async (productId: number) => {
            if (!auth?.user) return;
            setProcessing(productId);
            await addToCart(productId, 1);
            showNotification('Produit ajouté au panier !');
            setProcessing(null);
        },
        [auth, addToCart, showNotification],
    );

    const handleCheckout = useCallback(async () => {
        await checkout();
        showNotification('Commande passée avec succès ! 🎉');
    }, [checkout, showNotification]);

    // Stat dérivée — useMemo évite de recalculer à chaque render
    const cartItemCount = useMemo(
        () => cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0,
        [cart],
    );

    if (productsLoading && products.length === 0) {
        return (
            <SiteLayout>
                <div className="flex min-h-[60vh] items-center justify-center">
                    <div className="text-center">
                        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
                        <p className="mt-4 font-medium text-gray-500">Chargement de la boutique…</p>
                    </div>
                </div>
            </SiteLayout>
        );
    }

    return (
        <SiteLayout>
            <Head title="Boutique — Laratrain" />

            {/* ─── Toast Notification ──────────────────────────────────────────── */}
            {notification && (
                <div
                    className={`fixed right-6 top-24 z-[100] flex items-center gap-3 rounded-2xl px-6 py-4 shadow-2xl transition-all ${
                        notification.type === 'success' ? 'bg-gray-900 text-white' : 'bg-red-600 text-white'
                    }`}
                >
                    {notification.type === 'success' ? (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2.5}
                            stroke="currentColor"
                            className="h-5 w-5 text-green-400"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                    ) : (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2.5}
                            stroke="currentColor"
                            className="h-5 w-5 text-red-200"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                            />
                        </svg>
                    )}
                    <span className="text-sm font-bold">{notification.message}</span>
                </div>
            )}

            <div className="mx-auto max-w-7xl px-6 py-12">
                <div className="flex flex-col gap-12 lg:flex-row">
                    {/* ─── Products Grid ───────────────────────────────────────── */}
                    <div className="flex-1">
                        <header className="mb-12">
                            <h1 className="text-4xl font-black tracking-tight underline decoration-indigo-200 decoration-8 underline-offset-8">
                                Explorer la Collection
                            </h1>
                            <p className="mt-4 text-gray-500">
                                Découvrez nos produits sélectionnés avec soin.
                            </p>
                        </header>

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            {products.map((product) => (
                                <div
                                    key={product.id}
                                    className="group flex flex-col rounded-3xl border border-gray-100 bg-white p-4 shadow-sm transition hover:shadow-xl hover:shadow-indigo-50/50"
                                >
                                    <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100">
                                        <img
                                            src={
                                                product.image_url ||
                                                'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800'
                                            }
                                            alt={product.name}
                                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                        />
                                        <div className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-black backdrop-blur-sm">
                                            {product.stock > 0 ? 'EN STOCK' : 'RUPTURE'}
                                        </div>
                                    </div>

                                    <div className="mt-6 flex flex-1 flex-col">
                                        <h3 className="text-xl font-bold">{product.name}</h3>
                                        <p className="mt-2 line-clamp-2 text-sm text-gray-500">{product.description}</p>

                                        <div className="mt-auto flex items-center justify-between pt-6">
                                            <span className="text-2xl font-black text-indigo-600">{product.price} €</span>

                                            {auth?.user ? (
                                                <button
                                                    onClick={() => handleAddToCart(product.id)}
                                                    disabled={processing === product.id || product.stock === 0}
                                                    aria-label={`Ajouter ${product.name} au panier`}
                                                    className={`flex h-12 w-12 items-center justify-center rounded-2xl transition active:scale-95 ${
                                                        processing === product.id
                                                            ? 'bg-indigo-100 text-indigo-600'
                                                            : product.stock === 0
                                                              ? 'cursor-not-allowed bg-gray-100 text-gray-300'
                                                              : 'bg-gray-900 text-white hover:bg-indigo-600'
                                                    }`}
                                                >
                                                    {processing === product.id ? (
                                                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
                                                    ) : (
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            strokeWidth={2.5}
                                                            stroke="currentColor"
                                                            className="h-6 w-6"
                                                        >
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                                        </svg>
                                                    )}
                                                </button>
                                            ) : (
                                                <span className="text-xs font-medium text-gray-400">Connexion requise</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ─── Cart Sidebar ────────────────────────────────────────── */}
                    <aside className="w-full lg:w-96">
                        <div className="sticky top-28 rounded-3xl bg-gray-900 p-8 text-white shadow-2xl">
                            <div className="flex items-center justify-between border-b border-gray-800 pb-6">
                                <h2 className="text-2xl font-black">Votre Panier</h2>
                                {cartItemCount > 0 && (
                                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-sm font-black">
                                        {cartItemCount}
                                    </span>
                                )}
                            </div>

                            {!auth?.user ? (
                                <div className="mt-12 py-8 text-center">
                                    <p className="font-medium text-gray-400">Connectez-vous pour voir votre panier.</p>
                                </div>
                            ) : cart && cart.items.length > 0 ? (
                                <div className="mt-8">
                                    <div className="max-h-[400px] space-y-6 overflow-y-auto pr-2">
                                        {cart.items.map((item) => (
                                            <div key={item.id} className="flex gap-4">
                                                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gray-800">
                                                    <img
                                                        src={item.product.image_url || ''}
                                                        alt={item.product.name}
                                                        className="h-full w-full object-cover opacity-80"
                                                    />
                                                </div>
                                                <div className="flex flex-1 flex-col justify-center">
                                                    <h4 className="w-40 truncate text-sm font-bold">{item.product.name}</h4>
                                                    <div className="mt-1 flex items-center justify-between">
                                                        <span className="text-xs text-gray-500">Qté: {item.quantity}</span>
                                                        <span className="text-sm font-bold text-indigo-400">{item.subtotal} €</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-8 border-t border-gray-800 pt-8">
                                        <div className="flex items-center justify-between text-xl font-black">
                                            <span>Total</span>
                                            <span className="text-indigo-400">{cart.total_amount} €</span>
                                        </div>
                                        <button
                                            onClick={handleCheckout}
                                            disabled={cartLoading}
                                            className="group mt-8 w-full rounded-2xl bg-indigo-600 py-4 font-black transition hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-50"
                                        >
                                            <span className="flex items-center justify-center gap-2">
                                                {cartLoading ? (
                                                    'Traitement…'
                                                ) : (
                                                    <>
                                                        Passer la commande
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            strokeWidth={2.5}
                                                            stroke="currentColor"
                                                            className="h-5 w-5 transition-transform group-hover:translate-x-1"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                                                            />
                                                        </svg>
                                                    </>
                                                )}
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="mt-12 py-12 text-center">
                                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gray-800 text-gray-400">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor"
                                            className="h-10 w-10"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                                            />
                                        </svg>
                                    </div>
                                    <p className="mt-6 font-medium text-gray-500">Votre panier est vide.</p>
                                </div>
                            )}
                        </div>
                    </aside>
                </div>
            </div>
        </SiteLayout>
    );
}
