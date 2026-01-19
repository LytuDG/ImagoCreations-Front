import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { QuoteService } from '@/core/services/quote.service';
import { Quote } from '@/core/models/quote/quote';
import { TagModule } from 'primeng/tag';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { SeoService } from '@/core/services/seo.service';
import { TopbarWidget } from '../landing/components/topbarwidget';
import { FooterWidget } from '../landing/components/footerwidget';
import { TimelineModule } from 'primeng/timeline';
import { QuoteResponse, QuoteStatusEnum } from '@/core/models/quote/quote';

import { DialogModule } from 'primeng/dialog';
import { Textarea } from 'primeng/textarea';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-tracking',
    standalone: true,
    imports: [CommonModule, RouterModule, TagModule, ProgressSpinnerModule, CardModule, ButtonModule, TimelineModule, TopbarWidget, FooterWidget, Textarea, ConfirmDialogModule, ToastModule, DialogModule, FormsModule],
    providers: [ConfirmationService, MessageService],
    template: `
        <div class="bg-surface-0 dark:bg-surface-900 min-h-screen">
            <div id="tracking" class="landing-wrapper overflow-hidden">
                <topbar-widget class="fixed w-full top-0 left-0 z-50 bg-white dark:bg-surface-900 shadow-sm py-4 px-6 lg:px-20 flex items-center justify-between" />

                <div class="pt-48 px-4 md:px-6 lg:px-20 pb-8 min-h-[calc(100vh-400px)]">
                    <div class="max-w-4xl mx-auto">
                        <div *ngIf="loading" class="flex justify-center items-center py-20">
                            <p-progressSpinner ariaLabel="loading"></p-progressSpinner>
                        </div>

                        <div *ngIf="error" class="text-center py-16">
                            <i class="pi pi-exclamation-circle text-6xl text-red-500 mb-4"></i>
                            <h2 class="text-2xl font-bold text-surface-900 dark:text-surface-0 mb-2">Quote Not Found</h2>
                            <p class="text-surface-600 dark:text-surface-200 mb-6">The quote you are looking for does not exist or has expired.</p>
                            <button pButton label="Go Home" routerLink="/" icon="pi pi-home"></button>
                        </div>

                        <div *ngIf="!loading && !error && quote" class="animate-fade-in">
                            <!-- Header -->
                            <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                                <div>
                                    <h1 class="text-3xl font-bold text-surface-900 dark:text-surface-0">Quote Tracking</h1>
                                    <p class="text-surface-500 dark:text-surface-400 mt-1">Order #{{ quote.quoteNumber || 'PENDING' }}</p>
                                </div>
                                <!-- Status Badge -->
                                <p-tag [value]="quote.status || 'PENDING'" [severity]="getSeverity(quote.status)" class="text-lg px-4 py-2"></p-tag>
                            </div>

                            <!-- Content Grid -->
                            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <!-- Main Info (Left) -->
                                <div class="lg:col-span-2 space-y-6">
                                    <!-- Items Card -->
                                    <div class="surface-card p-6 rounded-xl bg-surface-0 dark:bg-surface-900 shadow-sm border border-surface-200 dark:border-surface-800">
                                        <h3 class="text-xl font-semibold mb-4 text-surface-900 dark:text-surface-0">Items</h3>
                                        <div class="space-y-4">
                                            <div *ngFor="let item of quoteItemsFormatted" class="flex flex-col sm:flex-row gap-4 py-4 border-b border-surface-100 dark:border-surface-800 last:border-0">
                                                <!-- Image mock or placeholder if available in product -->
                                                <div class="w-20 h-20 rounded-lg bg-surface-100 dark:bg-surface-800 flex-shrink-0 overflow-hidden">
                                                    <img *ngIf="item.product?.picture" [src]="item.product.picture" class="w-full h-full object-cover" />
                                                    <div *ngIf="!item.product?.picture" class="w-full h-full flex items-center justify-center text-surface-400">
                                                        <i class="pi pi-image text-2xl"></i>
                                                    </div>
                                                </div>

                                                <div class="flex-1">
                                                    <div class="flex justify-between items-start">
                                                        <div>
                                                            <h4 class="font-medium text-lg text-surface-900 dark:text-surface-0">{{ item.productName }}</h4>
                                                            <p class="text-sm text-surface-500 mb-2">{{ item.productDescription }}</p>
                                                        </div>
                                                        <div class="text-right">
                                                            <div class="font-bold text-lg text-surface-900 dark:text-surface-0" *ngIf="showPrices()">\${{ item.totalPrice | number: '1.2-2' }}</div>
                                                            <div class="text-sm text-surface-500" *ngIf="showPrices()">\${{ item.unitPrice | number: '1.2-2' }} / unit</div>
                                                        </div>
                                                    </div>

                                                    <!-- Variants / Attributes -->
                                                    <div class="flex flex-wrap gap-2 mt-2">
                                                        <div *ngFor="let attr of item.attributes" class="text-xs px-2 py-1 bg-surface-100 dark:bg-surface-800 rounded text-surface-600 dark:text-surface-300">
                                                            <span class="font-semibold">{{ attr.name }}:</span> {{ attr.value }}
                                                        </div>
                                                        <div class="text-xs px-2 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded font-semibold">Qty: {{ item.quantity }}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="flex justify-between items-center mt-6 pt-6 border-t border-surface-100 dark:border-surface-800" *ngIf="showPrices()">
                                            <span class="font-bold text-lg text-surface-900 dark:text-surface-0">Total Amount</span>
                                            <span class="font-bold text-2xl text-primary">\${{ quote.totalAmount || 0 | number: '1.2-2' }}</span>
                                        </div>
                                    </div>

                                    <!-- Action Buttons for SENT/TO_PAY status -->
                                    <div *ngIf="canTakeAction()" class="surface-card p-6 rounded-xl bg-surface-0 dark:bg-surface-900 shadow-sm border border-surface-200 dark:border-surface-800 slide-in-bottom">
                                        <h3 class="text-xl font-semibold mb-4 text-surface-900 dark:text-surface-0">Actions</h3>
                                        <p class="text-surface-600 dark:text-surface-400 mb-6">Please review the quote details above. You can approve to proceed to payment or reject if it doesn't meet your needs.</p>

                                        <div class="flex flex-col sm:flex-row gap-4">
                                            <button pButton label="Approve Quote" icon="pi pi-check" class="flex-1 p-button-success" (click)="confirmAction('approve')"></button>
                                            <button pButton label="Request Changes" icon="pi pi-pencil" class="flex-1 p-button-warning p-button-outlined" (click)="confirmAction('changes')"></button>
                                            <button pButton label="Reject Quote" icon="pi pi-times" class="flex-1 p-button-danger p-button-outlined" (click)="confirmAction('reject')"></button>
                                        </div>
                                    </div>

                                    <!-- Approved Message -->
                                    <div *ngIf="quote.status === 'approved'" class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6 text-center">
                                        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 mb-4">
                                            <i class="pi pi-check text-2xl"></i>
                                        </div>
                                        <h3 class="text-xl font-bold text-green-800 dark:text-green-200 mb-2">Quote Approved!</h3>
                                        <p class="text-green-700 dark:text-green-300 max-w-lg mx-auto">Thank you for approving this quote. Our team will proceed with the next steps shortly. You will receive an update via email.</p>
                                    </div>

                                    <!-- Rejected Message -->
                                    <div *ngIf="quote.status === 'rejected'" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
                                        <i class="pi pi-times-circle text-4xl text-red-500 mb-2"></i>
                                        <h3 class="text-xl font-bold text-red-800 dark:text-red-200">Quote Rejected</h3>
                                    </div>
                                </div>

                                <!-- Sidebar (Right) -->
                                <div class="space-y-6">
                                    <!-- Customer Info -->
                                    <div class="surface-card p-6 rounded-xl bg-surface-0 dark:bg-surface-900 shadow-sm border border-surface-200 dark:border-surface-800">
                                        <h3 class="text-lg font-semibold mb-4 text-surface-900 dark:text-surface-0">Customer Details</h3>
                                        <div class="space-y-3 text-sm">
                                            <div>
                                                <span class="block text-surface-500">Contact</span>
                                                <span class="font-medium text-surface-900 dark:text-surface-0">{{ quote.contactName }}</span>
                                                <span class="block text-xs text-surface-500" *ngIf="quote.companyName">{{ quote.companyName }}</span>
                                            </div>
                                            <div>
                                                <span class="block text-surface-500">Email</span>
                                                <span class="font-medium text-surface-900 dark:text-surface-0">{{ quote.email }}</span>
                                            </div>
                                            <div>
                                                <span class="block text-surface-500">Phone</span>
                                                <span class="font-medium text-surface-900 dark:text-surface-0">{{ quote.phone }}</span>
                                            </div>
                                            <div *ngIf="quote.address">
                                                <span class="block text-surface-500">Shipping Address</span>
                                                <span class="font-medium text-surface-900 dark:text-surface-0">{{ quote.address }}</span>
                                            </div>
                                            <div *ngIf="quote.notes" class="pt-2 border-t border-surface-100 dark:border-surface-800 mt-2">
                                                <span class="block text-surface-500">Notes</span>
                                                <p class="text-surface-900 dark:text-surface-0 italic">{{ quote.notes }}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Timeline/Status Progress -->
                                    <div class="surface-card p-6 rounded-xl bg-surface-0 dark:bg-surface-900 shadow-sm border border-surface-200 dark:border-surface-800">
                                        <h3 class="text-xl font-semibold mb-6 text-surface-900 dark:text-surface-0">Status History</h3>
                                        <p-timeline [value]="events" align="left">
                                            <ng-template pTemplate="content" let-event>
                                                <div class="flex flex-col">
                                                    <span class="font-medium" [ngClass]="{ 'text-primary': isCurrentStatus(event.status) }">{{ event.label }}</span>
                                                    <span class="text-xs text-surface-500">{{ event.description }}</span>
                                                </div>
                                            </ng-template>
                                            <ng-template pTemplate="marker" let-event>
                                                <span
                                                    class="flex w-8 h-8 items-center justify-center rounded-full border-2 z-10 shadow-sm"
                                                    [ngClass]="{
                                                        'bg-primary border-primary text-white': isStepCompleted(event.status),
                                                        'bg-surface-0 dark:bg-surface-900 border-surface-300 dark:border-surface-600 text-surface-300': !isStepCompleted(event.status)
                                                    }"
                                                >
                                                    <i [class]="event.icon"></i>
                                                </span>
                                            </ng-template>
                                        </p-timeline>
                                    </div>

                                    <!-- Actions -->
                                    <div class="surface-card p-6 rounded-xl bg-surface-0 dark:bg-surface-900 shadow-sm border border-surface-200 dark:border-surface-800">
                                        <h3 class="text-lg font-semibold mb-4 text-surface-900 dark:text-surface-0">Need Help?</h3>
                                        <p class="text-sm text-surface-600 dark:text-surface-400 mb-4">If you have questions about your quote status, please contact us.</p>
                                        <button pButton label="Contact Support" class="w-full p-button-outlined" icon="pi pi-envelope"></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <footer-widget />
            </div>
            <p-toast></p-toast>
            <p-confirmDialog header="Confirmation" icon="pi pi-exclamation-triangle"></p-confirmDialog>

            <p-dialog header="Reason for Update" [(visible)]="showReasonDialog" [modal]="true" [style]="{ width: '90vw', maxWidth: '500px' }">
                <div class="flex flex-col gap-2">
                    <label for="reason" class="font-medium text-surface-700 dark:text-surface-200">Please let us know why (Optional)</label>
                    <textarea id="reason" pInputTextarea [(ngModel)]="statusReason" rows="4" class="w-full" placeholder="Enter your comments here..."></textarea>
                </div>
                <ng-template pTemplate="footer">
                    <button pButton label="Cancel" icon="pi pi-times" class="p-button-text" (click)="showReasonDialog = false"></button>
                    <button pButton label="Submit" icon="pi pi-check" (click)="submitReason()"></button>
                </ng-template>
            </p-dialog>
        </div>
    `
})
export class Tracking implements OnInit {
    quoteService = inject(QuoteService);
    route = inject(ActivatedRoute);
    seoService = inject(SeoService);
    confirmationService = inject(ConfirmationService);
    messageService = inject(MessageService);

