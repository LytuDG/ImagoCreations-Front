// src/app/pages/quote-info/quote-info.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CartService, CustomerInfo } from '@/core/services/cart.service';
import { QuoteService } from '@/core/services/quote.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { DialogModule } from 'primeng/dialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TopbarWidget } from '../landing/components/topbarwidget';
import { FooterWidget } from '../landing/components/footerwidget';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { SeoService } from '@/core/services/seo.service';

@Component({
    selector: 'app-quote-customer-info',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule, ButtonModule, InputTextModule, TextareaModule, DialogModule, ProgressSpinnerModule, TopbarWidget, FooterWidget, ToastModule],
    providers: [MessageService],
    template: `
        <div class="bg-surface-0 dark:bg-surface-900 min-h-screen">
            <div id="quote-info" class="landing-wrapper overflow-hidden">
                <topbar-widget class="fixed w-full top-0 left-0 z-50 bg-white dark:bg-surface-900 shadow-sm py-4 px-6 lg:px-20 flex items-center justify-between" />

                <div class="pt-48 px-4 md:px-6 lg:px-20 pb-8 min-h-[calc(100vh-400px)]">
                    <div class="max-w-2xl mx-auto">
                        <div class="mb-8">
                            <button pButton label="Back to Cart" icon="pi pi-arrow-left" class="p-button-text pl-0" routerLink="/cart"></button>
                            <h1 class="text-3xl font-bold text-surface-900 dark:text-surface-0 mt-2">Customer Information</h1>
                            <p class="text-surface-600 dark:text-surface-200">Please provide your details to finalize the quote request.</p>
                        </div>

                        <!-- Customer Information Form -->
                        <div class="surface-card p-8 rounded-xl bg-surface-0 dark:bg-surface-900 shadow-md">
                            <h2 class="text-xl font-bold text-surface-900 dark:text-surface-0 mb-6">Contact Details</h2>

                            <div class="space-y-6">
                                <div class="flex flex-col gap-2">
                                    <label for="companyName" class="font-medium text-surface-900 dark:text-surface-0"> Company Name <span class="text-red-500">*</span> </label>
                                    <input pInputText id="companyName" [(ngModel)]="info.companyName" placeholder="Your Company" class="w-full" />
                                </div>

                                <div class="flex flex-col gap-2">
                                    <label for="contactPerson" class="font-medium text-surface-900 dark:text-surface-0"> Contact Person <span class="text-red-500">*</span> </label>
                                    <input pInputText id="contactPerson" [(ngModel)]="info.contactPerson" placeholder="Full Name" class="w-full" />
                                </div>

                                <div class="flex flex-col gap-2">
                                    <label for="email" class="font-medium text-surface-900 dark:text-surface-0"> Email Address <span class="text-red-500">*</span> </label>
                                    <input pInputText id="email" type="email" [(ngModel)]="info.email" placeholder="email@example.com" class="w-full" />
                                </div>

                                <div class="flex flex-col gap-2">
                                    <label for="phone" class="font-medium text-surface-900 dark:text-surface-0"> Phone Number <span class="text-red-500">*</span> </label>
                                    <input pInputText id="phone" [(ngModel)]="info.phone" placeholder="+1 (555) 000-0000" class="w-full" />
                                </div>

                                <div class="flex flex-col gap-2">
                                    <label for="address" class="font-medium text-surface-900 dark:text-surface-0">Address</label>
                                    <input pInputText id="address" [(ngModel)]="info.address" placeholder="Street Address, City, State, Zip" class="w-full" />
                                </div>

                                <div class="flex flex-col gap-2">
                                    <label for="notes" class="font-medium text-surface-900 dark:text-surface-0">Additional Notes</label>
                                    <textarea pInputTextarea id="notes" [(ngModel)]="info.notes" rows="4" placeholder="Any specific requirements or questions?" class="w-full"></textarea>
                                </div>

                                <!-- File Upload Summary -->
                                @if (cart.quoteFile()) {
                                    <div class="p-4 border border-surface-200 dark:border-surface-700 rounded-lg bg-surface-50 dark:bg-surface-800">
                                        <div class="flex items-center gap-3">
                                            <i class="pi pi-file text-xl text-primary"></i>
                                            <div class="flex-1">
                                                <p class="font-medium text-surface-900 dark:text-surface-0">Personalization File Attached</p>
                                                <p class="text-sm text-surface-500">{{ cart.quoteFile()?.name }} ({{ formatFileSize(cart.quoteFile()?.size) }})</p>
                                            </div>
                                            <i class="pi pi-check-circle text-green-500"></i>
                                        </div>
                                    </div>
                                }

                                <div class="pt-4">
                                    <button pButton label="Submit Quote Request" icon="pi pi-check" class="w-full p-button-lg font-bold" (click)="finalizeQuote()" [loading]="loading" [disabled]="cart.items().length === 0"></button>

                                    <p class="text-sm text-surface-500 dark:text-surface-400 mt-4 text-center">By submitting, you agree to our terms and conditions. Our team will review your request and contact you within 24-48 hours.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <footer-widget />
            </div>
            <p-toast></p-toast>

            <!-- Success Modal -->
            <p-dialog [(visible)]="showSuccessModal" [modal]="true" [closable]="false" [style]="{ width: '450px' }" styleClass="p-fluid">
                <div class="flex flex-col items-center text-center pt-4">
                    <div class="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
                        <i class="pi pi-check text-4xl text-green-600"></i>
                    </div>
                    <h2 class="text-2xl font-bold text-surface-900 dark:text-surface-0 mb-2">Quote Request Received!</h2>
                    <p class="text-surface-600 dark:text-surface-200 mb-6 leading-relaxed">
                        Thank you for your request. We have sent a confirmation email to <strong>{{ info.email }}</strong> with your quote details.
                    </p>

                    <div class="w-full p-4 bg-surface-50 dark:bg-surface-800 rounded-lg mb-6">
                        <p class="text-sm text-surface-500 mb-1">Track your quote status:</p>
                        <a href="#" class="text-primary font-medium hover:underline break-all">https://imagocreations.com/track/Q-{{ generatedQuoteId }}</a>
                    </div>

                    <div class="flex flex-col gap-3 w-full">
                        <button pButton label="Continue Shopping" class="p-button-outlined" routerLink="/"></button>
                    </div>
                </div>
            </p-dialog>
        </div>
    `
})
export class QuoteCustomerInfo implements OnInit {
    cart = inject(CartService);
    router = inject(Router);
    messageService = inject(MessageService);
    seoService = inject(SeoService);
    quoteService = inject(QuoteService);

