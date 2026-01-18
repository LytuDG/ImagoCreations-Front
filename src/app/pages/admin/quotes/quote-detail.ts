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

@Component({
    selector: 'app-quote-detail',
    standalone: true,
    imports: [CommonModule, ButtonModule, TagModule, CardModule, TableModule, SelectModule, FormsModule, ToastModule, ProgressSpinnerModule, DialogModule],
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
                        <button pButton icon="pi pi-arrow-left" label="Back to Quotes" class="p-button-text p-button-secondary pl-0 mb-2" (click)="goBack()"></button>
                        <h1 class="text-3xl font-bold m-0 text-surface-900 dark:text-surface-0">Quote Details</h1>
                        <div class="text-surface-500 mt-1 flex gap-3 items-center">
                            <span>ID: {{ quote.id }}</span>
                            <span>|</span>
                            <span>{{ quote.createdAt | date: 'medium' }}</span>
                        </div>
                    </div>

                    <div class="flex flex-col items-end gap-2">
                        <p-tag [value]="quote.status" [severity]="getSeverity(quote.status)" class="text-lg px-3 py-1"></p-tag>

                        <div class="flex items-center gap-2 mt-2">
                            <p-select [options]="statusOptions" [(ngModel)]="selectedStatus" placeholder="Change Status" optionLabel="label" optionValue="value" [style]="{ 'min-width': '200px' }"> </p-select>
                            <button pButton icon="pi pi-check" label="Update" (click)="updateStatus()" [loading]="updatingStatus" [disabled]="!selectedStatus || selectedStatus === quote.status"></button>
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
                                        <th style="width: 15%">Image</th>
                                        <th>Product</th>
                                        <th>Attributes</th>
                                        <th class="text-right">Unit Price</th>
                                        <th class="text-center">Qty</th>
                                        <th class="text-right">Total</th>
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
                                            <div class="text-sm text-surface-500">{{ item.product.type }}</div>
                                        </td>
                                        <td>
                                            <div *ngIf="item.quoteItemAttributeValue?.length" class="flex flex-wrap gap-1">
                                                <p-tag
                                                    *ngFor="let attr of item.quoteItemAttributeValue"
                                                    [value]="attr.productAttributeValue?.attribute?.name + ': ' + attr.productAttributeValue?.attributeValue?.value"
                                                    severity="secondary"
                                                    styleClass="text-xs"
                                                >
                                                </p-tag>
                                            </div>
                                            <span *ngIf="!item.quoteItemAttributeValue?.length" class="text-surface-400 italic text-sm">No options</span>
                                        </td>
                                        <td class="text-right font-medium">
                                            {{ item.unitPrice | currency: 'USD' }}
                                        </td>
                                        <td class="text-center">{{ item.quantity }}</td>
                                        <td class="text-right font-bold">
                                            {{ item.unitPrice * item.quantity | currency: 'USD' }}
                                        </td>
                                    </tr>
                                </ng-template>
                                <ng-template pTemplate="footer">
                                    <tr>
                                        <td colspan="5" class="text-right font-bold text-lg">Total Amount:</td>
                                        <td class="text-right font-bold text-lg text-primary">{{ calculateTotal() | currency: 'USD' }}</td>
                                    </tr>
                                </ng-template>
                            </p-table>
                        </div>

                        <div *ngIf="quote.notes" class="surface-card p-4 rounded-xl shadow-sm border border-surface-200 dark:border-surface-700">
                            <h3 class="text-lg font-bold mb-2">Customer Notes</h3>
                            <p class="text-surface-600 dark:text-surface-300 bg-surface-50 dark:bg-surface-800 p-3 rounded">{{ quote.notes }}</p>
                        </div>
                    </div>

                    <!-- Sidebar (Customer Info) -->
                    <div class="space-y-6">
                        <div class="surface-card p-4 rounded-xl shadow-sm border border-surface-200 dark:border-surface-700">
                            <h3 class="text-xl font-bold mb-4">Customer Information</h3>
                            <div class="space-y-3">
                                <div>
                                    <label class="text-sm text-surface-500 block">Company</label>
                                    <span class="font-medium text-lg">{{ quote.companyName || 'N/A' }}</span>
                                </div>
                                <div>
                                    <label class="text-sm text-surface-500 block">Contact Person</label>
                                    <span class="font-medium">{{ quote.contactName }}</span>
                                </div>
                                <div>
                                    <label class="text-sm text-surface-500 block">Email</label>
                                    <a [href]="'mailto:' + quote.email" class="text-primary hover:underline font-medium">{{ quote.email }}</a>
                                </div>
                                <div>
                                    <label class="text-sm text-surface-500 block">Phone</label>
                                    <span class="font-medium">{{ quote.phone || 'N/A' }}</span>
                                </div>
                                <div>
                                    <label class="text-sm text-surface-500 block">Address</label>
                                    <span class="font-medium block">{{ quote.address || 'N/A' }}</span>
                                </div>
                            </div>
                        </div>

                        <div *ngIf="quote.personalizationFileUrl" class="surface-card p-4 rounded-xl shadow-sm border border-surface-200 dark:border-surface-700">
                            <h3 class="text-lg font-bold mb-3">Personalization File</h3>
                            <div class="w-full aspect-video bg-surface-50 dark:bg-surface-800 rounded-lg flex items-center justify-center overflow-hidden mb-3 border border-surface-200 dark:border-surface-700">
                                <img [src]="quote.personalizationFileUrl" alt="Personalization" class="max-w-full max-h-full object-contain" />
                            </div>
                            <a [href]="quote.personalizationFileUrl" target="_blank" pButton label="Download / View Full" icon="pi pi-download" class="w-full p-button-outlined"></a>
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

    quote: QuoteResponse | null = null;
    loading = true;
    updatingStatus = false;

    selectedStatus: string | null = null;
    statusOptions = [
        { label: 'Draft', value: QuoteStatusEnum.DRAFT },
        { label: 'Sent', value: QuoteStatusEnum.SENT },
        { label: 'Changes Requested', value: QuoteStatusEnum.CHANGES_REQUESTED },
        { label: 'Approved', value: QuoteStatusEnum.APPROVED },
        { label: 'Converted to Order', value: QuoteStatusEnum.CONVERTED_TO_ORDER },
        { label: 'Rejected', value: QuoteStatusEnum.REJECTED }
    ];

    // Expose Enum to template
    QuoteStatusEnum = QuoteStatusEnum;

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
                // Adjust if response is wrapped
                this.quote = data; // Assuming getQuoteById returns QuoteResponse directly or compatible structure
                this.selectedStatus = this.quote!.status;
                this.loading = false;
            },
            error: (err) => {
                console.error('Error loading quote details', err);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Could not load quote details' });
                this.loading = false;
            }
        });
    }

    calculateTotal(): number {
        if (!this.quote) return 0;
        return this.quote.quoteItems.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
    }

    updateStatus() {
        if (!this.quote || !this.selectedStatus) return;

        this.updatingStatus = true;
        this.quoteService.updateQuoteStatus(this.quote.id, this.selectedStatus).subscribe({
            next: (updatedQuote) => {
                this.quote!.status = this.selectedStatus!;
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Quote status updated' });
                this.updatingStatus = false;
            },
            error: (err) => {
                console.error('Error updating status', err);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update status' });
                this.updatingStatus = false;
            }
        });
    }

    goBack() {
        this.router.navigate(['/admin/quotes']);
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
}
