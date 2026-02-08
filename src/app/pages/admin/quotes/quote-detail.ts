import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { QuoteService } from '@/core/services/quote.service';
import { QuoteResponse, QuoteStatusEnum } from '@/core/models/quote/quote';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { Textarea } from 'primeng/textarea';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

@Component({
    selector: 'app-quote-detail',
    standalone: true,
    imports: [
        CommonModule,
        ButtonModule,
        TagModule,
        CardModule,
        TableModule,
        SelectModule,
        FormsModule,
        ToastModule,
        ProgressSpinnerModule,
        DialogModule,
        InputNumberModule,
        Textarea,
        TranslocoModule
    ],
    providers: [MessageService],
    template: `
        <div class="card p-6">
            <p-toast></p-toast>

            <div *ngIf="loading" class="flex justify-center py-20">
                <p-progressSpinner></p-progressSpinner>
            </div>

            <div *ngIf="!loading && quote">
                <!-- Header -->
                <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <div>
                        <button
                            pButton
                            icon="pi pi-arrow-left"
                            [label]="'admin.quoteDetail.buttons.back' | transloco"
                            class="p-button-text p-button-secondary pl-0 mb-2"
                            (click)="goBack()"
                        ></button>
                        <h1 class="text-3xl font-bold m-0 text-surface-900 dark:text-surface-0">
                            {{ 'admin.quoteDetail.title' | transloco }}
                        </h1>
                        <div class="text-surface-500 mt-1 flex gap-3 items-center flex-wrap">
                            <span>{{ 'admin.quoteDetail.labels.id' | transloco }}: {{ quote.id }}</span>
                            <span>|</span>
                            <span>{{ 'admin.quoteDetail.labels.createdAt' | transloco }}: {{ quote.createdAt | date: 'medium' }}</span>
                        </div>
                        <div class="mt-2" *ngIf="quote.publicToken">
                            <button
                                pButton
                                icon="pi pi-external-link"
                                [label]="'admin.quoteDetail.buttons.viewPublic' | transloco"
                                class="p-button-outlined p-button-sm text-sm py-1"
                                (click)="viewPublicTracking()"
                            ></button>
                        </div>
                    </div>

                    <div class="flex flex-col items-end gap-2">
                        <p-tag
                            [value]="getTranslatedStatus(quote.status)"
                            [severity]="getSeverity(quote.status)"
                            class="text-lg px-3 py-1"
                        ></p-tag>

                        <div class="flex flex-col gap-2 mt-2 items-end">
                            <p-select
                                [options]="getTranslatedStatusOptions()"
                                [(ngModel)]="selectedStatus"
                                [placeholder]="'admin.quoteDetail.labels.status' | transloco"
                                optionLabel="label"
                                optionValue="value"
                                [style]="{ 'min-width': '200px' }"
                            ></p-select>

                            <!-- Admin Notes Quick Input -->
                            <div class="w-full max-w-xs">
                                <textarea
                                    pInputTextarea
                                    [(ngModel)]="adminNotes"
                                    rows="2"
                                    class="w-full text-sm"
                                    [placeholder]="'admin.quoteDetail.labels.addNotes' | transloco"
                                ></textarea>
                            </div>

                            <button
                                pButton
                                icon="pi pi-save"
                                [label]="'admin.quoteDetail.buttons.save' | transloco"
                                (click)="saveQuote()"
                                [loading]="updatingStatus"
                                [disabled]="!selectedStatus"
                            ></button>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <!-- Main Content (Items) -->
                    <div class="lg:col-span-2 space-y-6">
                        <div class="surface-card p-4 rounded-xl shadow-sm border border-surface-200 dark:border-surface-700">
                            <h3 class="text-xl font-bold mb-4">Quote Items</h3>
                            <p-table [value]="quote.quoteItems" styleClass="p-datatable-sm" [tableStyle]="{ 'min-width': '40rem' }">
                                <ng-template pTemplate="header">
                                    <tr>
                                        <th style="width: 15%">{{ 'admin.quoteDetail.table.headers.image' | transloco }}</th>
                                        <th>{{ 'admin.quoteDetail.table.headers.product' | transloco }}</th>
                                        <th>{{ 'admin.quoteDetail.table.headers.attributes' | transloco }}</th>
                                        <th class="text-right">{{ 'admin.quoteDetail.table.headers.unitPrice' | transloco }}</th>
                                        <th class="text-center">{{ 'admin.quoteDetail.table.headers.quantity' | transloco }}</th>
                                        <th class="text-right">{{ 'admin.quoteDetail.table.headers.total' | transloco }}</th>
                                    </tr>
                                </ng-template>
                                <ng-template pTemplate="body" let-item>
                                    <tr>
                                        <td>
                                            <div class="w-16 h-16 rounded overflow-hidden bg-surface-100">
                                                <img [src]="item.product.picture" [alt]="item.product.name" class="w-full h-full object-cover" />
                                            </div>
                                        </td>
                                        <td>
                                            <div class="font-bold">{{ item.product.name }}</div>
                                            <div class="text-sm text-surface-500">{{ getTranslatedProductType(item.product.type) }}</div>
                                        </td>
                                        <td>
                                            <div *ngIf="item.quoteItemAttributeValue?.length" class="flex flex-wrap gap-1">
                                                <p-tag
                                                    *ngFor="let attr of item.quoteItemAttributeValue"
                                                    [value]="getAttributeDisplay(attr)"
                                                    severity="secondary"
                                                    styleClass="text-xs"
                                                ></p-tag>
                                            </div>
                                            <span *ngIf="!item.quoteItemAttributeValue?.length" class="text-surface-400 italic text-sm">
                                                {{ 'admin.quoteDetail.labels.noOptions' | transloco }}
                                            </span>
                                        </td>
                                        <td class="text-right font-medium" style="min-width: 150px;">
                                            <p-inputNumber
                                                [(ngModel)]="item.unitPrice"
                                                mode="currency"
                                                currency="USD"
                                                locale="en-US"
                                                [minFractionDigits]="2"
                                                styleClass="w-full"
                                                inputStyleClass="text-right p-inputtext-sm w-full"
                                            ></p-inputNumber>
                                        </td>
                                        <td class="text-center">{{ item.quantity }}</td>
                                        <td class="text-right font-bold">
                                            {{ item.unitPrice * item.quantity | currency: 'USD' }}
                                        </td>
                                    </tr>
                                </ng-template>
                                <ng-template pTemplate="footer">
                                    <tr>
                                        <td colspan="5" class="text-right font-bold text-lg">
                                            {{ 'admin.quoteDetail.labels.totalAmount' | transloco }}
                                        </td>
                                        <td class="text-right font-bold text-lg text-primary">
                                            {{ calculateTotal() | currency: 'USD' }}
                                        </td>
                                    </tr>
                                </ng-template>
                            </p-table>
                        </div>

                        <div *ngIf="quote.notes" class="surface-card p-4 rounded-xl shadow-sm border border-surface-200 dark:border-surface-700">
                            <h3 class="text-lg font-bold mb-2">
                                {{ 'admin.quoteDetail.labels.quoteNotes' | transloco }}
                            </h3>
                            <p class="text-surface-600 dark:text-surface-300 bg-surface-50 dark:bg-surface-800 p-3 rounded">{{ quote.notes }}</p>
                        </div>
                    </div>

                    <!-- Sidebar (Customer Info) -->
                    <div class="space-y-6">
                        <div class="surface-card p-4 rounded-xl shadow-sm border border-surface-200 dark:border-surface-700">
                            <h3 class="text-xl font-bold mb-4">
                                {{ 'admin.quoteDetail.labels.customerInfo' | transloco }}
                            </h3>
                            <div class="space-y-3">
                                <div>
                                    <label class="text-sm text-surface-500 block">
                                        {{ 'admin.quoteDetail.labels.company' | transloco }}
                                    </label>
                                    <span class="font-medium text-lg">
                                        {{ quote.companyName || ('admin.quoteDetail.values.na' | transloco) }}
                                    </span>
                                </div>
                                <div>
                                    <label class="text-sm text-surface-500 block">
                                        {{ 'admin.quoteDetail.labels.contactPerson' | transloco }}
                                    </label>
                                    <span class="font-medium">{{ quote.contactName }}</span>
                                </div>
                                <div>
                                    <label class="text-sm text-surface-500 block">
                                        {{ 'admin.quoteDetail.labels.email' | transloco }}
                                    </label>
                                    <a [href]="'mailto:' + quote.email" class="text-primary hover:underline font-medium">
                                        {{ quote.email }}
                                    </a>
                                </div>
                                <div>
                                    <label class="text-sm text-surface-500 block">
                                        {{ 'admin.quoteDetail.labels.phone' | transloco }}
                                    </label>
                                    <span class="font-medium">
                                        {{ quote.phone || ('admin.quoteDetail.values.na' | transloco) }}
                                    </span>
                                </div>
                                <div>
                                    <label class="text-sm text-surface-500 block">
                                        {{ 'admin.quoteDetail.labels.address' | transloco }}
                                    </label>
                                    <span class="font-medium block">
                                        {{ quote.address || ('admin.quoteDetail.values.na' | transloco) }}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div *ngIf="quote.personalizationFileUrl" class="surface-card p-4 rounded-xl shadow-sm border border-surface-200 dark:border-surface-700">
                            <h3 class="text-lg font-bold mb-3">
                                {{ 'admin.quoteDetail.labels.personalizationFile' | transloco }}
                            </h3>
                            <div class="w-full aspect-video bg-surface-50 dark:bg-surface-800 rounded-lg flex items-center justify-center overflow-hidden mb-3 border border-surface-200 dark:border-surface-700">
                                <img [src]="quote.personalizationFileUrl" alt="Personalization" class="max-w-full max-h-full object-contain" />
                            </div>
                            <a
                                [href]="quote.personalizationFileUrl"
                                target="_blank"
                                pButton
                                [label]="'admin.quoteDetail.buttons.download' | transloco"
                                icon="pi pi-download"
                                class="w-full p-button-outlined"
                            ></a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class QuoteDetail implements OnInit {
    quoteService = inject(QuoteService);
    route = inject(ActivatedRoute);
    router = inject(Router);
    messageService = inject(MessageService);
    translocoService = inject(TranslocoService);

    quote: QuoteResponse | null = null;
    loading = true;
    updatingStatus = false;

    selectedStatus: string | null = null;
    adminNotes: string = '';

    // Status options will be translated dynamically
    statusOptions = [
        { label: QuoteStatusEnum.DRAFT, value: QuoteStatusEnum.DRAFT },
        { label: QuoteStatusEnum.SENT, value: QuoteStatusEnum.SENT },
        { label: QuoteStatusEnum.CHANGES_REQUESTED, value: QuoteStatusEnum.CHANGES_REQUESTED },
        { label: QuoteStatusEnum.APPROVED, value: QuoteStatusEnum.APPROVED },
        { label: QuoteStatusEnum.CONVERTED_TO_ORDER, value: QuoteStatusEnum.CONVERTED_TO_ORDER },
        { label: QuoteStatusEnum.REJECTED, value: QuoteStatusEnum.REJECTED }
    ];

    ngOnInit() {
        this.route.params.subscribe((params) => {
            const id = params['id'];
            if (id) {
                this.loadQuote(id);
            }
        });
    }

    loadQuote(id: string) {
        this.loading = true;
        this.quoteService.getQuoteById(id).subscribe({
            next: (data: any) => {
                this.quote = data;
                this.selectedStatus = this.quote!.status;
                this.loading = false;
            },
            error: (err) => {
                console.error('Error loading quote details', err);
                this.messageService.add({
                    severity: 'error',
                    summary: this.translocoService.translate('admin.messages.error.title'),
                    detail: this.translocoService.translate('admin.quoteDetail.messages.error.loading')
                });
                this.loading = false;
            }
        });
    }

    calculateTotal(): number {
        if (!this.quote) return 0;
        return this.quote.quoteItems.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
    }

    saveQuote() {
        if (!this.quote || !this.selectedStatus) return;

        this.updatingStatus = true;

        // Prepare payload with items and status
        const itemsPayload = this.quote.quoteItems.map((item) => ({
            id: item.id,
            unitPrice: item.unitPrice
        }));

        this.quoteService.updateQuote(this.quote.id, itemsPayload, this.selectedStatus, this.adminNotes).subscribe({
            next: (updatedQuote: any) => {
                this.quote = updatedQuote;
                this.selectedStatus = this.quote!.status;
                this.adminNotes = '';
                this.messageService.add({
                    severity: 'success',
                    summary: this.translocoService.translate('admin.messages.success.title'),
                    detail: this.translocoService.translate('admin.quoteDetail.messages.success.updated')
                });
                this.updatingStatus = false;
            },
            error: (err) => {
                console.error('Error updating quote', err);
                this.messageService.add({
                    severity: 'error',
                    summary: this.translocoService.translate('admin.messages.error.title'),
                    detail: this.translocoService.translate('admin.quoteDetail.messages.error.updating')
                });
                this.updatingStatus = false;
            }
        });
    }

    goBack() {
        this.router.navigate(['/admin/quotes']);
    }

    viewPublicTracking() {
        if (!this.quote?.publicToken) return;
        const url = this.router.serializeUrl(this.router.createUrlTree(['/track', this.quote.publicToken]));
        window.open(url, '_blank');
    }

    getSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | undefined {
        switch (status) {
            case QuoteStatusEnum.APPROVED:
            case QuoteStatusEnum.CONVERTED_TO_ORDER:
                return 'success';
            case QuoteStatusEnum.DRAFT:
                return 'secondary';
            case QuoteStatusEnum.SENT:
                return 'info';
            case QuoteStatusEnum.CHANGES_REQUESTED:
                return 'warn';
            case QuoteStatusEnum.REJECTED:
                return 'danger';
            default:
                return 'info';
        }
    }

    getTranslatedStatus(status: string): string {
        const statusKey = status.toLowerCase();
        const translationKey = `admin.quoteDetail.statusOptions.${statusKey}`;
        const translated = this.translocoService.translate(translationKey);

        // Fallback to general quotes status if not found in quoteDetail
        if (translated === translationKey) {
            const fallbackKey = `admin.quotes.status.${statusKey}`;
            const fallbackTranslation = this.translocoService.translate(fallbackKey);
            return fallbackTranslation !== fallbackKey ? fallbackTranslation : status;
        }

        return translated;
    }

    getTranslatedStatusOptions() {
        return this.statusOptions.map(option => ({
            value: option.value,
            label: this.getTranslatedStatus(option.value)
        }));
    }

    getTranslatedProductType(type: string): string {
        const translationKey = `admin.products.types.${type.toLowerCase()}`;
        const translated = this.translocoService.translate(translationKey);
        return translated !== translationKey ? translated : type;
    }

    getAttributeDisplay(attr: any): string {
        const attributeName = attr.productAttributeValue?.attribute?.name ||
                             this.translocoService.translate('admin.products.table.unknown');
        const attributeValue = attr.productAttributeValue?.attributeValue?.value ||
                              this.translocoService.translate('admin.products.table.unknown');
        return `${attributeName}: ${attributeValue}`;
    }
}