    info: CustomerInfo = {
        companyName: '',
        contactPerson: '',
        email: '',
        phone: '',
        address: '',
        notes: ''
    };

    loading = false;
    showSuccessModal = false;
    quoteResponse: any = null;
    generatedQuoteId = Math.floor(100000 + Math.random() * 900000);

    ngOnInit() {
        this.seoService.updateTitle('Request a Quote - Imago Creations');
        this.seoService.updateUrl('https://imagocreations.com/quote-info');

        // Redirect if cart is empty
        if (this.cart.items().length === 0) {
            this.router.navigate(['/cart']);
        }

        // Pre-fill with saved customer info if available
        const savedInfo = this.cart.customerInfo();
        if (savedInfo) {
            this.info = { ...savedInfo };
        }
    }

    formatFileSize(bytes?: number): string {
        if (!bytes) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    finalizeQuote() {
        if (!this.validateForm()) {
            return;
        }

        if (this.cart.items().length === 0) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Empty Cart',
                detail: 'Please add items to cart first'
            });
            return;
        }

        this.loading = true;
        const file = this.cart.quoteFile();

        if (file) {
            this.quoteService.uploadFile(file).subscribe({
                next: (res) => {
                    this.submitQuote(res.secure_url);
                },
                error: (error) => {
                    console.error('Error uploading file:', error);
                    this.loading = false;
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Upload Failed',
                        detail: 'Failed to upload personalization file. Please try again.',
                        life: 5000
                    });
                }
            });
        } else {
            this.submitQuote();
        }
    }

    submitQuote(fileUrl?: string) {
        // Usar el nuevo método helper para crear la cotización con la URL del archivo
        const quoteData = this.quoteService.createQuoteFromCart(this.cart.items(), this.info, this.info.notes, fileUrl);

        // Enviar a la API
        this.quoteService.createQuote(quoteData).subscribe({
            next: (response) => {
                this.quoteResponse = response;
                this.loading = false;
                this.showSuccessModal = true;

                // Guardar información del cliente
                this.cart.setCustomerInfo(this.info);

                // Limpiar el carrito después de enviar la cotización
                this.cart.clearCart();

                this.messageService.add({
                    severity: 'success',
                    summary: 'Quote Submitted',
                    detail: `Quote #${response.quoteNumber} has been created successfully`,
                    life: 5000
                });
            },
            error: (error) => {
                console.error('Error creating quote:', error);
                this.loading = false;

                let errorMessage = 'Failed to submit quote request';
                if (error.error?.message) {
                    errorMessage = Array.isArray(error.error.message) ? error.error.message.join(', ') : error.error.message;
                }

                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: errorMessage,
                    life: 5000
                });
            }
        });
    }

    validateForm(): boolean {
        if (!this.info.companyName?.trim()) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Missing Information',
                detail: 'Company Name is required'
            });
            return false;
        }

        if (!this.info.contactPerson?.trim()) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Missing Information',
                detail: 'Contact Person is required'
            });
            return false;
        }

        if (!this.info.email?.trim()) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Missing Information',
                detail: 'Email Address is required'
            });
            return false;
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(this.info.email)) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Invalid Email',
                detail: 'Please enter a valid email address'
            });
            return false;
        }

        if (!this.info.phone?.trim()) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Missing Information',
                detail: 'Phone Number is required'
            });
            return false;
        }

        return true;
    }

    viewQuoteDetails() {
        if (this.quoteResponse?.id) {
            // Aquí puedes navegar a una página de detalles de cotización
            // o mostrar más información en un modal
            this.router.navigate(['/quote', this.quoteResponse.id]);
            this.showSuccessModal = false;
        }
    }
}
