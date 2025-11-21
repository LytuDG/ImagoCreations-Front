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
import { PRODUCT_TYPE } from '@/core/models/product/product';

interface SortOption {
    label: string;
    value: string[];
}

@Component({
    selector: 'shop-widget',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, SkeletonModule, InputTextModule, SelectModule, PaginatorModule, TagModule],
    template: `
        <div id="shop" class="px-4 py-12 md:px-6 lg:px-8 bg-surface-50 dark:bg-surface-950">
            <!-- Header Section -->
            <div class="max-w-7xl mx-auto">
                <div class="text-center mb-12">
                    <h2 class="text-4xl font-bold text-surface-900 dark:text-surface-0 mb-3">Nuestros Productos</h2>
                    <p class="text-lg text-surface-600 dark:text-surface-400">Descubre nuestra colección exclusiva</p>
                </div>

                <!-- Filters Section -->
                <div class="bg-white dark:bg-surface-900 rounded-2xl shadow-lg p-6 mb-8">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <!-- Search by Name -->
                        <div class="flex flex-col gap-2">
                            <label class="text-sm font-semibold text-surface-700 dark:text-surface-300"> Buscar Producto </label>
                            <span class="p-input-icon-left w-full">
                                <i class="pi pi-search"></i>
                                <input type="text" pInputText [(ngModel)]="searchTerm" (ngModelChange)="onSearchChange()" placeholder="Nombre del producto..." class="w-full" />
                            </span>
                        </div>

                        <!-- Filter by Type -->
                        <div class="flex flex-col gap-2">
                            <label class="text-sm font-semibold text-surface-700 dark:text-surface-300"> Tipo de Producto </label>
                            <p-select [options]="productTypes" [(ngModel)]="selectedType" (ngModelChange)="onFilterChange()" placeholder="Todos los tipos" [showClear]="true" styleClass="w-full" />
                        </div>

                        <!-- Sort Options -->
                        <div class="flex flex-col gap-2">
                            <label class="text-sm font-semibold text-surface-700 dark:text-surface-300"> Ordenar por </label>
                            <p-select [options]="sortOptions" [(ngModel)]="selectedSort" (ngModelChange)="onFilterChange()" optionLabel="label" placeholder="Seleccionar orden" styleClass="w-full" />
                        </div>
                    </div>

                    <!-- Active Filters Display -->
                    <div *ngIf="hasActiveFilters()" class="flex flex-wrap gap-2 mt-4 pt-4 border-t border-surface-200 dark:border-surface-700">
                        <span class="text-sm font-semibold text-surface-600 dark:text-surface-400">Filtros activos:</span>
                        <p-tag *ngIf="searchTerm" [value]="'Búsqueda: ' + searchTerm" severity="info" (click)="clearSearch()" styleClass="cursor-pointer">
                            <i class="pi pi-times ml-2"></i>
                        </p-tag>
                        <p-tag *ngIf="selectedType" [value]="'Tipo: ' + selectedType" severity="success" (click)="clearType()" styleClass="cursor-pointer">
                            <i class="pi pi-times ml-2"></i>
                        </p-tag>
                        <button pButton label="Limpiar todo" icon="pi pi-filter-slash" (click)="clearAllFilters()" class="p-button-text p-button-sm"></button>
                    </div>
                </div>

                <!-- Loading Skeleton -->
                <div *ngIf="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div *ngFor="let i of [1, 2, 3, 4, 5, 6]" class="bg-white dark:bg-surface-900 rounded-2xl shadow-md overflow-hidden">
                        <p-skeleton width="100%" height="250px"></p-skeleton>
                        <div class="p-5">
                            <p-skeleton width="70%" height="1.5rem" styleClass="mb-3"></p-skeleton>
                            <p-skeleton width="40%" height="2rem" styleClass="mb-3"></p-skeleton>
                            <p-skeleton width="100%" height="1rem" styleClass="mb-2"></p-skeleton>
                            <p-skeleton width="100%" height="1rem" styleClass="mb-4"></p-skeleton>
                            <p-skeleton width="100%" height="3rem"></p-skeleton>
                        </div>
                    </div>
                </div>

                <!-- Products Grid -->
                <div *ngIf="!loading && products.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div *ngFor="let product of products" class="group bg-white dark:bg-surface-900 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col">
                        <!-- Product Image -->
                        <div class="relative overflow-hidden bg-surface-100 dark:bg-surface-800 aspect-[4/3]">
                            <img
                                [src]="product.picture || product.secureUrl"
                                [alt]="product.name"
                                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22%3E%3Crect fill=%22%23f0f0f0%22 width=%22400%22 height=%22300%22/%3E%3Ctext fill=%22%23999%22 font-family=%22sans-serif%22 font-size=%2224%22 dy=%2210.5%22 font-weight=%22bold%22 x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22%3ENo Image%3C/text%3E%3C/svg%3E'"
                            />
                            <div class="absolute top-3 right-3">
                                <span *ngIf="product.isActive" class="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full shadow-lg"> Disponible </span>
                                <span *ngIf="!product.isActive" class="px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full shadow-lg"> No disponible </span>
                            </div>
                        </div>

                        <!-- Product Details -->
                        <div class="p-5 flex flex-col flex-1">
                            <div class="flex justify-between items-start mb-3">
                                <h3 class="text-xl font-bold text-surface-900 dark:text-surface-0 line-clamp-2 flex-1">
                                    {{ product.name }}
                                </h3>
                            </div>

                            <p class="text-surface-600 dark:text-surface-400 text-sm line-clamp-3 mb-4 flex-1">
                                {{ product.description }}
                            </p>

                            <div class="flex items-center justify-between mt-auto pt-4 border-t border-surface-200 dark:border-surface-700">
                                <div class="flex flex-col">
                                    <span class="text-xs text-surface-500 dark:text-surface-400">Precio</span>
                                    <span class="text-2xl font-bold text-primary"> \${{ product.basePrice.toFixed(2) }} </span>
                                </div>
                                <button
                                    pButton
                                    icon="pi pi-shopping-cart"
                                    label="Agregar"
                                    (click)="addToCart(product)"
                                    [disabled]="!product.isActive"
                                    class="p-button-rounded"
                                    [ngClass]="product.isActive ? 'p-button-primary' : 'p-button-secondary'"
                                ></button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Empty State -->
                <div *ngIf="!loading && products.length === 0" class="text-center py-16">
                    <i class="pi pi-inbox text-6xl text-surface-300 dark:text-surface-600 mb-4"></i>
                    <h3 class="text-2xl font-bold text-surface-700 dark:text-surface-300 mb-2">No se encontraron productos</h3>
                    <p class="text-surface-500 dark:text-surface-400 mb-6">Intenta ajustar los filtros de búsqueda</p>
                    <button pButton label="Limpiar filtros" icon="pi pi-filter-slash" (click)="clearAllFilters()" class="p-button-outlined"></button>
                </div>

                <!-- Pagination -->
                <div *ngIf="!loading && totalRecords > 0" class="mt-8">
                    <p-paginator
                        [rows]="pageSize"
                        [totalRecords]="totalRecords"
                        [first]="(currentPage - 1) * pageSize"
                        (onPageChange)="onPageChange($event)"
                        [rowsPerPageOptions]="[6, 12, 24, 48]"
                        styleClass="bg-white dark:bg-surface-900 rounded-xl shadow-md"
                    ></p-paginator>
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

    // Pagination
    currentPage: number = 1;
    pageSize: number = 6;
    totalRecords: number = 0;

    // Filters
    searchTerm: string = '';
    selectedType: string | null = null;
    selectedSort: SortOption | null = null;

    // Debounce timer for search
    private searchDebounce: any;

    // Options
    productTypes = [
        { label: 'Simple', value: PRODUCT_TYPE.SIMPLE },
        { label: 'Variante', value: PRODUCT_TYPE.VARIANT }
    ];

    sortOptions: SortOption[] = [
        { label: 'Nombre (A-Z)', value: ['name', 'ASC'] },
        { label: 'Nombre (Z-A)', value: ['name', 'DESC'] },
        { label: 'Precio (Menor a Mayor)', value: ['basePrice', 'ASC'] },
        { label: 'Precio (Mayor a Menor)', value: ['basePrice', 'DESC'] },
        { label: 'Más recientes', value: ['created_at', 'DESC'] },
        { label: 'Más antiguos', value: ['created_at', 'ASC'] }
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

        // Apply search filter
        if (this.searchTerm && this.searchTerm.trim()) {
            filters.nameLike = this.searchTerm.trim();
        }

        // Apply type filter
        if (this.selectedType) {
            filters.type = this.selectedType;
        }

        // Apply sorting
        if (this.selectedSort) {
            filters.sort = this.selectedSort.value;
        }

        this.productService.filterPublicProducts(filters).subscribe({
            next: (response) => {
                this.products = response.data;
                this.totalRecords = response.total;
                this.loading = false;
            },
            error: (error) => {
                console.error('Error loading products', error);
                this.message.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudieron cargar los productos',
                    life: 3000
                });
                this.loading = false;
            }
        });
    }

    onSearchChange() {
        // Debounce search to avoid too many API calls
        if (this.searchDebounce) {
            clearTimeout(this.searchDebounce);
        }
        this.searchDebounce = setTimeout(() => {
            this.currentPage = 1; // Reset to first page on search
            this.loadProducts();
        }, 500);
    }

    onFilterChange() {
        this.currentPage = 1; // Reset to first page on filter change
        this.loadProducts();
    }

    onPageChange(event: PaginatorState) {
        this.currentPage = event.first! / event.rows! + 1;
        this.pageSize = event.rows!;
        this.loadProducts();
        // Scroll to top of products section
        document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
    }

    addToCart(product: Product) {
        if (!product.isActive) {
            this.message.add({
                severity: 'warn',
                summary: 'Producto no disponible',
                detail: 'Este producto no está disponible actualmente',
                life: 3000
            });
            return;
        }

        this.cart.addToCart(product, 1);
        this.message.add({
            severity: 'success',
            summary: 'Agregado al carrito',
            detail: `${product.name} ha sido agregado al carrito`,
            life: 3000
        });
    }

    hasActiveFilters(): boolean {
        return !!(this.searchTerm || this.selectedType);
    }

    clearSearch() {
        this.searchTerm = '';
        this.onFilterChange();
    }

    clearType() {
        this.selectedType = null;
        this.onFilterChange();
    }

    clearAllFilters() {
        this.searchTerm = '';
        this.selectedType = null;
        this.selectedSort = null;
        this.onFilterChange();
    }
}
