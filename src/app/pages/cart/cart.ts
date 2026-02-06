import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '@/core/services/cart.service';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { FileUploadModule } from 'primeng/fileupload';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Router, RouterModule } from '@angular/router';
import { TopbarWidget } from '../landing/components/topbarwidget';
import { FooterWidget } from '../landing/components/footerwidget';
import { DialogModule } from 'primeng/dialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TagModule } from 'primeng/tag';
import { ChipModule } from 'primeng/chip';
import { SeoService } from '@/core/services/seo.service';
import { SelectModule } from 'primeng/select';
import { ShopService } from '../landing/services/shop.service';
import { ProductAttributeGroup } from '../landing/models/shop.types';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { TooltipModule } from 'primeng/tooltip';

@Component({
    selector: 'app-cart',
    standalone: true,
    imports: [
      CommonModule,
      ButtonModule,
      InputNumberModule,
      FormsModule,
      TableModule,
      FileUploadModule,
      ToastModule,
      RouterModule,
      TopbarWidget,
      FooterWidget,
      DialogModule,
      ProgressSpinnerModule,
      TagModule,
      ChipModule,
      SelectModule,
      TranslocoModule,
      TooltipModule,
    ],
    providers: [MessageService],
    template: `
        <div class="bg-surface-0 dark:bg-surface-900 min-h-screen">
            <div id="cart" class="landing-wrapper overflow-hidden">
                <topbar-widget class="fixed w-full top-0 left-0 z-50 bg-white dark:bg-surface-900 shadow-sm py-4 px-6 lg:px-20 flex items-center justify-between" />

                <div class="pt-48 px-4 md:px-6 lg:px-20 pb-8 min-h-[calc(100vh-400px)]">
                    <div class="flex flex-col lg:flex-row gap-8">
                        <div class="flex-1">
                            <div class="flex flex-col gap-4">
                                <div class="flex justify-between items-center mb-4">
                                    <div class="flex items-center gap-4">
                                        <button pButton icon="pi pi-arrow-left" class="p-button-text p-button-rounded" routerLink="/" pTooltip="Back to Home"></button>
                                        <span class="text-3xl font-medium text-surface-900 dark:text-surface-0">
                                            {{ 'cart.title' | transloco }}
                                        </span>
                                    </div>
                                    <span class="text-surface-600 dark:text-surface-200">
                                        {{ cart.totalItems() }} {{ 'cart.items' | transloco }}
                                    </span>
                                </div>

                                <div *ngIf="cart.items().length === 0" class="text-center py-16 rounded-xl bg-surface-50 dark:bg-surface-800">
                                    <i class="pi pi-shopping-cart text-6xl text-surface-400 mb-4"></i>
                                    <p class="text-2xl text-surface-600 mb-6 font-medium">
                                        {{ 'cart.empty.title' | transloco }}
                                    </p>
                                    <button pButton
                                            [label]="'cart.empty.button' | transloco"
                                            routerLink="/"
                                            icon="pi pi-arrow-left"
                                            class="p-button-rounded p-button-outlined"></button>
                                </div>

                                <div
                                    *ngFor="let item of cart.items()"
                                    class="flex flex-col sm:flex-row sm:items-start p-6 gap-6 bg-surface-0 dark:bg-surface-900 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-surface-200 dark:border-surface-800"
                                >
                                    <div class="w-32 h-32 shrink-0 overflow-hidden rounded-lg bg-surface-100">
                                        <img [src]="item.product.picture" [alt]="item.product.name" class="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                                    </div>

                                    <div class="flex-1 flex flex-col gap-4">
                                        <div class="flex justify-between items-start">
                                            <div class="flex-1">
                                                <span class="text-2xl font-bold text-surface-900 dark:text-surface-0">{{ item.product.name }}</span>
                                                <span class="text-surface-600 dark:text-surface-300 line-clamp-2 block mt-1">{{ item.product.description }}</span>
                                            </div>
                                            <div class="text-right">
                                                <!-- Prices hidden for B2C quote mode -->
                                            </div>
                                        </div>

                                        <!-- Selected Attributes -->
                                        <div *ngIf="item.selectedAttributes && item.selectedAttributes.length > 0" class="mt-2">
                                            <div class="text-sm font-semibold text-surface-700 dark:text-surface-300 mb-2">
                                                {{ 'cart.item.options' | transloco }}
                                            </div>
                                            <div class="flex flex-wrap gap-2">
                                                <div *ngFor="let attr of item.selectedAttributes" class="flex items-center gap-2 px-3 py-1.5 bg-surface-50 dark:bg-surface-800 rounded-lg border border-surface-200 dark:border-surface-700">
                                                    <span class="text-sm text-surface-600 dark:text-surface-400 font-medium">{{ attr.attributeName }}:</span>
                                                    <span class="text-sm text-surface-900 dark:text-surface-0">{{ attr.valueName }}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Product Base Attributes Preview -->
                                        <div *ngIf="item.product.productsAttributesValues && item.product.productsAttributesValues.length > 0" class="mt-2">
                                            <div class="text-sm font-semibold text-surface-700 dark:text-surface-300 mb-2">
                                                {{ 'cart.item.attributes' | transloco }}
                                            </div>
                                            <div class="flex flex-wrap gap-1.5">
                                                <span *ngFor="let attr of item.product.productsAttributesValues | slice: 0 : 3" class="text-xs px-2 py-1 bg-surface-100 dark:bg-surface-800 rounded text-surface-600 dark:text-surface-400">
                                                    {{ attr.attribute.name }}: {{ attr.attributeValue?.value }}
                                                </span>
                                                <span *ngIf="item.product.productsAttributesValues.length > 3" class="text-xs px-2 py-1 bg-surface-100 dark:bg-surface-800 rounded text-surface-500">
                                                    +{{ item.product.productsAttributesValues.length - 3 }} more
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="flex flex-col sm:flex-row items-center gap-4 mt-2">
                                        <p-inputNumber
                                            [ngModel]="item.quantity"
                                            (ngModelChange)="updateQuantity(item.itemId, $event)"
                                            [showButtons]="true"
                                            buttonLayout="horizontal"
                                            spinnerMode="horizontal"
                                            [min]="1"
                                            inputStyleClass="w-16 text-center font-bold"
                                            decrementButtonClass="p-button-text text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800"
                                            incrementButtonClass="p-button-text text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800"
                                            styleClass="border border-surface-300 dark:border-surface-700 rounded-lg"
                                        ></p-inputNumber>
                                        <button
                                            pButton
                                            icon="pi pi-trash"
                                            class="p-button-text p-button-danger p-button-rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                                            (click)="removeItem(item.itemId)"
                                            pTooltip="{{ 'cart.item.remove' | transloco }}"
                                            tooltipPosition="top"
                                        ></button>
                                        <button
                                            pButton
                                            icon="pi pi-pencil"
                                            class="p-button-text p-button-secondary p-button-rounded hover:bg-surface-100 dark:hover:bg-surface-800"
                                            (click)="editAttributes(item)"
                                            pTooltip="{{ 'cart.item.edit' | transloco }}"
                                            tooltipPosition="top"
                                        ></button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="w-full lg:w-[28rem] shrink-0" *ngIf="cart.items().length > 0">
                            <div class="surface-card p-8 rounded-xl sticky top-32 shadow-lg bg-surface-0 dark:bg-surface-900 border border-surface-200 dark:border-surface-800">
                                <div class="flex justify-between items-center mb-6">
                                    <span class="text-2xl font-bold text-surface-900 dark:text-surface-0">
                                        {{ 'cart.summary.title' | transloco }}
                                    </span>
                                    <span class="text-sm text-surface-500">{{ cart.totalItems() }} {{ 'cart.items' | transloco }}</span>
                                </div>

                                <!-- Price Breakdown -->
                                <div class="space-y-3 mb-6">
                                    <div class="hidden">
                                        <div class="flex justify-between items-center">
                                            <span class="text-surface-600 dark:text-surface-200">
                                                {{ 'cart.summary.subtotal' | transloco }}
                                            </span>
                                            <span class="text-surface-900 dark:text-surface-0 font-medium">\${{ getSubtotal() | number: '1.2-2' }}</span>
                                        </div>

                                        <div *ngIf="hasAttributeModifiers()" class="ml-4 border-l-2 border-surface-200 dark:border-surface-700 pl-3">
                                            <div class="text-sm text-surface-500 mb-1">
                                                {{ 'cart.summary.modifiers' | transloco }}
                                            </div>
                                        </div>

                                        <div class="flex justify-between items-center pt-3 border-t border-surface-200 dark:border-surface-700">
                                            <span class="text-lg font-semibold text-surface-900 dark:text-surface-0">
                                                {{ 'cart.summary.total' | transloco }}
                                            </span>
                                            <span class="text-2xl font-bold text-primary">\${{ cart.totalPrice() | number: '1.2-2' }}</span>
                                        </div>
                                    </div>
                                </div>

                                <div class="border-t surface-border my-6"></div>

                                <div class="mb-8">
                                    <label class="block text-surface-900 dark:text-surface-0 font-bold mb-3 text-lg">
                                        {{ 'cart.personalization.title' | transloco }}
                                    </label>
                                    <p class="text-surface-500 dark:text-surface-400 text-sm mb-3">
                                        {{ 'cart.personalization.description' | transloco }}
                                    </p>

                                    <button pButton
                                            [label]="'cart.personalization.specsButton' | transloco"
                                            icon="pi pi-info-circle"
                                            class="p-button-text p-button-sm mb-3 pl-0"
                                            (click)="showSpecs = true"></button>

                                    <p-fileUpload
                                        mode="advanced"
                                        [chooseLabel]="'cart.personalization.upload.select' | transloco"
                                        chooseIcon="pi pi-upload"
                                        name="demo[]"
                                        url="https://www.primefaces.org/cdn/api/upload.php"
                                        accept="image/*"
                                        maxFileSize="5000000"
                                        (onSelect)="onFileSelect($event)"
                                        styleClass="w-full"
                                        [showUploadButton]="false"
                                        [showCancelButton]="false"
                                        [auto]="true"
                                    >
                                        <ng-template pTemplate="content">
                                            <div *ngIf="cart.quoteFile()" class="flex flex-col gap-3">
                                                <div class="flex items-center gap-3 p-3 border border-primary rounded bg-primary-50 text-primary dark:bg-primary-900 dark:border-primary-700">
                                                    <i class="pi pi-check-circle text-xl"></i>
                                                    <span class="font-medium truncate">{{ cart.quoteFile()?.name }}</span>
                                                    <i class="pi pi-times cursor-pointer ml-auto hover:text-red-600" (click)="clearFile()"></i>
                                                </div>

                                                <div class="w-full h-48 rounded-lg overflow-hidden bg-surface-50 dark:bg-surface-800 flex items-center justify-center relative group">
                                                    <img [src]="filePreviewUrl" alt="Preview" class="max-w-full max-h-full object-contain" *ngIf="filePreviewUrl" />
                                                    <div class="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center transition-all duration-300" *ngIf="filePreviewUrl">
                                                        <span class="text-white font-medium">Preview</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div *ngIf="!cart.quoteFile()" class="flex flex-col items-center justify-center py-4 text-surface-500 dark:text-surface-400">
                                                <i class="pi pi-image text-4xl mb-2"></i>
                                                <span>{{ 'cart.personalization.upload.dragging' | transloco }}</span>
                                            </div>
                                        </ng-template>
                                    </p-fileUpload>
                                </div>

                                <button pButton
                                        [label]="'cart.quote.button' | transloco"
                                        class="w-full p-button-lg font-bold py-4"
                                        icon="pi pi-send"
                                        (click)="requestQuote()"
                                        [loading]="loading"
                                        [disabled]="cart.items().length === 0"></button>
                                <p class="text-sm text-surface-500 dark:text-surface-400 mt-6 text-center leading-relaxed">
                                    {{ 'cart.quote.note' | transloco }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <footer-widget />
            </div>
            <p-toast></p-toast>

            <!-- File Specs Dialog -->
            <p-dialog [(visible)]="showSpecs"
                      [header]="'cart.personalization.specs.title' | transloco"
                      [modal]="true"
                      [style]="{ width: '450px' }"
                      styleClass="p-fluid">
                <div class="flex flex-col gap-4">
                    <div class="flex items-start gap-3">
                        <i class="pi pi-image text-primary text-xl mt-1"></i>
                        <div>
                            <h3 class="font-bold text-surface-900 dark:text-surface-0">
                                {{ 'cart.personalization.specs.format' | transloco }}
                            </h3>
                            <p class="text-surface-600 dark:text-surface-200" [innerHTML]="'cart.personalization.specs.formatText' | transloco"></p>
                        </div>
                    </div>
                    <div class="flex items-start gap-3">
                        <i class="pi pi-star text-primary text-xl mt-1"></i>
                        <div>
                            <h3 class="font-bold text-surface-900 dark:text-surface-0">
                                {{ 'cart.personalization.specs.quality' | transloco }}
                            </h3>
                            <p class="text-surface-600 dark:text-surface-200">
                                {{ 'cart.personalization.specs.qualityText' | transloco }}
                            </p>
                        </div>
                    </div>
                    <div class="flex items-start gap-3">
                        <i class="pi pi-palette text-primary text-xl mt-1"></i>
                        <div>
                            <h3 class="font-bold text-surface-900 dark:text-surface-0">
                                {{ 'cart.personalization.specs.colors' | transloco }}
                            </h3>
                            <p class="text-surface-600 dark:text-surface-200">
                                {{ 'cart.personalization.specs.colorsText' | transloco }}
                            </p>
                        </div>
                    </div>
                </div>
                <ng-template pTemplate="footer">
                    <button pButton
                            [label]="'cart.personalization.specs.gotIt' | transloco"
                            icon="pi pi-check"
                            (click)="showSpecs = false"
                            autofocus></button>
                </ng-template>
            </p-dialog>

            <!-- File Warning Dialog -->
            <p-dialog [(visible)]="showFileWarning"
                      [header]="'cart.quote.warning.title' | transloco"
                      [modal]="true"
                      [style]="{ width: '450px' }">
                <div class="flex flex-col gap-4">
                    <div class="flex items-start gap-3">
                        <i class="pi pi-exclamation-triangle text-orange-500 text-3xl"></i>
                        <div>
                            <p class="text-surface-900 dark:text-surface-0 mb-2">
                                {{ 'cart.quote.warning.message' | transloco }}
                            </p>
                            <p class="text-surface-600 dark:text-surface-200">
                                {{ 'cart.quote.warning.question' | transloco }}
                            </p>
                        </div>
                    </div>
                </div>
                <ng-template pTemplate="footer">
                    <button pButton
                            [label]="'cart.quote.warning.cancel' | transloco"
                            class="p-button-text"
                            (click)="showFileWarning = false"></button>
                    <button pButton
                            [label]="'cart.quote.warning.proceed' | transloco"
                            (click)="proceedWithoutFile()"></button>
                </ng-template>
            </p-dialog>

            <!-- Edit Attributes Dialog -->
            <p-dialog [(visible)]="showEditAttributesDialog"
                      [header]="'cart.dialog.edit.title' | transloco"
                      [modal]="true"
                      [style]="{ width: '500px' }"
                      (onHide)="onEditDialogHide()">
                <div class="space-y-6" *ngIf="itemToEdit">
                    <div class="flex items-start gap-4">
                        <img [src]="itemToEdit.product.picture" [alt]="itemToEdit.product.name" class="w-20 h-20 object-cover rounded-lg" />
                        <div>
                            <h4 class="font-semibold text-lg text-surface-900 dark:text-surface-0">{{ itemToEdit.product.name }}</h4>
                            <p class="text-surface-600 dark:text-surface-400 text-sm mt-1">{{ itemToEdit.product.description | slice: 0 : 100 }}...</p>
                        </div>
                    </div>

                    <!-- Attribute Selection -->
                    <div class="space-y-4" *ngIf="editAttributeGroups.length > 0">
                        <div *ngFor="let group of editAttributeGroups" class="space-y-3">
                            <div class="flex items-center justify-between">
                                <h5 class="text-sm font-semibold text-surface-700 dark:text-surface-300">{{ group.name }}</h5>
                                <span class="text-xs text-surface-500" *ngIf="editSelectedAttributes[group.id]">
                                    {{ 'cart.dialog.edit.selected' | transloco }}
                                </span>
                            </div>

                            <p-select
                                [options]="getEditSelectOptionsForGroup(group)"
                                [showClear]="true"
                                [(ngModel)]="editSelectedAttributes[group.id]"
                                (ngModelChange)="onEditAttributeChange()"
                                optionLabel="name"
                                optionValue="id"
                                [placeholder]="'cart.dialog.edit.placeholder' | transloco"
                                styleClass="w-full"
                                appendTo="body"
                            >
                                <ng-template let-option pTemplate="item">
                                    <div class="flex items-center justify-between w-full">
                                        <span>{{ option.name }}</span>
                                    </div>
                                </ng-template>
                            </p-select>
                        </div>
                    </div>
                </div>

                <ng-template pTemplate="footer">
                    <div class="flex justify-between items-center w-full">
                        <div class="text-sm text-surface-600 dark:text-surface-400">
                            {{ 'cart.dialog.edit.selectedCount' | transloco:{count: getEditSelectedAttributesCount(), total: editAttributeGroups.length} }}
                        </div>
                        <div class="flex gap-2">
                            <button pButton
                                    [label]="'cart.dialog.edit.cancel' | transloco"
                                    icon="pi pi-times"
                                    class="p-button-text"
                                    (click)="showEditAttributesDialog = false"></button>
                            <button pButton
                                    [label]="'cart.dialog.edit.update' | transloco"
                                    icon="pi pi-check"
                                    (click)="saveEditedAttributes()"></button>
                        </div>
                    </div>
                </ng-template>
            </p-dialog>
        </div>
    `,
    styles: [
        `
            :host ::ng-deep .p-inputnumber-input {
                width: 3rem;
            }
            .attribute-chip {
                transition: all 0.2s ease;
            }
            .attribute-chip:hover {
                transform: translateY(-1px);
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
        `
    ]
})
export class Cart implements OnInit {
    cart = inject(CartService);
    messageService = inject(MessageService);
    router = inject(Router);
    seoService = inject(SeoService);
    shopService = inject(ShopService);
    translocoService = inject(TranslocoService);

