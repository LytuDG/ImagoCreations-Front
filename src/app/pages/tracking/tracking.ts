import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { QuoteService } from '@/core/services/quote.service';
import { Quote } from '@/core/models/quote/quote';
import { TagModule } from 'primeng/tag';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { SeoService } from '@/core/services/seo.service';
import { TopbarWidget } from '../landing/components/topbarwidget';
import { FooterWidget } from '../landing/components/footerwidget';
import { TimelineModule } from 'primeng/timeline';

@Component({
    selector: 'app-tracking',
    standalone: true,
    imports: [CommonModule, RouterModule, TagModule, ProgressSpinnerModule, CardModule, ButtonModule, TimelineModule, TopbarWidget, FooterWidget],
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
                                            <div *ngFor="let item of quoteQuoteItems" class="flex items-center gap-4 py-3 border-b border-surface-100 dark:border-surface-800 last:border-0">
                                                <div class="flex-1">
                                                    <h4 class="font-medium text-surface-900 dark:text-surface-0">{{ item.productName || 'Product Title' }}</h4>
                                                    <div class="flex gap-2 text-sm text-surface-500 mt-1">
                                                        <span>Qty: {{ item.quantity }}</span>
                                                        <span *ngIf="item.price">• \${{ item.price | number: '1.2-2' }}</span>
                                                    </div>
                                                </div>
                                                <div class="font-bold text-surface-900 dark:text-surface-0" *ngIf="item.price">\${{ item.price * item.quantity | number: '1.2-2' }}</div>
                                            </div>
                                        </div>

                                        <div class="flex justify-between items-center mt-4 pt-4 border-t border-surface-100 dark:border-surface-800">
                                            <span class="font-bold text-lg text-surface-900 dark:text-surface-0">Total Estimated</span>
                                            <span class="font-bold text-xl text-primary">\${{ quote.totalAmount | number: '1.2-2' }}</span>
                                        </div>
                                    </div>

                                    <!-- Timeline/Status Progress -->
                                    <div class="surface-card p-6 rounded-xl bg-surface-0 dark:bg-surface-900 shadow-sm border border-surface-200 dark:border-surface-800">
                                        <h3 class="text-xl font-semibold mb-6 text-surface-900 dark:text-surface-0">Status History</h3>
                                        <p-timeline [value]="events" align="left">
                                            <ng-template pTemplate="content" let-event>
                                                <div class="flex flex-col">
                                                    <span class="font-medium" [ngClass]="{ 'text-primary': event.status === quote.status }">{{ event.status }}</span>
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
                                </div>

                                <!-- Sidebar (Right) -->
                                <div class="space-y-6">
                                    <!-- Customer Info -->
                                    <div class="surface-card p-6 rounded-xl bg-surface-0 dark:bg-surface-900 shadow-sm border border-surface-200 dark:border-surface-800">
                                        <h3 class="text-lg font-semibold mb-4 text-surface-900 dark:text-surface-0">Customer Details</h3>
                                        <div class="space-y-3 text-sm">
                                            <div>
                                                <span class="block text-surface-500">Contact</span>
                                                <span class="font-medium text-surface-900 dark:text-surface-0">{{ quote.contactName }} ({{ quote.companyName }})</span>
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
                                        </div>
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
        </div>
    `
})
export class Tracking implements OnInit {
    quoteService = inject(QuoteService);
    route = inject(ActivatedRoute);
    seoService = inject(SeoService);

    loading = true;
    error = false;
    quote: Quote | null = null;
    quoteQuoteItems: any[] = [];

    events = [
        { status: 'PENDING', icon: 'pi pi-file', description: 'Request received' },
        { status: 'PROCESSING', icon: 'pi pi-cog', description: 'Under review' },
        { status: 'APPROVED', icon: 'pi pi-check', description: 'Quote approved' }
        // { status: 'COMPLETED', icon: 'pi pi-check-circle', description: 'Order completed' }
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
                // Map the API response items to a display friendly format if needed
                // The API returns createQuotesItemsDtos or quoteItems usually
                this.quoteQuoteItems = (data as any).quoteItems || data.createQuotesItemsDtos || [];
                this.loading = false;
            },
            error: (err) => {
                console.error(err);
                this.error = true;
                this.loading = false;
            }
        });
    }

    getSeverity(status?: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | undefined {
        switch (status) {
            case 'APPROVED':
                return 'success';
            case 'PROCESSING':
                return 'info';
            case 'PENDING':
                return 'warn';
            case 'REJECTED':
                return 'danger';
            case 'EXPIRED':
                return 'danger';
            default:
                return 'secondary';
        }
    }

    isStepCompleted(stepStatus: string): boolean {
        if (!this.quote?.status) return false;

        const statusOrder = ['PENDING', 'PROCESSING', 'APPROVED'];
        const currentIdx = statusOrder.indexOf(this.quote.status);
        const stepIdx = statusOrder.indexOf(stepStatus);

        return currentIdx >= stepIdx;
    }
}
