import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { SeoService } from '@/core/services/seo.service';
import { TopbarWidget } from '../landing/components/topbarwidget';
import { FooterWidget } from '../landing/components/footerwidget';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

@Component({
    selector: 'app-tracker-search',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        ButtonModule,
        InputTextModule,
        TopbarWidget,
        FooterWidget,
        ToastModule,
        TranslocoModule
    ],
    providers: [MessageService],
    template: `
        <div class="bg-surface-0 dark:bg-surface-900 min-h-screen">
            <div id="tracker-search" class="landing-wrapper overflow-hidden">
                <topbar-widget class="fixed w-full top-0 left-0 z-50 bg-white dark:bg-surface-900 shadow-sm py-4 px-6 lg:px-20 flex items-center justify-between" />

                <div class="pt-48 px-4 md:px-6 lg:px-20 pb-8 min-h-[calc(100vh-400px)] flex items-center justify-center">
                    <div class="w-full max-w-lg">
                        <div class="surface-card p-8 rounded-2xl bg-surface-0 dark:bg-surface-900 shadow-xl border border-surface-200 dark:border-surface-800 text-center">
                            <div class="mb-8">
                                <div class="w-20 h-20 bg-primary-50 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                                    <i class="pi pi-search text-4xl"></i>
                                </div>
                                <h1 class="text-3xl font-bold text-surface-900 dark:text-surface-0 mb-3">
                                    {{ 'tracker.title' | transloco }}
                                </h1>
                                <p class="text-surface-600 dark:text-surface-300">
                                    {{ 'tracker.description' | transloco }}
                                </p>
                            </div>

                            <div class="flex flex-col gap-4">
                                <div class="flex flex-col gap-2 text-left">
                                    <label for="token" class="font-medium text-surface-900 dark:text-surface-0 ml-1">
                                        {{ 'tracker.form.label' | transloco }}
                                    </label>
                                    <input pInputText
                                           id="token"
                                           [(ngModel)]="token"
                                           [placeholder]="'tracker.form.placeholder' | transloco"
                                           class="w-full p-inputtext-lg"
                                           (keyup.enter)="trackOrder()" />
                                </div>

                                <button pButton
                                        [label]="'tracker.form.button' | transloco"
                                        icon="pi pi-arrow-right"
                                        class="w-full p-button-lg mt-2"
                                        (click)="trackOrder()"
                                        [disabled]="!token.trim()"></button>
                            </div>

                            <div class="mt-8 pt-6 border-t border-surface-100 dark:border-surface-800">
                                <p class="text-sm text-surface-500" [innerHTML]="'tracker.support' | transloco"></p>  <!-- Sin "landing." -->
                            </div>
                        </div>
                    </div>
                </div>
                <footer-widget />
                <p-toast></p-toast>
            </div>
        </div>
    `
})
export class TrackerSearch implements OnInit {
    router = inject(Router);
    messageService = inject(MessageService);
    seoService = inject(SeoService);
    translocoService = inject(TranslocoService);  // <-- Inyecta TranslocoService

    token: string = '';

    ngOnInit() {
        this.seoService.updateTitle('Track Your Order - Imago Creations');
        this.seoService.updateDescription('Check the status of your Imago Creations order.');
    }

    trackOrder() {
        if (!this.token || !this.token.trim()) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Input Required',
                detail: this.translocoService.translate('tracker.messages.required')  // <-- Traduce desde "tracker"
            });
            return;
        }

        this.router.navigate(['/track', this.token.trim()]);
    }
}
