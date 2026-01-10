import { Injectable, computed, signal } from '@angular/core';
import { Product } from './product.service';

export interface CartItemAttribute {
    attributeId: string;
    attributeName: string;
    valueId: string;
    valueName: string;
    priceModifier?: number;
}

export interface CartItem {
    product: Product;
    quantity: number;
    selectedAttributes?: CartItemAttribute[];
}

@Injectable({
    providedIn: 'root'
})
export class CartService {
    public items = signal<CartItem[]>([]);
    public quoteFile = signal<File | null>(null);

    // Computed con atributos
    public totalItems = computed(() => this.items().reduce((acc, item) => acc + item.quantity, 0));

    public totalPrice = computed(() => {
        return this.items().reduce((acc, item) => {
            let itemPrice = item.product.basePrice;

            // Sumar modificadores de precio de atributos
            if (item.selectedAttributes?.length) {
                item.selectedAttributes.forEach(attr => {
                    if (attr.priceModifier) {
                        itemPrice += attr.priceModifier;
                    }
                });
            }

            return acc + (itemPrice * item.quantity);
        }, 0);
    });

    // Método actualizado para soportar atributos
    public addToCart(product: Product, quantity: number = 1, selectedAttributes?: CartItemAttribute[]) {
        const currentItems = this.items();

        // Buscar si ya existe el mismo producto con los mismos atributos
        const findExistingItemIndex = () => {
            return currentItems.findIndex((item) => {
                if (item.product.id !== product.id) return false;

                // Si ambos no tienen atributos, es el mismo
                if (!item.selectedAttributes && !selectedAttributes) return true;

                // Si uno tiene atributos y el otro no, son diferentes
                if (!item.selectedAttributes || !selectedAttributes) return false;

                // Si tienen diferente cantidad de atributos, son diferentes
                if (item.selectedAttributes.length !== selectedAttributes.length) return false;

                // Verificar que todos los atributos sean iguales
                return item.selectedAttributes.every(attr1 =>
                    selectedAttributes.some(attr2 =>
                        attr1.attributeId === attr2.attributeId &&
                        attr1.valueId === attr2.valueId
                    )
                );
            });
        };

        const existingItemIndex = findExistingItemIndex();

        if (existingItemIndex > -1) {
            // Si ya existe con los mismos atributos, aumentar cantidad
            const updatedItems = [...currentItems];
            updatedItems[existingItemIndex].quantity += quantity;
            this.items.set(updatedItems);
        } else {
            // Si es nuevo o tiene atributos diferentes, agregar como nuevo item
            this.items.set([...currentItems, {
                product,
                quantity,
                selectedAttributes
            }]);
        }
    }

    // Método para actualizar atributos de un item existente
    public updateItemAttributes(productId: string, selectedAttributes: CartItemAttribute[]) {
        const currentItems = this.items();
        const itemIndex = currentItems.findIndex(item => item.product.id === productId);

        if (itemIndex > -1) {
            const updatedItems = [...currentItems];
            updatedItems[itemIndex].selectedAttributes = selectedAttributes;
            this.items.set(updatedItems);
        }
    }

    // Método para obtener el precio de un item específico con atributos
    public getItemPrice(item: CartItem): number {
        let price = item.product.basePrice;

        if (item.selectedAttributes?.length) {
            item.selectedAttributes.forEach(attr => {
                if (attr.priceModifier) {
                    price += attr.priceModifier;
                }
            });
        }

        return price;
    }

    // Métodos existentes (sin cambios)
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

    public customerInfo = signal<CustomerInfo | null>(null);

    public setCustomerInfo(info: CustomerInfo) {
        this.customerInfo.set(info);
    }
}

export interface CustomerInfo {
    companyName: string;
    contactPerson: string;
    email: string;
    phone: string;
    address?: string;
    notes?: string;
}
