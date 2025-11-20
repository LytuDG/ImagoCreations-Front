import { CartService } from '@/core/services/cart.service';
import { Product, ProductService } from '@/core/services/product.service';
import { CommonModule, NgClass } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { OrderListModule } from 'primeng/orderlist';
import { PickListModule } from 'primeng/picklist';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
    selector: 'shop-widget',
    standalone: true,
    imports: [CommonModule, FormsModule, PickListModule, OrderListModule, TagModule, ButtonModule, SkeletonModule],
    template: `
        <div class="card px-4 py-8 md:px-6 lg:px-8">
            <div class="flex justify-between items-center mb-6">
                <div class="font-bold text-2xl text-surface-900 dark:text-surface-0">Featured Products</div>
            </div>

            <div *ngIf="loading" class="grid grid-cols-12 gap-4">
                <div *ngFor="let i of [1, 2, 3, 4, 5, 6]" class="col-span-12 sm:col-span-6 lg:col-span-4 p-2">
                    <div class="p-4 border border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900 rounded flex flex-col gap-4">
                        <p-skeleton width="100%" height="200px"></p-skeleton>
                        <div class="flex justify-between items-center">
                            <p-skeleton width="40%" height="2rem"></p-skeleton>
                            <p-skeleton width="20%" height="2rem"></p-skeleton>
                        </div>
                        <p-skeleton width="100%" height="1rem"></p-skeleton>
                        <p-skeleton width="100%" height="1rem"></p-skeleton>
                        <div class="flex justify-between mt-4">
                            <p-skeleton width="40%" height="3rem"></p-skeleton>
                            <p-skeleton width="40%" height="3rem"></p-skeleton>
                        </div>
                    </div>
                </div>
            </div>

            <div *ngIf="!loading" class="grid grid-cols-12 gap-4">
                <div *ngFor="let item of products" class="col-span-12 sm:col-span-6 lg:col-span-4 p-2">
                    <div class="group p-4 border border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900 rounded-xl flex flex-col h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                        <div class="relative w-full overflow-hidden rounded-lg bg-surface-100 dark:bg-surface-800 mb-4">
                            <img class="w-full h-64 object-cover hover:scale-105 transition-transform duration-500" [src]="item.picture" [alt]="item.name" />
                        </div>
                        <div class="flex flex-col flex-1">
                            <div class="flex justify-between items-start mb-2">
                                <div>
                                    <div class="text-lg font-bold text-surface-900 dark:text-surface-0 mt-1">{{ item.name }}</div>
                                </div>
                                <span class="text-xl font-bold text-primary">\${{ item.basePrice }}</span>
                            </div>
                            <p class="text-surface-600 dark:text-surface-300 text-sm line-clamp-2 mb-4 flex-1">{{ item.description }}</p>
                            <div class="flex gap-2 mt-auto">
                                <p-button icon="pi pi-shopping-cart" label="Add to Cart" (click)="addToCart(item)" class="flex-1" styleClass="w-full"></p-button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    providers: [ProductService]
})
export class ShopWindget implements OnInit {
    cart = inject(CartService);
    message = inject(MessageService);
    productService = inject(ProductService);

    products: Product[] = [];
    loading: boolean = true;

    ngOnInit() {
        this.loadProducts();
    }

    loadProducts() {
        this.loading = true;
        this.productService.filterProducts({ limit: 6, page: 1 }).subscribe({
            next: (response) => {
                this.products = response.data;
                this.loading = false;
            },
            error: (error) => {
                console.error('Error loading products', error);
                this.loading = false;
            }
        });
    }

    addToCart(product: Product) {
        this.cart.addToCart(product);
        this.message.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Product added to cart',
            life: 3000
        });
    }
}
