import { Component, inject, OnInit } from '@angular/core';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { Product, ProductService } from '../../../core/services/product.service';

@Component({
    standalone: true,
    selector: 'app-recent-sales-widget',
    imports: [CommonModule, TableModule, ButtonModule, RippleModule, TranslocoModule],
    template: `
        <div class="card mb-8!">
            <div class="font-semibold text-xl mb-4">
                {{ 'dashboard.recentSales.title' | transloco }}
            </div>
            <p-table
                [value]="products"
                [paginator]="true"
                [rows]="5"
                responsiveLayout="scroll"
                [showCurrentPageReport]="true"
                currentPageReportTemplate="{{'Showing {first} to {last} of {totalRecords} entries'}}"
                [rowsPerPageOptions]="[5, 10, 25]">
                <ng-template #header>
                    <tr>
                        <th>
                            {{ 'dashboard.recentSales.table.headers.image' | transloco }}
                        </th>
                        <th pSortableColumn="name">
                            {{ 'dashboard.recentSales.table.headers.name' | transloco }}
                            <p-sortIcon field="name"></p-sortIcon>
                        </th>
                        <th pSortableColumn="price">
                            {{ 'dashboard.recentSales.table.headers.price' | transloco }}
                            <p-sortIcon field="price"></p-sortIcon>
                        </th>
                        <th>
                            {{ 'dashboard.recentSales.table.headers.view' | transloco }}
                        </th>
                    </tr>
                </ng-template>
                <ng-template #body let-product>
                    <tr>
                        <td style="width: 15%; min-width: 5rem;">
                            <img
                                src="https://primefaces.org/cdn/primevue/images/product/{{ product.image }}"
                                class="shadow-lg"
                                [alt]="product.name"
                                width="50" />
                        </td>
                        <td style="width: 35%; min-width: 7rem;">
                            {{ product.name }}
                        </td>
                        <td style="width: 35%; min-width: 8rem;">
                            {{ product.price | currency: currencySymbol }}
                        </td>
                        <td style="width: 15%;">
                            <button
                                pButton
                                pRipple
                                type="button"
                                [attr.aria-label]="'dashboard.recentSales.table.actions.view' | transloco"
                                [title]="'dashboard.recentSales.table.actions.view' | transloco"
                                icon="pi pi-search"
                                class="p-button p-component p-button-text p-button-icon-only">
                            </button>
                        </td>
                    </tr>
                </ng-template>
                <ng-template #emptymessage>
                    <tr>
                        <td colspan="4" class="text-center p-6">
                            {{ 'dashboard.recentSales.table.emptyMessage' | transloco }}
                        </td>
                    </tr>
                </ng-template>
            </p-table>
        </div>
    `,
    providers: [ProductService]
})
export class RecentSalesWidget implements OnInit {
    private productService = inject(ProductService);
    private translocoService = inject(TranslocoService);

    products!: any[];
    currencySymbol = '$';

    ngOnInit() {
        // Detectar el idioma actual para ajustar la moneda si es necesario
        const currentLang = this.translocoService.getActiveLang();
        this.currencySymbol = currentLang === 'es' ? '$' : '$'; // Puedes ajustar esto según necesites

        this.productService.getProductsSmall().then((data) => (this.products = data));
    }
}
