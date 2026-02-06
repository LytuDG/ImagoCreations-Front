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
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

@Component({
    selector: 'app-quote-customer-info',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        ButtonModule,
        InputTextModule,
        TextareaModule,
        DialogModule,
        ProgressSpinnerModule,
        TopbarWidget,
        FooterWidget,
        ToastModule,
        TranslocoModule
    ],
    providers: [MessageService],
    template: `
        <div class="bg-surface-0 dark:bg-surface-900 min-h-screen">
            <div id="quote-info" class="landing-wrapper overflow-hidden">
                <topbar-widget class="fixed w-full top-0 left-0 z-50 bg-white dark:bg-surface-900 shadow-sm py-4 px-6 lg:px-20 flex items-center justify-between" />

                <div class="pt-48 px-4 md:px-6 lg:px-20 pb-8 min-h-[calc(100vh-400px)]">
                    <div class="max-w-2xl mx-auto">
                        <div class="mb-8">
                            <button pButton
                                    [label]="'quoteInfo.buttons.back' | transloco"
                                    icon="pi pi-arrow-left"
                                    class="p-button-text pl-0"
                                    routerLink="/cart"></button>
                            <h1 class="text-3xl font-bold text-surface-900 dark:text-surface-0 mt-2">
                                {{ 'quoteInfo.title' | transloco }}
                            </h1>
                            <p class="text-surface-600 dark:text-surface-200">
                                {{ 'quoteInfo.description' | transloco }}
                            </p>
                        </div>

                        <!-- Customer Information Form -->
                        <div class="surface-card p-8 rounded-xl bg-surface-0 dark:bg-surface-900 shadow-md">
                            <h2 class="text-xl font-bold text-surface-900 dark:text-surface-0 mb-6">
                                {{ 'quoteInfo.form.title' | transloco }}
                            </h2>

                            <div class="space-y-6">
                                <div class="flex flex-col gap-2">
                                    <label for="companyName" class="font-medium text-surface-900 dark:text-surface-0">
                                        {{ 'quoteInfo.form.companyName' | transloco }} <span class="text-red-500">*</span>
                                    </label>
                                    <input pInputText
                                           id="companyName"
                                           [(ngModel)]="info.companyName"
                                           [placeholder]="'quoteInfo.form.placeholders.company' | transloco"
                                           class="w-full" />
                                </div>

                                <div class="flex flex-col gap-2">
                                    <label for="contactPerson" class="font-medium text-surface-900 dark:text-surface-0">
                                        {{ 'quoteInfo.form.contactPerson' | transloco }} <span class="text-red-500">*</span>
                                    </label>
                                    <input pInputText
                                           id="contactPerson"
                                           [(ngModel)]="info.contactPerson"
                                           [placeholder]="'quoteInfo.form.placeholders.person' | transloco"
                                           class="w-full" />
                                </div>

                                <div class="flex flex-col gap-2">
                                    <label for="email" class="font-medium text-surface-900 dark:text-surface-0">
                                        {{ 'quoteInfo.form.email' | transloco }} <span class="text-red-500">*</span>
                                    </label>
                                    <input pInputText
                                           id="email"
                                           type="email"
                                           [(ngModel)]="info.email"
                                           [placeholder]="'quoteInfo.form.placeholders.email' | transloco"
                                           class="w-full" />
                                </div>

                                <div class="flex flex-col gap-2">
                                    <label for="phone" class="font-medium text-surface-900 dark:text-surface-0">
                                        {{ 'quoteInfo.form.phone' | transloco }} <span class="text-red-500">*</span>
                                    </label>
                                    <input pInputText
                                           id="phone"
                                           [(ngModel)]="info.phone"
                                           [placeholder]="'quoteInfo.form.placeholders.phone' | transloco"
                                           class="w-full" />
                                </div>

                                <div class="flex flex-col gap-2">
                                    <label for="address" class="font-medium text-surface-900 dark:text-surface-0">
                                        {{ 'quoteInfo.form.address' | transloco }}
                                    </label>
                                    <input pInputText
                                           id="address"
                                           [(ngModel)]="info.address"
                                           [placeholder]="'quoteInfo.form.placeholders.address' | transloco"
                                           class="w-full" />
                                </div>

                                <div class="flex flex-col gap-2">
                                    <label for="notes" class="font-medium text-surface-900 dark:text-surface-0">
                                        {{ 'quoteInfo.form.notes' | transloco }}
                                    </label>
                                    <textarea pInputTextarea
                                              id="notes"
                                              [(ngModel)]="info.notes"
                                              rows="4"
                                              [placeholder]="'quoteInfo.form.placeholders.notes' | transloco"
                                              class="w-full"></textarea>
                                </div>

                                <!-- File Upload Summary -->
                                @if (cart.quoteFile()) {
                                    <div class="p-4 border border-surface-200 dark:border-surface-700 rounded-lg bg-surface-50 dark:bg-surface-800">
                                        <div class="flex items-center gap-3">
                                            <i class="pi pi-file text-xl text-primary"></i>
                                            <div class="flex-1">
                                                <p class="font-medium text-surface-900 dark:text-surface-0">
                                                    {{ 'quoteInfo.file.attached' | transloco }}
                                                </p>
                                                <p class="text-sm text-surface-500">
                                                    {{ 'quoteInfo.file.size' | transloco:{name: cart.quoteFile()?.name, size: formatFileSize(cart.quoteFile()?.size)} }}
                                                </p>
                                            </div>
                                            <i class="pi pi-check-circle text-green-500"></i>
                                        </div>
                                    </div>
                                }

                                <div class="pt-4">
                                    <button pButton
                                            [label]="'quoteInfo.buttons.submit' | transloco"
                                            icon="pi pi-check"
                                            class="w-full p-button-lg font-bold"
                                            (click)="finalizeQuote()"
                                            [loading]="loading"
                                            [disabled]="cart.items().length === 0"></button>

                                    <p class="text-sm text-surface-500 dark:text-surface-400 mt-4 text-center">
                                        {{ 'quoteInfo.terms' | transloco }}
                                    </p>
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
                    <h2 class="text-2xl font-bold text-surface-900 dark:text-surface-0 mb-2">
                        {{ 'quoteInfo.success.title' | transloco }}
                    </h2>
                    <p class="text-surface-600 dark:text-surface-200 mb-6 leading-relaxed" [innerHTML]="'quoteInfo.success.message' | transloco:{email: info.email}"></p>

                    <div class="w-full p-4 bg-surface-50 dark:bg-surface-800 rounded-lg mb-6">
                        <p class="text-sm text-surface-500 mb-1">
                            {{ 'quoteInfo.success.track' | transloco }}
                        </p>
                        <a [routerLink]="['/track', quoteResponse?.publicToken]"
                           class="text-primary font-medium hover:underline break-all"
                           target="_blank">
                            https://imagocreations.com/track/{{ quoteResponse?.publicToken }}
                        </a>
                    </div>

                    <div class="flex flex-col gap-3 w-full">
                        <button pButton
                                [label]="'quoteInfo.success.continue' | transloco"
                                class="p-button-outlined"
                                routerLink="/"></button>
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
    translocoService = inject(TranslocoService); // <-- Añade esto

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

        if (this.cart.items().length === 0) {
            this.router.navigate(['/cart']);
        }

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
                detail: this.translocoService.translate('quoteInfo.validation.emptyCart')
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
                        summary: this.translocoService.translate('quoteInfo.messages.uploadFailed'),
                        detail: this.translocoService.translate('quoteInfo.messages.uploadError'),
                        life: 5000
                    });
                }
            });
        } else {
            this.submitQuote();
        }
    }

    submitQuote(fileUrl?: string) {
        const quoteData = this.quoteService.createQuoteFromCart(this.cart.items(), this.info, this.info.notes, fileUrl);

        this.quoteService.createQuote(quoteData).subscribe({
            next: (response) => {
                this.quoteResponse = response;
                this.loading = false;
                this.showSuccessModal = true;

                this.cart.setCustomerInfo(this.info);
                this.cart.clearCart();

                this.messageService.add({
                    severity: 'success',
                    summary: this.translocoService.translate('quoteInfo.messages.quoteSubmitted'),
                    detail: this.translocoService.translate('quoteInfo.messages.quoteCreated', { number: response.quoteNumber }),
                    life: 5000
                });
            },
            error: (error) => {
                console.error('Error creating quote:', error);
                this.loading = false;

                let errorMessage = this.translocoService.translate('quoteInfo.messages.failed');
                if (error.error?.message) {
                    errorMessage = Array.isArray(error.error.message) ? error.error.message.join(', ') : error.error.message;
                }

                this.messageService.add({
                    severity: 'error',
                    summary: this.translocoService.translate('quoteInfo.messages.error'),
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
                summary: this.translocoService.translate('quoteInfo.messages.missingInfo'),
                detail: `${this.translocoService.translate('quoteInfo.form.companyName')} ${this.translocoService.translate('quoteInfo.validation.required')}`
            });
            return false;
        }

        if (!this.info.contactPerson?.trim()) {
            this.messageService.add({
                severity: 'warn',
                summary: this.translocoService.translate('quoteInfo.messages.missingInfo'),
                detail: `${this.translocoService.translate('quoteInfo.form.contactPerson')} ${this.translocoService.translate('quoteInfo.validation.required')}`
            });
            return false;
        }

        if (!this.info.email?.trim()) {
            this.messageService.add({
                severity: 'warn',
                summary: this.translocoService.translate('quoteInfo.messages.missingInfo'),
                detail: `${this.translocoService.translate('quoteInfo.form.email')} ${this.translocoService.translate('quoteInfo.validation.required')}`
            });
            return false;
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(this.info.email)) {
            this.messageService.add({
                severity: 'warn',
                summary: this.translocoService.translate('quoteInfo.messages.invalidEmail'),
                detail: this.translocoService.translate('quoteInfo.validation.invalidEmail')
            });
            return false;
        }

        if (!this.info.phone?.trim()) {
            this.messageService.add({
                severity: 'warn',
                summary: this.translocoService.translate('quoteInfo.messages.missingInfo'),
                detail: `${this.translocoService.translate('quoteInfo.form.phone')} ${this.translocoService.translate('quoteInfo.validation.required')}`
            });
            return false;
        }

        return true;
    }

    viewQuoteDetails() {
        if (this.quoteResponse?.id) {
            this.router.navigate(['/quote', this.quoteResponse.id]);
            this.showSuccessModal = false;
        }
    }
}