    loading = true;
    error = false;
    quote: QuoteResponse | null = null;
    quoteItemsFormatted: any[] = [];

    // Dialog state
    showReasonDialog = false;
    statusReason = '';
    pendingAction: 'reject' | 'changes' | null = null;

    // Define timeline events explicitly
    events = [
        { status: QuoteStatusEnum.DRAFT, label: 'Draft', icon: 'pi pi-file', description: 'Quote created' },
        { status: QuoteStatusEnum.SENT, label: 'Sent', icon: 'pi pi-send', description: 'Available for approval' },
        { status: QuoteStatusEnum.APPROVED, label: 'Approved', icon: 'pi pi-check', description: 'Approved by client' },
        { status: QuoteStatusEnum.TO_PAY, label: 'Payment', icon: 'pi pi-wallet', description: 'Payment pending' },
        { status: QuoteStatusEnum.PAID, label: 'Paid', icon: 'pi pi-verified', description: 'Process complete' }
    ];

    ngOnInit() {
        this.seoService.updateTitle('Track Quote - Imago Creations');

        this.route.params.subscribe((params) => {
            const token = params['token'];
            if (token) {
                this.loadQuote(token);
            } else {
                this.error = true;
                this.loading = false;
            }
        });
    }

    loadQuote(token: string) {
        this.quoteService.getQuoteByToken(token).subscribe({
            next: (data) => {
                this.quote = data;
                this.formatQuoteItems(data);
                this.loading = false;
            },
            error: (err) => {
                console.error(err);
                this.error = true;
                this.loading = false;
            }
        });
    }

