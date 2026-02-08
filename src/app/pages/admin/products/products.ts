import { Component, OnInit, signal, ViewChild, inject } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { LegacyProduct, ProductService } from '../../../core/services/product.service';
import { FilterProductsDto } from '@/core/models/product/filter-products.dto';
import { FileUploadModule } from 'primeng/fileupload';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { Product, PRODUCT_TYPE } from '@/core/models/product/product';
import { ImageUploadService } from '@/core/services/image-upload.service';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { forkJoin, Observable } from 'rxjs';
import { MultiSelectModule } from 'primeng/multiselect';
import { CheckboxModule } from 'primeng/checkbox';
import { CardModule } from 'primeng/card';
import { TooltipModule } from 'primeng/tooltip';
import { ProductAttributeValue } from './models/product-atribute-value';
import { ProductAttributeValueService } from './service/product-atributte-value.service';
import { ProductAttributesDialog } from './product-attribute-form.dialog';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

interface Column {
    field: string;
    header: string;
    customExportHeader?: string;
}

interface ExportColumn {
    title: string;
    dataKey: string;
}

@Component({
    selector: 'app-products',
    standalone: true,
    imports: [
        CommonModule,
        FileUploadModule,
        TableModule,
        FormsModule,
        ButtonModule,
        RippleModule,
        ToastModule,
        ToolbarModule,
        RatingModule,
        InputTextModule,
        TextareaModule,
        SelectModule,
        RadioButtonModule,
        InputNumberModule,
        DialogModule,
        TagModule,
        InputIconModule,
        InputGroupAddonModule,
        IconFieldModule,
        ConfirmDialogModule,
        ToggleSwitchModule,
        ProgressSpinnerModule,
        MultiSelectModule,
        CheckboxModule,
        CardModule,
        TooltipModule,
        ProductAttributesDialog,
        TranslocoModule
    ],
    template: `
        <p-toast />

        <p-toolbar class="mb-6">
            <ng-template #start>
                <p-button
                    [label]="'admin.products.buttons.new' | transloco"
                    icon="pi pi-plus"
                    severity="secondary"
                    class="mr-2"
                    (onClick)="openNew()"
                />
                <p-button
                    [label]="'admin.products.buttons.edit' | transloco"
                    icon="pi pi-pencil"
                    severity="secondary"
                    class="mr-2"
                    (onClick)="editSelectedProduct()"
                    [disabled]="!selectedProduct"
                />
                <p-button
                    [label]="'admin.products.buttons.manageAttributes' | transloco"
                    icon="pi pi-tags"
                    severity="secondary"
                    class="mr-2"
                    (onClick)="manageAttributes()"
                    [disabled]="!selectedProduct"
                />
                <p-button
                    [label]="'admin.products.buttons.delete' | transloco"
                    severity="secondary"
                    icon="pi pi-trash"
                    outlined
                    (onClick)="deleteSelectedProduct()"
                    [disabled]="!selectedProduct"
                />
            </ng-template>

            <ng-template #end>
                <p-button
                    [label]="'admin.products.buttons.export' | transloco"
                    icon="pi pi-upload"
                    severity="secondary"
                    (onClick)="exportCSV()"
                />
                <p-button
                    [label]="'admin.products.buttons.refresh' | transloco"
                    icon="pi pi-refresh"
                    severity="secondary"
                    class="ml-1"
                    (onClick)="loadProducts()"
                    [loading]="loading()"
                />
            </ng-template>
        </p-toolbar>

        <p-table
            #dt
            [value]="products()"
            [rows]="pageSize"
            [columns]="cols"
            [paginator]="true"
            [lazy]="true"
            [totalRecords]="totalRecords"
            [loading]="loading()"
            (onLazyLoad)="onPageChange($event)"
            [globalFilterFields]="['name', 'sku', 'type']"
            [tableStyle]="{ 'min-width': '85rem' }"
            [(selection)]="selectedProduct"
            [rowHover]="true"
            dataKey="id"
            selectionMode="single"
            [currentPageReportTemplate]="'admin.products.table.pagination.showingProducts' | transloco"
            [showCurrentPageReport]="true"
            [rowsPerPageOptions]="[10, 20, 50]"
            [first]="(currentPage - 1) * pageSize"
        >
            <ng-template #caption>
                <div class="flex items-center justify-between">
                    <h5 class="m-0">{{ 'admin.products.title' | transloco }}</h5>
                    <p-iconfield>
                        <p-inputicon styleClass="pi pi-search" />
                        <input
                            pInputText
                            type="text"
                            (keyup)="applyFilter($event, 'name')"
                            [placeholder]="'admin.products.search.placeholder' | transloco"
                        />
                    </p-iconfield>
                </div>
            </ng-template>
            <ng-template #header>
                <tr>
                    <th style="width: 3rem"></th>
                    <th style="min-width: 12rem">{{ 'admin.products.table.columns.sku' | transloco }}</th>
                    <th pSortableColumn="name" style="min-width:16rem">
                        {{ 'admin.products.table.columns.name' | transloco }}
                        <p-sortIcon field="name" />
                    </th>
                    <th>{{ 'admin.products.table.columns.image' | transloco }}</th>
                    <th pSortableColumn="basePrice" style="min-width: 8rem">
                        {{ 'admin.products.table.columns.price' | transloco }}
                        <p-sortIcon field="basePrice" />
                    </th>
                    <th pSortableColumn="type" style="min-width:10rem">
                        {{ 'admin.products.table.columns.type' | transloco }}
                        <p-sortIcon field="type" />
                    </th>
                    <th style="min-width: 12rem">{{ 'admin.products.table.columns.attributes' | transloco }}</th>
                    <th pSortableColumn="isActive" style="min-width: 10rem">
                        {{ 'admin.products.table.columns.status' | transloco }}
                        <p-sortIcon field="isActive" />
                    </th>
                </tr>
            </ng-template>
            <ng-template #body let-product>
                <tr
                    (click)="selectRow(product)"
                    [ngClass]="{
                        'bg-primary-50': selectedProduct?.id === product.id,
                        'cursor-pointer': true
                    }"
                    class="hover:bg-surface-100 transition-colors duration-150"
                >
                    <td class="w-12 p-3" (click)="$event.stopPropagation()">
                        <div class="flex h-full items-center">
                            <p-radioButton [value]="product" [(ngModel)]="selectedProduct" />
                        </div>
                    </td>
                    <td class="p-3" style="min-width: 12rem">{{ product.sku || ('admin.products.table.na' | transloco) }}</td>
                    <td class="p-3" style="min-width: 16rem">{{ product.name }}</td>
                    <td class="p-3">
                        <img [src]="product.picture" [alt]="product.name" style="width: 64px; height: 64px; object-fit: cover;" class="rounded" />
                    </td>
                    <td class="p-3">{{ product.basePrice | currency: 'USD' }}</td>
                    <td class="p-3">
                        <p-tag [value]="getTranslatedProductType(product.type)" [severity]="getTypeSeverity(product.type)" />
                    </td>
                    <td class="p-3">
                        @if (product.productsAttributesValues?.length) {
                            <div class="flex flex-wrap gap-1">
                                @for (attr of getProductAttributes(product) | slice: 0 : 3; track attr.id) {
                                    <p-tag [value]="getAttributeDisplay(attr)" severity="info" class="text-xs" />
                                }
                                @if (product.productsAttributesValues.length > 3) {
                                    <p-tag [value]="'+' + (product.productsAttributesValues.length - 3)" severity="contrast" class="text-xs" />
                                }
                            </div>
                        }
                        @if (!product.productsAttributesValues?.length) {
                            <span class="text-gray-400 text-sm">{{ 'admin.products.table.noAttributes' | transloco }}</span>
                        }
                    </td>
                    <td class="p-3">
                        <p-tag
                            [value]="product.isActive ? ('admin.products.status.active' | transloco) : ('admin.products.status.inactive' | transloco)"
                            [severity]="product.isActive ? 'success' : 'danger'"
                        />
                    </td>
                </tr>
            </ng-template>

            <ng-template #emptymessage>
                <tr>
                    <td colspan="8" class="text-center py-6">
                        <div class="flex flex-col items-center gap-3">
                            <i class="pi pi-box text-6xl text-gray-400"></i>
                            <span class="text-xl text-gray-500 font-medium">
                                {{ 'admin.products.table.empty.message' | transloco }}
                            </span>
                            <div class="flex gap-2">
                                <p-button
                                    [label]="'admin.products.buttons.refresh' | transloco"
                                    icon="pi pi-refresh"
                                    severity="secondary"
                                    outlined
                                    (onClick)="loadProducts()"
                                />
                                <p-button
                                    [label]="'admin.products.buttons.createProduct' | transloco"
                                    icon="pi pi-plus"
                                    (onClick)="openNew()"
                                />
                            </div>
                        </div>
                    </td>
                </tr>
            </ng-template>
        </p-table>

        <!-- Diálogo principal de producto -->
        <p-dialog
            [(visible)]="productDialog"
            [style]="{ width: '600px' }"
            [modal]="true"
            [closable]="!isUploading && !isSaving"
            [closeOnEscape]="!isUploading && !isSaving"
        >
            <ng-template #header>
                <div class="flex items-center gap-3">
                    <i class="pi pi-box text-2xl"></i>
                    <span class="font-semibold text-xl">
                        {{ newProduct.name || ('admin.products.dialog.newProduct' | transloco) }}
                    </span>
                </div>
            </ng-template>

            <ng-template #content>
                <div class="flex flex-col gap-5">
                    <!-- Image Upload Section -->
                    <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
                        @if (!selectedFile && !imagePreview) {
                            <div class="flex flex-col items-center gap-3">
                                <i class="pi pi-cloud-upload text-5xl text-gray-400"></i>
                                <div>
                                    <p class="font-semibold text-gray-700 mb-1">
                                        {{ 'admin.products.dialog.upload.title' | transloco }}
                                    </p>
                                    <p class="text-sm text-gray-500">
                                        {{ 'admin.products.dialog.upload.description' | transloco }}
                                    </p>
                                </div>
                                <input type="file" #fileInput (change)="onFileSelect($event)" accept="image/*" class="hidden" id="imageUpload" />
                                <p-button
                                    [label]="'admin.products.dialog.upload.button' | transloco"
                                    icon="pi pi-upload"
                                    (onClick)="fileInput.click()"
                                    [disabled]="isUploading || isSaving"
                                />
                            </div>
                        }

                        @if (selectedFile || imagePreview) {
                            <div class="flex flex-col items-center gap-3">
                                @if (imagePreview) {
                                    <img [src]="imagePreview" [alt]="'admin.products.dialog.previewAlt' | transloco" class="max-h-48 rounded-lg shadow-md" />
                                }
                                <div class="flex items-center gap-2 text-sm text-gray-600">
                                    <i class="pi pi-file"></i>
                                    <span>{{ selectedFile?.name }}</span>
                                    <span class="text-gray-400">{{ formatFileSize(selectedFile?.size) }}</span>
                                </div>
                                <p-button
                                    [label]="'admin.products.dialog.upload.changeButton' | transloco"
                                    icon="pi pi-refresh"
                                    severity="secondary"
                                    [outlined]="true"
                                    (onClick)="fileInput.click()"
                                    [disabled]="isUploading || isSaving"
                                />
                                <input type="file" #fileInput (change)="onFileSelect($event)" accept="image/*" class="hidden" />
                            </div>
                        }

                        @if (submitted && !selectedFile && !product.id) {
                            <small class="text-red-500 block mt-2">
                                {{ 'admin.products.validation.imageRequired' | transloco }}
                            </small>
                        }
                    </div>

                    <!-- Product Name -->
                    <div>
                        <label for="productName" class="block font-semibold mb-2 text-gray-700">
                            {{ 'admin.products.form.name' | transloco }} <span class="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            pInputText
                            id="productName"
                            [(ngModel)]="newProduct.name"
                            [placeholder]="'admin.products.form.placeholders.name' | transloco"
                            [disabled]="isUploading || isSaving"
                            class="w-full"
                            fluid
                        />
                        @if (submitted && !newProduct.name) {
                            <small class="text-red-500">
                                {{ 'admin.products.validation.nameRequired' | transloco }}
                            </small>
                        }
                    </div>

                    <!-- Description -->
                    <div>
                        <label for="productDescription" class="block font-semibold mb-2 text-gray-700">
                            {{ 'admin.products.form.description' | transloco }} <span class="text-red-500">*</span>
                        </label>
                        <textarea
                            id="productDescription"
                            pTextarea
                            [(ngModel)]="newProduct.description"
                            [placeholder]="'admin.products.form.placeholders.description' | transloco"
                            [disabled]="isUploading || isSaving"
                            rows="4"
                            class="w-full"
                            fluid
                        ></textarea>
                        @if (submitted && !newProduct.description) {
                            <small class="text-red-500">
                                {{ 'admin.products.validation.descriptionRequired' | transloco }}
                            </small>
                        }
                    </div>

                    <!-- Base Price -->
                    <div>
                        <label for="basePrice" class="block font-semibold mb-2 text-gray-700">
                            {{ 'admin.products.form.basePrice' | transloco }} <span class="text-red-500">*</span>
                        </label>
                        <p-inputnumber
                            id="basePrice"
                            [(ngModel)]="newProduct.basePrice"
                            mode="currency"
                            currency="USD"
                            locale="en-US"
                            [disabled]="isUploading || isSaving"
                            [placeholder]="'0.00'"
                            [min]="0"
                            class="w-full"
                            fluid
                        />
                        @if (submitted && !newProduct.basePrice) {
                            <small class="text-red-500">
                                {{ 'admin.products.validation.basePriceRequired' | transloco }}
                            </small>
                        }
                    </div>

                    <!-- Sección de atributos (solo para edición) -->
                    @if (product.id) {
                        <div class="border-t pt-4 mt-4">
                            <div class="flex items-center justify-between mb-3">
                                <label class="block font-semibold text-gray-700">
                                    {{ 'admin.products.form.productAttributes' | transloco }}
                                </label>
                                <p-button
                                    [label]="'admin.products.form.manageAttributes' | transloco"
                                    icon="pi pi-tags"
                                    severity="secondary"
                                    [outlined]="true"
                                    size="small"
                                    (onClick)="openAttributesDialog()"
                                    [disabled]="isUploading || isSaving"
                                />
                            </div>

                            @if (product.productsAttributesValues?.length) {
                                <div class="space-y-2">
                                    @for (attr of product.productsAttributesValues; track attr.id) {
                                        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div>
                                                <span class="font-medium">{{ attr.attribute.name }}</span>
                                                <span class="text-gray-600 ml-2">→ {{ attr.attributeValue?.value }}</span>
                                                <div class="text-xs text-gray-500 mt-1">
                                                    <span class="mr-3">
                                                        {{ 'admin.products.form.required' | transloco }}:
                                                        {{ attr.required ? ('admin.products.buttons.yes' | transloco) : ('admin.products.buttons.no' | transloco) }}
                                                    </span>
                                                    <span>
                                                        {{ 'admin.products.form.order' | transloco }}: {{ attr.attributeValue?.order }}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                </div>
                            }

                            @if (!product.productsAttributesValues?.length) {
                                <div class="text-center py-4 text-gray-400">
                                    <i class="pi pi-tags text-xl mr-2"></i>
                                    {{ 'admin.products.form.noAttributes' | transloco }}
                                </div>
                            }
                        </div>
                    }

                    <!-- Active Status -->
                    <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                            <label class="font-semibold text-gray-700 block mb-1">
                                {{ 'admin.products.form.activeStatus' | transloco }}
                            </label>
                            <p class="text-sm text-gray-500">
                                {{ 'admin.products.form.activeStatusDescription' | transloco }}
                            </p>
                        </div>
                        <p-toggleswitch [(ngModel)]="newProduct.isActive" [disabled]="isUploading || isSaving" />
                    </div>

                    <!-- Upload Progress -->
                    @if (isUploading) {
                        <div class="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <p-progressSpinner [style]="{ width: '30px', height: '30px' }" strokeWidth="4" />
                            <span class="text-blue-700 font-medium">
                                {{ 'admin.products.messages.uploading' | transloco }}
                            </span>
                        </div>
                    }

                    <!-- Save Progress -->
                    @if (isSaving) {
                        <div class="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                            <p-progressSpinner [style]="{ width: '30px', height: '30px' }" strokeWidth="4" />
                            <span class="text-green-700 font-medium">
                                {{ getSavingMessage() }}
                            </span>
                        </div>
                    }
                </div>
            </ng-template>

            <ng-template #footer>
                <div class="flex justify-end gap-2">
                    <p-button
                        [label]="'admin.products.buttons.cancel' | transloco"
                        icon="pi pi-times"
                        severity="secondary"
                        [outlined]="true"
                        (onClick)="hideDialog()"
                        [disabled]="isUploading || isSaving"
                    />
                    <p-button
                        [label]="getSaveButtonLabel()"
                        icon="pi pi-check"
                        (onClick)="saveProduct()"
                        [loading]="isUploading || isSaving"
                        [disabled]="isUploading || isSaving"
                    />
                </div>
            </ng-template>
        </p-dialog>

        <app-product-attributes-dialog
            [visible]="attributesDialog"
            [product]="selectedProduct"
            [existingAttributes]="selectedProduct?.productsAttributesValues || []"
            (save)="onAttributesSaved()"
            (cancel)="closeAttributesDialog()"
            (hide)="closeAttributesDialog()"
            (delete)="onAttributesDeleted()"
        />

        <p-confirmdialog [style]="{ width: '450px' }" />
    `,
    providers: [MessageService, ProductService, ConfirmationService]
})
export class Products implements OnInit {
    private productService = inject(ProductService);
    private messageService = inject(MessageService);
    private confirmationService = inject(ConfirmationService);
    private imageUploadService = inject(ImageUploadService);
    private sanitizer = inject(DomSanitizer);
    private productAttributeValueService = inject(ProductAttributeValueService);
    private translocoService = inject(TranslocoService);

