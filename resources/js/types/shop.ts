export interface Product {
    id: number;
    name: string;
    slug: string;
    description: string;
    image_url: string | null;
    price: number;
    stock: number;
}

export interface CartItem {
    id: number;
    product: Product;
    quantity: number;
    subtotal: number;
}

export interface Cart {
    id: number;
    items: CartItem[];
    total_amount: number;
}

export interface Notification {
    message: string;
    type: 'success' | 'error';
}
