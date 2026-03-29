<div align="center">

# 🚂 Laratrain

**Une architecture Laravel modulaire, propre et documentée — avec une vraie boutique React.**

[![PHP](https://img.shields.io/badge/PHP-8.4-777BB4?logo=php&logoColor=white)](https://php.net)
[![Laravel](https://img.shields.io/badge/Laravel-12-FF2D20?logo=laravel&logoColor=white)](https://laravel.com)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![Inertia.js](https://img.shields.io/badge/Inertia.js-2-9553E9?logo=inertia&logoColor=white)](https://inertiajs.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Docker](https://img.shields.io/badge/Docker-compose-2496ED?logo=docker&logoColor=white)](https://docker.com)
[![Tests](https://img.shields.io/badge/Tests-8%20passing-22c55e?logo=vitest&logoColor=white)](#tests)

</div>

---

## 🎯 À propos

Laratrain est un projet d'apprentissage et de référence qui illustre une **architecture Laravel moderne** :

- 🧩 **Modules métier** indépendants (`Catalog`, `Checkout`, `Common`)
- 🏛️ **Repository Pattern** — zéro logique Eloquent dans les contrôleurs
- 📦 **DTOs + Actions** — une opération = une classe, une responsabilité
- ⚛️ **React + Inertia** — SPA sans API séparée, avec Context et hooks customs
- 🐳 **Docker** prêt à l'emploi (PHP 8.4, PostgreSQL, Redis, Nginx)

---

## ⚡ Démarrage rapide

### Prérequis

- [Docker](https://docs.docker.com/get-docker/) & Docker Compose
- [Make](https://www.gnu.org/software/make/) (optionnel, mais recommandé)

### Installation

```bash
# 1. Cloner le projet
git clone git@github.com:ismaTsmk/laratrain.git
cd laratrain

# 2. Copier l'environnement
cp .env.example .env

# 3. Démarrer les conteneurs
make up

# 4. Entrer dans le conteneur PHP
make shell

# 5. Installer les dépendances et initialiser
composer install
php artisan key:generate
php artisan migrate --seed
exit

# 6. Installer les dépendances JS et build
npm install
npm run dev
```

> Accès : **http://localhost:8080**

---

## 🛠️ Commandes Make

```bash
make up          # Démarrer tous les conteneurs
make stop        # Arrêter les conteneurs
make shell       # Entrer dans le conteneur PHP
make migrate     # Lancer les migrations
make logs        # Voir les logs en temps réel
make artisan cmd=<commande>  # Lancer une commande artisan
```

---

## 🏗️ Architecture Backend

```
app/
└── Modules/
    ├── Catalog/                  # Module produits
    │   ├── Actions/              # CreateProduct, UpdateProduct, DeleteProduct
    │   ├── Controllers/          # ProductController
    │   ├── DTOs/                 # ProductData
    │   ├── Models/               # Product + ProductBuilder
    │   ├── Repositories/         # ProductRepository ← plus de query dans les controllers
    │   ├── Requests/             # ProductRequest (validation)
    │   └── Resources/            # ProductResource (transformation API)
    │
    ├── Checkout/                 # Module panier & commandes
    │   ├── Actions/              # AddProductToCart, PlaceOrder
    │   ├── Controllers/          # CheckoutController
    │   ├── DTOs/                 # AddToCartData
    │   ├── Models/               # Cart + CartBuilder, Order, CartItem
    │   ├── Repositories/         # CartRepository ← getActiveCart, findOrCreate...
    │   └── Resources/            # CartResource, OrderResource
    │
    └── Common/
        └── Payment/              # Logique de paiement partagée
```

### Flux d'une requête

```
Request → FormRequest (validation)
        → Controller (routing only)
        → Repository (query Eloquent)  ←  jamais dans le controller
        → Action (logique métier)
        → DTO (transport de données)
        → Resource (réponse JSON)
```

---

## ⚛️ Architecture Frontend

> 📖 Documentation complète → [`FRONTEND.md`](./FRONTEND.md)

```
resources/js/
├── contexts/CartContext.tsx      # État global du panier (React Context)
├── hooks/
│   ├── use-cart.ts              # Logique métier panier (useCallback)
│   └── use-products.ts          # Fetch produits (useMemo + cleanup)
├── layouts/
│   ├── site-layout.tsx          # Nav + Footer partagés (Welcome + Shop)
│   └── app-layout.tsx           # Dashboard avec sidebar
├── components/cart-widget.tsx   # Badge panier live dans la nav
└── pages/
    ├── welcome.tsx              # Accueil public
    ├── shop.tsx                 # Boutique + panier sidebar
    └── dashboard.tsx            # Stats en temps réel
```

**Inertia.js** fait le pont entre Laravel et React : le serveur décide quelle page afficher, les données PHP arrivent directement en props React — pas d'API REST nécessaire pour la navigation.

---

## 🔌 API REST

| Méthode | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/api/products` | Liste des produits (search, limit, paginate) | — |
| `POST` | `/api/products` | Créer un produit | — |
| `GET` | `/api/products/{id}` | Détail d'un produit | — |
| `PUT` | `/api/products/{id}` | Modifier un produit | — |
| `DELETE` | `/api/products/{id}` | Supprimer un produit | — |
| `GET` | `/api/cart` | Voir le panier actif | ✅ Sanctum |
| `POST` | `/api/cart/add` | Ajouter au panier | ✅ Sanctum |
| `POST` | `/api/checkout` | Passer la commande | ✅ Sanctum |

---

## 🧪 Tests

```bash
# Depuis le conteneur (make shell)
php artisan test

# Ou depuis l'hôte
docker compose exec php php artisan test
```

```
PASS  Tests\Feature\CatalogTest      5 tests
PASS  Tests\Feature\CheckoutTest     3 tests
─────────────────────────────────────────────
Tests: 8 passed (25 assertions)
```

---

## 🐳 Stack Docker

| Service | Image | Port |
|---|---|---|
| **Nginx** | `nginx:alpine` | `8080` |
| **PHP-FPM** | `php:8.4-fpm` | — |
| **PostgreSQL** | `postgres:17` | `5432` |
| **Redis** | `redis:alpine` | `6379` |

---

## 📄 Concepts illustrés

| Concept | Fichier de référence |
|---|---|
| Repository Pattern | `app/Modules/Catalog/Repositories/ProductRepository.php` |
| Custom Eloquent Builder | `app/Modules/Checkout/Models/Builders/CartBuilder.php` |
| Action Pattern | `app/Modules/Checkout/Actions/AddProductToCartAction.php` |
| DTO depuis FormRequest | `app/Modules/Checkout/DTOs/AddToCartData.php` |
| React Context | `resources/js/contexts/CartContext.tsx` |
| Custom Hook | `resources/js/hooks/use-products.ts` |
| Inertia Layout System | `resources/js/app.tsx` |

---

<div align="center">

Construit avec ❤️ par [ismaTsmk](https://github.com/ismaTsmk)

</div>
