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

import { SeoService } from '@/core/services/seo.service';

@Component({
    selector: 'app-cart',
    standalone: true,
    imports: [CommonModule, ButtonModule, InputNumberModule, FormsModule, TableModule, FileUploadModule, ToastModule, RouterModule, TopbarWidget, FooterWidget, DialogModule, ProgressSpinnerModule],
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
                                        <span class="text-3xl font-medium text-surface-900 dark:text-surface-0">Shopping Cart</span>
                                    </div>
                                    <span class="text-surface-600 dark:text-surface-200">{{ cart.totalItems() }} Items</span>
                                </div>

                                <div *ngIf="cart.items().length === 0" class="text-center py-16 rounded-xl bg-surface-50 dark:bg-surface-800">
                                    <i class="pi pi-shopping-cart text-6xl text-surface-400 mb-4"></i>
                                    <p class="text-2xl text-surface-600 mb-6 font-medium">Your cart is empty</p>
                                    <button pButton label="Go Shopping" routerLink="/" icon="pi pi-arrow-left" class="p-button-rounded p-button-outlined"></button>
                                </div>

                                <div *ngFor="let item of cart.items()" class="flex flex-col sm:flex-row sm:items-center p-6 gap-6 bg-surface-0 dark:bg-surface-900 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                                    <div class="w-32 h-32 flex-shrink-0 overflow-hidden rounded-lg bg-surface-100">
                                        <img [src]="item.product.picture" [alt]="item.product.name" class="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                                    </div>
                                    <div class="flex-1 flex flex-col gap-3">
                                        <span class="text-2xl font-bold text-surface-900 dark:text-surface-0">{{ item.product.name }}</span>
                                        <span class="text-surface-600 dark:text-surface-300 line-clamp-2">{{ item.product.description }}</span>
                                    </div>
                                    <div class="flex flex-col sm:flex-row items-center gap-6">
                                        <span class="text-2xl font-bold text-primary">\${{ item.product.basePrice }}</span>
                                        <p-inputNumber
                                            [ngModel]="item.quantity"
                                            (ngModelChange)="updateQuantity(item.product.id, $event)"
                                            [showButtons]="true"
                                            buttonLayout="horizontal"
                                            spinnerMode="horizontal"
                                            [min]="1"
                                            inputStyleClass="w-16 text-center font-bold"
                                            decrementButtonClass="p-button-text text-surface-500"
                                            incrementButtonClass="p-button-text text-surface-500"
                                        >
                                        </p-inputNumber>
                                        <button pButton icon="pi pi-trash" class="p-button-text p-button-danger p-button-rounded hover:bg-red-50" (click)="removeItem(item.product.id)"></button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="w-full lg:w-[28rem] flex-shrink-0" *ngIf="cart.items().length > 0">
                            <div class="surface-card p-8 rounded-xl sticky top-32 shadow-lg bg-surface-0 dark:bg-surface-900">
                                <div class="flex justify-between items-center mb-6">
                                    <span class="text-2xl font-bold text-surface-900 dark:text-surface-0">Order Summary</span>
                                </div>

                                <div class="flex justify-between items-center mb-4">
                                    <span class="text-surface-600 dark:text-surface-200 text-lg">Subtotal (Est.)</span>
                                    <span class="text-2xl font-bold text-surface-900 dark:text-surface-0">\${{ cart.totalPrice() | number: '1.2-2' }}</span>
                                </div>

                                <div class="border-t surface-border my-6"></div>

                                <div class="mb-8">
                                    <label class="block text-surface-900 dark:text-surface-0 font-bold mb-3 text-lg">Personalization File</label>
                                    <p class="text-surface-500 dark:text-surface-400 text-sm mb-3">Upload your logo or design for customization.</p>

                                    <button pButton label="View File Specs" icon="pi pi-info-circle" class="p-button-text p-button-sm mb-3 pl-0" (click)="showSpecs = true"></button>

                                    <p-fileUpload
                                        mode="advanced"
                                        chooseLabel="Select File"
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
                                                <div class="flex items-center gap-3 p-3 border border-primary rounded bg-primary-50 text-primary">
                                                    <i class="pi pi-check-circle text-xl"></i>
                                                    <span class="font-medium truncate">{{ cart.quoteFile()?.name }}</span>
                                                    <i class="pi pi-times cursor-pointer ml-auto hover:text-red-600" (click)="clearFile()"></i>
                                                </div>

                                                <div class="w-full h-48 rounded-lg overflow-hidden bg-surface-50 flex items-center justify-center relative group">
                                                    <img [src]="filePreviewUrl" alt="Preview" class="max-w-full max-h-full object-contain" *ngIf="filePreviewUrl" />
                                                    <div class="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center transition-all duration-300" *ngIf="filePreviewUrl">
                                                        <span class="text-white font-medium">Preview</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div *ngIf="!cart.quoteFile()" class="flex flex-col items-center justify-center py-4 text-surface-500">
                                                <i class="pi pi-image text-4xl mb-2"></i>
                                                <span>Drag and drop or click to select</span>
                                            </div>
                                        </ng-template>
                                    </p-fileUpload>
                                </div>

                                <button pButton label="Request Quote" class="w-full p-button-lg font-bold py-4" icon="pi pi-send" (click)="requestQuote()" [loading]="loading"></button>
                                <p class="text-sm text-surface-500 mt-6 text-center leading-relaxed">By requesting a quote, our team will review your order and personalization requirements and get back to you shortly.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <footer-widget />
            </div>
            <p-toast></p-toast>

            <!-- File Specs Dialog -->
            <p-dialog [(visible)]="showSpecs" header="File Specifications" [modal]="true" [style]="{ width: '450px' }" styleClass="p-fluid">
                <div class="flex flex-col gap-4">
                    <div class="flex items-start gap-3">
                        <i class="pi pi-image text-primary text-xl mt-1"></i>
                        <div>
                            <h3 class="font-bold text-surface-900 dark:text-surface-0">Format</h3>
                            <p class="text-surface-600 dark:text-surface-200">We prefer <strong>PNG</strong> files with a transparent background for the best results.</p>
                        </div>
                    </div>
                    <div class="flex items-start gap-3">
                        <i class="pi pi-star text-primary text-xl mt-1"></i>
                        <div>
                            <h3 class="font-bold text-surface-900 dark:text-surface-0">Quality</h3>
                            <p class="text-surface-600 dark:text-surface-200">Please provide the highest resolution available (at least 300 DPI is recommended).</p>
                        </div>
                    </div>
                    <div class="flex items-start gap-3">
                        <i class="pi pi-palette text-primary text-xl mt-1"></i>
                        <div>
                            <h3 class="font-bold text-surface-900 dark:text-surface-0">Colors</h3>
                            <p class="text-surface-600 dark:text-surface-200">CMYK color mode is preferred for print accuracy.</p>
                        </div>
                    </div>
                </div>
                <ng-template pTemplate="footer">
                    <button pButton label="Got it" icon="pi pi-check" (click)="showSpecs = false" autofocus></button>
                </ng-template>
            </p-dialog>

            <!-- File Warning Dialog -->
            <p-dialog [(visible)]="showFileWarning" header="No File Uploaded" [modal]="true" [style]="{ width: '450px' }">
                <div class="flex flex-col gap-4">
                    <div class="flex items-start gap-3">
                        <i class="pi pi-exclamation-triangle text-orange-500 text-3xl"></i>
                        <div>
                            <p class="text-surface-900 dark:text-surface-0 mb-2">You haven't uploaded a personalization file.</p>
                            <p class="text-surface-600 dark:text-surface-200">Would you like to proceed without a custom logo or design?</p>
                        </div>
                    </div>
                </div>
                <ng-template pTemplate="footer">
                    <button pButton label="Cancel" class="p-button-text" (click)="showFileWarning = false"></button>
                    <button pButton label="Proceed Anyway" (click)="proceedWithoutFile()"></button>
                </ng-template>
            </p-dialog>
        </div>
    `,
    styles: [
        `
            :host ::ng-deep .p-inputnumber-input {
                width: 3rem;
            }
        `
    ]
})
export class Cart implements OnInit {
    cart = inject(CartService);
    messageService = inject(MessageService);
    router = inject(Router);
    seoService = inject(SeoService);

    ngOnInit() {
        this.seoService.updateTitle('Shopping Cart - Imago Creations');
        this.seoService.updateDescription('Review your custom uniform order.');
        this.seoService.updateUrl('https://imagocreations.com/cart');
    }

    showSpecs = false;
    showFileWarning = false;
    loading = false;
    filePreviewUrl: string | null = null;

    updateQuantity(productId: string | undefined, quantity: number) {
        if (!productId) return;
        this.cart.updateQuantity(productId, quantity);
    }

    removeItem(productId: string | undefined) {
        if (!productId) return;
        this.cart.removeFromCart(productId);
        this.messageService.add({ severity: 'info', summary: 'Removed', detail: 'Item removed from cart' });
    }

    onFileSelect(event: any) {
        if (event.files && event.files.length > 0) {
            const file = event.files[0];
            this.cart.setQuoteFile(file);
            this.messageService.add({ severity: 'success', summary: 'File Uploaded', detail: file.name });

            // Create preview URL
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
    }

    requestQuote() {
        if (this.cart.items().length === 0) {
            this.messageService.add({ severity: 'warn', summary: 'Empty Cart', detail: 'Add items to cart first' });
            return;
        }

        // Check if file is uploaded
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
