import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

@Component({
    standalone: true,
    selector: 'app-best-selling-widget',
    imports: [CommonModule, ButtonModule, MenuModule, TranslocoModule],
    template: `
        <div class="card">
            <div class="flex justify-between items-center mb-6">
                <div class="font-semibold text-xl">
                    {{ 'dashboard.bestSelling.title' | transloco }}
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
            <ul class="list-none p-0 m-0">
                <li class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                    <div>
                        <span class="text-surface-900 dark:text-surface-0 font-medium mr-2 mb-1 md:mb-0">
                            {{ 'dashboard.bestSelling.products.spaceTShirt.name' | transloco }}
                        </span>
                        <div class="mt-1 text-muted-color">
                            {{ 'dashboard.bestSelling.products.spaceTShirt.category' | transloco }}
                        </div>
                    </div>
                    <div class="mt-2 md:mt-0 flex items-center">
                        <div class="bg-surface-300 dark:bg-surface-500 rounded-border overflow-hidden w-40 lg:w-24" style="height: 8px">
                            <div class="bg-orange-500 h-full" style="width: 50%"></div>
                        </div>
                        <span class="text-orange-500 ml-4 font-medium">
                            {{ 'dashboard.bestSelling.products.spaceTShirt.percentage' | transloco }}
                        </span>
                    </div>
                </li>
                <li class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                    <div>
                        <span class="text-surface-900 dark:text-surface-0 font-medium mr-2 mb-1 md:mb-0">
                            {{ 'dashboard.bestSelling.products.portalSticker.name' | transloco }}
                        </span>
                        <div class="mt-1 text-muted-color">
                            {{ 'dashboard.bestSelling.products.portalSticker.category' | transloco }}
                        </div>
                    </div>
                    <div class="mt-2 md:mt-0 ml-0 md:ml-20 flex items-center">
                        <div class="bg-surface-300 dark:bg-surface-500 rounded-border overflow-hidden w-40 lg:w-24" style="height: 8px">
                            <div class="bg-cyan-500 h-full" style="width: 16%"></div>
                        </div>
                        <span class="text-cyan-500 ml-4 font-medium">
                            {{ 'dashboard.bestSelling.products.portalSticker.percentage' | transloco }}
                        </span>
                    </div>
                </li>
                <li class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                    <div>
                        <span class="text-surface-900 dark:text-surface-0 font-medium mr-2 mb-1 md:mb-0">
                            {{ 'dashboard.bestSelling.products.supernovaSticker.name' | transloco }}
                        </span>
                        <div class="mt-1 text-muted-color">
                            {{ 'dashboard.bestSelling.products.supernovaSticker.category' | transloco }}
                        </div>
                    </div>
                    <div class="mt-2 md:mt-0 ml-0 md:ml-20 flex items-center">
                        <div class="bg-surface-300 dark:bg-surface-500 rounded-border overflow-hidden w-40 lg:w-24" style="height: 8px">
                            <div class="bg-pink-500 h-full" style="width: 67%"></div>
                        </div>
                        <span class="text-pink-500 ml-4 font-medium">
                            {{ 'dashboard.bestSelling.products.supernovaSticker.percentage' | transloco }}
                        </span>
                    </div>
                </li>
                <li class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                    <div>
                        <span class="text-surface-900 dark:text-surface-0 font-medium mr-2 mb-1 md:mb-0">
                            {{ 'dashboard.bestSelling.products.wondersNotebook.name' | transloco }}
                        </span>
                        <div class="mt-1 text-muted-color">
                            {{ 'dashboard.bestSelling.products.wondersNotebook.category' | transloco }}
                        </div>
                    </div>
                    <div class="mt-2 md:mt-0 ml-0 md:ml-20 flex items-center">
                        <div class="bg-surface-300 dark:bg-surface-500 rounded-border overflow-hidden w-40 lg:w-24" style="height: 8px">
                            <div class="bg-green-500 h-full" style="width: 35%"></div>
                        </div>
                        <span class="text-primary ml-4 font-medium">
                            {{ 'dashboard.bestSelling.products.wondersNotebook.percentage' | transloco }}
                        </span>
                    </div>
                </li>
                <li class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                    <div>
                        <span class="text-surface-900 dark:text-surface-0 font-medium mr-2 mb-1 md:mb-0">
                            {{ 'dashboard.bestSelling.products.matBlackCase.name' | transloco }}
                        </span>
                        <div class="mt-1 text-muted-color">
                            {{ 'dashboard.bestSelling.products.matBlackCase.category' | transloco }}
                        </div>
                    </div>
                    <div class="mt-2 md:mt-0 ml-0 md:ml-20 flex items-center">
                        <div class="bg-surface-300 dark:bg-surface-500 rounded-border overflow-hidden w-40 lg:w-24" style="height: 8px">
                            <div class="bg-purple-500 h-full" style="width: 75%"></div>
                        </div>
                        <span class="text-purple-500 ml-4 font-medium">
                            {{ 'dashboard.bestSelling.products.matBlackCase.percentage' | transloco }}
                        </span>
                    </div>
                </li>
                <li class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                    <div>
                        <span class="text-surface-900 dark:text-surface-0 font-medium mr-2 mb-1 md:mb-0">
                            {{ 'dashboard.bestSelling.products.robotsTShirt.name' | transloco }}
                        </span>
                        <div class="mt-1 text-muted-color">
                            {{ 'dashboard.bestSelling.products.robotsTShirt.category' | transloco }}
                        </div>
                    </div>
                    <div class="mt-2 md:mt-0 ml-0 md:ml-20 flex items-center">
                        <div class="bg-surface-300 dark:bg-surface-500 rounded-border overflow-hidden w-40 lg:w-24" style="height: 8px">
                            <div class="bg-teal-500 h-full" style="width: 40%"></div>
                        </div>
                        <span class="text-teal-500 ml-4 font-medium">
                            {{ 'dashboard.bestSelling.products.robotsTShirt.percentage' | transloco }}
                        </span>
                    </div>
                </li>
            </ul>
        </div>
    `
})
export class BestSellingWidget {
    private translocoService = inject(TranslocoService);
    menu = null;

    items: MenuItem[] = [
        {
            label: this.translocoService.translate('dashboard.bestSelling.menu.addNew'),
            icon: 'pi pi-fw pi-plus'
        },
        {
            label: this.translocoService.translate('dashboard.bestSelling.menu.remove'),
            icon: 'pi pi-fw pi-trash'
        }
    ];
}
