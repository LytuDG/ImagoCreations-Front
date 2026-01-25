import { CartService } from '@/core/services/cart.service';
import { Product } from '@/core/models/product/product';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { TagModule } from 'primeng/tag';
import { SliderModule } from 'primeng/slider';
import { CheckboxModule } from 'primeng/checkbox';
import { AccordionModule } from 'primeng/accordion';
import { DividerModule } from 'primeng/divider';
import { ChipModule } from 'primeng/chip';
import { BadgeModule } from 'primeng/badge';
import { DialogModule } from 'primeng/dialog';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ShopService } from '../services/shop.service';
import { AttributeGroup, ProductAttributeGroup, SortOption, ShopFilterState } from '../models/shop.types';
import { ProductAttributeValue } from '@/pages/admin/products/models/product-atribute-value';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

@Component({
    selector: 'shop-widget',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        SkeletonModule,
        InputTextModule,
        InputNumberModule,
        SelectModule,
        PaginatorModule,
        TagModule,
        SliderModule,
        CheckboxModule,
        AccordionModule,
        DividerModule,
        ChipModule,
        BadgeModule,
        DialogModule,
        RadioButtonModule,
        TranslocoModule,
    ],
    template: `
  <div id="shop" class="py-16 bg-surface-50 dark:bg-surface-950">
      <div class="w-full max-w-[1920px] mx-auto px-4 md:px-8 lg:px-12">
          <div class="flex flex-col lg:flex-row gap-12">
              <div class="w-full lg:w-1/4 xl:w-1/5 flex-shrink-0 space-y-8">
                  <div class="relative">
                      <input
                          type="text"
                          pInputText
                          [(ngModel)]="searchTerm"
                          (ngModelChange)="onSearchChange()"
                          [placeholder]="'landing.shop.search.placeholder' | transloco"
                          class="w-full pl-10 !rounded-full !bg-white dark:!bg-surface-900 !border-surface-200 dark:!border-surface-700 shadow-sm"
                      />
                  </div>

                  <div class="bg-white dark:bg-surface-900 rounded-3xl p-6 shadow-sm border border-surface-100 dark:border-surface-800">
                      <div class="flex justify-between items-center mb-6">
                          <h3 class="text-xl font-serif font-medium text-surface-900 dark:text-surface-0">{{ 'landing.shop.filters.title' | transloco }}</h3>
                          @if (hasActiveFilters()) {
                              <button class="text-sm text-primary-600 hover:text-primary-700 font-medium" (click)="clearAllFilters()">{{ 'landing.shop.filters.clearAll' | transloco }}</button>
                          }
                      </div>

                      <div class="mb-8 hidden">
                          <h4 class="text-sm font-bold text-surface-900 dark:text-surface-0 uppercase tracking-wider mb-4">{{ 'landing.shop.filters.priceRange' | transloco }}</h4>
                          <p-slider [(ngModel)]="priceRange" [range]="true" [min]="0" [max]="1000" (onChange)="onPriceChange()" styleClass="w-full mb-4"></p-slider>
                          <div class="flex justify-between text-sm text-surface-600 dark:text-surface-400">
                              <span>\${{ priceRange[0] }}</span>
                              <span>\${{ priceRange[1] }}</span>
                          </div>
                      </div>

                      <p-divider styleClass="my-6"></p-divider>

                      @if (attributeGroups.length > 0) {
                          <div class="space-y-6">
                              <h4 class="text-sm font-bold text-surface-900 dark:text-surface-0 uppercase tracking-wider mb-2">{{ 'landing.shop.filters.attributes' | transloco }}</h4>

                              @for (group of attributeGroups; track group.id) {
                                  <div class="space-y-3">
                                      <div class="flex items-center justify-between">
                                          <h5 class="text-sm font-semibold text-surface-700 dark:text-surface-300">{{ group.name }}</h5>
                                          <span class="text-xs text-surface-500"> {{ getSelectedAttributeValues(group.id).length }}/{{ group.values.length }} </span>
                                      </div>

                                      <div class="flex flex-wrap gap-2">
                                          @for (value of group.values; track value.id) {
                                              <button
                                                  type="button"
                                                  class="px-3 py-1.5 text-sm rounded-full border transition-all"
                                                  [ngClass]="{
                                                      'border-primary-500 bg-primary-50 text-primary-700': value.selected,
                                                      'border-surface-200 dark:border-surface-700 hover:border-surface-300': !value.selected
                                                  }"
                                                  (click)="toggleAttributeValue(group.id, value.id)"
                                              >
                                                  <div class="flex items-center gap-1.5">
                                                      <span>{{ value.name }}</span>
                                                      @if (false && value.priceModifier) {
                                                          <span class="text-xs" [ngClass]="value.priceModifier > 0 ? 'text-green-600' : 'text-red-600'"> {{ value.priceModifier > 0 ? '+' : '' }}{{ value.priceModifier | currency: 'USD' }} </span>
                                                      }
                                                      <span class="text-xs text-surface-500">({{ value.count }})</span>
                                                  </div>
                                              </button>
                                          }
                                      </div>
                                  </div>
                              }
                          </div>
                      }

                      @if (attributeGroups.length > 0) {
                          <p-divider styleClass="my-6"></p-divider>
                      }

                      <div>
                          <h4 class="text-sm font-bold text-surface-900 dark:text-surface-0 uppercase tracking-wider mb-4">{{ 'landing.shop.filters.availability' | transloco }}</h4>
                          <div class="flex flex-col gap-3">
                              <div class="flex items-center gap-2">
                                  <p-checkbox [binary]="true" inputId="stock-in" [(ngModel)]="inStockOnly" (onChange)="onFilterChange()"></p-checkbox>
                                  <label for="stock-in" class="text-sm text-surface-700 dark:text-surface-300 cursor-pointer">{{ 'landing.shop.filters.inStock' | transloco }}</label>
                              </div>
                              <div class="flex items-center gap-2">
                                  <p-checkbox [binary]="true" inputId="stock-pre" [disabled]="true"></p-checkbox>
                                  <label for="stock-pre" class="text-sm text-surface-400 dark:text-surface-600 cursor-not-allowed">{{ 'landing.shop.filters.preOrder' | transloco }}</label>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>

              <div class="flex-1">
                  <div class="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                      <div>
                          <h2 class="text-3xl font-serif text-surface-900 dark:text-surface-0">{{ 'landing.shop.title' | transloco }}</h2>
                          <p class="text-surface-500 dark:text-surface-400 mt-1 text-sm">{{ 'landing.shop.subtitle' | transloco }}</p>
                      </div>

                      <div class="flex items-center gap-3">
                          <span class="text-sm text-surface-500 hidden sm:block">{{ 'landing.shop.sort.by' | transloco }}</span>
                          <p-select
                              [options]="translatedSortOptions"
                              [(ngModel)]="selectedSort"
                              (ngModelChange)="onFilterChange()"
                              optionLabel="label"
                              [placeholder]="'landing.shop.sort.placeholder' | transloco"
                              class="!border-none !bg-transparent !text-surface-900 dark:!text-surface-0 font-medium"
                          ></p-select>
                      </div>
                  </div>

                  @if (hasActiveFilters()) {
                      <div class="flex flex-wrap gap-2 mb-6">
                          @if (searchTerm) {
                            <p-tag value="{{ ('landing.shop.activeFilters.search' | transloco) + searchTerm }}"
                                  severity="secondary" [rounded]="true" (click)="clearSearch()"
                                  class="cursor-pointer px-3 !bg-surface-200 !text-surface-700">
                                <i class="pi pi-times ml-2 text-xs"></i>
                            </p-tag>
                          }

                          @if (inStockOnly) {
                              <p-tag [value]="'landing.shop.activeFilters.inStock' | transloco" severity="secondary" [rounded]="true" (click)="inStockOnly = false; onFilterChange()" styleClass="cursor-pointer px-3 !bg-surface-200 !text-surface-700">
                                  <i class="pi pi-times ml-2 text-xs"></i>
                              </p-tag>
                          }

                          @for (group of attributeGroups; track group.id) {
                              @for (value of group.values; track value.id) {
                                  @if (value.selected) {
                                      <p-tag [value]="group.name + ': ' + value.name" [rounded]="true" (click)="toggleAttributeValue(group.id, value.id)" class="cursor-pointer px-3">
                                          <i class="pi pi-times ml-2 text-xs"></i>
                                      </p-tag>
                                  }
                              }
                          }
                      </div>
                  }

                  @if (loading) {
                      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
                          @for (i of [1, 2, 3, 4, 5, 6, 7, 8]; track i) {
                              <div class="flex flex-col h-full">
                                  <div class="relative aspect-[3/4] rounded-xl overflow-hidden mb-6">
                                      <p-skeleton width="100%" height="100%"></p-skeleton>
                                  </div>

                                  <div class="flex flex-col flex-1 px-1">
                                      <div class="flex justify-between items-start gap-4 mb-2">
                                          <p-skeleton width="60%" height="1.75rem"></p-skeleton>
                                          <p-skeleton width="25%" height="1.75rem"></p-skeleton>
                                      </div>

                                      <p-skeleton width="80%" height="1rem" styleClass="mb-8"></p-skeleton>

                                      <div class="mt-auto">
                                          <p-skeleton width="100%" height="3.75rem" styleClass="rounded-xl"></p-skeleton>
                                      </div>
                                  </div>
                              </div>
                          }
                      </div>
                  }

                  @if (!loading && filteredProducts.length > 0) {
                      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
                          @for (product of filteredProducts; track product.id) {
                              <div class="group flex flex-col h-full">
                                  <div class="relative aspect-[3/4] rounded-xl overflow-hidden bg-surface-100 dark:bg-surface-800 cursor-pointer mb-6 transition-all duration-500 hover:shadow-2xl">
                                      <img
                                          [src]="product.picture || product.secureUrl"
                                          [alt]="product.name"
                                          class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                          onerror="this.src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiB2aWV3Qm94PSIwIDAgNDAwIDQwMCI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9IiNmMmYyZjIiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjIwIiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+'"
                                      />

                                      @if (!product.isActive) {
                                          <div class="absolute top-4 left-4">
                                              <span class="px-4 py-2 bg-black/60 backdrop-blur-md text-white text-xs font-bold tracking-wider uppercase rounded-full border border-white/10">{{ 'landing.shop.product.soldOut' | transloco }}</span>
                                          </div>
                                      }

                                      <div class="absolute top-4 right-4 flex flex-col gap-2 items-end">
                                          @for (attr of getProductAttributes(product) | slice: 0 : 2; track $index) {
                                              <div class="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full shadow-sm text-xs font-medium">{{ attr.attribute.name }}: {{ attr.attributeValue?.value }}</div>
                                          }
                                          @if (getProductAttributes(product).length > 2) {
                                              <div class="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full shadow-sm text-xs font-medium">+{{ getProductAttributes(product).length - 2 }} more</div>
                                          }
                                      </div>

                                      <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                                          <div class="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-xl hover:bg-white hover:text-surface-900 transition-colors">
                                              <i class="pi pi-eye text-sm"></i>
                                          </div>
                                      </div>
                                  </div>

                                  <div class="flex flex-col flex-1 px-1">
                                      <div class="flex justify-between items-start gap-4 mb-2">
                                          <h3 class="font-serif text-xl font-medium text-surface-900 dark:text-surface-0 leading-tight cursor-pointer group-hover:text-primary-600 transition-colors" [title]="product.name">
                                              {{ product.name }}
                                          </h3>
                                      </div>

                                      @if (getProductAttributes(product).length > 0) {
                                          <div class="mb-3">
                                              <div class="flex flex-wrap gap-1.5">
                                                  @for (attr of getProductAttributes(product) | slice: 0 : 3; track $index) {
                                                      <span class="text-xs px-2 py-0.5 bg-surface-100 dark:bg-surface-800 rounded text-surface-600 dark:text-surface-400">
                                                          {{ attr.attributeValue?.value }}
                                                      </span>
                                                  }
                                              </div>
                                          </div>
                                      }

                                      <p class="text-sm text-surface-500 dark:text-surface-400 line-clamp-1 mb-4 font-light tracking-wide">
                                          {{ product.description || ('landing.shop.product.defaultDescription' | transloco) }}
                                      </p>

                                      <div class="mt-auto">
                                          <button
                                              pButton
                                              pRipple
                                              [label]="'landing.shop.product.addToCart' | transloco"
                                              icon="pi pi-shopping-bag"
                                              class="w-full p-button-outlined p-button-lg !rounded-xl font-medium !border-surface-200 dark:!border-surface-700 !text-surface-900 dark:!text-surface-0 hover:!bg-primary-600 hover:!border-primary-600 hover:!text-white transition-all duration-300 py-4"
                                              (click)="openAttributeDialog(product)"
                                              [disabled]="!product.isActive"
                                          ></button>
                                      </div>
                                  </div>
                              </div>
                          }
                      </div>
                  }

                  @if (!loading && filteredProducts.length === 0) {
                      <div class="py-20 text-center">
                          <p class="text-xl text-surface-400 font-serif italic">{{ 'landing.shop.empty.message' | transloco }}</p>
                          <button class="mt-4 text-primary-600 hover:underline" (click)="clearAllFilters()">{{ 'landing.shop.empty.clearFilters' | transloco }}</button>
                      </div>
                  }

                  @if (!loading && totalRecords > 0) {
                      <div class="mt-16 flex justify-center">
                          <p-paginator [rows]="pageSize" [totalRecords]="totalRecords" [first]="(currentPage - 1) * pageSize" (onPageChange)="onPageChange($event)" styleClass="!bg-transparent !border-none"></p-paginator>
                      </div>
                  }
              </div>
          </div>
      </div>
  </div>

  <p-dialog [(visible)]="showAttributeDialog" [modal]="true" [style]="{ width: '500px' }" [header]="'landing.shop.dialog.title' | transloco" [closable]="true" [closeOnEscape]="true" (onHide)="onDialogHide()">
      @if (selectedProduct) {
          <div class="space-y-6">
              <div class="flex items-start gap-4">
                  <img [src]="selectedProduct.picture || selectedProduct.secureUrl" [alt]="selectedProduct.name" class="w-20 h-20 object-cover rounded-lg" />
                  <div>
                      <h4 class="font-semibold text-lg text-surface-900 dark:text-surface-0">{{ selectedProduct.name }}</h4>
                      <p class="text-surface-600 dark:text-surface-400 text-sm mt-1">{{ selectedProduct.description | slice: 0 : 100 }}...</p>
                  </div>
              </div>

              @if (productAttributeGroups.length > 0) {
                  <div class="space-y-6">
                      @for (group of productAttributeGroups; track group.id) {
                          <div class="space-y-3">
                              <div class="flex items-center justify-between">
                                  <h5 class="text-sm font-semibold text-surface-700 dark:text-surface-300">{{ group.name }}</h5>
                                  @if (selectedAttributeValuesForCart[group.id]) {
                                      <span class="text-xs text-surface-500">{{ 'landing.shop.dialog.selected' | transloco }}</span>
                                  }
                              </div>

                              <p-select
                                  [options]="getSelectOptionsForGroup(group)"
                                  [(ngModel)]="selectedAttributeValuesForCart[group.id]"
                                  (onChange)="onAttributeSelectChange(group.id)"
                                  optionLabel="name"
                                  optionValue="id"
                                  [placeholder]="'landing.shop.dialog.selectPlaceholder' | transloco"
                                  styleClass="w-full"
                                  [showClear]="true"
                                  appendTo="body"
                              >
                                  <ng-template let-option pTemplate="item">
                                      <div class="flex items-center justify-between w-full">
                                          <span>{{ option.name }}</span>
                                          @if (false && option.priceModifier) {
                                              <span class="text-xs ml-2" [ngClass]="option.priceModifier > 0 ? 'text-green-600' : 'text-red-600'"> {{ option.priceModifier > 0 ? '+' : '' }}{{ option.priceModifier | currency: 'USD' }} </span>
                                          }
                                      </div>
                                  </ng-template>
                              </p-select>

                              @if (selectedAttributeValuesForCart[group.id]) {
                                  <div class="text-xs text-surface-500 pl-1">
                                      {{ 'landing.shop.dialog.selected' | transloco }}: {{ getSelectedAttributeName(group.id) }}
                                      @if (false && getSelectedAttributePriceModifier(group.id) !== 0) {
                                          <span> ({{ getSelectedAttributePriceModifier(group.id) > 0 ? '+' : '' }}{{ getSelectedAttributePriceModifier(group.id) | currency: 'USD' }}) </span>
                                      }
                                  </div>
                              }
                          </div>
                      }
                  </div>
              }

              @if (productAttributeGroups.length === 0) {
                  <div class="text-center py-8 text-surface-500">
                      <i class="pi pi-info-circle text-2xl mb-2"></i>
                      <p>{{ 'landing.shop.dialog.noOptions' | transloco }}</p>
                  </div>
              }

              <div class="flex items-end gap-4 bg-surface-50 dark:bg-surface-800 p-4 rounded-lg mt-6">
                  <div class="flex-1">
                      <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">{{ 'landing.shop.dialog.quantity' | transloco }}</label>
                      <p-inputNumber
                          [(ngModel)]="currentQuantity"
                          [showButtons]="true"
                          buttonLayout="horizontal"
                          spinnerMode="horizontal"
                          [min]="1"
                          inputStyleClass="w-16 text-center font-bold"
                          decrementButtonClass="p-button-secondary"
                          incrementButtonClass="p-button-secondary"
                          styleClass="w-full"
                      ></p-inputNumber>
                  </div>
                  <button pButton [label]="'landing.shop.dialog.addVariant' | transloco" icon="pi pi-plus" class="p-button-outlined h-[42px]" (click)="addToAccumulated()" pTooltip="Add this configuration to the list below" tooltipPosition="top"></button>
              </div>

              @if (accumulatedVariants.length > 0) {
                  <div class="mt-6 border-t border-surface-200 dark:border-surface-700 pt-4">
                      <h5 class="font-bold text-surface-900 dark:text-surface-0 mb-3 text-sm uppercase tracking-wide">{{ 'landing.shop.dialog.selectedVariants' | transloco }}</h5>
                      <div class="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                          @for (variant of accumulatedVariants; track variant.tempId) {
                              <div class="flex items-center justify-between p-3 bg-surface-0 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-lg">
                                  <div class="flex flex-col gap-1">
                                      <div class="flex flex-wrap gap-2">
                                          @for (attr of variant.selectedAttributes; track attr.attributeId) {
                                              <span class="text-xs px-2 py-1 bg-surface-100 dark:bg-surface-800 rounded font-medium"> {{ attr.attributeName }}: {{ attr.valueName }} </span>
                                          }
                                          @if (variant.selectedAttributes.length === 0) {
                                              <span class="text-xs text-surface-500">{{ 'landing.shop.dialog.noOptionsSelected' | transloco }}</span>
                                          }
                                      </div>
                                      <span class="text-sm font-bold text-surface-900 dark:text-surface-0">{{ 'landing.shop.dialog.quantity' | transloco }}: {{ variant.quantity }}</span>
                                  </div>
                                  <button pButton icon="pi pi-trash" class="p-button-text p-button-danger p-button-sm p-button-rounded" (click)="removeAccumulated($index)"></button>
                              </div>
                          }
                      </div>
                  </div>
              }
              <div class="bg-surface-50 dark:bg-surface-800 p-4 rounded-lg hidden">
                  <div class="flex justify-between items-center">
                      <span class="text-sm font-medium text-surface-700 dark:text-surface-300">{{ 'landing.shop.dialog.basePrice' | transloco }}:</span>
                      <span class="font-medium text-surface-900 dark:text-surface-0"> $\{{ selectedProduct.basePrice | number: '1.2-2' }} </span>
                  </div>

                  @if (hasAttributeModifiers()) {
                      <div class="mt-2 space-y-1">
                          @for (group of productAttributeGroups; track group.id) {
                              @if (selectedAttributeValuesForCart[group.id]) {
                                  <div class="flex justify-between items-center text-sm">
                                      <span class="text-surface-600 dark:text-surface-400"> {{ group.name }}: </span>
                                      @if (getSelectedAttributePriceModifier(group.id) !== 0) {
                                          <span [ngClass]="getSelectedAttributePriceModifier(group.id) > 0 ? 'text-green-600' : 'text-red-600'">
                                              {{ getSelectedAttributePriceModifier(group.id) > 0 ? '+' : '' }}{{ getSelectedAttributePriceModifier(group.id) | currency: 'USD' }}
                                          </span>
                                      }
                                  </div>
                              }
                          }
                      </div>
                  }

                  <div class="flex justify-between items-center mt-3 pt-3 border-t border-surface-200 dark:border-surface-700">
                      <span class="font-bold text-surface-900 dark:text-surface-0">{{ 'landing.shop.dialog.total' | transloco }}:</span>
                      <span class="text-xl font-bold text-surface-900 dark:text-surface-0"> $\{{ calculateFinalPrice() | number: '1.2-2' }} </span>
                  </div>
              </div>
          </div>
      }

      <ng-template pTemplate="footer">
          <div class="flex justify-between items-center w-full">
              <div class="text-sm text-surface-600 dark:text-surface-400">{{ accumulatedVariants.length }} {{ 'landing.shop.dialog.itemsPending' | transloco }}</div>
              <div class="flex gap-2">
                  <button pButton [label]="'landing.shop.dialog.cancel' | transloco" icon="pi pi-times" class="p-button-text" (click)="showAttributeDialog = false"></button>
                  <button pButton [label]="'landing.shop.dialog.addAllToCart' | transloco" icon="pi pi-shopping-bag" (click)="confirmAddToCart()" [disabled]="!canAddToCart()"></button>
              </div>
          </div>
      </ng-template>
  </p-dialog>
    `
})
export class ShopWidget implements OnInit {
    cart = inject(CartService);
    message = inject(MessageService);
    shopService = inject(ShopService);
    translocoService = inject(TranslocoService);

