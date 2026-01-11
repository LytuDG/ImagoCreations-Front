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
import { QuoteResponse, QuoteFilter } from '@/core/models/quote/quote';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
    selector: 'app-admin-quotes',
    standalone: true,
    imports: [CommonModule, TableModule, ButtonModule, InputTextModule, TagModule, ToastModule, FormsModule, IconFieldModule, InputIconModule, SkeletonModule],
    providers: [MessageService],
    template: `
        <div class="grid">
            <div class="col-12">
                <div class="card px-6 py-6">
                    <p-toast></p-toast>
                    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                        <h5 class="m-0 text-2xl font-bold">Quotes Management</h5>
                        <div class="flex gap-2">
                            <p-iconField iconPosition="left">
                                <p-inputIcon styleClass="pi pi-search" />
                                <input pInputText type="text" (input)="onGlobalFilter($event)" placeholder="Search..." class="w-full" />
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
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                        styleClass="p-datatable-striped"
                    >
                        <ng-template pTemplate="header">
                            <tr>
                                <th style="width: 15%">Quote ID</th>
                                <th style="width: 20%">Company</th>
                                <th style="width: 15%">Contact</th>
                                <th style="width: 15%">Email</th>
                                <th style="width: 10%">Date</th>
                                <th style="width: 10%">Total</th>
                                <th style="width: 10%">Status</th>
                                <th style="width: 5%">Actions</th>
                            </tr>
                        </ng-template>

                        <ng-template pTemplate="body" let-quote>
                            <tr>
                                <td>
                                    <span class="p-column-title">Quote ID</span>
                                    <span class="font-medium text-primary cursor-pointer hover:underline" (click)="viewQuote(quote)">
                                        {{ quote.quoteNumber || quote.id.substring(0, 8) }}
                                    </span>
                                </td>
                                <td>
                                    <span class="p-column-title">Company</span>
                                    {{ quote.customerInfo?.companyName || 'N/A' }}
                                </td>
                                <td>
                                    <span class="p-column-title">Contact</span>
                                    {{ quote.customerInfo?.contactPerson || 'N/A' }}
                                </td>
                                <td>
                                    <span class="p-column-title">Email</span>
                                    {{ quote.customerInfo?.email }}
                                </td>
                                <td>
                                    <span class="p-column-title">Date</span>
                                    {{ quote.createdAt | date: 'mediumDate' }}
                                </td>
                                <td>
                                    <span class="p-column-title">Total</span>
                                    {{ quote.totalAmount | currency: 'USD' }}
                                </td>
                                <td>
                                    <span class="p-column-title">Status</span>
                                    <p-tag [value]="quote.status" [severity]="getSeverity(quote.status)"> </p-tag>
                                </td>
                                <td>
                                    <div class="flex gap-2">
                                        <button pButton icon="pi pi-eye" class="p-button-rounded p-button-text p-button-info" (click)="viewQuote(quote)" pTooltip="View Details"></button>
                                    </div>
                                </td>
                            </tr>
                        </ng-template>

                        <ng-template pTemplate="emptymessage">
                            <tr>
                                <td colspan="8" class="text-center p-4">No quotes found.</td>
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
                this.totalRecords = response.total;
                this.loading = false;
            },
            error: (error) => {
                console.error('Error loading quotes:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to load quotes'
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
        switch (status?.toUpperCase()) {
            case 'APPROVED':
            case 'COMPLETED':
                return 'success';
            case 'PENDING':
                return 'warn';
            case 'REJECTED':
            case 'CANCELLED':
                return 'danger';
            case 'PROCESSING':
                return 'info';
            default:
                return 'secondary';
        }
    }

    viewQuote(quote: QuoteResponse) {
        // Implementar navegación a detalles o abrir modal
        this.messageService.add({ severity: 'info', summary: 'Info', detail: 'View details for ' + (quote.quoteNumber || quote.id) });
        // this.router.navigate(['/admin/quotes', quote.id]);
    }
}
