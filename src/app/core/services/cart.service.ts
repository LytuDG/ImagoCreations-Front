import { Injectable, computed, signal, PLATFORM_ID, Inject, effect } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Product } from './product.service';

export interface CartItemAttribute {
    attributeId: string;
    attributeName: string;
    valueId: string;
    valueName: string;
    priceModifier?: number;
}

export interface CartItem {
    itemId: string; // Unique identifier for the cart line item
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
    public customerInfo = signal<CustomerInfo | null>(null);

    private readonly CART_STORAGE_KEY = 'cart_items';
    private readonly CUSTOMER_INFO_KEY = 'customer_info';
    private isBrowser: boolean;

    constructor(@Inject(PLATFORM_ID) platformId: Object) {
        this.isBrowser = isPlatformBrowser(platformId);

        // Cargar datos del localStorage al iniciar
        if (this.isBrowser) {
            const savedItems = localStorage.getItem(this.CART_STORAGE_KEY);
            if (savedItems) {
                try {
                    this.items.set(JSON.parse(savedItems));
                } catch (e) {
                    console.error('Error parsing cart items', e);
                }
            }

            const savedCustomerInfo = localStorage.getItem(this.CUSTOMER_INFO_KEY);
            if (savedCustomerInfo) {
                try {
                    this.customerInfo.set(JSON.parse(savedCustomerInfo));
                } catch (e) {
                    console.error('Error parsing customer info', e);
                }
            }
        }

        // Efecto para guardar cambios en items
        effect(() => {
            const items = this.items();
            if (this.isBrowser) {
                localStorage.setItem(this.CART_STORAGE_KEY, JSON.stringify(items));
            }
        });

        // Efecto para guardar cambios en customerInfo
        effect(() => {
            const info = this.customerInfo();
            if (this.isBrowser) {
                if (info) {
                    localStorage.setItem(this.CUSTOMER_INFO_KEY, JSON.stringify(info));
                } else {
                    localStorage.removeItem(this.CUSTOMER_INFO_KEY);
                }
            }
        });
    }

    // Computed con atributos
    public totalItems = computed(() => this.items().reduce((acc, item) => acc + item.quantity, 0));

    public totalPrice = computed(() => {
        return this.items().reduce((acc, item) => {
            let itemPrice = item.product.basePrice;

            // Sumar modificadores de precio de atributos
            if (item.selectedAttributes?.length) {
                item.selectedAttributes.forEach((attr) => {
                    if (attr.priceModifier) {
                        itemPrice += attr.priceModifier;
                    }
                });
            }

            return acc + itemPrice * item.quantity;
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
                return item.selectedAttributes.every((attr1) => selectedAttributes.some((attr2) => attr1.attributeId === attr2.attributeId && attr1.valueId === attr2.valueId));
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
            this.items.set([
                ...currentItems,
                {
                    itemId: this.generateItemId(),
                    product,
                    quantity,
                    selectedAttributes
                }
            ]);
        }
    }

    private generateItemId(): string {
        return Date.now().toString(36) + Math.random().toString(36).substring(2);
    }

    // Método para actualizar atributos de un item existente
    public updateItemAttributes(itemId: string, selectedAttributes: CartItemAttribute[]) {
        const currentItems = this.items();
        const itemIndex = currentItems.findIndex((item) => item.itemId === itemId);

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
            item.selectedAttributes.forEach((attr) => {
                if (attr.priceModifier) {
                    price += attr.priceModifier;
                }
            });
        }

        return price;
    }

    // Métodos existentes (sin cambios)
    public removeFromCart(itemId: string) {
        this.items.set(this.items().filter((item) => item.itemId !== itemId));
    }

    public updateQuantity(itemId: string, quantity: number) {
        if (quantity <= 0) {
            this.removeFromCart(itemId);
            return;
        }

        const currentItems = this.items();
        const itemIndex = currentItems.findIndex((item) => item.itemId === itemId);

        if (itemIndex > -1) {
            const updatedItems = [...currentItems];
            updatedItems[itemIndex].quantity = quantity;
            this.items.set(updatedItems);
        }
    }

    public clearCart() {
        this.items.set([]);
        this.quoteFile.set(null);
        if (this.isBrowser) {
            localStorage.removeItem(this.CART_STORAGE_KEY);
        }
    }

    public setQuoteFile(file: File | null) {
        this.quoteFile.set(file);
    }

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
