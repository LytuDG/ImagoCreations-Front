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
import { MessageService } from 'primeng/api';
import { forkJoin } from 'rxjs';
import { Attribute } from '@/pages/admin/attributes/models/attribute';
import { Product } from '@/core/models/product/product';
import { AttributeValue } from '../attributes/models/attributeValue';
import { AttributeValueService } from '../attributes/services/attribute-value.service';
import { AttributeService } from '../attributes/services/attribute.service';
import { ProductAttributeValue } from './models/product-atribute-value';
import { ProductAttributeValueService } from './service/product-atributte-value.service';

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
    ProgressSpinnerModule
  ],
  template: `
    <p-dialog
      [(visible)]="visible"
      [style]="{ width: '700px' }"
      [modal]="true"
      [closable]="!saving && !loadingAttributes && !loadingAttributeValues"
      [closeOnEscape]="!saving && !loadingAttributes && !loadingAttributeValues"
      (onHide)="onHide()"
    >
      <ng-template #header>
        <div class="flex items-center gap-3">
          <i class="pi pi-tags text-2xl"></i>
          <span class="font-semibold text-xl">Manage Attributes for {{ product?.name }}</span>
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
                  {{ loadingAttributes ? 'Loading available attributes...' : 'Loading attribute values...' }}
                </span>
              </div>
            </div>
          }

          <!-- Main content when loaded -->
          @if (!loadingAttributes && !loadingAttributeValues) {
            <!-- Available Attributes Selector -->
            <div class="mb-6">
              <label class="block font-semibold mb-3 text-gray-700">Select Attributes</label>
              <p-multiSelect
                [options]="availableAttributes"
                [(ngModel)]="selectedAttributes"
                (ngModelChange)="onAttributesSelectionChange($event)"
                optionLabel="name"
                placeholder="Choose attributes to assign"
                [showClear]="true"
                [filter]="true"
                display="chip"
                class="w-full"
              >
                <ng-template let-attribute pTemplate="item">
                  <div class="flex items-center">
                    <span>{{ attribute.name }}</span>
                    <span class="ml-2 text-xs text-gray-500">({{ getInputTypeLabel(attribute.inputType) }})</span>
                  </div>
                </ng-template>
              </p-multiSelect>
              <small class="text-gray-500">Attributes marked as reusable can be assigned to multiple products</small>
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
                          <p-tag [value]="getInputTypeLabel(attribute.inputType)" severity="info" size="small" />
                          @if (attribute.reusable) {
                            <span class="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">Reusable</span>
                          }
                          @if (attribute.required) {
                            <span class="text-xs text-red-600 bg-red-50 px-2 py-1 rounded">Required</span>
                          }
                        </div>
                      </div>
                      <p-button
                        icon="pi pi-times"
                        severity="danger"
                        [text]="true"
                        [rounded]="true"
                        (onClick)="removeAttribute(attribute)"
                      />
                    </div>

                    <!-- Value Selection -->
                    <div class="mb-3">
                      <label class="block text-sm font-medium text-gray-700 mb-2">Select Value</label>
                      @if (attributeValuesMap[attribute.id!]?.length) {
                        <div>
                          <p-select
                            [options]="attributeValuesMap[attribute.id!]"
                            [(ngModel)]="selectedAttributeValues[attribute.id!]"
                            optionLabel="value"
                            placeholder="Choose a value"
                            [showClear]="true"
                            class="w-full"
                          >
                            <ng-template let-value pTemplate="item">
                              <div class="flex justify-between items-center">
                                <span>{{ value.value }}</span>
                                @if (value.priceModifier) {
                                  <span class="text-xs" [ngClass]="value.priceModifier > 0 ? 'text-green-600' : 'text-red-600'">
                                    {{ value.priceModifier > 0 ? '+' : '' }}{{ value.priceModifier | currency:'USD' }}
                                  </span>
                                }
                              </div>
                            </ng-template>
                          </p-select>
                          @if (!selectedAttributeValues[attribute.id!] && attribute.required) {
                            <small class="text-red-500">
                              This attribute requires a value
                            </small>
                          }
                        </div>
                      }
                      @if (!attributeValuesMap[attribute.id!]?.length) {
                        <div class="text-center py-3 text-gray-400">
                          <i class="pi pi-exclamation-circle mr-2"></i>
                          No values available for this attribute
                        </div>
                      }
                    </div>

                    <!-- Configuration Options -->
                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Order</label>
                        <p-inputNumber
                          [(ngModel)]="attributeOrders[attribute.id!]"
                          [min]="1"
                          [max]="100"
                          placeholder="Order"
                          class="w-full"
                        />
                      </div>
                      <div class="flex items-center mt-7.5 ml-24">
                        <p-checkbox
                          [(ngModel)]="attributeRequiredFlags[attribute.id!]"
                          [binary]="true"
                          [inputId]="'required-' + attribute.id"
                        />
                        <label [for]="'required-' + attribute.id" class="items ml-2 text-sm font-medium text-gray-700">
                          Required for this product
                        </label>
                      </div>
                    </div>
                  </div>
                }
              </div>
            }

            <!-- Empty state -->
            @if (!selectedAttributes.length) {
              <div class="text-center py-8">
                <i class="pi pi-tags text-5xl text-gray-300 mb-4"></i>
                <p class="text-gray-500">Select attributes from the dropdown above to configure them for this product</p>
              </div>
            }
          }

          <!-- Saving progress -->
          @if (saving) {
            <div class="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p-progressSpinner [style]="{ width: '30px', height: '30px' }" strokeWidth="4" />
              <span class="text-blue-700 font-medium">Saving attributes...</span>
            </div>
          }
        </div>
      </ng-template>

      <ng-template #footer>
        <div class="flex justify-between items-center">
          <div class="text-sm mr-2.5 text-gray-500">
            {{ selectedAttributes.length }} attribute{{ selectedAttributes.length !== 1 ? 's' : '' }} selected
          </div>
          <div class="flex justify-end gap-2">
            <p-button
              label="Cancel"
              icon="pi pi-times"
              severity="secondary"
              [outlined]="true"
              (onClick)="onCancel()"
              [disabled]="saving || loadingAttributes || loadingAttributeValues"
            />
            <p-button
              label="Save Attributes"
              icon="pi pi-check"
              (onClick)="saveAttributes()"
              [loading]="saving"
              [disabled]="saving || loadingAttributes || loadingAttributeValues || !selectedAttributes.length"
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

  @Input() visible: boolean = false;
  @Input() product: Product | null = null;
  @Input() existingAttributes: ProductAttributeValue[] = [];

  @Output() save = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  @Output() hide = new EventEmitter<void>();

  saving: boolean = false;
  loadingAttributes: boolean = false;
  loadingAttributeValues: boolean = false;

  availableAttributes: Attribute[] = [];
  selectedAttributes: Attribute[] = [];

  attributeValuesMap: { [key: string]: AttributeValue[] } = {};
  selectedAttributeValues: { [key: string]: string } = {};
  attributeOrders: { [key: string]: number } = {};
  attributeRequiredFlags: { [key: string]: boolean } = {};

  // Para rastrear qué atributos están cargando sus valores
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
        this.loadExistingAttributes();
      },
      error: (error) => {
        console.error('Error loading attributes:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load available attributes',
          life: 5000
        });
        this.loadingAttributes = false;
      }
    });
  }

  loadExistingAttributes(): void {
    if (!this.product?.id || !this.existingAttributes.length) return;

    this.existingAttributes.forEach(attr => {
      if (attr.attributeId && attr.attribute) {
        const existingAttr = this.availableAttributes.find(a => a.id === attr.attributeId);
        if (existingAttr && !this.selectedAttributes.find(a => a.id === attr.attributeId)) {
          this.selectedAttributes.push(existingAttr);

          if (attr.attributeValueId) {
            this.selectedAttributeValues[attr.attributeId] = attr.attributeValueId;
          }

          this.attributeOrders[attr.attributeId] = attr.sortOrder || 1;
          this.attributeRequiredFlags[attr.attributeId] = attr.required || false;
        }
      }
    });

    // Cargar valores para atributos existentes
    const existingAttributeIds = this.selectedAttributes.map(attr => attr.id!);
    if (existingAttributeIds.length > 0) {
      this.loadAttributeValues(existingAttributeIds);
    }
  }

  onAttributesSelectionChange(selectedAttrs: Attribute[]): void {
    // Identificar atributos nuevos que se han seleccionado y no tienen valores cargados
    const newAttributeIds = selectedAttrs
      .map(attr => attr.id!)
      .filter(id => !this.attributeValuesMap[id] && !this.loadingAttributeIds.has(id));

    if (newAttributeIds.length > 0) {
      this.loadAttributeValues(newAttributeIds);
    }

    // Identificar atributos que se han deseleccionado y limpiar sus valores del cache
    const deselectedAttributeIds = this.selectedAttributes
      .filter(prevAttr => !selectedAttrs.find(newAttr => newAttr.id === prevAttr.id))
      .map(attr => attr.id!);

    deselectedAttributeIds.forEach(id => {
      if (!this.existingAttributes.find(attr => attr.attributeId === id)) {
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
    attributeIds.forEach(id => this.loadingAttributeIds.add(id));

    const attributeValueObservables = attributeIds.map(attributeId =>
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
        attributeIds.forEach(id => this.loadingAttributeIds.delete(id));
        this.loadingAttributeValues = false;
      }
    });
  }

  removeAttribute(attribute: Attribute): void {
    this.selectedAttributes = this.selectedAttributes.filter(a => a.id !== attribute.id);
    delete this.selectedAttributeValues[attribute.id!];
    delete this.attributeOrders[attribute.id!];
    delete this.attributeRequiredFlags[attribute.id!];

    // Opcional: Si quieres liberar memoria, puedes eliminar del cache
    // delete this.attributeValuesMap[attribute.id!];
  }

  saveAttributes(): void {
    if (!this.product?.id) return;

    const hasErrors = this.selectedAttributes.some(attr => {
      if (attr.required && !this.selectedAttributeValues[attr.id!]) {
        this.messageService.add({
          severity: 'error',
          summary: 'Validation Error',
          detail: `Value required for attribute: ${attr.name}`,
          life: 5000
        });
        return true;
      }
      return false;
    });

    if (hasErrors) return;

    this.saving = true;

    const attributeDtos = this.selectedAttributes
        .filter(attr => this.selectedAttributeValues[attr.id!])
        .map(attr => {
            const value = this.selectedAttributeValues[attr.id!];

            // Asegurarte de que solo envías el ID (string)
            const attributeValueId = typeof value === 'string'
                ? value
                : (value as any)?.id || value;

            return {
                productId: this.product!.id!,
                attributeId: attr.id!,
                attributeValueId: attributeValueId,
                required: this.attributeRequiredFlags[attr.id!] || false,
                order: this.attributeOrders[attr.id!] || 1
            };
        });

    const deleteAttributeObservables = this.existingAttributes
      .filter(attr => attr.id)
      .map(attr => this.productAttributeValueService.deleteProductAttribute(attr.id!));

    const createAttributeObservables = attributeDtos.map(dto =>
      this.productAttributeValueService.createProductAttributeValue(dto)
    );

    const allOperations = [...deleteAttributeObservables, ...createAttributeObservables];

    forkJoin(allOperations).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Product attributes saved successfully',
          life: 3000
        });
        this.save.emit();
        this.visible = false;
        this.saving = false;
      },
      error: (error) => {
        console.error('Error saving product attributes:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to save product attributes',
          life: 5000
        });
        this.saving = false;
      }
    });
  }

  getInputTypeLabel(inputType: string): string {
    const labels: { [key: string]: string } = {
      'text': 'Text',
      'number': 'Number',
      'select': 'Select',
      'checkbox': 'Checkbox',
      'radio': 'Radio',
      'textarea': 'Textarea',
      'date': 'Date'
    };
    return labels[inputType] || inputType;
  }

  onCancel() {
    this.cancel.emit();
  }

  onHide() {
    this.hide.emit();
  }
}
