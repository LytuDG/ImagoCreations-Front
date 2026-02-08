import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuoteService } from '@/core/services/quote.service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { QuoteResponse, QuoteFilter, QuoteStatusEnum } from '@/core/models/quote/quote';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { SkeletonModule } from 'primeng/skeleton';
import { Router } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { TooltipModule } from 'primeng/tooltip';

@Component({
    selector: 'app-admin-quotes',
    standalone: true,
    imports: [
        CommonModule,
        TableModule,
        ButtonModule,
        InputTextModule,
        TagModule,
        ToastModule,
        FormsModule,
        IconFieldModule,
        InputIconModule,
        SkeletonModule,
        TranslocoModule,
        TooltipModule
    ],
    providers: [MessageService],
    template: `
        <div class="grid">
            <div class="col-12">
                <div class="card px-6 py-6">
                    <p-toast></p-toast>
                    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                        <h5 class="m-0 text-2xl font-bold">{{ 'admin.quotes.title' | transloco }}</h5>
                        <div class="flex gap-2">
                            <p-iconField iconPosition="left">
                                <p-inputIcon styleClass="pi pi-search" />
                                <input
                                    pInputText
                                    type="text"
                                    (input)="onGlobalFilter($event)"
                                    [placeholder]="'admin.quotes.search.placeholder' | transloco"
                                    class="w-full"
                                />
                            </p-iconField>
                        </div>
                    </div>

                    <p-table
                        #dt
                        [value]="quotes"
                        [lazy]="true"
                        (onLazyLoad)="loadQuotes($event)"
                        [dataKey]="'id'"
                        [tableStyle]="{ 'min-width': '75rem' }"
                        [paginator]="true"
                        [rows]="10"
                        [totalRecords]="totalRecords"
                        [loading]="loading"
                        [rowsPerPageOptions]="[10, 25, 50]"
                        [showCurrentPageReport]="true"
                        [currentPageReportTemplate]="'admin.quotes.table.pagination.showingEntries' | transloco"
                        styleClass="p-datatable-striped"
                    >
                        <ng-template pTemplate="header">
                            <tr>
                                <th style="width: 15%">{{ 'admin.quotes.table.headers.quoteId' | transloco }}</th>
                                <th style="width: 20%">{{ 'admin.quotes.table.headers.company' | transloco }}</th>
                                <th style="width: 15%">{{ 'admin.quotes.table.headers.contact' | transloco }}</th>
                                <th style="width: 15%">{{ 'admin.quotes.table.headers.email' | transloco }}</th>
                                <th style="width: 10%">{{ 'admin.quotes.table.headers.date' | transloco }}</th>
                                <th style="width: 10%">{{ 'admin.quotes.table.headers.total' | transloco }}</th>
                                <th style="width: 10%">{{ 'admin.quotes.table.headers.status' | transloco }}</th>
                                <th style="width: 5%">{{ 'admin.quotes.table.headers.actions' | transloco }}</th>
                            </tr>
                        </ng-template>

                        <ng-template pTemplate="body" let-quote>
                            <tr>
                                <td>
                                    <span
                                        class="font-medium text-primary cursor-pointer hover:underline"
                                        (click)="viewQuote(quote)"
                                    >
                                        {{ quote.quoteNumber || quote.id.substring(0, 8) }}
                                    </span>
                                </td>
                                <td>
                                    <span class="p-column-title">{{ 'admin.quotes.table.headers.company' | transloco }}</span>
                                    {{ quote.companyName || quote.customerInfo?.companyName || ('admin.quotes.values.na' | transloco) }}
                                </td>
                                <td>
                                    <span class="p-column-title">{{ 'admin.quotes.table.headers.contact' | transloco }}</span>
                                    {{ quote.contactName || quote.customerInfo?.contactPerson || ('admin.quotes.values.na' | transloco) }}
                                </td>
                                <td>
                                    <span class="p-column-title">{{ 'admin.quotes.table.headers.email' | transloco }}</span>
                                    {{ quote.email || quote.customerInfo?.email }}
                                </td>
                                <td>
                                    <span class="p-column-title">{{ 'admin.quotes.table.headers.date' | transloco }}</span>
                                    {{ quote.createdAt | date: 'mediumDate' }}
                                </td>
                                <td>
                                    <span class="p-column-title">{{ 'admin.quotes.table.headers.total' | transloco }}</span>
                                    {{ quote.totalAmount || quote.total | currency: 'USD' }}
                                </td>
                                <td>
                                    <span class="p-column-title">{{ 'admin.quotes.table.headers.status' | transloco }}</span>
                                    <p-tag
                                        [value]="getTranslatedStatus(quote.status)"
                                        [severity]="getSeverity(quote.status)"
                                    ></p-tag>
                                </td>
                                <td>
                                    <div class="flex gap-2">
                                        <button
                                            pButton
                                            icon="pi pi-eye"
                                            class="p-button-rounded p-button-text p-button-info"
                                            (click)="viewQuote(quote)"
                                            [pTooltip]="'admin.quotes.tooltips.viewDetails' | transloco"
                                        ></button>
                                    </div>
                                </td>
                            </tr>
                        </ng-template>

                        <ng-template pTemplate="emptymessage">
                            <tr>
                                <td colspan="8" class="text-center p-4">
                                    {{ 'admin.quotes.table.emptyMessage' | transloco }}
                                </td>
                            </tr>
                        </ng-template>
                    </p-table>
                </div>
            </div>
        </div>
    `
})
export class Quotes implements OnInit {
    quoteService = inject(QuoteService);
    messageService = inject(MessageService);
    router = inject(Router);
    translocoService = inject(TranslocoService);

