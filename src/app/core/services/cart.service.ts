import { Injectable, computed, signal } from '@angular/core';
import { Product } from './product.service';

export interface CartItem {
    product: Product;
    quantity: number;
}

@Injectable({
    providedIn: 'root'
})
export class CartService {
    public items = signal<CartItem[]>([]);
    public quoteFile = signal<File | null>(null);

    public totalItems = computed(() => this.items().reduce((acc, item) => acc + item.quantity, 0));
    public totalPrice = computed(() => this.items().reduce((acc, item) => acc + item.product.basePrice * item.quantity, 0));

    public addToCart(product: Product, quantity: number = 1) {
        const currentItems = this.items();
        const existingItemIndex = currentItems.findIndex((item) => item.product.id === product.id);

        if (existingItemIndex > -1) {
            const updatedItems = [...currentItems];
            updatedItems[existingItemIndex].quantity += quantity;
            this.items.set(updatedItems);
        } else {
            this.items.set([...currentItems, { product, quantity }]);
        }
    }

    public removeFromCart(productId: string) {
        this.items.set(this.items().filter((item) => item.product.id !== productId));
    }

    public updateQuantity(productId: string, quantity: number) {
        if (quantity <= 0) {
            this.removeFromCart(productId);
            return;
        }

        const currentItems = this.items();
        const itemIndex = currentItems.findIndex((item) => item.product.id === productId);

        if (itemIndex > -1) {
            const updatedItems = [...currentItems];
            updatedItems[itemIndex].quantity = quantity;
            this.items.set(updatedItems);
        }
    }

    public clearCart() {
        this.items.set([]);
        this.quoteFile.set(null);
    }

    public setQuoteFile(file: File | null) {
        this.quoteFile.set(file);
    }
}
