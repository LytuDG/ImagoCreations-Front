import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { QuoteService } from '@/core/services/quote.service';
import { QuoteStatusEnum, QuoteResponse } from '@/core/models/quote/quote';
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
import { DialogModule } from 'primeng/dialog';
import { Textarea } from 'primeng/textarea';
import { FormsModule } from '@angular/forms';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

@Component({
    selector: 'app-tracking',
    standalone: true,
    imports: [
        CommonModule, RouterModule, TagModule, ProgressSpinnerModule, CardModule,
        ButtonModule, TimelineModule, TopbarWidget, FooterWidget, Textarea,
        ConfirmDialogModule, ToastModule, DialogModule, FormsModule,
        TranslocoModule  // <-- Añade esto
    ],
    providers: [ConfirmationService, MessageService],
    template: `
        <div class="bg-surface-0 dark:bg-surface-900 min-h-screen">
            <div id="tracking" class="landing-wrapper overflow-hidden">
                <topbar-widget class="fixed w-full top-0 left-0 z-50 bg-white dark:bg-surface-900 shadow-sm py-4 px-6 lg:px-20 flex items-center justify-between" />

                <div class="pt-48 px-4 md:px-6 lg:px-20 pb-8 min-h-[calc(100vh-400px)]">
                    <div class="max-w-4xl mx-auto">
                        <!-- Loading State -->
                        <div *ngIf="loading" class="flex justify-center items-center py-20">
                            <p-progressSpinner ariaLabel="loading"></p-progressSpinner>
                        </div>

                        <!-- Error State -->
                        <div *ngIf="error" class="text-center py-16">
                            <i class="pi pi-exclamation-circle text-6xl text-red-500 mb-4"></i>
                            <h2 class="text-2xl font-bold text-surface-900 dark:text-surface-0 mb-2">
                                {{ 'tracking.notFound.title' | transloco }}
                            </h2>
                            <p class="text-surface-600 dark:text-surface-200 mb-6">
                                {{ 'tracking.notFound.message' | transloco }}
                            </p>
                            <button pButton
                                    [label]="'tracking.notFound.button' | transloco"
                                    routerLink="/"
                                    icon="pi pi-home"></button>
                        </div>

                        <!-- Main Content -->
                        <div *ngIf="!loading && !error && quote" class="animate-fade-in">
                            <!-- Header -->
                            <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                                <div>
                                    <h1 class="text-3xl font-bold text-surface-900 dark:text-surface-0">
                                        {{ 'tracking.title' | transloco }}
                                    </h1>
                                    <p class="text-surface-500 dark:text-surface-400 mt-1">
                                        {{ 'tracking.subtitle' | transloco:{number: (quote.quoteNumber || 'PENDING')} }}
                                    </p>
                                </div>
                                <!-- Status Badge -->
                                <p-tag
                                    [value]="getTranslatedStatus(quote.status)"
                                    [severity]="getSeverity(quote.status)"
                                    class="text-lg px-4 py-2"></p-tag>
                            </div>

                            <!-- Content Grid -->
                            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <!-- Main Info (Left) -->
                                <div class="lg:col-span-2 space-y-6">
                                    <!-- Items Card -->
                                    <div class="surface-card p-6 rounded-xl bg-surface-0 dark:bg-surface-900 shadow-sm border border-surface-200 dark:border-surface-800">
                                        <h3 class="text-xl font-semibold mb-4 text-surface-900 dark:text-surface-0">
                                            {{ 'tracking.sections.items' | transloco }}
                                        </h3>
                                        <div class="space-y-4">
                                            <div *ngFor="let item of quoteItemsFormatted" class="flex flex-col sm:flex-row gap-4 py-4 border-b border-surface-100 dark:border-surface-800 last:border-0">
                                                <div class="w-20 h-20 rounded-lg bg-surface-100 dark:bg-surface-800 shrink-0 overflow-hidden">
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
                                                            <div class="font-bold text-lg text-surface-900 dark:text-surface-0" *ngIf="showPrices()">
                                                                \${{ item.totalPrice | number: '1.2-2' }}
                                                            </div>
                                                            <div class="text-sm text-surface-500" *ngIf="showPrices()">
                                                                {{ 'tracking.pricing.unitPrice' | transloco:{price: (item.unitPrice | number:'1.2-2')} }}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <!-- Variants / Attributes -->
                                                    <div class="flex flex-wrap gap-2 mt-2">
                                                        <div *ngFor="let attr of item.attributes" class="text-xs px-2 py-1 bg-surface-100 dark:bg-surface-800 rounded text-surface-600 dark:text-surface-300">
                                                            <span class="font-semibold">{{ attr.name }}:</span> {{ attr.value }}
                                                        </div>
                                                        <div class="text-xs px-2 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded font-semibold">
                                                            {{ 'tracking.pricing.quantity' | transloco:{quantity: item.quantity} }}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="flex justify-between items-center mt-6 pt-6 border-t border-surface-100 dark:border-surface-800" *ngIf="showPrices()">
                                            <span class="font-bold text-lg text-surface-900 dark:text-surface-0">
                                                {{ 'tracking.pricing.totalAmount' | transloco }}
                                            </span>
                                            <span class="font-bold text-2xl text-primary">
                                                \${{ quote.totalAmount || 0 | number: '1.2-2' }}
                                            </span>
                                        </div>
                                    </div>

                                    <!-- Action Buttons -->
                                    <div *ngIf="canTakeAction()" class="surface-card p-6 rounded-xl bg-surface-0 dark:bg-surface-900 shadow-sm border border-surface-200 dark:border-surface-800 slide-in-bottom">
                                        <h3 class="text-xl font-semibold mb-4 text-surface-900 dark:text-surface-0">
                                            {{ 'tracking.sections.actions' | transloco }}
                                        </h3>
                                        <p class="text-surface-600 dark:text-surface-400 mb-6">
                                            {{ 'tracking.actions.description' | transloco }}
                                        </p>

                                        <div class="flex flex-col sm:flex-row gap-4">
                                            <button pButton
                                                    [label]="'tracking.actions.approve' | transloco"
                                                    icon="pi pi-check"
                                                    class="flex-1 p-button-success"
                                                    (click)="confirmAction('approve')"></button>
                                            <button pButton
                                                    [label]="'tracking.actions.changes' | transloco"
                                                    icon="pi pi-pencil"
                                                    class="flex-1 p-button-warning p-button-outlined"
                                                    (click)="confirmAction('changes')"></button>
                                            <button pButton
                                                    [label]="'tracking.actions.reject' | transloco"
                                                    icon="pi pi-times"
                                                    class="flex-1 p-button-danger p-button-outlined"
                                                    (click)="confirmAction('reject')"></button>
                                        </div>
                                    </div>

                                    <!-- Approved Message -->
                                    <div *ngIf="quote.status === 'approved'" class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6 text-center">
                                        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 mb-4">
                                            <i class="pi pi-check text-2xl"></i>
                                        </div>
                                        <h3 class="text-xl font-bold text-green-800 dark:text-green-200 mb-2">
                                            {{ 'tracking.messages.approved.title' | transloco }}
                                        </h3>
                                        <p class="text-green-700 dark:text-green-300 max-w-lg mx-auto">
                                            {{ 'tracking.messages.approved.message' | transloco }}
                                        </p>
                                    </div>

                                    <!-- Rejected Message -->
                                    <div *ngIf="quote.status === 'rejected'" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
                                        <i class="pi pi-times-circle text-4xl text-red-500 mb-2"></i>
                                        <h3 class="text-xl font-bold text-red-800 dark:text-red-200">
                                            {{ 'tracking.messages.rejected.title' | transloco }}
                                        </h3>
                                    </div>
                                </div>

                                <!-- Sidebar (Right) -->
                                <div class="space-y-6">
                                    <!-- Customer Info -->
                                    <div class="surface-card p-6 rounded-xl bg-surface-0 dark:bg-surface-900 shadow-sm border border-surface-200 dark:border-surface-800">
                                        <h3 class="text-lg font-semibold mb-4 text-surface-900 dark:text-surface-0">
                                            {{ 'tracking.sections.customerDetails' | transloco }}
                                        </h3>
                                        <div class="space-y-3 text-sm">
                                            <div>
                                                <span class="block text-surface-500">{{ 'tracking.customer.contact' | transloco }}</span>
                                                <span class="font-medium text-surface-900 dark:text-surface-0">{{ quote.contactName }}</span>
                                                <span class="block text-xs text-surface-500" *ngIf="quote.companyName">
                                                    {{ 'tracking.customer.company' | transloco }}: {{ quote.companyName }}
                                                </span>
                                            </div>
                                            <div>
                                                <span class="block text-surface-500">{{ 'tracking.customer.email' | transloco }}</span>
                                                <span class="font-medium text-surface-900 dark:text-surface-0">{{ quote.email }}</span>
                                            </div>
                                            <div>
                                                <span class="block text-surface-500">{{ 'tracking.customer.phone' | transloco }}</span>
                                                <span class="font-medium text-surface-900 dark:text-surface-0">{{ quote.phone }}</span>
                                            </div>
                                            <div *ngIf="quote.address">
                                                <span class="block text-surface-500">{{ 'tracking.customer.shippingAddress' | transloco }}</span>
                                                <span class="font-medium text-surface-900 dark:text-surface-0">{{ quote.address }}</span>
                                            </div>
                                            <div *ngIf="quote.notes" class="pt-2 border-t border-surface-100 dark:border-surface-800 mt-2">
                                                <span class="block text-surface-500">{{ 'tracking.customer.notes' | transloco }}</span>
                                                <p class="text-surface-900 dark:text-surface-0 italic">{{ quote.notes }}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Timeline/Status Progress -->
                                    <div class="surface-card p-6 rounded-xl bg-surface-0 dark:bg-surface-900 shadow-sm border border-surface-200 dark:border-surface-800">
                                        <h3 class="text-xl font-semibold mb-6 text-surface-900 dark:text-surface-0">
                                            {{ 'tracking.sections.statusHistory' | transloco }}
                                        </h3>
                                        <p-timeline [value]="timelineEvents" align="left">
                                            <ng-template pTemplate="content" let-event>
                                                <div class="flex flex-col">
                                                    <span class="font-medium" [ngClass]="{ 'text-primary': isCurrentStatus(event.status) }">
                                                        {{ event.label }}
                                                    </span>
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
                                        <h3 class="text-lg font-semibold mb-4 text-surface-900 dark:text-surface-0">
                                            {{ 'tracking.sections.help' | transloco }}
                                        </h3>
                                        <p class="text-sm text-surface-600 dark:text-surface-400 mb-4">
                                            If you have questions about your quote status, please contact us.
                                        </p>
                                        <button pButton
                                                [label]="'tracking.actions.contact' | transloco"
                                                class="w-full p-button-outlined"
                                                icon="pi pi-envelope"></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <footer-widget />
            </div>
            <p-toast></p-toast>
            <p-confirmDialog [header]="'tracking.dialog.approveHeader' | transloco" icon="pi pi-exclamation-triangle"></p-confirmDialog>

            <p-dialog [header]="'tracking.dialog.reason' | transloco"
                      [(visible)]="showReasonDialog"
                      [modal]="true"
                      [style]="{ width: '90vw', maxWidth: '500px' }">
                <div class="flex flex-col gap-2">
                    <label for="reason" class="font-medium text-surface-700 dark:text-surface-200">
                        {{ 'tracking.dialog.reason' | transloco }}
                    </label>
                    <textarea id="reason"
                              pInputTextarea
                              [(ngModel)]="statusReason"
                              rows="4"
                              class="w-full"
                              [placeholder]="'tracking.dialog.placeholder' | transloco"></textarea>
                </div>
                <ng-template pTemplate="footer">
                    <button pButton
                            [label]="'tracking.dialog.cancel' | transloco"
                            icon="pi pi-times"
                            class="p-button-text"
                            (click)="showReasonDialog = false"></button>
                    <button pButton
                            [label]="'tracking.dialog.submit' | transloco"
                            icon="pi pi-check"
                            (click)="submitReason()"></button>
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
    translocoService = inject(TranslocoService);  // <-- Añade esto

    loading = true;
    error = false;
    quote: QuoteResponse | null = null;
    quoteItemsFormatted: any[] = [];

    showReasonDialog = false;
    statusReason = '';
    pendingAction: 'reject' | 'changes' | null = null;

    // Timeline events con traducciones
    get timelineEvents() {
        return [
            {
                status: QuoteStatusEnum.DRAFT,
                label: this.getTranslatedStatus(QuoteStatusEnum.DRAFT),
                icon: 'pi pi-file',
                description: this.translocoService.translate('tracking.timeline.draft')
            },
            {
                status: QuoteStatusEnum.SENT,
                label: this.getTranslatedStatus(QuoteStatusEnum.SENT),
                icon: 'pi pi-send',
                description: this.translocoService.translate('tracking.timeline.sent')
            },
            {
                status: QuoteStatusEnum.APPROVED,
                label: this.getTranslatedStatus(QuoteStatusEnum.APPROVED),
                icon: 'pi pi-check',
                description: this.translocoService.translate('tracking.timeline.approved')
            },
            {
                status: QuoteStatusEnum.TO_PAY,
                label: this.getTranslatedStatus(QuoteStatusEnum.TO_PAY),
                icon: 'pi pi-wallet',
                description: this.translocoService.translate('tracking.timeline.to_pay')
            },
            {
                status: QuoteStatusEnum.PAID,
                label: this.getTranslatedStatus(QuoteStatusEnum.PAID),
                icon: 'pi pi-verified',
                description: this.translocoService.translate('tracking.timeline.paid')
            }
        ];
    }

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
                attributes: attributes,
                product: item.product
            };
        });
    }

    canTakeAction(): boolean {
        if (!this.quote) return false;
        return [QuoteStatusEnum.SENT, QuoteStatusEnum.TO_PAY].includes(this.quote.status as QuoteStatusEnum);
    }

    confirmAction(action: 'approve' | 'reject' | 'changes') {
        if (action === 'approve') {
            this.confirmationService.confirm({
                message: this.translocoService.translate('tracking.dialog.approveConfirm'),
                header: this.translocoService.translate('tracking.dialog.approveHeader'),
                icon: 'pi pi-check-circle',
                accept: () => {
                    this.executeStatusChange('approve', '');
                }
            });
        } else {
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
            case 'approve': newStatus = QuoteStatusEnum.APPROVED; break;
            case 'reject': newStatus = QuoteStatusEnum.REJECTED; break;
            case 'changes': newStatus = QuoteStatusEnum.CHANGES_REQUESTED; break;
        }

        this.quoteService.updatePublicQuoteStatus(this.quote.publicToken, newStatus, notes).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Quote status updated successfully'
                });
                if (this.quote) {
                    this.quote.status = newStatus;
                    if (notes) this.quote.notes = notes;
                }
            },
            error: (err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Could not update status'
                });
                console.error(err);
            }
        });
    }

    getTranslatedStatus(status: string): string {
        const statusKey = status.toLowerCase();
        const translationKey = `tracking.status.${statusKey}`;
        const translation = this.translocoService.translate(translationKey);
        return translation !== translationKey ? translation : status;
    }

    getSeverity(status?: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | undefined {
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
        if (!this.quote?.status) return false;
        const statusOrder = [
            QuoteStatusEnum.DRAFT,
            QuoteStatusEnum.SENT,
            QuoteStatusEnum.APPROVED,
            QuoteStatusEnum.TO_PAY,
            QuoteStatusEnum.PAID
        ];

        if (this.quote.status === QuoteStatusEnum.REJECTED ||
            this.quote.status === QuoteStatusEnum.CHANGES_REQUESTED) {
            if (this.quote.status === QuoteStatusEnum.REJECTED &&
                stepStatus === QuoteStatusEnum.SENT) return true;
        }

        const currentIdx = statusOrder.indexOf(this.quote.status as QuoteStatusEnum);
        const stepIdx = statusOrder.indexOf(stepStatus as QuoteStatusEnum);

        if (currentIdx === -1) return false;
        return currentIdx >= stepIdx;
    }

    isCurrentStatus(stepStatus: string): boolean {
        return this.quote?.status === stepStatus;
    }

    showPrices(): boolean {
        if (!this.quote?.status) return false;
        const visibleStatuses = [
            QuoteStatusEnum.SENT,
            QuoteStatusEnum.APPROVED,
            QuoteStatusEnum.TO_PAY,
            QuoteStatusEnum.PAID,
            QuoteStatusEnum.CONVERTED_TO_ORDER
        ];
        return visibleStatuses.includes(this.quote.status as QuoteStatusEnum);
    }
}