    /**
     * Format Items for Display
     * Groups: Product Name + Attributes + Quantity + Price
     */
    formatQuoteItems(quote: QuoteResponse) {
        this.quoteItemsFormatted = (quote.quoteItems || []).map((item) => {
            const attributes = (item.quoteItemAttributeValue || [])
                .map((qiav) => ({
                    name: qiav.productAttributeValue?.attribute?.name,
                    value: qiav.productAttributeValue?.attributeValue?.value
                }))
                .filter((a) => a.name && a.value);

            return {
                id: item.id,
                productName: item.product?.name || 'Item',
                productDescription: item.product?.description,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                totalPrice: item.unitPrice * item.quantity,
                attributes: attributes, // List of {name, value}
                product: item.product
            };
        });
    }

    canTakeAction(): boolean {
        // Allow action only if status is SENT or TO_PAY, or draft if testing public logic?
        // Usually, client approves when status is SENT.
        if (!this.quote) return false;
        return [QuoteStatusEnum.SENT, QuoteStatusEnum.TO_PAY].includes(this.quote.status as QuoteStatusEnum);
    }

    confirmAction(action: 'approve' | 'reject' | 'changes') {
        if (action === 'approve') {
            this.confirmationService.confirm({
                message: 'Are you sure you want to approve this quote? This will proceed to the next step.',
                header: 'Approve Quote',
                icon: 'pi pi-check-circle',
                accept: () => {
                    this.executeStatusChange('approve', '');
                }
            });
        } else {
            // For reject or changes, open dialog
            this.pendingAction = action;
            this.statusReason = '';
            this.showReasonDialog = true;
        }
    }