    ngOnInit() {
        this.seoService.updateTitle('Shopping Cart - Imago Creations');
        this.seoService.updateDescription('Review your custom uniform order.');
        this.seoService.updateUrl('https://imagocreations.com/cart');
    }

    showSpecs = false;
    showFileWarning = false;
    showEditAttributesDialog = false;
    loading = false;
    filePreviewUrl: string | null = null;

    // Variables para editar atributos
    itemToEdit: any = null;
    editAttributeGroups: ProductAttributeGroup[] = [];
    editSelectedAttributes: { [key: string]: string } = {};

    getItemUnitPrice(item: any): number {
        return this.cart.getItemPrice(item);
    }

    getItemTotalPrice(item: any): number {
        return this.cart.getItemPrice(item) * item.quantity;
    }

    getSubtotal(): number {
        return this.cart.items().reduce((total, item) => {
            return total + item.product.basePrice * item.quantity;
        }, 0);
    }

    hasAttributeModifiers(): boolean {
        return this.cart.items().some((item) => item.selectedAttributes?.some((attr) => attr.priceModifier && attr.priceModifier !== 0));
    }

    updateQuantity(itemId: string | undefined, quantity: number) {
        if (!itemId) return;
        this.cart.updateQuantity(itemId, quantity);
    }

    removeItem(itemId: string | undefined) {
        if (!itemId) return;
        this.cart.removeFromCart(itemId);
        this.messageService.add({
            severity: 'info',
            summary: 'Removed',
            detail: this.translocoService.translate('cart.messages.removed')
        });
    }

