# 📦 Module: Catalog

Ce module gère le catalogue de produits de l'e-commerce.

## Responsabilité
Le module Catalog est responsable du stockage, de la récupération et de la gestion des produits (nom, description, prix, stock).

## Flux de données
1. **Controller (`app/Modules/Catalog/Controllers/ProductController.php`)** : Reçoit la requête HTTP.
2. **FormRequest (`app/Modules/Catalog/Requests/ProductRequest.php`)** : Valide les données entrantes.
3. **DTO (`app/Modules/Catalog/DTOs/ProductData.php`)** : Transforme les données validées en un objet typé "Data Transfer Object" (PHP 8.4 native readonly class).
4. **Action (`app/Modules/Catalog/Actions/*Action.php`)** : Exécute la logique métier spécifique (Pattern Action). Une classe = Une intention.
5. **Eloquent Model (`app/Modules/Catalog/Models/Product.php`)** : Interagit avec la base de données. Utilise un **Custom Query Builder** (`ProductBuilder.php`) pour encapsuler les règles de requête.
6. **API Resource (`app/Modules/Catalog/Resources/ProductResource.php`)** : Formate la réponse JSON pour le client.

## Pourquoi ces patterns ?
- **Actions** : Permettent de garder des contrôleurs très fins ("anemic") et facilitent les tests unitaires de la logique métier sans avoir à simuler des requêtes HTTP complètes.
- **DTOs** : Garantissent que les données passant par les Actions sont toujours valides et typées, évitant les tableaux associatifs (`array`) difficiles à maintenir.
- **Custom Query Builder** : Permet de nommer les intentions de requête (ex: `$query->available()`) au lieu de chaîner des `where()` dans tout le code.