    productDialog: boolean = false;
    attributesDialog: boolean = false;
    uploadedFiles: any[] = [];
    products = signal<Product[]>([]);
    product!: Product;
    selectedProduct: Product | null = null;

    loading = signal<boolean>(false);
    totalRecords = 0;
    pageSize = 10;
    currentPage = 1;
    submitted: boolean = false;

    statuses!: any[];
    @ViewChild('dt') dt!: Table;
    exportColumns!: ExportColumn[];
    cols!: Column[];

    newProduct: Partial<Product> = {};
    productTypes = [
        { label: 'admin.products.types.simple', value: PRODUCT_TYPE.SIMPLE },
        { label: 'admin.products.types.variant', value: PRODUCT_TYPE.VARIANT }
    ];

    isUploading = false;
    isSaving = false;
    selectedFile: File | null = null;
    imagePreview: SafeUrl | null = null;
    timeOut: any;

    ngOnInit() {
        this.initializeColumns();
        this.loadProducts();
    }

    exportCSV() {
        this.dt.exportCSV();
    }

    initializeColumns() {
        this.cols = [
            { field: 'sku', header: this.translocoService.translate('admin.products.table.columns.sku'), customExportHeader: 'Product SKU' },
            { field: 'name', header: this.translocoService.translate('admin.products.table.columns.name') },
            { field: 'secureUrl', header: this.translocoService.translate('admin.products.table.columns.image') },
            { field: 'basePrice', header: this.translocoService.translate('admin.products.table.columns.price') },
            { field: 'type', header: this.translocoService.translate('admin.products.table.columns.type') },
            { field: 'isActive', header: this.translocoService.translate('admin.products.table.columns.status') }
        ];
        this.exportColumns = this.cols.map((col) => ({
            title: col.customExportHeader || col.header,
            dataKey: col.field
        }));
    }

