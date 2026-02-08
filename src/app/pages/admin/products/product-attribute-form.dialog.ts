import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ConfirmationService, MessageService } from 'primeng/api';
import { forkJoin } from 'rxjs';
import { Attribute } from '@/pages/admin/attributes/models/attribute';
import { Product } from '@/core/models/product/product';
import { AttributeValue } from '../attributes/models/attributeValue';
import { AttributeValueService } from '../attributes/services/attribute-value.service';
import { AttributeService } from '../attributes/services/attribute.service';
import { ProductAttributeValue } from './models/product-atribute-value';
import { ProductAttributeValueService } from './service/product-atributte-value.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

@Component({
    selector: 'app-product-attributes-dialog',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        DialogModule,
        TagModule,
        MultiSelectModule,
        SelectModule,
        InputNumberModule,
        CheckboxModule,
        ProgressSpinnerModule,
        ConfirmDialogModule,
        TooltipModule,
        TranslocoModule
    ],
    template: `
        <p-dialog
            [(visible)]="visible"
            [modal]="true"
            [closable]="!saving && !loadingAttributes && !loadingAttributeValues"
            [closeOnEscape]="!saving && !loadingAttributes && !loadingAttributeValues"
            (onHide)="onHide()"
        >
            <ng-template #header>
                <div class="flex items-center gap-3">
                    <i class="pi pi-tags text-2xl"></i>
                    <span class="font-semibold text-xl">
                        {{ 'admin.productAttributes.title' | transloco: { productName: product?.name || '' } }}
                    </span>
                </div>
            </ng-template>

            <ng-template #content>
                <div class="flex flex-col gap-5">
                    <!-- Loading state -->
                    @if (loadingAttributes || loadingAttributeValues) {
                        <div class="flex items-center justify-center p-8">
                            <div class="flex flex-col items-center gap-3">
                                <p-progressSpinner />
                                <span class="text-gray-600">
                                    {{
                                        loadingAttributes
                                            ? ('admin.productAttributes.loading.attributes' | transloco)
                                            : ('admin.productAttributes.loading.values' | transloco)
                                    }}
                                </span>
                            </div>
                        </div>
                    }

                    <!-- Main content when loaded -->
                    @if (!loadingAttributes && !loadingAttributeValues) {
                        @if (existingAttributes.length) {
                            <div class="mb-6">
                                <label class="block font-semibold mb-3 text-gray-700">
                                    {{ 'admin.productAttributes.sections.currentAttributes.title' | transloco }}
                                    <span class="ml-2 text-sm font-normal text-gray-500">
                                        {{ 'admin.productAttributes.sections.currentAttributes.count' | transloco: {
                                            count: existingAttributes.length,
                                            plural: existingAttributes.length !== 1 ? 's' : ''
                                        } }}
                                    </span>
                                </label>
                                <div class="space-y-2 max-h-60 overflow-y-auto pr-2">
                                    @for (attr of existingAttributes; track attr.id) {
                                        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                                            <div class="flex-1 min-w-0">
                                                <div class="flex items-center gap-2 mb-1 flex-wrap">
                                                    <span class="font-medium text-gray-800 truncate">
                                                        {{ attr.attribute?.name || ('admin.productAttributes.sections.currentAttributes.unknownAttribute' | transloco) }}
                                                    </span>
                                                    <span class="text-gray-400">→</span>
                                                    <span class="text-gray-600 truncate">
                                                        {{ attr.attributeValue?.value || ('admin.productAttributes.sections.currentAttributes.noValue' | transloco) }}
                                                    </span>
                                                    @if (attr.required) {
                                                        <span class="text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded whitespace-nowrap">
                                                            {{ 'admin.productAttributes.sections.currentAttributes.required' | transloco }}
                                                        </span>
                                                    }
                                                </div>
                                                <div class="flex items-center gap-3 text-xs text-gray-500">
                                                    <span>
                                                        {{ 'admin.productAttributes.sections.currentAttributes.order' | transloco: { order: attr.attributeValue?.order || 1 } }}
                                                    </span>
                                                    @if (attr.attribute?.inputType) {
                                                        <span class="text-gray-400">•</span>
                                                        <span>{{ getTranslatedInputType(attr.attribute.inputType) }}</span>
                                                    }
                                                </div>
                                            </div>
                                            <button
                                                pButton
                                                icon="pi pi-trash"
                                                severity="danger"
                                                [text]="true"
                                                [rounded]="true"
                                                (click)="removeExistingAttribute(attr)"
                                                [disabled]="saving"
                                                class="ml-2 shrink-0"
                                                pTooltip="{{ 'admin.productAttributes.buttons.remove' | transloco }}"
                                                tooltipPosition="left"
                                            ></button>
                                        </div>
                                    }
                                </div>
                            </div>
                        }

                        <!-- Available Attributes Selector -->
                        <div class="mb-6">
                            <label class="block font-semibold mb-3 text-gray-700">
                                {{ 'admin.productAttributes.sections.addNewAttributes.title' | transloco }}
                                @if (existingAttributes.length) {
                                    <span class="ml-2 text-sm font-normal text-gray-500">
                                        {{ 'admin.productAttributes.sections.addNewAttributes.hint' | transloco }}
                                    </span>
                                }
                            </label>
                            <p-multiSelect
                                [options]="availableAttributes"
                                [(ngModel)]="selectedAttributes"
                                (ngModelChange)="onAttributesSelectionChange($event)"
                                optionLabel="name"
                                [placeholder]="'admin.productAttributes.sections.addNewAttributes.placeholder' | transloco"
                                [showClear]="true"
                                [filter]="true"
                                display="chip"
                                class="w-full"
                                appendTo="body"
                            >
                                <ng-template let-attribute pTemplate="item">
                                    <div class="flex items-center">
                                        <span>{{ attribute.name }}</span>
                                        <span class="ml-2 text-xs text-gray-500">
                                            ({{ getTranslatedInputType(attribute.inputType) }})
                                        </span>
                                    </div>
                                </ng-template>
                            </p-multiSelect>
                            <small class="text-gray-500">
                                {{ 'admin.productAttributes.sections.addNewAttributes.tooltip' | transloco }}
                            </small>
                        </div>

                        <!-- Attribute Configuration -->
                        @if (selectedAttributes.length) {
                            <div class="space-y-4">
                                @for (attribute of selectedAttributes; track attribute.id; let i = $index) {
                                    <div class="p-4 border border-gray-200 rounded-lg bg-white">
                                        <div class="flex justify-between items-start mb-3">
                                            <div>
                                                <h4 class="font-semibold text-gray-800">{{ attribute.name }}</h4>
                                                <div class="flex items-center gap-3 mt-1">
                                                    <p-tag [value]="getTranslatedInputType(attribute.inputType)" severity="info" size="small" />
                                                    @if (attribute.reusable) {
                                                        <span class="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                                                            {{ 'admin.attributes.table.columns.reusable' | transloco }}
                                                        </span>
                                                    }
                                                    @if (attribute.required) {
                                                        <span class="text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
                                                            {{ 'admin.attributes.table.columns.required' | transloco }}
                                                        </span>
                                                    }
                                                </div>
                                            </div>
                                            <p-button
                                                icon="pi pi-times"
                                                severity="danger"
                                                [text]="true"
                                                [rounded]="true"
                                                (onClick)="removeAttribute(attribute)"
                                                pTooltip="{{ 'admin.productAttributes.buttons.removeAttribute' | transloco }}"
                                            />
                                        </div>

                                        <!-- Value Selection -->
                                        <div class="mb-3">
                                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                                {{ 'admin.productAttributes.sections.configuration.selectValue' | transloco }}
                                            </label>
                                            @if ((attributeValuesMap[attribute.id!] || []).length > 0) {
                                                <div>
                                                    <p-select
                                                        [options]="attributeValuesMap[attribute.id!]"
                                                        [(ngModel)]="selectedAttributeValues[attribute.id!]"
                                                        optionLabel="value"
                                                        [placeholder]="'admin.productAttributes.sections.configuration.chooseValue' | transloco"
                                                        [showClear]="true"
                                                        class="w-full"
                                                        appendTo="body"
                                                    >
                                                        <ng-template let-value pTemplate="item">
                                                            <div class="flex justify-between items-center">
                                                                <span>{{ value.value }}</span>
                                                                @if (value.priceModifier) {
                                                                    <span class="text-xs" [ngClass]="value.priceModifier > 0 ? 'text-green-600' : 'text-red-600'">
                                                                        {{ value.priceModifier > 0 ? '+' : '' }}{{ value.priceModifier | currency: 'USD' }}
                                                                    </span>
                                                                }
                                                            </div>
                                                        </ng-template>
                                                    </p-select>
                                                    @if (!selectedAttributeValues[attribute.id!] && attribute.required) {
                                                        <small class="text-red-500">
                                                            {{ 'admin.productAttributes.sections.configuration.valueRequired' | transloco }}
                                                        </small>
                                                    }
                                                </div>
                                            }
                                            @if ((attributeValuesMap[attribute.id!] || []).length === 0) {
                                                <div class="text-center py-3 text-gray-400">
                                                    <i class="pi pi-exclamation-circle mr-2"></i>
                                                    {{ 'admin.productAttributes.sections.addNewAttributes.noValuesAvailable' | transloco }}
                                                </div>
                                            }
                                        </div>

                                        <!-- Configuration Options -->
                                        <div class="grid grid-cols-2 gap-4">
                                            <div>
                                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                                    {{ 'admin.productAttributes.sections.configuration.order' | transloco }}
                                                </label>
                                                <p-inputNumber
                                                    [(ngModel)]="attributeOrders[attribute.id!]"
                                                    [min]="1"
                                                    [max]="100"
                                                    [placeholder]="'admin.productAttributes.sections.configuration.orderPlaceholder' | transloco"
                                                    class="w-full"
                                                />
                                            </div>
                                            <div class="flex items-center mt-7.5 ml-24">
                                                <p-checkbox
                                                    [(ngModel)]="attributeRequiredFlags[attribute.id!]"
                                                    [binary]="true"
                                                    [inputId]="'required-' + attribute.id"
                                                />
                                                <label
                                                    [for]="'required-' + attribute.id"
                                                    class="items ml-2 text-sm font-medium text-gray-700"
                                                >
                                                    {{ 'admin.productAttributes.sections.configuration.requiredForProduct' | transloco }}
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>
                        }

                        <!-- Empty state -->
                        @if (!selectedAttributes.length && !existingAttributes.length) {
                            <div class="text-center py-8">
                                <i class="pi pi-tags text-5xl text-gray-300 mb-4"></i>
                                <p class="text-gray-500">
                                    {{ 'admin.productAttributes.sections.configuration.emptyState' | transloco }}
                                </p>
                            </div>
                        }
                    }

                    <!-- Saving progress -->
                    @if (saving) {
                        <div class="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <p-progressSpinner [style]="{ width: '30px', height: '30px' }" strokeWidth="4" />
                            <span class="text-blue-700 font-medium">
                                {{ 'admin.productAttributes.messages.saving' | transloco }}
                            </span>
                        </div>
                    }
                </div>
            </ng-template>

            <ng-template #footer>
                <div class="flex justify-between items-center">
                    <div class="text-sm text-gray-500">
                        <div class="flex items-center gap-4">
                            <span>
                                <i class="pi pi-check-circle text-green-500 mr-1"></i>
                                {{ 'admin.productAttributes.labels.assigned' | transloco: { count: existingAttributes.length } }}
                            </span>
                            <span class="mr-4">
                                <i class="pi pi-plus-circle text-blue-500 mr-1"></i>
                                {{ 'admin.productAttributes.labels.new' | transloco: { count: selectedAttributes.length } }}
                            </span>
                        </div>
                    </div>
                    <div class="flex justify-end gap-2">
                        <p-button
                            [label]="'admin.productAttributes.buttons.cancel' | transloco"
                            icon="pi pi-times"
                            severity="secondary"
                            [outlined]="true"
                            (onClick)="onCancel()"
                            [disabled]="saving || loadingAttributes || loadingAttributeValues"
                        />
                        <p-button
                            [label]="'admin.productAttributes.buttons.saveNewAttributes' | transloco"
                            icon="pi pi-check"
                            (onClick)="saveAttributes()"
                            [loading]="saving"
                            [disabled]="saving || loadingAttributes || loadingAttributeValues"
                            pTooltip="{{ 'admin.productAttributes.buttons.saveTooltip' | transloco }}"
                            tooltipPosition="top"
                        />
                    </div>
                </div>
            </ng-template>
        </p-dialog>
    `
})
export class ProductAttributesDialog implements OnInit, OnChanges {
    private attributeService = inject(AttributeService);
    private attributeValueService = inject(AttributeValueService);
    private productAttributeValueService = inject(ProductAttributeValueService);
    private messageService = inject(MessageService);
    private confirmationService = inject(ConfirmationService);
    private translocoService = inject(TranslocoService);

