import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CartService, CustomerInfo } from '@/core/services/cart.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { DialogModule } from 'primeng/dialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TopbarWidget } from '../landing/components/topbarwidget';
import { FooterWidget } from '../landing/components/footerwidget';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

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
                    <div class="max-w-3xl mx-auto">
                        <div class="mb-8">
                            <button pButton label="Back to Cart" icon="pi pi-arrow-left" class="p-button-text pl-0" routerLink="/cart"></button>
                            <h1 class="text-3xl font-bold text-surface-900 dark:text-surface-0 mt-2">Customer Information</h1>
                            <p class="text-surface-600 dark:text-surface-200">Please provide your details to finalize the quote request.</p>
                        </div>

                        <div class="surface-card p-8 rounded-xl bg-surface-0 dark:bg-surface-900 shadow-md">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div class="flex flex-col gap-2">
                                    <label for="companyName" class="font-medium text-surface-900 dark:text-surface-0">Company Name *</label>
                                    <input pInputText id="companyName" [(ngModel)]="info.companyName" placeholder="Your Company" class="w-full" />
                                </div>
                                <div class="flex flex-col gap-2">
                                    <label for="contactPerson" class="font-medium text-surface-900 dark:text-surface-0">Contact Person *</label>
                                    <input pInputText id="contactPerson" [(ngModel)]="info.contactPerson" placeholder="Full Name" class="w-full" />
                                </div>
                                <div class="flex flex-col gap-2">
                                    <label for="email" class="font-medium text-surface-900 dark:text-surface-0">Email Address *</label>
                                    <input pInputText id="email" [(ngModel)]="info.email" placeholder="email@example.com" class="w-full" />
                                </div>
                                <div class="flex flex-col gap-2">
                                    <label for="phone" class="font-medium text-surface-900 dark:text-surface-0">Phone Number *</label>
                                    <input pInputText id="phone" [(ngModel)]="info.phone" placeholder="+1 (555) 000-0000" class="w-full" />
                                </div>
                                <div class="flex flex-col gap-2 md:col-span-2">
                                    <label for="address" class="font-medium text-surface-900 dark:text-surface-0">Address</label>
                                    <input pInputText id="address" [(ngModel)]="info.address" placeholder="Street Address, City, State, Zip" class="w-full" />
                                </div>
                                <div class="flex flex-col gap-2 md:col-span-2">
                                    <label for="notes" class="font-medium text-surface-900 dark:text-surface-0">Additional Notes</label>
                                    <textarea pInputTextarea id="notes" [(ngModel)]="info.notes" rows="4" placeholder="Any specific requirements or questions?" class="w-full"></textarea>
                                </div>
                            </div>

                            <div class="mt-8 flex justify-end">
                                <button pButton label="Finalize Quote Request" icon="pi pi-check" class="p-button-lg font-bold" (click)="finalizeQuote()" [loading]="loading"></button>
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
                        <a href="#" class="text-primary font-medium hover:underline break-all">https://imagocreations.com/track/Q-{{ quoteId }}</a>
                    </div>

                    <div class="flex flex-col gap-3 w-full">
                        <button pButton label="Continue Shopping" class="p-button-outlined" routerLink="/"></button>
                    </div>
                </div>
            </p-dialog>
        </div>
    `
})
export class QuoteCustomerInfo {
    cart = inject(CartService);
    router = inject(Router);
    messageService = inject(MessageService);

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
    quoteId = Math.floor(100000 + Math.random() * 900000);

    ngOnInit() {
        // Redirect if cart is empty
        if (this.cart.items().length === 0) {
            this.router.navigate(['/cart']);
        }
    }

    finalizeQuote() {
        if (!this.validateForm()) {
            return;
        }

        this.loading = true;

        // Simulate API call
        setTimeout(() => {
            this.loading = false;
            this.showSuccessModal = true;
            this.cart.setCustomerInfo(this.info);
            this.cart.clearCart();
        }, 1500);
    }

    validateForm(): boolean {
        if (!this.info.companyName || !this.info.contactPerson || !this.info.email || !this.info.phone) {
            this.messageService.add({ severity: 'warn', summary: 'Missing Information', detail: 'Please fill in all required fields (*)' });
            return false;
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(this.info.email)) {
            this.messageService.add({ severity: 'warn', summary: 'Invalid Email', detail: 'Please enter a valid email address' });
            return false;
        }

        return true;
    }
}
