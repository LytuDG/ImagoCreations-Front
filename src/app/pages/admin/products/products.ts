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
        ProductAttributesDialog
    ],
    template: `
        <p-toast />

        <p-toolbar class="mb-6">
            <ng-template #start>
                <p-button label="New" icon="pi pi-plus" severity="secondary" class="mr-2" (onClick)="openNew()" />
                <p-button label="Edit" icon="pi pi-pencil" severity="secondary" class="mr-2" (onClick)="editSelectedProduct()" [disabled]="!selectedProduct" />
                <p-button label="Manage Attributes" icon="pi pi-tags" severity="secondary" class="mr-2" (onClick)="manageAttributes()" [disabled]="!selectedProduct" />
                <p-button severity="secondary" label="Delete" icon="pi pi-trash" outlined (onClick)="deleteSelectedProduct()" [disabled]="!selectedProduct" />
            </ng-template>

            <ng-template #end>
                <p-button label="Export" icon="pi pi-upload" severity="secondary" (onClick)="exportCSV()" />
                <p-button label="Refresh" icon="pi pi-refresh" severity="secondary" class="ml-1" (onClick)="loadProducts()" [loading]="loading()" />
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
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
            [showCurrentPageReport]="true"
            [rowsPerPageOptions]="[10, 20, 50]"
            [first]="(currentPage - 1) * pageSize"
        >
            <ng-template #caption>
                <div class="flex items-center justify-between">
                    <h5 class="m-0">Manage Products</h5>
                    <p-iconfield>
                        <p-inputicon styleClass="pi pi-search" />
                        <input
                            pInputText
                            type="text"
                            (keyup)="applyFilter($event, 'name')"
                            placeholder="Search by name, SKU or type..."
                        />
                    </p-iconfield>
                </div>
            </ng-template>
            <ng-template #header>
                <tr>
                    <th style="width: 3rem"></th>
                    <th style="min-width: 12rem">SKU</th>
                    <th pSortableColumn="name" style="min-width:16rem">
                        Name
                        <p-sortIcon field="name" />
                    </th>
                    <th>Image</th>
                    <th pSortableColumn="basePrice" style="min-width: 8rem">
                        Price
                        <p-sortIcon field="basePrice" />
                    </th>
                    <th pSortableColumn="type" style="min-width:10rem">
                        Type
                        <p-sortIcon field="type" />
                    </th>
                    <th style="min-width: 12rem">Attributes</th>
                    <th pSortableColumn="isActive" style="min-width: 10rem">
                        Status
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
                            <p-radioButton
                                [value]="product"
                                [(ngModel)]="selectedProduct"
                            />
                        </div>
                    </td>
                    <td class="p-3" style="min-width: 12rem">{{ product.sku || 'N/A' }}</td>
                    <td class="p-3" style="min-width: 16rem">{{ product.name }}</td>
                    <td class="p-3">
                        <img [src]="product.picture" [alt]="product.name" style="width: 64px; height: 64px; object-fit: cover;" class="rounded" />
                    </td>
                    <td class="p-3">{{ product.basePrice | currency: 'USD' }}</td>
                    <td class="p-3">
                        <p-tag [value]="product.type" [severity]="getTypeSeverity(product.type)" />
                    </td>
                    <td class="p-3">
                        @if (product.productsAttributesValues?.length) {
                            <div class="flex flex-wrap gap-1">
                                @for (attr of getProductAttributes(product) | slice:0:3; track attr.id) {
                                    <p-tag
                                        [value]="getAttributeDisplay(attr)"
                                        severity="info"
                                        class="text-xs"
                                    />
                                }
                                @if (product.productsAttributesValues.length > 3) {
                                    <p-tag
                                        [value]="'+' + (product.productsAttributesValues.length - 3)"
                                        severity="contrast"
                                        class="text-xs"
                                    />
                                }
                            </div>
                        }
                        @if (!product.productsAttributesValues?.length) {
                            <span class="text-gray-400 text-sm">No attributes</span>
                        }
                    </td>
                    <td class="p-3">
                        <p-tag [value]="product.isActive ? 'Active' : 'Inactive'" [severity]="product.isActive ? 'success' : 'danger'" />
                    </td>
                </tr>
            </ng-template>

            <ng-template #emptymessage>
                <tr>
                    <td colspan="8" class="text-center py-6">
                        <div class="flex flex-column items-center gap-3">
                            <i class="pi pi-box text-6xl text-color-secondary"></i>
                            <span class="text-xl text-color-secondary font-medium">
                                No products found
                            </span>
                            <p-button label="Refresh" icon="pi pi-refresh" (onClick)="loadProducts()" />
                        </div>
                    </td>
                </tr>
            </ng-template>
        </p-table>

        <!-- Diálogo principal de producto -->
        <p-dialog [(visible)]="productDialog" [style]="{ width: '600px' }" [modal]="true" [closable]="!isUploading && !isSaving" [closeOnEscape]="!isUploading && !isSaving">
            <ng-template #header>
                <div class="flex items-center gap-3">
                    <i class="pi pi-box text-2xl"></i>
                    <span class="font-semibold text-xl">{{ newProduct.name || 'New Product' }}</span>
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
                                    <p class="font-semibold text-gray-700 mb-1">Click to upload product image</p>
                                    <p class="text-sm text-gray-500">PNG, JPG, GIF or WebP (max. 10MB)</p>
                                </div>
                                <input type="file" #fileInput (change)="onFileSelect($event)" accept="image/*" class="hidden" id="imageUpload" />
                                <p-button label="Choose Image" icon="pi pi-upload" (onClick)="fileInput.click()" [disabled]="isUploading || isSaving" />
                            </div>
                        }

                        @if (selectedFile || imagePreview) {
                            <div class="flex flex-col items-center gap-3">
                                @if (imagePreview) {
                                    <img [src]="imagePreview" alt="Product preview" class="max-h-48 rounded-lg shadow-md" />
                                }
                                <div class="flex items-center gap-2 text-sm text-gray-600">
                                    <i class="pi pi-file"></i>
                                    <span>{{ selectedFile?.name }}</span>
                                    <span class="text-gray-400">{{ formatFileSize(selectedFile?.size) }}</span>
                                </div>
                                <p-button label="Change Image" icon="pi pi-refresh" severity="secondary" [outlined]="true" (onClick)="fileInput.click()" [disabled]="isUploading || isSaving" />
                                <input type="file" #fileInput (change)="onFileSelect($event)" accept="image/*" class="hidden" />
                            </div>
                        }

                        @if (submitted && !selectedFile) {
                            <small class="text-red-500 block mt-2">Product image is required.</small>
                        }
                    </div>

                    <!-- Product Name -->
                    <div>
                        <label for="productName" class="block font-semibold mb-2 text-gray-700"> Product Name <span class="text-red-500">*</span> </label>
                        <input type="text" pInputText id="productName" [(ngModel)]="newProduct.name" placeholder="Enter product name" [disabled]="isUploading || isSaving" class="w-full" fluid />
                        @if (submitted && !newProduct.name) {
                            <small class="text-red-500">Product name is required.</small>
                        }
                    </div>

                    <!-- Description -->
                    <div>
                        <label for="productDescription" class="block font-semibold mb-2 text-gray-700"> Description <span class="text-red-500">*</span> </label>
                        <textarea id="productDescription" pTextarea [(ngModel)]="newProduct.description" placeholder="Describe the product features and characteristics" [disabled]="isUploading || isSaving" rows="4" class="w-full" fluid></textarea>
                        @if (submitted && !newProduct.description) {
                            <small class="text-red-500">Description is required.</small>
                        }
                    </div>

                    <!-- Base Price and Product Type -->
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label for="basePrice" class="block font-semibold mb-2 text-gray-700"> Base Price <span class="text-red-500">*</span> </label>
                            <p-inputnumber id="basePrice" [(ngModel)]="newProduct.basePrice" mode="currency" currency="USD" locale="en-US" [disabled]="isUploading || isSaving" placeholder="0.00" [min]="0" class="w-full" fluid />
                            @if (submitted && !newProduct.basePrice) {
                                <small class="text-red-500">Base price is required.</small>
                            }
                        </div>

                        <div>
                            <label for="productType" class="block font-semibold mb-2 text-gray-700"> Product Type <span class="text-red-500">*</span> </label>
                            <p-select id="productType" [(ngModel)]="newProduct.type" [options]="productTypes" optionLabel="label" optionValue="value" placeholder="Select type" [disabled]="isUploading || isSaving" class="w-full" fluid />
                        </div>
                    </div>

                    <!-- Sección de atributos (solo para edición) -->
                    @if (product.id) {
                        <div class="border-t pt-4 mt-4">
                            <div class="flex items-center justify-between mb-3">
                                <label class="block font-semibold text-gray-700">Product Attributes</label>
                                <p-button
                                    label="Manage Attributes"
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
                                                <span class="font-medium">{{ attr.attribute?.name }}</span>
                                                <span class="text-gray-600 ml-2">→ {{ attr.attributeValue?.value }}</span>
                                                <div class="text-xs text-gray-500 mt-1">
                                                    <span class="mr-3">Required: {{ attr.required ? 'Yes' : 'No' }}</span>
                                                    <span>Order: {{ attr.attributeValue?.order }}</span>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                </div>
                            }

                            @if (!product.productsAttributesValues?.length) {
                                <div class="text-center py-4 text-gray-400">
                                    <i class="pi pi-tags text-xl mr-2"></i>
                                    No attributes assigned yet
                                </div>
                            }
                        </div>
                    }

                    <!-- Active Status -->
                    <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                            <label class="font-semibold text-gray-700 block mb-1">Active Status</label>
                            <p class="text-sm text-gray-500">Make this product available for purchase</p>
                        </div>
                        <p-toggleswitch [(ngModel)]="newProduct.isActive" [disabled]="isUploading || isSaving" />
                    </div>

                    <!-- Upload Progress -->
                    @if (isUploading) {
                        <div class="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <p-progressSpinner [style]="{ width: '30px', height: '30px' }" strokeWidth="4" />
                            <span class="text-blue-700 font-medium">Uploading image...</span>
                        </div>
                    }

                    <!-- Save Progress -->
                    @if (isSaving) {
                        <div class="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                            <p-progressSpinner [style]="{ width: '30px', height: '30px' }" strokeWidth="4" />
                            <span class="text-green-700 font-medium">Creating product...</span>
                        </div>
                    }
                </div>
            </ng-template>

            <ng-template #footer>
                <div class="flex justify-end gap-2">
                    <p-button label="Cancel" icon="pi pi-times" severity="secondary" [outlined]="true" (onClick)="hideDialog()" [disabled]="isUploading || isSaving" />
                    <p-button [label]="product.id ? 'Update Product' : 'Create Product'" icon="pi pi-check" (onClick)="saveProduct()" [loading]="isUploading || isSaving" [disabled]="isUploading || isSaving" />
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
        { label: 'Simple Product', value: PRODUCT_TYPE.SIMPLE },
        { label: 'Product with Variants', value: PRODUCT_TYPE.VARIANT }
    ];

    isUploading = false;
    isSaving = false;
    selectedFile: File | null = null;
    imagePreview: SafeUrl | null = null;
    timeOut: any;

    ngOnInit() {
        this.initializeColumns();
    }

    exportCSV() {
        this.dt.exportCSV();
    }

    initializeColumns() {
        this.cols = [
            { field: 'sku', header: 'SKU', customExportHeader: 'Product SKU' },
            { field: 'name', header: 'Name' },
            { field: 'secureUrl', header: 'Image' },
            { field: 'basePrice', header: 'Price' },
            { field: 'type', header: 'Type' },
            { field: 'isActive', header: 'Status' }
        ];
        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
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
                summary: 'Selection Required',
                detail: 'Please select a product to edit',
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
                summary: 'Selection Required',
                detail: 'Please select a product to delete',
                life: 3000
            });
            return;
        }
        this.deleteProduct(this.selectedProduct);
    }

    deleteProduct(product: Product) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + product.name + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                if (product.id) {
                    const productAttributes = product.productsAttributesValues || [];
                    const deleteAttributeObservables = productAttributes
                        .filter(attr => attr.id)
                        .map(attr =>
                            this.productAttributeValueService.deleteProductAttribute(attr.id!)
                        );

                    if (deleteAttributeObservables.length > 0) {
                        forkJoin(deleteAttributeObservables).subscribe({
                            next: () => {
                                this.deleteProductAfterAttributes(product);
                            },
                            error: (error) => {
                                console.error('Error deleting product attributes:', error);
                                this.messageService.add({
                                    severity: 'error',
                                    summary: 'Error',
                                    detail: 'Failed to delete product attributes',
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
                    summary: 'Successful',
                    detail: 'Product Deleted',
                    life: 3000
                });
            },
            error: (error) => {
                console.error('Error deleting product:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to delete product',
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
                const products = response.data;
                this.products.set(products);
                console.log(products[0].productsAttributesValues)
                this.totalRecords = response.total;
                this.loading.set(false);
            },
            error: (error: any) => {
                console.error('Error loading products:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to load products',
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
        return `${attr.attribute?.name || 'Unknown'}: ${attr.attributeValue?.value || 'Unknown'}`;
    }

    manageAttributes(): void {
        if (!this.selectedProduct?.id) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Selection Required',
                detail: 'Please select a product to manage its attributes',
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
            summary: 'Success',
            detail: 'Product attributes saved successfully',
            life: 3000
        });
    }

    onAttributesDeleted(): void {
      this.loadProducts(this.currentPage, this.pageSize);
    }

    getTypeSeverity(type: string): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' | undefined | null {
        return type === PRODUCT_TYPE.SIMPLE ? 'info' : 'secondary';
    }

    onFileSelect(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            const file = input.files[0];

            const validation = this.imageUploadService.validateImageFile(file);
            if (!validation.isValid) {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Invalid File',
                    detail: validation.error,
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
                summary: 'Validation Error',
                detail: 'Please fill in all required fields',
                life: 5000
            });
            return;
        }

        if (!isUpdate && !this.selectedFile) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Validation Error',
                detail: 'Product image is required for new products',
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
                        summary: 'Error',
                        detail: 'Image data missing for new product',
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

                    const message = isUpdate ? 'Product updated successfully' : 'Product created successfully';
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: message,
                        life: 3000
                    });

                    if (!isUpdate && result.id) {
                        setTimeout(() => {
                            const newProduct = this.products().find(p => p.id === result.id);
                            if (newProduct) {
                                this.selectedProduct = newProduct;
                            }
                        }, 500);
                    }
                },
                error: (error: any) => {
                    this.isSaving = false;
                    let errorMessage = 'Failed to save product';
                    if (error.status === 0) {
                        errorMessage = 'Network error - please check your connection';
                    } else if (error.status === 413) {
                        errorMessage = 'Image file is too large';
                    } else if (error.status === 415) {
                        errorMessage = 'Unsupported file type';
                    } else if (error.error?.message) {
                        errorMessage = error.error.message;
                    } else if (error.message) {
                        errorMessage = error.message;
                    }

                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
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
                            summary: 'Error',
                            detail: 'Image upload failed',
                            life: 5000
                        });
                        this.isSaving = false;
                        return;
                    }
                    saveFlow();
                },
                error: (error) => {
                    this.isUploading = false;
                    this.isSaving = false;
                    let errorMessage = 'Failed to upload image';
                    if (error.error?.message) {
                        errorMessage = error.error.message;
                    }
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: errorMessage,
                        life: 5000
                    });
                }
            });
        } else {
            saveFlow();
        }
    }
}
