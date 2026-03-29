import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { CartWidget } from '@/components/cart-widget';
import { dashboard, login, register } from '@/routes';

/**
 * SiteLayout — layout partagé pour toutes les pages publiques (Welcome, Shop).
 *
 * WHY un layout séparé du AppLayout (sidebar) :
 * L'AppLayout est pensé pour les pages authentifiées avec sidebar de navigation.
 * Le SiteLayout est un layout "vitrine" minimaliste : nav top + footer.
 * Séparer les deux permet de faire évoluer chacun indépendamment.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
    const { auth } = usePage<{ auth: { user: any } }>().props;

    return (
        <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-indigo-100 selection:text-indigo-700">
            {/* ─── Navigation ──────────────────────────────────────────────────────── */}
            <nav className="fixed top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                    {/* Logo */}
                    <Link href="/" className="text-2xl font-black tracking-tighter text-indigo-600">
                        LARATRAIN<span className="text-gray-900">.</span>
                    </Link>

                    {/* Nav links */}
                    <div className="flex items-center gap-2">
                        <Link
                            href="/"
                            className="rounded-xl px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-indigo-50 hover:text-indigo-600"
                        >
                            Accueil
                        </Link>
                        <Link
                            href="/shop"
                            className="rounded-xl px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-indigo-50 hover:text-indigo-600"
                        >
                            Boutique
                        </Link>
                    </div>

                    {/* Auth + Cart */}
                    <div className="flex items-center gap-3">
                        {/* CartWidget: visible uniquement si connecté */}
                        {auth?.user && <CartWidget />}

                        {auth?.user ? (
                            <Link
                                href={dashboard()}
                                className="rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 hover:shadow-indigo-300"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link
                                    href={login()}
                                    className="rounded-xl px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-indigo-50 hover:text-indigo-600"
                                >
                                    Connexion
                                </Link>
                                <Link
                                    href={register()}
                                    className="rounded-full border-2 border-indigo-600 px-5 py-2 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50"
                                >
                                    S'inscrire
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* ─── Page Content ────────────────────────────────────────────────────── */}
            <main className="pt-20">
                {children}
            </main>

            {/* ─── Footer ──────────────────────────────────────────────────────────── */}
            <footer className="border-t border-gray-100 bg-white py-10 text-center text-sm text-gray-400">
                <p>© 2026 Laratrain — Fièrement construit avec Laravel & React.</p>
            </footer>
        </div>
    );
}