    // Método para editar atributos
    editAttributes(item: any) {
        this.itemToEdit = item;

        // Preparar grupos de atributos del producto
        this.editAttributeGroups = this.shopService.prepareProductAttributeGroups(item.product);

        // Preparar atributos seleccionados actuales
        this.editSelectedAttributes = {};
        if (item.selectedAttributes) {
            item.selectedAttributes.forEach((attr: any) => {
                this.editSelectedAttributes[attr.attributeId] = attr.valueId;
            });
        }

        this.showEditAttributesDialog = true;
    }

    getEditSelectOptionsForGroup(group: any): any[] {
        return [
            { id: null, name: 'None', priceModifier: 0 },
            ...group.values.map((value: any) => ({
                id: value.id,
                name: value.name,
                priceModifier: value.priceModifier || 0
            }))
        ];
    }

    onEditAttributeChange() {
        // Actualizar el precio cuando cambian los atributos
    }

    getEditDialogPrice(): number {
        if (!this.itemToEdit) return 0;
        return this.shopService.calculatePrice(this.itemToEdit.product.basePrice, this.editSelectedAttributes, this.editAttributeGroups);
    }

    getEditSelectedAttributesCount(): number {
        return Object.values(this.editSelectedAttributes).filter((value) => value !== null && value !== undefined).length;
    }

