import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import SiteLayout from '@/layouts/site-layout';
import { useProducts } from '@/hooks/use-products';
import { useCart } from '@/contexts/CartContext';

/**
 * Page d'accueil — utilisé SiteLayout + hooks customs.
 *
 * BEFORE : useState + useEffect + axios inline pour les produits, nav dupliquée.
 * AFTER  : useProducts() hook, nav dans SiteLayout, addToCart depuis le contexte.
 */
export default function Welcome({ canRegister = true }: { canRegister?: boolean }) {
    const { auth } = usePage<{ auth: { user: any } }>().props;
    const { products, loading } = useProducts({ limit: 3 });
    const { addToCart } = useCart();

    return (
        <SiteLayout>
            <Head title="Bienvenue chez Laratrain" />

            {/* ─── Hero ────────────────────────────────────────────────────────── */}
            <section className="relative overflow-hidden py-32 lg:py-48">
                <div className="mx-auto max-w-7xl px-6 text-center">
                    <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl">
                        Découvrez l'excellence{' '}
                        <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent italic">
                            du commerce modulaire.
                        </span>
                    </h1>
                    <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-gray-500">
                        Une architecture robuste, des modules élégants et une expérience utilisateur inégalée.
                        Bienvenue dans le futur de vos projets Laravel.
                    </p>
                    <div className="mt-10 flex items-center justify-center gap-x-4">
                        <Link
                            href="/shop"
                            className="rounded-full bg-gray-900 px-8 py-4 text-sm font-bold text-white shadow-xl transition hover:-translate-y-1 hover:bg-gray-800"
                        >
                            Découvrir le catalogue
                        </Link>
                        {!auth?.user && (
                            <Link
                                href="/login"
                                className="rounded-full border-2 border-gray-200 px-8 py-4 text-sm font-bold text-gray-700 transition hover:-translate-y-1 hover:border-indigo-300 hover:text-indigo-600"
                            >
                                Se connecter
                            </Link>
                        )}
                    </div>
                </div>

                {/* Background decoration */}
                <div className="absolute top-0 -z-10 h-full w-full opacity-30">
                    <div className="absolute left-1/4 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-indigo-200 blur-3xl" />
                    <div className="absolute right-1/4 top-1/3 h-64 w-64 -translate-y-1/2 rounded-full bg-purple-200 blur-3xl" />
                </div>
            </section>

            {/* ─── Featured Products ───────────────────────────────────────────── */}
            <section className="bg-gray-50 py-24">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="mb-12 flex items-end justify-between">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight">Dernières pépites</h2>
                            <p className="mt-2 text-gray-500">Nos produits les plus récents, sélectionnés pour vous.</p>
                        </div>
                        <Link href="/shop" className="group text-sm font-bold text-indigo-600 hover:text-indigo-700">
                            Voir tout{' '}
                            <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                        </Link>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-96 animate-pulse rounded-3xl bg-gray-200" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
                            {products.map((product) => (
                                <div
                                    key={product.id}
                                    className="group relative overflow-hidden rounded-3xl bg-white p-4 shadow-sm transition hover:shadow-xl"
                                >
                                    <div className="aspect-square overflow-hidden rounded-2xl bg-gray-100">
                                        <img
                                            src={
                                                product.image_url ||
                                                'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800'
                                            }
                                            alt={product.name}
                                            className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                                        />
                                    </div>
                                    <div className="mt-6 pb-2">
                                        <h3 className="text-lg font-bold text-gray-900">{product.name}</h3>
                                        <p className="mt-1 line-clamp-2 text-sm text-gray-500">{product.description}</p>
                                        <div className="mt-4 flex items-center justify-between">
                                            <span className="text-xl font-black text-indigo-600">{product.price} €</span>
                                            {auth?.user ? (
                                                <button
                                                    onClick={() => addToCart(product.id)}
                                                    aria-label={`Ajouter ${product.name} au panier`}
                                                    className="relative z-20 rounded-full bg-gray-100 p-2 text-gray-900 transition hover:bg-indigo-600 hover:text-white active:scale-95"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth={2}
                                                        stroke="currentColor"
                                                        className="h-5 w-5"
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                                    </svg>
                                                </button>
                                            ) : (
                                                <Link
                                                    href="/login"
                                                    className="relative z-20 rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-600 transition hover:bg-indigo-100 hover:text-indigo-600"
                                                >
                                                    Connexion
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                    {/* Overlay link to shop (under buttons intentionally z-10) */}
                                    <Link href="/shop" className="absolute inset-0 z-10" aria-hidden="true" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* ─── Features strip ──────────────────────────────────────────────── */}
            <section className="py-24">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="grid grid-cols-1 gap-12 sm:grid-cols-3 text-center">
                        {[
                            { emoji: '⚡', title: 'Architecture modulaire', desc: 'Modules Catalog, Checkout et Common indépendants, faciles à faire évoluer.' },
                            { emoji: '🛡️', title: 'API sécurisée', desc: "Sanctum pour l'authentification, CSRF protection, validation par FormRequest + DTO." },
                            { emoji: '🧩', title: 'Repository Pattern', desc: 'Zéro logique Eloquent dans les contrôleurs — tout passe par des repositories dédiés.' },
                        ].map((f) => (
                            <div key={f.title} className="flex flex-col items-center gap-4">
                                <span className="text-5xl">{f.emoji}</span>
                                <h3 className="text-lg font-bold">{f.title}</h3>
                                <p className="text-sm text-gray-500">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </SiteLayout>
    );
}