    onPageChange(event: any) {
        const page = event.first / event.rows + 1;
        this.selectedProduct = null;
        this.loadProducts(page, event.rows);
    }

    applyFilter(event: Event, column: string): void {
        clearTimeout(this.timeOut);
        this.timeOut = setTimeout(() => {
            const filterValue = (event.target as HTMLInputElement).value.trim();
            if (filterValue) {
                this.dt.filterGlobal(filterValue, 'contains');
            } else {
                this.dt.filterGlobal(null, 'contains');
            }
        }, 500);
    }

    selectRow(product: Product): void {
        this.selectedProduct = product;
    }

    openNew() {
        this.product = {} as Product;
        this.newProduct = {
            isActive: true,
            type: PRODUCT_TYPE.SIMPLE
        };
        this.submitted = false;
        this.selectedFile = null;
        this.imagePreview = null;
        this.productDialog = true;
    }

    editProduct(product: Product) {
        this.product = { ...product };
        this.newProduct = { ...product };
        this.imagePreview = product.picture as SafeUrl;
        this.productDialog = true;
    }

    editSelectedProduct(): void {
        if (!this.selectedProduct) {
            this.messageService.add({
                severity: 'warn',
                summary: this.translocoService.translate('admin.products.messages.selectionRequired.title'),
                detail: this.translocoService.translate('admin.products.messages.selectionRequired.edit'),
                life: 3000
            });
            return;
        }
        this.editProduct(this.selectedProduct);
    }