    hasEditAttributeModifiers(): boolean {
        return this.shopService.hasAttributeModifiers(this.editSelectedAttributes, this.editAttributeGroups);
    }

    getEditAttributePriceModifier(attributeId: string): number {
        const valueId = this.editSelectedAttributes[attributeId];
        return this.shopService.getAttributePriceModifier(attributeId, valueId, this.editAttributeGroups);
    }

    saveEditedAttributes() {
        if (!this.itemToEdit) return;

        const selectedAttributes: any[] = [];

        Object.entries(this.editSelectedAttributes).forEach(([attributeId, valueId]) => {
            if (!valueId) return;

            const group = this.editAttributeGroups.find((g) => g.id === attributeId);

            if (group) {
                const value = group.values.find((v: any) => v.id === valueId);
                selectedAttributes.push({
                    attributeId,
                    attributeName: group.name,
                    valueId,
                    valueName: value?.name || '',
                    priceModifier: value?.priceModifier || 0
                });
            }
        });

        this.cart.updateItemAttributes(this.itemToEdit.itemId, selectedAttributes);

        this.messageService.add({
            severity: 'success',
            summary: 'Updated',
            detail: this.translocoService.translate('cart.messages.updated'),
            life: 3000
        });

        this.showEditAttributesDialog = false;
    }

