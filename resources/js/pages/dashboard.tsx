import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { dashboard } from '@/routes';
import { useCart } from '@/contexts/CartContext';
import { useProducts } from '@/hooks/use-products';

/**
 * Dashboard — page authentifiée avec vraies données.
 *
 * BEFORE : uniquement des PlaceholderPattern vides.
 * AFTER  : 3 cartes de stats avec données réelles depuis le contexte et les hooks.
 */
export default function Dashboard() {
    const { cart, cartCount } = useCart();
    const { products, loading: productsLoading } = useProducts();

    const statCards = [
        {
            label: 'Produits au catalogue',
            value: productsLoading ? '…' : products.length,
            icon: '📦',
            desc: 'Total des produits disponibles',
            href: '/shop',
            cta: 'Voir la boutique',
            color: 'from-indigo-500 to-purple-600',
        },
        {
            label: 'Articles dans le panier',
            value: cartCount,
            icon: '🛒',
            desc: cart ? `Total : ${cart.total_amount} €` : 'Panier vide',
            href: '/shop',
            cta: cartCount > 0 ? 'Finaliser la commande' : 'Ajouter des produits',
            color: 'from-emerald-500 to-teal-600',
        },
        {
            label: 'Architecture backend',
            value: '3',
            icon: '🧩',
            desc: 'Modules : Catalog, Checkout, Common',
            href: '/shop',
            cta: 'Lire le README',
            color: 'from-amber-500 to-orange-600',
        },
    ];

    return (
        <>
            <Head title="Dashboard" />

            <div className="flex flex-col gap-8 p-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Tableau de bord</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Bienvenue sur Laratrain — votre boutique modulaire Laravel × React.
                    </p>
                </div>

                {/* Stats cards */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {statCards.map((card) => (
                        <div
                            key={card.label}
                            className="flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
                        >
                            {/* Gradient bar */}
                            <div className={`h-1.5 w-full bg-gradient-to-r ${card.color}`} />
                            <div className="flex flex-1 flex-col gap-4 p-6">
                                <div className="flex items-start justify-between">
                                    <span className="text-sm font-medium text-muted-foreground">{card.label}</span>
                                    <span className="text-2xl">{card.icon}</span>
                                </div>
                                <div className="text-4xl font-black tabular-nums tracking-tight">{card.value}</div>
                                <p className="text-sm text-muted-foreground">{card.desc}</p>
                                <Link
                                    href={card.href}
                                    className="mt-auto text-xs font-semibold text-indigo-600 hover:underline"
                                >
                                    {card.cta} →
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Cart detail (si non vide) */}
                {cart && cart.items.length > 0 && (
                    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                        <h2 className="mb-4 text-lg font-bold">Panier en cours</h2>
                        <div className="divide-y divide-border">
                            {cart.items.map((item) => (
                                <div key={item.id} className="flex items-center justify-between py-3">
                                    <div>
                                        <p className="text-sm font-semibold">{item.product.name}</p>
                                        <p className="text-xs text-muted-foreground">Qté : {item.quantity}</p>
                                    </div>
                                    <span className="text-sm font-bold text-indigo-600">{item.subtotal} €</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                            <span className="font-bold">Total</span>
                            <span className="text-lg font-black text-indigo-600">{cart.total_amount} €</span>
                        </div>
                        <Link
                            href="/shop"
                            className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-gray-900 py-3 text-sm font-bold text-white transition hover:bg-indigo-600"
                        >
                            Finaliser ma commande →
                        </Link>
                    </div>
                )}

                {/* Quick links */}
                <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                    <h2 className="mb-4 text-lg font-bold">Liens rapides</h2>
                    <div className="flex flex-wrap gap-3">
                        {[
                            { label: '🛍️ Boutique', href: '/shop' },
                            { label: '⚙️ Paramètres', href: '/settings/profile' },
                            { label: '🔒 Sécurité', href: '/settings/security' },
                        ].map((l) => (
                            <Link
                                key={l.label}
                                href={l.href}
                                className="rounded-xl border border-border px-4 py-2 text-sm font-medium transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600"
                            >
                                {l.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
