# 🧠 Agent Brain - Laratrain Modular E-commerce API

## 🏗️ Global Architecture

- **Pattern**: Modular Monolith
- **Logic**: Action Pattern (Service/Action)
- **Data Flow**: Controller ➔ FormRequest ➔ DTO ➔ Action ➔ Eloquent ➔ API Resource
- **State**: Event-Driven (Events, Listeners, Async Jobs)
- **Tech Stack**:
    - Laravel 11/12
    - PHP 8.4 (Readonly classes, Property Promotion)
    - Pest/PHPUnit for Testing
    - Custom Query Builders

## 📂 Module Structure (`app/Modules/{ModuleName}`)

```text
├── Actions/          # Logic (One class per action)
├── Controllers/      # Anemic controllers
├── DTOs/             # Native PHP 8.4 readonly classes
├── Events/           # Module specific events
├── Jobs/             # Background tasks
├── Models/           # Eloquent models & Query Builders
├── Providers/        # Module service providers
├── Resources/        # API Resources (JSON transformers)
├── Requests/         # FormRequests for validation
└── README.md         # Pedagogical documentation
```

## 📝 Todo List

- [x] **Phase 0: Initialization**
    - [x] Create `agent.md`
    - [x] Configure Module Autoloading / Base Structure
    - [x] Setup `PaymentGatewayInterface` and `StripePaymentService` (Fictitious)

- [x] **Phase 1: Catalog Module**
    - [x] CRUD Products (Model, QueryBuilder)
    - [x] List/Show/Create/Update Actions
    - [x] API Resources & FormRequests
    - [x] Unit & Feature Tests
    - [x] Module `README.md`

- [x] **Phase 2: Cart & Checkout Module**
    - [x] Add to Cart Logic (Action + Session/DB storage)
    - [x] View Cart API
    - [x] Order Creation Action (Transaction cart ➔ order)
    - [x] Order Events (OrderCreated)
    - [x] Unit & Feature Tests
    - [x] Module `README.md`

- [x] **Phase 3: Minimalist Front-end (React)**
    - [x] Product List Page (Fetching from API)
    - [x] Cart Drawer/Component
    - [x] Single Page Checkout
    - [x] Basic CSS/Tailwind Styling

- [x] **Phase 4: Payment Integration**
    - [x] `ProcessPayment` Job implementation
    - [x] Event listeners for payment success/failure
    - [x] Update Order status
    - [x] Unit & Feature Tests
    - [x] Module `README.md`
    - [x] Database Seeding (Unsplash images)

- [x] **Phase 5: Custom Home Page**
    - [x] Premium Landing Page
    - [x] API Integration (Last 3 products)

## 💭 Current Reflection

L'objectif est de montrer comment Laravel peut s'adapter à une architecture "Enterprise" sans sacrifier la puissance d'Eloquent. En utilisant des DTOs PHP 8.4 natifs, on garde une base de code propre et typée. Les Actions permettent de découpler la logique métier du contrôleur, facilitant le test et la réutilisation.

---
*Dernière mise à jour : 2026-03-29*