    quotes: QuoteResponse[] = [];
    totalRecords: number = 0;
    loading: boolean = true;

    // Filtros
    lastLazyLoadEvent: any = null;
    searchTerm: string = '';

    ngOnInit() {
        // La carga inicial se maneja en onLazyLoad
    }

    loadQuotes(event: any) {
        this.loading = true;
        this.lastLazyLoadEvent = event;

        const page = event.first / event.rows + 1;
        const limit = event.rows;

        const filter: QuoteFilter = {
            page: page,
            limit: limit,
            search: this.searchTerm || undefined
            // sort: this.getSortString(event) // Implementar ordenamiento si es necesario
        };

        this.quoteService.getQuotes(filter).subscribe({
            next: (response) => {
                this.quotes = response.data;
                this.totalRecords = response.total; // Use total as totalRecords for pagination
                this.loading = false;
            },
            error: (error) => {
                console.error('Error loading quotes:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: this.translocoService.translate('admin.messages.error.title'),
                    detail: this.translocoService.translate('admin.quotes.messages.error.loading'),
                    life: 3000
                });
                this.loading = false;
            }
        });
    }

    onGlobalFilter(event: Event) {
        const input = event.target as HTMLInputElement;
        this.searchTerm = input.value;

        // Debounce simple o recarga directa (aquí recarga directa pero reseteando paginación)
        if (this.lastLazyLoadEvent) {
            this.lastLazyLoadEvent.first = 0;
            this.loadQuotes(this.lastLazyLoadEvent);
        }
    }

    getSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | undefined {
        // Map backend enums to severity
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
        // Normalizar el estado a minúsculas para la clave de traducción
        const statusKey = status.toLowerCase();

        // Intentar traducir desde el estado específico de quotes
        const translationKey = `admin.quotes.status.${statusKey}`;
        const translated = this.translocoService.translate(translationKey);

        // Si no hay traducción específica, usar el valor original
        if (translated === translationKey) {
            return status;
        }

        return translated;
    }

    viewQuote(quote: QuoteResponse) {
        this.router.navigate(['/admin/quotes', quote.id]);
    }
}