    submitReason() {
        if (this.pendingAction) {
            this.executeStatusChange(this.pendingAction, this.statusReason);
            this.showReasonDialog = false;
        }
    }

    executeStatusChange(action: 'approve' | 'reject' | 'changes', notes: string) {
        if (!this.quote) return;

        let newStatus: QuoteStatusEnum;
        switch (action) {
            case 'approve':
                newStatus = QuoteStatusEnum.APPROVED;
                break;
            case 'reject':
                newStatus = QuoteStatusEnum.REJECTED;
                break;
            case 'changes':
                newStatus = QuoteStatusEnum.CHANGES_REQUESTED;
                break;
        }

        this.quoteService.updatePublicQuoteStatus(this.quote.publicToken, newStatus, notes).subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Quote status updated successfully' });
                // Optimistic update or reload
                if (this.quote) {
                    this.quote.status = newStatus;
                    if (notes) this.quote.notes = notes; // Update notes locally for visibility
                }
            },
            error: (err) => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Could not update status' });
                console.error(err);
            }
        });
    }

    getSeverity(status?: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | undefined {
        // Map backend statuses to PrimeNG severities
        switch (status) {
            case QuoteStatusEnum.APPROVED:
            case QuoteStatusEnum.PAID:
                return 'success';
            case QuoteStatusEnum.SENT:
            case QuoteStatusEnum.TO_PAY:
                return 'info';
            case QuoteStatusEnum.DRAFT:
                return 'secondary';
            case QuoteStatusEnum.REJECTED:
                return 'danger';
            case QuoteStatusEnum.CHANGES_REQUESTED:
                return 'warn';
            default:
                return 'secondary';
        }
    }

    isStepCompleted(stepStatus: string): boolean {
        // Simple logic: define an order and check index
        if (!this.quote?.status) return false;
        const statusOrder = [QuoteStatusEnum.DRAFT, QuoteStatusEnum.SENT, QuoteStatusEnum.APPROVED, QuoteStatusEnum.TO_PAY, QuoteStatusEnum.PAID];

        // Handle negative cases like Rejected separately or treat as end of line
        if (this.quote.status === QuoteStatusEnum.REJECTED || this.quote.status === QuoteStatusEnum.CHANGES_REQUESTED) {
            // Visualize differently maybe? For now let's just show progress up to SENT
            if (this.quote.status === QuoteStatusEnum.REJECTED && stepStatus === QuoteStatusEnum.SENT) return true;
        }

        const currentIdx = statusOrder.indexOf(this.quote.status as QuoteStatusEnum);
        const stepIdx = statusOrder.indexOf(stepStatus as QuoteStatusEnum);

        if (currentIdx === -1) return false; // Unknown status
        return currentIdx >= stepIdx;
    }

    isCurrentStatus(stepStatus: string): boolean {
        return this.quote?.status === stepStatus;
    }

    showPrices(): boolean {
        if (!this.quote?.status) return false;
        const visibleStatuses = [QuoteStatusEnum.SENT, QuoteStatusEnum.APPROVED, QuoteStatusEnum.TO_PAY, QuoteStatusEnum.PAID, QuoteStatusEnum.CONVERTED_TO_ORDER];
        return visibleStatuses.includes(this.quote.status as QuoteStatusEnum);
    }
}
