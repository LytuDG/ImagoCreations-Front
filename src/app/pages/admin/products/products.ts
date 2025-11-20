import { Component, OnInit, signal, ViewChild } from '@angular/core';
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
import { firstValueFrom } from 'rxjs';

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
        ProgressSpinnerModule
    ],
    template: `
        <p-toast />

        <p-toolbar styleClass="mb-6">
            <ng-template #start>
                <p-button label="New" icon="pi pi-plus" severity="secondary" class="mr-2" (onClick)="openNew()" />
                <p-button severity="secondary" label="Delete" icon="pi pi-trash" outlined (onClick)="deleteSelectedProducts()" [disabled]="!selectedProducts || !selectedProducts.length" />
            </ng-template>

            <ng-template #end>
                <p-button label="Export" icon="pi pi-upload" severity="secondary" (onClick)="exportCSV()" />
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
            [tableStyle]="{ 'min-width': '75rem' }"
            [(selection)]="selectedProducts"
            [rowHover]="true"
            dataKey="id"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
            [showCurrentPageReport]="true"
            [rowsPerPageOptions]="[10, 20, 50]"
        >
            <ng-template #caption>
                <div class="flex items-center justify-between">
                    <h5 class="m-0">Manage Products</h5>
                    <p-iconfield>
                        <p-inputicon styleClass="pi pi-search" />
                        <input pInputText type="text" (input)="onGlobalFilter(dt, $event)" placeholder="Search..." />
                    </p-iconfield>
                </div>
            </ng-template>
            <ng-template #header>
                <tr>
                    <th style="width: 3rem">
                        <p-tableHeaderCheckbox />
                    </th>
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
                    <th pSortableColumn="isActive" style="min-width: 10rem">
                        Status
                        <p-sortIcon field="isActive" />
                    </th>
                    <th style="min-width: 12rem"></th>
                </tr>
            </ng-template>
            <ng-template #body let-product>
                <tr>
                    <td style="width: 3rem">
                        <p-tableCheckbox [value]="product" />
                    </td>
                    <td style="min-width: 12rem">{{ product.sku || 'N/A' }}</td>
                    <td style="min-width: 16rem">{{ product.name }}</td>
                    <td>
                        <img [src]="product.picture" [alt]="product.name" style="width: 64px; height: 64px; object-fit: cover;" class="rounded" />
                    </td>
                    <td>{{ product.basePrice | currency: 'USD' }}</td>
                    <td>
                        <p-tag [value]="product.type" [severity]="product.type === 'simple' ? 'info' : 'secondary'" />
                    </td>
                    <td>
                        <p-tag [value]="product.isActive ? 'Active' : 'Inactive'" [severity]="product.isActive ? 'success' : 'danger'" />
                    </td>
                    <td>
                        <p-button icon="pi pi-pencil" class="mr-2" [rounded]="true" [outlined]="true" (click)="editProduct(product)" />
                        <p-button icon="pi pi-trash" severity="danger" [rounded]="true" [outlined]="true" (click)="deleteProduct(product)" />
                    </td>
                </tr>
            </ng-template>
        </p-table>

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
                        <div *ngIf="!selectedFile && !imagePreview" class="flex flex-col items-center gap-3">
                            <i class="pi pi-cloud-upload text-5xl text-gray-400"></i>
                            <div>
                                <p class="font-semibold text-gray-700 mb-1">Click to upload product image</p>
                                <p class="text-sm text-gray-500">PNG, JPG, GIF or WebP (max. 10MB)</p>
                            </div>
                            <input type="file" #fileInput (change)="onFileSelect($event)" accept="image/*" class="hidden" id="imageUpload" />
                            <p-button label="Choose Image" icon="pi pi-upload" (onClick)="fileInput.click()" [disabled]="isUploading || isSaving" />
                        </div>

                        <div *ngIf="selectedFile || imagePreview" class="flex flex-col items-center gap-3">
                            <img *ngIf="imagePreview" [src]="imagePreview" alt="Product preview" class="max-h-48 rounded-lg shadow-md" />
                            <div class="flex items-center gap-2 text-sm text-gray-600">
                                <i class="pi pi-file"></i>
                                <span>{{ selectedFile?.name }}</span>
                                <span class="text-gray-400">{{ formatFileSize(selectedFile?.size) }}</span>
                            </div>
                            <p-button label="Change Image" icon="pi pi-refresh" severity="secondary" [outlined]="true" (onClick)="fileInput.click()" [disabled]="isUploading || isSaving" />
                            <input type="file" #fileInput (change)="onFileSelect($event)" accept="image/*" class="hidden" />
                        </div>

                        <small class="text-red-500 block mt-2" *ngIf="submitted && !selectedFile">Product image is required.</small>
                    </div>

                    <!-- Product Name -->
                    <div>
                        <label for="productName" class="block font-semibold mb-2 text-gray-700"> Product Name <span class="text-red-500">*</span> </label>
                        <input type="text" pInputText id="productName" [(ngModel)]="newProduct.name" placeholder="Enter product name" [disabled]="isUploading || isSaving" class="w-full" fluid />
                        <small class="text-red-500" *ngIf="submitted && !newProduct.name">Product name is required.</small>
                    </div>

                    <!-- Description -->
                    <div>
                        <label for="productDescription" class="block font-semibold mb-2 text-gray-700"> Description <span class="text-red-500">*</span> </label>
                        <textarea id="productDescription" pTextarea [(ngModel)]="newProduct.description" placeholder="Describe the product features and characteristics" [disabled]="isUploading || isSaving" rows="4" class="w-full" fluid></textarea>
                        <small class="text-red-500" *ngIf="submitted && !newProduct.description">Description is required.</small>
                    </div>

                    <!-- Base Price and Product Type -->
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label for="basePrice" class="block font-semibold mb-2 text-gray-700"> Base Price <span class="text-red-500">*</span> </label>
                            <p-inputnumber id="basePrice" [(ngModel)]="newProduct.basePrice" mode="currency" currency="USD" locale="en-US" [disabled]="isUploading || isSaving" placeholder="0.00" [min]="0" class="w-full" fluid />
                            <small class="text-red-500" *ngIf="submitted && !newProduct.basePrice">Base price is required.</small>
                        </div>

                        <div>
                            <label for="productType" class="block font-semibold mb-2 text-gray-700"> Product Type <span class="text-red-500">*</span> </label>
                            <p-select id="productType" [(ngModel)]="newProduct.type" [options]="productTypes" optionLabel="label" optionValue="value" placeholder="Select type" [disabled]="isUploading || isSaving" class="w-full" fluid />
                        </div>
                    </div>

                    <!-- Active Status -->
                    <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                            <label class="font-semibold text-gray-700 block mb-1">Active Status</label>
                            <p class="text-sm text-gray-500">Make this product available for purchase</p>
                        </div>
                        <p-toggleswitch [(ngModel)]="newProduct.isActive" [disabled]="isUploading || isSaving" />
                    </div>

                    <!-- Upload Progress -->
                    <div *ngIf="isUploading" class="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <p-progressSpinner [style]="{ width: '30px', height: '30px' }" strokeWidth="4" />
                        <span class="text-blue-700 font-medium">Uploading image...</span>
                    </div>

                    <!-- Save Progress -->
                    <div *ngIf="isSaving" class="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                        <p-progressSpinner [style]="{ width: '30px', height: '30px' }" strokeWidth="4" />
                        <span class="text-green-700 font-medium">Creating product...</span>
                    </div>
                </div>
            </ng-template>

            <ng-template #footer>
                <div class="flex justify-end gap-2">
                    <p-button label="Cancel" icon="pi pi-times" severity="secondary" [outlined]="true" (onClick)="hideDialog()" [disabled]="isUploading || isSaving" />
                    <p-button [label]="product.id ? 'Update Product' : 'Create Product'" icon="pi pi-check" (onClick)="saveProduct()" [loading]="isUploading || isSaving" [disabled]="isUploading || isSaving" />
                </div>
            </ng-template>
        </p-dialog>

        <p-confirmdialog [style]="{ width: '450px' }" />
    `,
    providers: [MessageService, ProductService, ConfirmationService]
})
export class Products implements OnInit {
    productDialog: boolean = false;

