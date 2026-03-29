# Frontend Architecture — Laratrain

## Stack

| Couche | Technologie |
|---|---|
| Framework SPA | React 18 (via Inertia.js) |
| Routing | Inertia.js (SSR-ready, pas de client router) |
| Styling | Tailwind CSS |
| HTTP | Axios (credentials + CSRF configurés globalement dans `app.tsx`) |
| État global | React Context API |
| Bundler | Vite |

---

## Structure des fichiers

```
resources/js/
├── app.tsx                        # Point d'entrée : routing de layout, CartProvider
├── contexts/
│   └── CartContext.tsx            # Contexte global du panier
├── hooks/
│   ├── use-cart.ts               # Hook interne : logique métier du panier
│   ├── use-products.ts           # Hook custom : fetch produits avec search/limit
│   ├── use-appearance.tsx        # Thème clair/sombre
│   ├── use-initials.tsx          # Initiales user
│   ├── use-mobile-navigation.ts  # Navigation mobile sidebar
│   └── use-clipboard.ts         # Copier dans le presse-papier
├── layouts/
│   ├── site-layout.tsx           # Layout public (nav + footer) — Welcome + Shop
│   ├── app-layout.tsx            # Layout authentifié avec sidebar  
│   ├── auth-layout.tsx           # Layout pages d'auth
│   └── settings/layout.tsx       # Layout paramètres
├── components/
│   ├── cart-widget.tsx           # Badge panier dans la nav (lit CartContext)
│   └── ui/                       # Composants UI réutilisables (shadcn/ui)
├── pages/
│   ├── welcome.tsx               # Page d'accueil publique
│   ├── shop.tsx                  # Boutique (produits + panier)
│   ├── dashboard.tsx             # Dashboard authentifié avec stats
│   ├── auth/                     # Login, register, forgot-password…
│   └── settings/                 # Profile, security, appearance
└── types/
    ├── shop.ts                   # Types Product, Cart, CartItem, Notification
    ├── auth.ts                   # Types User, Auth
    └── navigation.ts             # Types BreadcrumbItem
```

---

## Architecture des layouts

```
app.tsx (layout resolver)
│
├── name === 'welcome' ou 'shop'  → null  (la page déclare SiteLayout elle-même)
├── name starts with 'auth/'      → AuthLayout
├── name starts with 'settings/'  → [AppLayout, SettingsLayout]
└── default                       → AppLayout (sidebar)
```

**Pourquoi les pages publiques déclarent-elles leur propre layout ?**  
Inertia résout les layouts via `createInertiaApp`. Pour `welcome` et `shop`, retourner `null` permet à la page de contrôler entièrement son layout (ici `SiteLayout`). Cela évite d'avoir un wrapper global qui s'applique à des pages qui ne doivent pas avoir la sidebar.

---

## Gestion de l'état du panier

### CartContext (`contexts/CartContext.tsx`)

```
CartProvider
└── usePage().props.auth.user   → chargement conditionnel
└── useCart (hook interne)
    ├── fetchCart()             → GET /api/cart
    ├── addToCart(id, qty)      → POST /api/cart/add → refetch
    └── checkout()              → POST /api/checkout
```

**Pourquoi Context et pas Zustand/Redux ?**  
Le panier est un état global simple sans besoin de middleware, de devtools ou de logique asynchrone complexe. React Context suffit et évite une dépendance externe. La limite de Context (re-renders) est acceptée ici car le Provider est haut dans l'arbre mais peu de composants sont subscribers (CartWidget, Shop, Dashboard).  
Si la logique métier évoluait (optimistic updates, file d'attente d'actions), migrer vers **Zustand** serait trivial car l'interface exposée par `useCart()` resterait identique.

---

## Hooks customs

### `useProducts(options?)` — `hooks/use-products.ts`

```ts
const { products, loading, error } = useProducts({ limit: 3, search: 'chaussure' });
```

**Pourquoi :**  
Évite de répéter `useState + useEffect + axios.get('/api/products')` dans chaque composant. Encapsule aussi le **cleanup** (flag `cancelled`) pour prévenir les erreurs de setState sur un composant démonté.

**`useMemo` sur les params :**  
```ts
const params = useMemo(() => ({ limit, search }), [limit, search]);
```
Sans `useMemo`, un nouvel objet serait créé à chaque render, déclenchant inutilement le `useEffect`. `useMemo` garantit la même référence si les valeurs n'ont pas changé.

---

### `useCart` (interne) — `hooks/use-cart.ts`

Hook bas niveau utilisé uniquement par `CartContext`. Expose les handlers mémoïsés avec `useCallback`.

**Pourquoi `useCallback` sur les handlers ?**  
`fetchCart`, `addToCart` et `checkout` sont passées dans la value du Context. Sans `useCallback`, une nouvelle référence serait créée à chaque render du Provider, ce qui forcerait tous les consumers à re-render même si le panier n'a pas changé.

```ts
const fetchCart = useCallback(async () => { … }, []);
const addToCart = useCallback(async (id, qty) => { 
    await axios.post(…); 
    await fetchCart(); // dépendance explicite
}, [fetchCart]);
```

---

## Composants clés

### `CartWidget` (`components/cart-widget.tsx`)

- Lit `cartCount` et `loading` depuis `useCart()`
- Affiche un badge numérique si `cartCount > 0`
- Utilisé dans `SiteLayout` — visible uniquement si `auth.user` est présent

### `SiteLayout` (`layouts/site-layout.tsx`)

Layout partagé entre `Welcome` et `Shop`. Contient :
- Nav fixe avec logo, liens, auth CTA, CartWidget (si connecté)
- Balise `<main>` avec `pt-20` (hauteur de la nav)
- Footer

**Avant :** la nav était copiée-collée dans `welcome.tsx` et `shop.tsx`.  
**Après :** une seule source de vérité.

---

## Patterns utilisés

### Cleanup flag dans useEffect

```ts
useEffect(() => {
    let cancelled = false;
    axios.get(…).then((res) => {
        if (!cancelled) setState(res.data);
    });
    return () => { cancelled = true; }; // cleanup
}, [deps]);
```
Évite l'erreur *"Can't perform a React state update on an unmounted component"*.

### Chargement conditionnel du panier

```ts
useEffect(() => {
    if (auth?.user) fetchCart();
}, [auth?.user]);
```
Sans cette condition, chaque visiteur non connecté déclencherait un 401 au chargement.

### Erreurs sous forme de codes

Le hook `use-cart.ts` expose des codes d'erreur (`'session_expired'`, `'csrf_invalid'`) et non des messages. La traduction en texte lisible est faite dans le composant. Cela permet de localiser les messages sans toucher à la logique du hook.

---

## Flux de données

```
Utilisateur clique "Ajouter au panier"
       ↓
Shop.handleAddToCart(productId)
       ↓
CartContext.addToCart(productId, 1)
       ↓
use-cart.addToCart → POST /api/cart/add
       ↓ (succès)
use-cart.fetchCart → GET /api/cart → setState(cart)
       ↓
CartContext re-render → CartWidget badge mis à jour
                      → Shop sidebar mise à jour
                      → Dashboard stats mises à jour
```

---

## Endpoints API consommés

| Endpoint | Méthode | Page / Hook |
|---|---|---|
| `/api/products?limit=N&search=X` | GET | `useProducts` |
| `/api/cart` | GET | `useCart.fetchCart` |
| `/api/cart/add` | POST | `useCart.addToCart` |
| `/api/checkout` | POST | `useCart.checkout` |