    @Input() visible: boolean = false;
    @Input() product: Product | null = null;
    @Input() existingAttributes: ProductAttributeValue[] = [];

    @Output() save = new EventEmitter<void>();
    @Output() delete = new EventEmitter<void>();
    @Output() cancel = new EventEmitter<void>();
    @Output() hide = new EventEmitter<void>();

    saving: boolean = false;
    loadingAttributes: boolean = false;
    loadingAttributeValues: boolean = false;

    dropdownIcon = 'pi pi-chevron-down';

    availableAttributes: Attribute[] = [];
    selectedAttributes: Attribute[] = [];

    attributeValuesMap: { [key: string]: AttributeValue[] } = {};
    selectedAttributeValues: { [key: string]: string } = {};
    attributeOrders: { [key: string]: number } = {};
    attributeRequiredFlags: { [key: string]: boolean } = {};

    loadingAttributeIds = new Set<string>();

    ngOnInit() {
        // Componente inicializado
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['visible'] && changes['visible'].currentValue === true) {
            this.resetForm();
            this.loadAvailableAttributes();
        }
    }

    resetForm() {
        this.selectedAttributes = [];
        this.selectedAttributeValues = {};
        this.attributeOrders = {};
        this.attributeRequiredFlags = {};
        this.attributeValuesMap = {};
        this.loadingAttributeIds.clear();
    }

    loadAvailableAttributes(): void {
        this.loadingAttributes = true;

        this.attributeService.getAttribute({}).subscribe({
            next: (response) => {
                this.availableAttributes = response.data || [];
                this.loadingAttributes = false;

                // Cargar valores para todos los atributos
                const allAttributeIds = this.availableAttributes.map((attr) => attr.id!).filter((id) => id && !this.attributeValuesMap[id]) as string[];

                if (allAttributeIds.length > 0) {
                    this.loadAttributeValues(allAttributeIds);
                }
            },
            error: (error) => {
                console.error('Error loading attributes:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: this.translocoService.translate('admin.products.messages.error.title'),
                    detail: this.translocoService.translate('admin.productAttributes.messages.error.loadingAttributes'),
                    life: 5000
                });
                this.loadingAttributes = false;
            }
        });
    }

    getAvailableValues(attributeId: string): AttributeValue[] {
        const allValues = this.attributeValuesMap[attributeId] || [];

        // Obtener los valores ya asignados para este atributo
        const assignedValueIds = this.existingAttributes
            .filter((attr) => attr.attributeId === attributeId)
            .map((attr) => attr.attributeValueId)
            .filter((id) => id) as string[];

        // Filtrar excluyendo los ya asignados
        return allValues.filter((value) => !assignedValueIds.includes(value.id!));
    }

    loadExistingAttributes(): void {
        if (!this.product?.id || !this.existingAttributes.length) return;

        this.existingAttributes.forEach((attr) => {
            if (attr.attributeId && attr.attribute) {
                const existingAttr = this.availableAttributes.find((a) => a.id === attr.attributeId);
                if (existingAttr && !this.selectedAttributes.find((a) => a.id === attr.attributeId)) {
                    this.selectedAttributes.push(existingAttr);

                    if (attr.attributeValueId) {
                        this.selectedAttributeValues[attr.attributeId] = attr.attributeValueId;
                    }

                    this.attributeOrders[attr.attributeId] = attr.attributeValue?.order || 1;
                    this.attributeRequiredFlags[attr.attributeId] = attr.required || false;
                }
            }
        });

        // Cargar valores para atributos existentes
        const existingAttributeIds = this.selectedAttributes.map((attr) => attr.id!);
        if (existingAttributeIds.length > 0) {
            this.loadAttributeValues(existingAttributeIds);
        }
    }

    onAttributesSelectionChange(selectedAttrs: Attribute[]): void {
        // Identificar atributos nuevos que se han seleccionado y no tienen valores cargados
        const newAttributeIds = selectedAttrs.map((attr) => attr.id!).filter((id) => !this.attributeValuesMap[id] && !this.loadingAttributeIds.has(id));

        if (newAttributeIds.length > 0) {
            this.loadAttributeValues(newAttributeIds);
        }

        // Identificar atributos que se han deseleccionado y limpiar sus valores del cache
        const deselectedAttributeIds = this.selectedAttributes.filter((prevAttr) => !selectedAttrs.find((newAttr) => newAttr.id === prevAttr.id)).map((attr) => attr.id!);

        deselectedAttributeIds.forEach((id) => {
            if (!this.existingAttributes.find((attr) => attr.attributeId === id)) {
                delete this.attributeValuesMap[id];
                delete this.selectedAttributeValues[id];
                delete this.attributeOrders[id];
                delete this.attributeRequiredFlags[id];
            }
        });

        // Actualizar la lista de atributos seleccionados
        this.selectedAttributes = selectedAttrs;
    }

    private loadAttributeValues(attributeIds: string[]): void {
        this.loadingAttributeValues = true;

        // Marcar atributos como cargando
        attributeIds.forEach((id) => this.loadingAttributeIds.add(id));

        const attributeValueObservables = attributeIds.map((attributeId) =>
            this.attributeValueService.getValuesByAttribute(attributeId, {
                isActive: true,
                page: 1,
                pageSize: 100
            })
        );

        forkJoin(attributeValueObservables).subscribe({
            next: (responses) => {
                responses.forEach((response, index) => {
                    const attributeId = attributeIds[index];
                    this.attributeValuesMap[attributeId] = response.data || [];
                    this.loadingAttributeIds.delete(attributeId);
                });
                this.loadingAttributeValues = false;
            },
            error: (error) => {
                console.error('Error loading attribute values:', error);
                attributeIds.forEach((id) => this.loadingAttributeIds.delete(id));
                this.loadingAttributeValues = false;
                this.messageService.add({
                    severity: 'error',
                    summary: this.translocoService.translate('admin.products.messages.error.title'),
                    detail: this.translocoService.translate('admin.productAttributes.messages.error.loadingValues'),
                    life: 5000
                });
            }
        });
    }

    removeAttribute(attribute: Attribute): void {
        this.selectedAttributes = this.selectedAttributes.filter((a) => a.id !== attribute.id);
        delete this.selectedAttributeValues[attribute.id!];
        delete this.attributeOrders[attribute.id!];
        delete this.attributeRequiredFlags[attribute.id!];
    }

    saveAttributes(): void {
        if (!this.product?.id) return;

        // Validar que nuevos atributos tengan valor si son required
        const hasErrors = this.selectedAttributes.some((attr) => {
            const isExisting = this.existingAttributes.find((e) => e.attributeId === attr.id);

            if (!isExisting && attr.required && !this.selectedAttributeValues[attr.id!]) {
                const errorMessage = this.translocoService.translate('admin.productAttributes.messages.validation.valueRequired', {
                    attributeName: attr.name
                });

                this.messageService.add({
                    severity: 'error',
                    summary: this.translocoService.translate('admin.products.messages.validation.title'),
                    detail: errorMessage,
                    life: 5000
                });
                return true;
            }
            return false;
        });

        if (hasErrors) return;

        this.saving = true;

        // Solo crear NUEVOS atributos (NO eliminar los existentes)
        const attributeDtos = this.selectedAttributes
            .filter((attr) => {
                return this.selectedAttributeValues[attr.id!];
            })
            .map((attr) => {
                const value = this.selectedAttributeValues[attr.id!];
                const attributeValueId = typeof value === 'string' ? value : (value as any)?.id || value;

                return {
                    productId: this.product!.id!,
                    attributeId: attr.id!,
                    attributeValueId: attributeValueId,
                    required: this.attributeRequiredFlags[attr.id!] || false,
                    order: this.attributeOrders[attr.id!] || 1
                };
            });

        if (attributeDtos.length === 0) {
            this.messageService.add({
                severity: 'info',
                summary: this.translocoService.translate('admin.productAttributes.messages.noChanges'),
                detail: this.translocoService.translate('admin.productAttributes.messages.noAttributesToAdd'),
                life: 3000
            });
            this.saving = false;
            return;
        }

        this.productAttributeValueService.createProductAttributeValue(attributeDtos).subscribe({
            next: (newAttributes) => {
                this.visible = false;
                this.resetForm();
                this.save.emit();
                this.saving = false;

                this.messageService.add({
                    severity: 'success',
                    summary: this.translocoService.translate('admin.products.messages.success.title'),
                    detail: this.translocoService.translate('admin.productAttributes.messages.success.attributesSaved'),
                    life: 3000
                });
            },
            error: (error) => {
                console.error('Error saving product attributes:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: this.translocoService.translate('admin.products.messages.error.title'),
                    detail: this.translocoService.translate('admin.productAttributes.messages.error.savingAttributes'),
                    life: 5000
                });
                this.saving = false;
            }
        });
    }

    getTranslatedInputType(inputType: string): string {
        const translationKey = `admin.productAttributes.inputTypes.${inputType}`;
        const translated = this.translocoService.translate(translationKey);

        // Si no hay traducción específica, intenta con las de attributes generales
        if (translated === translationKey) {
            const fallbackKey = `admin.attributes.inputTypes.${inputType}`;
            const fallbackTranslation = this.translocoService.translate(fallbackKey);
            return fallbackTranslation !== fallbackKey ? fallbackTranslation : inputType;
        }

        return translated;
    }

    onCancel() {
        this.cancel.emit();
    }

    onHide() {
        this.hide.emit();
    }

    removeExistingAttribute(attr: ProductAttributeValue): void {
        if (!attr.id) return;

        const attributeName = attr.attribute?.name || this.translocoService.translate('admin.productAttributes.sections.currentAttributes.unknownAttribute');
        const message = this.translocoService.translate('admin.productAttributes.confirmations.removeAttribute.message', { attributeName });

        this.confirmationService.confirm({
            message: message,
            header: this.translocoService.translate('admin.productAttributes.confirmations.removeAttribute.header'),
            icon: 'pi pi-exclamation-triangle',
            acceptButtonStyleClass: 'p-button-danger',
            rejectButtonStyleClass: 'p-button-text',
            accept: () => {
                this.productAttributeValueService.deleteProductAttribute(attr.id!).subscribe({
                    next: () => {
                        this.existingAttributes = this.existingAttributes.filter((a) => a.id !== attr.id);
                        this.selectedAttributes = this.selectedAttributes.filter((a) => a.id !== attr.attributeId);
                        this.delete.emit();
                    },
                    error: (error) => {
                        console.error('Error removing attribute:', error);
                        this.messageService.add({
                            severity: 'error',
                            summary: this.translocoService.translate('admin.products.messages.error.title'),
                            detail: this.translocoService.translate('admin.productAttributes.messages.error.removingAttribute'),
                            life: 5000
                        });
                    }
                });
            }
        });
    }
}