    products: Product[] = [];
    filteredProducts: Product[] = [];
    loading: boolean = true;

    // Pagination
    currentPage: number = 1;
    pageSize: number = 12;
    totalRecords: number = 0;

    // Filters
    searchTerm: string = '';
    selectedSort: SortOption | null = null;

    // Client-side Filters
    priceRange: number[] = [0, 1000];
    inStockOnly: boolean = false;

    // Attribute Filters
    attributeGroups: AttributeGroup[] = [];
    selectedAttributeValues: Map<string, string[]> = new Map();

    // Attribute Selection Dialog
    showAttributeDialog: boolean = false;
    selectedProduct: Product | null = null;
    productAttributeGroups: ProductAttributeGroup[] = [];
    selectedAttributeValuesForCart: { [key: string]: string } = {};

    // Multi-variant selection
    currentQuantity: number = 1;
    accumulatedVariants: any[] = [];

    // Debounce timer for search
    private searchDebounce: any;

    sortOptions: SortOption[] = [
        { key: 'nameAsc', value: ['name', 'ASC'] },
        { key: 'nameDesc', value: ['name', 'DESC'] },
        { key: 'priceLowHigh', value: ['basePrice', 'ASC'] },
        { key: 'priceHighLow', value: ['basePrice', 'DESC'] },
        { key: 'newest', value: ['created_at', 'DESC'] },
        { key: 'oldest', value: ['created_at', 'ASC'] }
    ];

