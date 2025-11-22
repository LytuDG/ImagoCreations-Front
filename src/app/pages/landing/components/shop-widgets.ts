import { CartService } from '@/core/services/cart.service';
import { Product, ProductService } from '@/core/services/product.service';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { TagModule } from 'primeng/tag';
import { SliderModule } from 'primeng/slider';
import { CheckboxModule } from 'primeng/checkbox';
import { AccordionModule } from 'primeng/accordion';
import { DividerModule } from 'primeng/divider';

interface SortOption {
    label: string;
    value: string[];
}

@Component({
    selector: 'shop-widget',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, SkeletonModule, InputTextModule, SelectModule, PaginatorModule, TagModule, SliderModule, CheckboxModule, AccordionModule, DividerModule],
    template: `
        <div id="shop" class="py-16 bg-surface-50 dark:bg-surface-950">
            <div class="w-full max-w-[1920px] mx-auto px-4 md:px-8 lg:px-12">
                <!-- Main Layout -->
                <div class="flex flex-col lg:flex-row gap-12">
                    <!-- Sidebar Filters (Left) -->
                    <div class="w-full lg:w-1/4 xl:w-1/5 flex-shrink-0 space-y-8">
                        <!-- Search (Mobile/Sidebar) -->
                        <div class="relative">
                            <input
                                type="text"
                                pInputText
                                [(ngModel)]="searchTerm"
                                (ngModelChange)="onSearchChange()"
                                placeholder="Search collection..."
                                class="w-full pl-10 !rounded-full !bg-white dark:!bg-surface-900 !border-surface-200 dark:!border-surface-700 shadow-sm"
                            />
                        </div>

                        <div class="bg-white dark:bg-surface-900 rounded-3xl p-6 shadow-sm border border-surface-100 dark:border-surface-800">
                            <h3 class="text-xl font-serif font-medium text-surface-900 dark:text-surface-0 mb-6">Filters</h3>

                            <!-- Price Range (Client Side) -->
                            <div class="mb-8">
                                <h4 class="text-sm font-bold text-surface-900 dark:text-surface-0 uppercase tracking-wider mb-4">Price Range</h4>
                                <p-slider [(ngModel)]="priceRange" [range]="true" [min]="0" [max]="1000" (onChange)="onPriceChange()" styleClass="w-full mb-4"></p-slider>
                                <div class="flex justify-between text-sm text-surface-600 dark:text-surface-400">
                                    <span>\${{ priceRange[0] }}</span>
                                    <span>\${{ priceRange[1] }}</span>
                                </div>
                            </div>

                            <p-divider styleClass="my-6"></p-divider>

                            <!-- Availability (Mock) -->
                            <div>
                                <h4 class="text-sm font-bold text-surface-900 dark:text-surface-0 uppercase tracking-wider mb-4">Availability</h4>
                                <div class="flex flex-col gap-3">
                                    <div class="flex items-center gap-2">
                                        <p-checkbox [binary]="true" inputId="stock-in" [(ngModel)]="inStockOnly" (onChange)="onFilterChange()"></p-checkbox>
                                        <label for="stock-in" class="text-sm text-surface-700 dark:text-surface-300 cursor-pointer">In Stock</label>
                                    </div>
                                    <div class="flex items-center gap-2">
                                        <p-checkbox [binary]="true" inputId="stock-pre" [disabled]="true"></p-checkbox>
                                        <label for="stock-pre" class="text-sm text-surface-400 dark:text-surface-600 cursor-not-allowed">Pre-order</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Product Grid (Right) -->
                    <div class="flex-1">
                        <!-- Top Bar -->
                        <div class="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                            <div>
                                <h2 class="text-3xl font-serif text-surface-900 dark:text-surface-0">Corporate Collection</h2>
                                <p class="text-surface-500 dark:text-surface-400 mt-1 text-sm">Refined apparel for your brand.</p>
                            </div>

                            <div class="flex items-center gap-3">
                                <span class="text-sm text-surface-500 hidden sm:block">Sort by:</span>
                                <p-select
                                    [options]="sortOptions"
                                    [(ngModel)]="selectedSort"
                                    (ngModelChange)="onFilterChange()"
                                    optionLabel="label"
                                    placeholder="Featured"
                                    styleClass="!border-none !bg-transparent !text-surface-900 dark:!text-surface-0 font-medium"
                                />
                            </div>
                        </div>

                        <!-- Active Filters -->
                        <div *ngIf="hasActiveFilters()" class="flex flex-wrap gap-2 mb-6">
                            <p-tag *ngIf="searchTerm" [value]="'Search: ' + searchTerm" severity="secondary" [rounded]="true" (click)="clearSearch()" styleClass="cursor-pointer px-3 !bg-surface-200 !text-surface-700">
                                <i class="pi pi-times ml-2 text-xs"></i>
                            </p-tag>

                            <p-tag *ngIf="inStockOnly" value="In Stock Only" severity="secondary" [rounded]="true" (click)="inStockOnly = false; onFilterChange()" styleClass="cursor-pointer px-3 !bg-surface-200 !text-surface-700">
                                <i class="pi pi-times ml-2 text-xs"></i>
                            </p-tag>
                        </div>

                        <!-- Loading -->
                        <div *ngIf="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
                            <div *ngFor="let i of [1, 2, 3, 4, 5, 6, 7, 8]" class="flex flex-col h-full">
                                <!-- Image Skeleton Container -->
                                <div class="relative aspect-[3/4] rounded-xl overflow-hidden mb-6">
                                    <p-skeleton width="100%" height="100%"></p-skeleton>
                                </div>

                                <!-- Content Skeleton -->
                                <div class="flex flex-col flex-1 px-1">
                                    <!-- Header -->
                                    <div class="flex justify-between items-start gap-4 mb-2">
                                        <p-skeleton width="60%" height="1.75rem"></p-skeleton>
                                        <p-skeleton width="25%" height="1.75rem"></p-skeleton>
                                    </div>

                                    <!-- Description -->
                                    <p-skeleton width="80%" height="1rem" styleClass="mb-8"></p-skeleton>

                                    <!-- Button -->
                                    <div class="mt-auto">
                                        <p-skeleton width="100%" height="3.75rem" styleClass="rounded-xl"></p-skeleton>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Products -->
                        <div *ngIf="!loading && filteredProducts.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
                            <div *ngFor="let product of filteredProducts" class="group flex flex-col h-full">
                                <!-- Image Container -->
                                <div class="relative aspect-[3/4] rounded-xl overflow-hidden bg-surface-100 dark:bg-surface-800 cursor-pointer mb-6 transition-all duration-500 hover:shadow-2xl">
                                    <img
                                        [src]="product.picture || product.secureUrl"
                                        [alt]="product.name"
                                        class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        onerror="this.src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiB2aWV3Qm94PSIwIDAgNDAwIDQwMCI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9IiNmMmYyZjIiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjIwIiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+'"
                                    />

                                    <!-- Sold Out Badge -->
                                    <div class="absolute top-4 left-4" *ngIf="!product.isActive">
                                        <span class="px-4 py-2 bg-black/60 backdrop-blur-md text-white text-xs font-bold tracking-wider uppercase rounded-full border border-white/10"> Sold Out </span>
                                    </div>

                                    <!-- Decorative Arrow (New Detail) -->
                                    <div class="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                                        <div class="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-xl hover:bg-white hover:text-surface-900 transition-colors">
                                            <i class="pi pi-arrow-up-right text-lg"></i>
                                        </div>
                                    </div>
                                </div>

                                <!-- Content -->
                                <div class="flex flex-col flex-1 px-1">
                                    <!-- Header -->
                                    <div class="flex justify-between items-start gap-4 mb-2">
                                        <h3 class="font-serif text-xl font-medium text-surface-900 dark:text-surface-0 leading-tight cursor-pointer group-hover:text-primary-600 transition-colors" [title]="product.name">
                                            {{ product.name }}
                                        </h3>
                                        <span class="font-serif text-xl text-surface-900 dark:text-surface-0 whitespace-nowrap"> \${{ product.basePrice.toFixed(2) }} </span>
                                    </div>

                                    <!-- Description -->
                                    <p class="text-sm text-surface-500 dark:text-surface-400 line-clamp-1 mb-8 font-light tracking-wide">
                                        {{ product.description || 'Premium quality corporate item' }}
                                    </p>

                                    <!-- Action Button -->
                                    <div class="mt-auto">
                                        <button
                                            pButton
                                            pRipple
                                            label="Add to Cart"
                                            icon="pi pi-shopping-bag"
                                            class="w-full p-button-outlined p-button-lg !rounded-xl font-medium !border-surface-200 dark:!border-surface-700 !text-surface-900 dark:!text-surface-0 hover:!bg-primary-600 hover:!border-primary-600 hover:!text-white transition-all duration-300 py-4"
                                            (click)="addToCart(product); $event.stopPropagation()"
                                            [disabled]="!product.isActive"
                                        ></button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Empty State -->
                        <div *ngIf="!loading && filteredProducts.length === 0" class="py-20 text-center">
                            <p class="text-xl text-surface-400 font-serif italic">No products match your refinement.</p>
                            <button class="mt-4 text-primary-600 hover:underline" (click)="clearAllFilters()">Clear Filters</button>
                        </div>

                        <!-- Pagination -->
                        <div *ngIf="!loading && totalRecords > 0" class="mt-16 flex justify-center">
                            <p-paginator [rows]="pageSize" [totalRecords]="totalRecords" [first]="(currentPage - 1) * pageSize" (onPageChange)="onPageChange($event)" styleClass="!bg-transparent !border-none"></p-paginator>
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
    filteredProducts: Product[] = []; // For client-side filtering
    loading: boolean = true;

    // Pagination
    currentPage: number = 1;
    pageSize: number = 12; // Increased for grid alignment
    totalRecords: number = 0;

    // Filters
    searchTerm: string = '';
    selectedSort: SortOption | null = null;

    // Client-side Filters
    priceRange: number[] = [0, 1000];
    inStockOnly: boolean = false;

    // Debounce timer for search
    private searchDebounce: any;

    sortOptions: SortOption[] = [
        { label: 'Name (A-Z)', value: ['name', 'ASC'] },
        { label: 'Name (Z-A)', value: ['name', 'DESC'] },
        { label: 'Price (Low to High)', value: ['basePrice', 'ASC'] },
        { label: 'Price (High to Low)', value: ['basePrice', 'DESC'] },
        { label: 'Newest', value: ['created_at', 'DESC'] },
        { label: 'Oldest', value: ['created_at', 'ASC'] }
    ];

    ngOnInit() {
        this.loadProducts();
    }

    loadProducts() {
        this.loading = true;

        const filters: any = {
            page: this.currentPage,
            limit: this.pageSize,
            isActive: true // Only show active products on landing page
        };

        if (this.searchTerm && this.searchTerm.trim()) {
            filters.nameLike = this.searchTerm.trim();
        }

        if (this.selectedSort) {
            filters.sort = this.selectedSort.value;
        }

        this.productService.filterPublicProducts(filters).subscribe({
            next: (response) => {
                this.products = response.data;
                this.totalRecords = response.total;
                this.applyClientSideFilters();
                this.loading = false;
            },
            error: (error) => {
                console.error('Error loading products', error);
                this.message.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Could not load products',
                    life: 3000
                });
                this.loading = false;
            }
        });
    }

    // Client-side filtering logic
    applyClientSideFilters() {
        this.filteredProducts = this.products.filter((product) => {
            // Price Range
            const price = product.basePrice;
            if (price < this.priceRange[0] || price > this.priceRange[1]) {
                return false;
            }

            // In Stock (Mock logic - assuming isActive is stock for now, or just filtering active)
            if (this.inStockOnly && !product.isActive) {
                return false;
            }

            return true;
        });
    }

    onSearchChange() {
        if (this.searchDebounce) {
            clearTimeout(this.searchDebounce);
        }
        this.searchDebounce = setTimeout(() => {
            this.currentPage = 1;
            this.loadProducts();
        }, 500);
    }

    onFilterChange() {
        this.currentPage = 1;
        this.loadProducts();
    }

    onPriceChange() {
        // Just re-apply client filters, don't reload from server
        this.applyClientSideFilters();
    }

    onPageChange(event: PaginatorState) {
        this.currentPage = event.first! / event.rows! + 1;
        this.pageSize = event.rows!;
        this.loadProducts();
        document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
    }

    addToCart(product: Product) {
        if (!product.isActive) {
            this.message.add({
                severity: 'warn',
                summary: 'Product unavailable',
                detail: 'This product is currently unavailable',
                life: 3000
            });
            return;
        }

        this.cart.addToCart(product, 1);
        this.message.add({
            severity: 'success',
            summary: 'Added to cart',
            detail: `${product.name} has been added to cart`,
            life: 3000
        });
    }

    hasActiveFilters(): boolean {
        return !!(this.searchTerm || this.inStockOnly);
    }

    clearSearch() {
        this.searchTerm = '';
        this.onFilterChange();
    }

    clearAllFilters() {
        this.searchTerm = '';
        this.selectedSort = null;
        this.priceRange = [0, 1000];
        this.inStockOnly = false;
        this.onFilterChange();
    }
}
