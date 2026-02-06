import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

@Component({
    standalone: true,
    selector: 'app-notifications-widget',
    imports: [CommonModule, ButtonModule, MenuModule, TranslocoModule],
    template: `
        <div class="card">
            <div class="flex items-center justify-between mb-6">
                <div class="font-semibold text-xl">
                    {{ 'dashboard.notifications.title' | transloco }}
                </div>
                <div>
                    <button
                        pButton
                        type="button"
                        icon="pi pi-ellipsis-v"
                        class="p-button-rounded p-button-text p-button-plain"
                        (click)="menu.toggle($event)">
                    </button>
                    <p-menu #menu [popup]="true" [model]="items"></p-menu>
                </div>
            </div>

            <span class="block text-muted-color font-medium mb-4">
                {{ 'dashboard.notifications.time.today' | transloco }}
            </span>
            <ul class="p-0 mx-0 mt-0 mb-6 list-none">
                <li class="flex items-center py-2 border-b border-surface">
                    <div class="w-12 h-12 flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-full mr-4 shrink-0">
                        <i class="pi pi-dollar text-xl! text-blue-500"></i>
                    </div>
                    <span class="text-surface-900 dark:text-surface-0 leading-normal">
                        {{ 'dashboard.notifications.today.purchase.name' | transloco }}
                        <span class="text-surface-700 dark:text-surface-100">
                            {{ 'dashboard.notifications.today.purchase.description' | transloco }}
                            <span class="text-primary font-bold">
                                {{ 'dashboard.notifications.today.purchase.amount' | transloco }}
                            </span>
                        </span>
                    </span>
                </li>
                <li class="flex items-center py-2">
                    <div class="w-12 h-12 flex items-center justify-center bg-orange-100 dark:bg-orange-400/10 rounded-full mr-4 shrink-0">
                        <i class="pi pi-download text-xl! text-orange-500"></i>
                    </div>
                    <span class="text-surface-700 dark:text-surface-100 leading-normal">
                        {{ 'dashboard.notifications.today.withdrawal.description' | transloco }}
                        <span class="text-primary font-bold">
                            {{ 'dashboard.notifications.today.withdrawal.amount' | transloco }}
                        </span>
                        {{ 'dashboard.notifications.today.withdrawal.action' | transloco }}
                    </span>
                </li>
            </ul>

            <span class="block text-muted-color font-medium mb-4">
                {{ 'dashboard.notifications.time.yesterday' | transloco }}
            </span>
            <ul class="p-0 m-0 list-none mb-6">
                <li class="flex items-center py-2 border-b border-surface">
                    <div class="w-12 h-12 flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-full mr-4 shrink-0">
                        <i class="pi pi-dollar text-xl! text-blue-500"></i>
                    </div>
                    <span class="text-surface-900 dark:text-surface-0 leading-normal">
                        {{ 'dashboard.notifications.yesterday.purchase.name' | transloco }}
                        <span class="text-surface-700 dark:text-surface-100">
                            {{ 'dashboard.notifications.yesterday.purchase.description' | transloco }}
                            <span class="text-primary font-bold">
                                {{ 'dashboard.notifications.yesterday.purchase.amount' | transloco }}
                            </span>
                        </span>
                    </span>
                </li>
                <li class="flex items-center py-2 border-b border-surface">
                    <div class="w-12 h-12 flex items-center justify-center bg-pink-100 dark:bg-pink-400/10 rounded-full mr-4 shrink-0">
                        <i class="pi pi-question text-xl! text-pink-500"></i>
                    </div>
                    <span class="text-surface-900 dark:text-surface-0 leading-normal">
                        {{ 'dashboard.notifications.yesterday.question.name' | transloco }}
                        <span class="text-surface-700 dark:text-surface-100">
                            {{ 'dashboard.notifications.yesterday.question.description' | transloco }}
                        </span>
                    </span>
                </li>
            </ul>

            <span class="block text-muted-color font-medium mb-4">
                {{ 'dashboard.notifications.time.lastWeek' | transloco }}
            </span>
            <ul class="p-0 m-0 list-none">
                <li class="flex items-center py-2 border-b border-surface">
                    <div class="w-12 h-12 flex items-center justify-center bg-green-100 dark:bg-green-400/10 rounded-full mr-4 shrink-0">
                        <i class="pi pi-arrow-up text-xl! text-green-500"></i>
                    </div>
                    <span class="text-surface-900 dark:text-surface-0 leading-normal">
                        {{ 'dashboard.notifications.lastWeek.revenue.description' | transloco }}
                        <span class="text-primary font-bold">
                            {{ 'dashboard.notifications.lastWeek.revenue.percentage' | transloco }}
                        </span>
                    </span>
                </li>
                <li class="flex items-center py-2 border-b border-surface">
                    <div class="w-12 h-12 flex items-center justify-center bg-purple-100 dark:bg-purple-400/10 rounded-full mr-4 shrink-0">
                        <i class="pi pi-heart text-xl! text-purple-500"></i>
                    </div>
                    <span class="text-surface-900 dark:text-surface-0 leading-normal">
                        <span class="text-primary font-bold">
                            {{ 'dashboard.notifications.lastWeek.wishlist.count' | transloco }}
                        </span>
                        {{ 'dashboard.notifications.lastWeek.wishlist.description' | transloco }}
                    </span>
                </li>
            </ul>
        </div>
    `
})
export class NotificationsWidget {
    private translocoService = inject(TranslocoService);

    items: MenuItem[] = [
        {
            label: this.translocoService.translate('dashboard.notifications.menu.addNew'),
            icon: 'pi pi-fw pi-plus'
        },
        {
            label: this.translocoService.translate('dashboard.notifications.menu.remove'),
            icon: 'pi pi-fw pi-trash'
        }
    ];
}