    onEditDialogHide() {
        this.itemToEdit = null;
        this.editAttributeGroups = [];
        this.editSelectedAttributes = {};
    }

    onFileSelect(event: any) {
        if (event.files && event.files.length > 0) {
            const file = event.files[0];
            this.cart.setQuoteFile(file);
            this.messageService.add({
                severity: 'success',
                summary: 'File Uploaded',
                detail: this.translocoService.translate('cart.messages.fileUploaded')
            });

            const reader = new FileReader();
            reader.onload = (e: any) => {
                this.filePreviewUrl = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    }

    clearFile() {
        this.cart.setQuoteFile(null);
        this.filePreviewUrl = null;
        this.messageService.add({
            severity: 'info',
            summary: 'File Removed',
            detail: this.translocoService.translate('cart.messages.fileRemoved')
        });
    }

    requestQuote() {
        if (this.cart.items().length === 0) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Empty Cart',
                detail: this.translocoService.translate('cart.messages.emptyCart')
            });
            return;
        }

        if (!this.cart.quoteFile()) {
            this.showFileWarning = true;
            return;
        }

        this.proceedToQuote();
    }

    proceedWithoutFile() {
        this.showFileWarning = false;
        this.proceedToQuote();
    }

    proceedToQuote() {
        this.loading = true;

        // Simulate brief loading before navigation
        setTimeout(() => {
            this.loading = false;
            this.router.navigate(['/quote-info']);
        }, 800);
    }
}