    hideDialog() {
        this.productDialog = false;
        this.submitted = false;
        this.newProduct = {};
        this.selectedFile = null;
        this.imagePreview = null;
    }

    deleteSelectedProduct(): void {
        if (!this.selectedProduct) {
            this.messageService.add({
                severity: 'warn',
                summary: this.translocoService.translate('admin.products.messages.selectionRequired.title'),
                detail: this.translocoService.translate('admin.products.messages.selectionRequired.delete'),
                life: 3000
            });
            return;
        }
        this.deleteProduct(this.selectedProduct);
    }

    deleteProduct(product: Product) {
        const message = this.translocoService.translate('admin.products.confirmations.delete.message', { name: product.name });

        this.confirmationService.confirm({
            message: message,
            header: this.translocoService.translate('admin.products.confirmations.delete.header'),
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                if (product.id) {
                    const productAttributes = product.productsAttributesValues || [];
                    const deleteAttributeObservables = productAttributes.filter((attr) => attr.id).map((attr) => this.productAttributeValueService.deleteProductAttribute(attr.id!));

                    if (deleteAttributeObservables.length > 0) {
                        forkJoin(deleteAttributeObservables).subscribe({
                            next: () => {
                                this.deleteProductAfterAttributes(product);
                            },
                            error: (error) => {
                                console.error('Error deleting product attributes:', error);
                                this.messageService.add({
                                    severity: 'error',
                                    summary: this.translocoService.translate('admin.products.messages.error.title'),
                                    detail: this.translocoService.translate('admin.products.messages.error.deletingAttributes'),
                                    life: 3000
                                });
                            }
                        });
                    } else {
                        this.deleteProductAfterAttributes(product);
                    }
                }
            }
        });
    }

    private deleteProductAfterAttributes(product: Product): void {
        this.productService.deleteProduct(product.id!).subscribe({
            next: () => {
                this.products.set(this.products().filter((val) => val.id !== product.id));
                this.selectedProduct = null;
                this.totalRecords = Math.max(0, this.totalRecords - 1);

                if (this.products().length === 0 && this.currentPage > 1) {
                    this.currentPage--;
                    this.loadProducts(this.currentPage, this.pageSize);
                }

                this.messageService.add({
                    severity: 'success',
                    summary: this.translocoService.translate('admin.products.messages.success.title'),
                    detail: this.translocoService.translate('admin.products.messages.success.deleted'),
                    life: 3000
                });
            },
            error: (error) => {
                console.error('Error deleting product:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: this.translocoService.translate('admin.products.messages.error.title'),
                    detail: this.translocoService.translate('admin.products.messages.error.deletingProduct'),
                    life: 3000
                });
            }
        });
    }

    loadProducts(page: number = 1, limit: number = 10) {
        this.loading.set(true);
        this.currentPage = page;
        this.pageSize = limit;

        const filters: FilterProductsDto = {
            page,
            limit
        };

        this.productService.filterProducts(filters).subscribe({
            next: (response: any) => {
                const products = response.data || [];
                this.products.set(products);
                this.totalRecords = response.total || 0;
                this.loading.set(false);
            },
            error: (error: any) => {
                console.error('Error loading products:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: this.translocoService.translate('admin.products.messages.error.title'),
                    detail: this.translocoService.translate('admin.products.messages.error.loading'),
                    life: 5000
                });
                this.loading.set(false);
            }
        });
    }

    getProductAttributes(product: Product): ProductAttributeValue[] {
        return product.productsAttributesValues || [];
    }

    getAttributeDisplay(attr: ProductAttributeValue): string {
        const attributeName = attr.attribute?.name || this.translocoService.translate('admin.products.table.unknown');
        const attributeValue = attr.attributeValue?.value || this.translocoService.translate('admin.products.table.unknown');
        return `${attributeName}: ${attributeValue}`;
    }

    manageAttributes(): void {
        if (!this.selectedProduct?.id) {
            this.messageService.add({
                severity: 'warn',
                summary: this.translocoService.translate('admin.products.messages.selectionRequired.title'),
                detail: this.translocoService.translate('admin.products.messages.selectionRequired.manageAttributes'),
                life: 3000
            });
            return;
        }
        this.openAttributesDialog();
    }

    openAttributesDialog(): void {
        if (!this.selectedProduct?.id) return;
        this.attributesDialog = true;
    }

    closeAttributesDialog(): void {
        this.attributesDialog = false;
    }

    onAttributesSaved(): void {
        this.loadProducts(this.currentPage, this.pageSize);

        this.messageService.add({
            severity: 'success',
            summary: this.translocoService.translate('admin.products.messages.success.title'),
            detail: this.translocoService.translate('admin.products.messages.success.attributesSaved'),
            life: 3000
        });
    }

    onAttributesDeleted(): void {
        this.loadProducts(this.currentPage, this.pageSize);
    }

    getTypeSeverity(type: string): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' | undefined | null {
        return type === PRODUCT_TYPE.SIMPLE ? 'info' : 'secondary';
    }

    getTranslatedProductType(type: string): string {
        const translationKey = `admin.products.types.${type.toLowerCase()}`;
        const translated = this.translocoService.translate(translationKey);
        return translated !== translationKey ? translated : type;
    }

    onFileSelect(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            const file = input.files[0];

            const validation = this.imageUploadService.validateImageFile(file);
            if (!validation.isValid) {
                this.messageService.add({
                    severity: 'error',
                    summary: this.translocoService.translate('admin.products.messages.error.title'),
                    detail: validation.error || this.translocoService.translate('admin.products.messages.error.invalidFile'),
                    life: 5000
                });
                return;
            }

            this.selectedFile = file;

            const reader = new FileReader();
            reader.onload = (e: ProgressEvent<FileReader>) => {
                if (e.target?.result) {
                    this.imagePreview = this.sanitizer.sanitize(1, e.target.result as string) || null;
                }
            };
            reader.readAsDataURL(file);
        }
    }

    formatFileSize(bytes: number | undefined): string {
        if (!bytes) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    }

    saveProduct(): void {
        this.submitted = true;
        const isUpdate = !!this.product.id;

        if (!this.newProduct.name || !this.newProduct.description || !this.newProduct.basePrice) {
            this.messageService.add({
                severity: 'warn',
                summary: this.translocoService.translate('admin.products.messages.validation.title'),
                detail: this.translocoService.translate('admin.products.messages.validation.requiredFields'),
                life: 5000
            });
            return;
        }

        if (!isUpdate && !this.selectedFile) {
            this.messageService.add({
                severity: 'warn',
                summary: this.translocoService.translate('admin.products.messages.validation.title'),
                detail: this.translocoService.translate('admin.products.messages.validation.imageRequired'),
                life: 5000
            });
            return;
        }

        this.isSaving = true;

        const saveFlow = () => {
            let publicId = this.product.pictureProperties?.publicId;
            let secureUrl = this.product.pictureProperties?.secureId || this.product.picture;

            const productDto = {
                name: this.newProduct.name,
                description: this.newProduct.description,
                basePrice: this.newProduct.basePrice,
                type: this.newProduct.type || PRODUCT_TYPE.SIMPLE,
                isActive: this.newProduct.isActive ?? true,
                haveStock: false,
                publicId: publicId,
                secureUrl: secureUrl
            };

            let productObservable: Observable<any>;

            if (isUpdate && this.product.id) {
                productObservable = this.productService.updateProduct(this.product.id, productDto);
            } else {
                if (!productDto.publicId || !productDto.secureUrl) {
                    this.messageService.add({
                        severity: 'error',
                        summary: this.translocoService.translate('admin.products.messages.error.title'),
                        detail: this.translocoService.translate('admin.products.messages.error.imageDataMissing'),
                        life: 5000
                    });
                    this.isSaving = false;
                    return;
                }
                productObservable = this.productService.createProduct(productDto as any);
            }

            productObservable.subscribe({
                next: (result) => {
                    this.isSaving = false;
                    this.hideDialog();
                    this.loadProducts(this.currentPage, this.pageSize);
                    this.selectedProduct = null;

                    const messageKey = isUpdate ? 'admin.products.messages.success.updated' : 'admin.products.messages.success.created';
                    this.messageService.add({
                        severity: 'success',
                        summary: this.translocoService.translate('admin.products.messages.success.title'),
                        detail: this.translocoService.translate(messageKey),
                        life: 3000
                    });

                    if (!isUpdate && result.id) {
                        setTimeout(() => {
                            const newProduct = this.products().find((p) => p.id === result.id);
                            if (newProduct) {
                                this.selectedProduct = newProduct;
                            }
                        }, 500);
                    }
                },
                error: (error: any) => {
                    this.isSaving = false;
                    let errorMessage = this.translocoService.translate('admin.products.messages.error.saving');

                    if (error.status === 0) {
                        errorMessage = this.translocoService.translate('admin.products.messages.error.network');
                    } else if (error.status === 413) {
                        errorMessage = this.translocoService.translate('admin.products.messages.error.fileTooLarge');
                    } else if (error.status === 415) {
                        errorMessage = this.translocoService.translate('admin.products.messages.error.unsupportedFile');
                    } else if (error.error?.message) {
                        errorMessage = error.error.message;
                    } else if (error.message) {
                        errorMessage = error.message;
                    }

                    this.messageService.add({
                        severity: 'error',
                        summary: this.translocoService.translate('admin.products.messages.error.title'),
                        detail: errorMessage,
                        life: 5000
                    });
                }
            });
        };

        if (this.selectedFile) {
            this.isUploading = true;
            this.imageUploadService.uploadImage(this.selectedFile, 'product').subscribe({
                next: (uploadResponse) => {
                    this.isUploading = false;
                    if (!uploadResponse?.public_id || !uploadResponse?.secure_url) {
                        this.messageService.add({
                            severity: 'error',
                            summary: this.translocoService.translate('admin.products.messages.error.title'),
                            detail: this.translocoService.translate('admin.products.messages.error.uploadFailed'),
                            life: 5000
                        });
                        this.isSaving = false;
                        return;
                    }

                    // Actualizar el producto con los datos de la imagen subida
                    this.product.pictureProperties = {
                        publicId: uploadResponse.public_id,
                        secureId: uploadResponse.secure_url
                    };
                    this.product.picture = uploadResponse.secure_url;

                    saveFlow();
                },
                error: (error) => {
                    this.isUploading = false;
                    this.isSaving = false;
                    let errorMessage = this.translocoService.translate('admin.products.messages.error.uploadFailed');
                    if (error.error?.message) {
                        errorMessage = error.error.message;
                    }
                    this.messageService.add({
                        severity: 'error',
                        summary: this.translocoService.translate('admin.products.messages.error.title'),
                        detail: errorMessage,
                        life: 5000
                    });
                }
            });
        } else {
            saveFlow();
        }
    }

    // Métodos auxiliares para traducciones dinámicas
    getSaveButtonLabel(): string {
        return this.product.id
            ? this.translocoService.translate('admin.products.buttons.updateProduct')
            : this.translocoService.translate('admin.products.buttons.createProduct');
    }

    getSavingMessage(): string {
        return this.product.id
            ? this.translocoService.translate('admin.products.messages.updating')
            : this.translocoService.translate('admin.products.messages.creating');
    }
}
