# 🛒 Module: Checkout

Ce module gère le panier et le processus de commande (Checkout).

## Responsabilité
Le module Checkout est responsable de la gestion des articles dans le panier, du calcul des totaux et de la transformation d'un panier en une commande ferme (`Order`).

## Flux de données
1. **Controller (`app/Modules/Checkout/Controllers/CheckoutController.php`)** : Gère les points d'entrée API pour le panier et le passage de commande.
2. **DTO (`app/Modules/Checkout/DTOs/AddToCartData.php`)** : Reçoit les données de l'API pour l'ajout au panier.
3. **Actions** :
    - `AddProductToCartAction` : Gère l'ajout ou la mise à jour de la quantité dans le panier.
    - `PlaceOrderAction` : Encapsule la création d'une commande à partir d'un panier dans une **transaction base de données**.
4. **Event-Driven** : Une fois la commande créée, l'événement `OrderCreated` est déclenché. Cela permet de séparer la logique de commande de la logique de paiement ou d'envoi d'e-mails.

## Pourquoi ces patterns ?
- **Transaction DB** : Crucial lors du checkout pour s'assurer que la commande et ses lignes sont créées atomiquement, et que le statut du panier est mis à jour sans erreur partielle.
- **Events** : Le `PlaceOrderAction` ne sait pas que le paiement doit être traité. Il se contente de dire "Une commande a été créée". C'est un **Listener** ou un **Job** qui s'occupera de la suite, respectant le principe de responsabilité unique (SRP).