    uploadedFiles: any[] = [];
    products = signal<Product[]>([]);

    product!: Product;

    selectedProducts!: Product[] | null;

    // Pagination and loading state
    loading = signal<boolean>(false);
    totalRecords = 0;
    pageSize = 10;
    currentPage = 1;

    submitted: boolean = false;

    statuses!: any[];

    @ViewChild('dt') dt!: Table;

    exportColumns!: ExportColumn[];

    cols!: Column[];

    // New Product properties
    newProduct: Partial<Product> = {};
    productTypes = [
        { label: 'Simple Product', value: PRODUCT_TYPE.SIMPLE },
        { label: 'Product with Variants', value: PRODUCT_TYPE.VARIANT }
    ];

    // Image upload state
    isUploading = false;
    isSaving = false;
    selectedFile: File | null = null;
    imagePreview: SafeUrl | null = null;

    constructor(
        private productService: ProductService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private imageUploadService: ImageUploadService,
        private sanitizer: DomSanitizer
    ) {}

    onUpload(event: any) {
        for (const file of event.files) {
            this.uploadedFiles.push(file);
        }

        this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });
    }

    exportCSV() {
        this.dt.exportCSV();
    }

    loadingTable() {
        this.dt.loading = !this.dt.loading;
    }

    ngOnInit() {
        this.initializeColumns();
        // Don't call loadProducts() here - lazy loading will trigger onPageChange automatically
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

    /**
     * Load products from API with pagination
     */
    loadProducts(page: number = 1, limit: number = 10) {
        this.loading.set(true);
        this.currentPage = page;
        this.pageSize = limit;

        const filters: FilterProductsDto = {
            page,
            limit
            // Only show active products by default (remove this line to show all)
            // isActive: true
        };

        this.productService.filterProducts(filters).subscribe({
            next: (response: any) => {
                this.products.set(response.data);
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

    /**
     * Handle pagination events from the table
     */
    onPageChange(event: any) {
        const page = event.first / event.rows + 1;
        this.loadProducts(page, event.rows);
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
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

    deleteSelectedProducts() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected products?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                // TODO: Implement bulk delete API if available
                this.products.set(this.products().filter((val) => !this.selectedProducts?.includes(val)));
                this.selectedProducts = null;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Products Deleted',
                    life: 3000
                });
            }
        });
    }

    hideDialog() {
        this.productDialog = false;
        this.submitted = false;
        this.newProduct = {};
        this.selectedFile = null;
        this.imagePreview = null;
    }

    deleteProduct(product: Product) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + product.name + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                if (product.id) {
                    this.productService.deleteProduct(product.id).subscribe({
                        next: () => {
                            this.products.set(this.products().filter((val) => val.id !== product.id));
                            this.product = {} as Product;
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
            }
        });
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.products().length; i++) {
            if (this.products()[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    createId(): string {
        let id = '';
        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (var i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }

    getSeverity(status: string | boolean) {
        if (typeof status === 'boolean') {
            return status ? 'success' : 'danger';
        }
        switch (status) {
            case 'INSTOCK':
                return 'success';
            case 'LOWSTOCK':
                return 'warn';
            case 'OUTOFSTOCK':
                return 'danger';
            default:
                return 'info';
        }
    }

    /**
     * Handle file selection for product image
     */
    onFileSelect(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            const file = input.files[0];

            // Validate the file
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

            // Create preview
            const reader = new FileReader();
            reader.onload = (e: ProgressEvent<FileReader>) => {
                if (e.target?.result) {
                    this.imagePreview = this.sanitizer.sanitize(1, e.target.result as string) || null;
                }
            };
            reader.readAsDataURL(file);
        }
    }

    /**
     * Format file size for display
     */
    formatFileSize(bytes: number | undefined): string {
        if (!bytes) return '0 Bytes';

        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    }

    /**
     * Save product with image upload (Create or Update)
     */
    async saveProduct(): Promise<void> {
        this.submitted = true;
        const isUpdate = !!this.product.id;

        // Validate required fields
        if (!this.newProduct.name || !this.newProduct.description || !this.newProduct.basePrice) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Validation Error',
                detail: 'Please fill in all required fields',
                life: 5000
            });
            return;
        }

        // Image is required for new products, but optional for updates (if not changing)
        if (!isUpdate && !this.selectedFile) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Validation Error',
                detail: 'Product image is required for new products',
                life: 5000
            });
            return;
        }

        try {
            let publicId = this.product.pictureProperties?.publicId;
            let secureUrl = this.product.pictureProperties?.secureId || this.product.picture;

            // Step 1: Upload image to Cloudinary if a new file is selected
            if (this.selectedFile) {
                console.log('🚀 Starting image upload...', {
                    fileName: this.selectedFile.name,
                    fileSize: this.selectedFile.size,
                    fileType: this.selectedFile.type
                });

                this.isUploading = true;
                const uploadResponse = await firstValueFrom(this.imageUploadService.uploadImage(this.selectedFile, 'product'));

                console.log('✅ Image upload successful:', uploadResponse);

                if (!uploadResponse || !uploadResponse.public_id || !uploadResponse.secure_url) {
                    throw new Error('Image upload response is incomplete');
                }

                publicId = uploadResponse.public_id;
                secureUrl = uploadResponse.secure_url;
                this.isUploading = false;
            }

            this.isSaving = true;

            // Step 2: Create or Update product
            const productDto = {
                name: this.newProduct.name,
                description: this.newProduct.description,
                basePrice: this.newProduct.basePrice,
                type: this.newProduct.type || PRODUCT_TYPE.SIMPLE,
                isActive: this.newProduct.isActive ?? true,
                publicId: publicId,
                secureUrl: secureUrl
            };

            console.log('🚀 Saving product with data:', productDto);

            if (isUpdate && this.product.id) {
                const updatedProduct = await firstValueFrom(this.productService.updateProduct(this.product.id, productDto));
                console.log('✅ Product updated successfully:', updatedProduct);
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Product updated successfully', life: 3000 });
            } else {
                // Ensure publicId and secureUrl are present for creation
                if (!productDto.publicId || !productDto.secureUrl) {
                    throw new Error('Image data missing for new product');
                }
                const createdProduct = await firstValueFrom(this.productService.createProduct(productDto as any));
                console.log('✅ Product created successfully:', createdProduct);
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Product created successfully', life: 3000 });
            }

            this.isSaving = false;

            // Reset form and close dialog
            this.hideDialog();

            // Refresh the products list
            this.loadProducts(this.currentPage, this.pageSize);
        } catch (error: any) {
            console.error('❌ Error during product save:', error);

            this.isUploading = false;
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
    }
}