    get translatedSortOptions() {
        return this.sortOptions.map(option => ({
            ...option,
            label: this.translocoService.translate('landing.shop.sort.' + option.key)
        }));
    }


    ngOnInit() {
        this.loadProducts();
    }

    loadProducts() {
        this.loading = true;

        const filters: any = {
            page: this.currentPage,
            limit: this.pageSize,
            isActive: true,
            relations: ['pav', 'attribute', 'attributeValue']
        };

        if (this.searchTerm && this.searchTerm.trim()) {
            filters.nameLike = this.searchTerm.trim();
        }

        if (this.selectedSort) {
            filters.sort = this.selectedSort.value;
        }

        this.shopService.getProducts(filters).subscribe({
            next: (response) => {
                this.products = response.data;
                this.totalRecords = response.total;

                this.attributeGroups = this.shopService.processAttributes(this.products, this.selectedAttributeValues);
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

    openAttributeDialog(product: Product) {
        if (!product.isActive) {
            this.message.add({
                severity: 'warn',
                summary: 'Product unavailable',
                detail: 'This product is currently unavailable',
                life: 3000
            });
            return;
        }

        this.selectedProduct = product;
        this.selectedAttributeValuesForCart = {};
        this.productAttributeGroups = this.shopService.prepareProductAttributeGroups(product);
        this.currentQuantity = 1;
        this.accumulatedVariants = [];
        this.showAttributeDialog = true;
    }

    getSelectOptionsForGroup(group: ProductAttributeGroup): any[] {
        // Agrega una opción vacía al inicio para permitir deseleccionar
        return [
            { id: null, name: 'None', priceModifier: 0 },
            ...group.values.map((value) => ({
                id: value.id,
                name: value.name,
                priceModifier: value.priceModifier || 0
            }))
        ];
    }

    onAttributeSelectChange(attributeId: string) {
        console.log(`Attribute ${attributeId} selected:`, this.selectedAttributeValuesForCart[attributeId]);
    }

    getSelectedAttributeName(attributeId: string): string {
        const valueId = this.selectedAttributeValuesForCart[attributeId];
        if (!valueId) return '';

        const group = this.productAttributeGroups.find((g) => g.id === attributeId);
        if (!group) return '';

        const value = group.values.find((v) => v.id === valueId);
        return value?.name || '';
    }

    getSelectedAttributePriceModifier(attributeId: string): number {
        const valueId = this.selectedAttributeValuesForCart[attributeId];
        return this.shopService.getAttributePriceModifier(attributeId, valueId, this.productAttributeGroups);
    }

    hasAttributeModifiers(): boolean {
        return this.shopService.hasAttributeModifiers(this.selectedAttributeValuesForCart, this.productAttributeGroups);
    }

    calculateFinalPrice(): number {
        if (!this.selectedProduct) return 0;
        return this.shopService.calculatePrice(this.selectedProduct.basePrice, this.selectedAttributeValuesForCart, this.productAttributeGroups);
    }

    getSelectedAttributesCount(): number {
        return Object.values(this.selectedAttributeValuesForCart).filter((value) => value !== null && value !== undefined).length;
    }

    addToAccumulated() {
        if (!this.selectedProduct) return;

        const selectedAttributes: any[] = [];

        Object.entries(this.selectedAttributeValuesForCart).forEach(([attributeId, valueId]) => {
            if (!valueId) return;

            const group = this.productAttributeGroups.find((g) => g.id === attributeId);

            if (group) {
                const value = group.values.find((v) => v.id === valueId);
                selectedAttributes.push({
                    attributeId,
                    attributeName: group.name,
                    valueId,
                    valueName: value?.name || '',
                    priceModifier: value?.priceModifier || 0
                });
            }
        });

        this.accumulatedVariants.push({
            selectedAttributes,
            quantity: this.currentQuantity,
            tempId: Date.now()
        });

        // Reset for next entry, but keep product open
        this.selectedAttributeValuesForCart = {};
        this.currentQuantity = 1;

        this.message.add({
            severity: 'info',
            summary: 'Added to list',
            detail: 'Variant added to pending list'
        });
    }

    removeAccumulated(index: number) {
        this.accumulatedVariants.splice(index, 1);
    }

    confirmAddToCart() {
        if (!this.selectedProduct) return;

        // If user has pending selection but didn't click "Add Variant", add it now if list is empty
        // Or if list is not empty but they selected something else?
        // Let's adopt this policy:
        // 1. If accumulatedVariants > 0, just add those.
        // 2. If accumulatedVariants == 0, add the current selection.

        if (this.accumulatedVariants.length === 0) {
            this.addToAccumulated(); // Add current selection to list first
        }

        this.accumulatedVariants.forEach((variant) => {
            this.cart.addToCart(this.selectedProduct!, variant.quantity, variant.selectedAttributes);
        });

        this.message.add({
            severity: 'success',
            summary: 'Added to cart',
            detail: `${this.accumulatedVariants.length} variants added to cart`,
            life: 3000
        });

        this.showAttributeDialog = false;
        this.selectedProduct = null;
        this.selectedAttributeValuesForCart = {};
        this.accumulatedVariants = [];
        this.currentQuantity = 1;
    }

    canAddToCart(): boolean {
        // Can add if accumulated list has items OR current selection is valid
        // Simple validation: just needs product
        return true;
    }

    onDialogHide() {
        this.selectedAttributeValuesForCart = {};
        this.accumulatedVariants = [];
        this.currentQuantity = 1;
    }

    applyClientSideFilters() {
        const state: ShopFilterState = {
            searchTerm: this.searchTerm,
            priceRange: this.priceRange,
            inStockOnly: this.inStockOnly,
            selectedSort: this.selectedSort,
            selectedAttributeValues: this.selectedAttributeValues
        };
        this.filteredProducts = this.shopService.filterProducts(this.products, state);
    }

    getProductAttributes(product: Product): ProductAttributeValue[] {
        return product.productsAttributesValues || [];
    }

    toggleAttributeValue(attributeId: string, valueId: string) {
        if (!this.selectedAttributeValues.has(attributeId)) {
            this.selectedAttributeValues.set(attributeId, []);
        }

        const values = this.selectedAttributeValues.get(attributeId)!;
        const index = values.indexOf(valueId);

        if (index === -1) {
            values.push(valueId);
        } else {
            values.splice(index, 1);
        }

        const group = this.attributeGroups.find((g) => g.id === attributeId);
        if (group) {
            const value = group.values.find((v) => v.id === valueId);
            if (value) {
                value.selected = !value.selected;
            }
            group.selected = values.length > 0;
        }

        this.applyClientSideFilters();
    }

    toggleAttributeGroup(attributeId: string) {
        const group = this.attributeGroups.find((g) => g.id === attributeId);
        if (!group) return;

        const isSelected = group.selected;

        if (isSelected) {
            group.values.forEach((value) => (value.selected = false));
            this.selectedAttributeValues.delete(attributeId);
        } else {
            group.selected = true;
        }

        this.applyClientSideFilters();
    }

    isAttributeValueSelected(attributeId: string, valueId: string): boolean {
        return this.selectedAttributeValues.get(attributeId)?.includes(valueId) || false;
    }

    getSelectedAttributeValues(attributeId: string): string[] {
        return this.selectedAttributeValues.get(attributeId) || [];
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
        this.applyClientSideFilters();
    }

    onPageChange(event: PaginatorState) {
        this.currentPage = event.first! / event.rows! + 1;
        this.pageSize = event.rows!;
        this.loadProducts();
        document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
    }

    hasActiveFilters(): boolean {
        return !!(this.searchTerm || this.inStockOnly || this.selectedAttributeValues.size > 0);
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
        this.selectedAttributeValues.clear();

        this.attributeGroups.forEach((group) => {
            group.selected = false;
            group.values.forEach((value) => (value.selected = false));
        });

        this.onFilterChange();
    }
}
