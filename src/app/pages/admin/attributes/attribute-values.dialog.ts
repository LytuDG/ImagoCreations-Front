import { Component, inject, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { Attribute } from './models/attribute';
import { AttributeValue } from './models/attributeValue';
import { AttributeValueService } from './services/attribute-value.service';
import { ApiResponse } from '@/core/models/apiResponse';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddon } from "primeng/inputgroupaddon";

@Component({
  selector: 'app-attribute-values-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    SelectModule,
    RadioButtonModule,
    ToggleButtonModule,
    DialogModule,
    TableModule,
    ToastModule,
    ConfirmDialogModule,
    DividerModule,
    TagModule,
    InputGroupModule,
    TranslocoModule,
    InputGroupAddon
],
  template: `
    <p-toast />

    <p-dialog
      [(visible)]="visible"
      [style]="{ maxHeight: '80vh', minWidth: '49vw' }"
      [header]="getDialogHeader()"
      [modal]="true"
      [draggable]="false"
      [closable]="!saving"
      (onHide)="onHide()"
    >
      <ng-template #content>
        <!-- Formulario para crear/editar valor -->
        <div class="flex flex-col gap-4 mb-4 justify-center">
            @if(showForm){
                <!-- Contenedor principal en grid -->
                <div class="grid justify-center">
                    <!-- Valor (texto) - Ocupa toda la fila -->
                    <div class="col-12 field mb-4">
                        <h5 class="m-0">{{ getFormTitle() }}</h5>
                        <label for="value" class="block font-bold mb-2">
                            {{ 'admin.attributes.values.form.value' | transloco }}
                        </label>
                        <input
                        type="text"
                        pInputText
                        id="value"
                        [(ngModel)]="editingValue.value"
                        required
                        class="w-full"
                        [placeholder]="'admin.attributes.values.placeholders.value' | transloco"
                        [disabled]="saving"
                        />
                    </div>

                    <!-- Sección de Modificador de Precio -->
                    <div class="col-12">
                        <label class="font-bold mt-2">
                            {{ 'admin.attributes.values.form.priceModifier.title' | transloco }}
                        </label>
                        <div class="mb-6 mt-2">
                        <!-- Tipo de Modificador -->
                          <div class="col-12 md:col-6 mb-6">
                            <label class="block text-sm mb-2">
                                {{ 'admin.attributes.values.form.priceModifier.type' | transloco }}
                            </label>
                            <div class="flex gap-3">
                            <!-- Opciones de radio button -->
                              <div class="flex items-center">
                                <p-radiobutton
                                    inputId="fixed"
                                    name="modifierType"
                                    value="fixed"
                                    [(ngModel)]="editingValue.modifierType"
                                    [disabled]="saving"
                                />
                                <label for="fixed" class="ml-2 cursor-pointer">
                                    {{ 'admin.attributes.values.form.priceModifier.fixed' | transloco }}
                                </label>
                              </div>
                              <div class="flex items-center">
                                <p-radiobutton
                                    inputId="percent"
                                    name="modifierType"
                                    value="percent"
                                    [(ngModel)]="editingValue.modifierType"
                                    [disabled]="saving"
                                />
                                <label for="percent" class="ml-2 cursor-pointer">
                                    {{ 'admin.attributes.values.form.priceModifier.percent' | transloco }}
                                </label>
                              </div>
                            </div>
                          </div>

                        <!-- Monto del Modificador -->
                          <div class="col-12 md:col-6">
                            <label for="priceModifier" class="block text-sm mb-2">
                                {{ 'admin.attributes.values.form.priceModifier.amount' | transloco }}
                            </label>
                            <p-inputgroup>
                            <p-inputgroup-addon>
                                {{ editingValue.modifierType === 'percent' ? '%' : '$' }}
                            </p-inputgroup-addon>
                            <p-inputnumber
                                id="priceModifier"
                                [(ngModel)]="editingValue.priceModifier"
                                mode="decimal"
                                [min]="editingValue.modifierType === 'percent' ? 0 : -100000"
                                [max]="editingValue.modifierType === 'percent' ? 100 : 100000"
                                [minFractionDigits]="2"
                                [maxFractionDigits]="2"
                                class="w-full"
                                [disabled]="saving">
                            </p-inputnumber>
                            </p-inputgroup>

                            <!-- Ejemplo de cálculo -->
                            @if (editingValue.priceModifier !== 0) {
                                <small class="text-color-secondary block mt-2">
                                    {{ getModifierExample() }}
                                </small>
                            }
                          </div>
                        </div>
                    </div>

                <!-- Orden y Estado en la misma fila -->
                  <div class="col-12 grid">
                    <div class="col-12 md:col-6 field">
                    <label for="order" class="block font-bold mb-2">
                        {{ 'admin.attributes.values.form.order.label' | transloco }}
                    </label>
                    <p-inputnumber
                        id="order"
                        [(ngModel)]="editingValue.order"
                        [min]="0"
                        [max]="1000"
                        class="w-full"
                        [disabled]="saving">
                    </p-inputnumber>
                    <small class="text-color-secondary">
                        {{ 'admin.attributes.values.form.order.description' | transloco }}
                    </small>
                    </div>

                    <div class="col-12 md:col-6 field mt-6">
                      <label class="block font-bold mb-2">
                        {{ 'admin.attributes.values.form.status.label' | transloco }}
                      </label>
                      <div class="flex items-center">
                        <p-togglebutton
                        [(ngModel)]="editingValue.isActive"
                        [onLabel]="'admin.attributes.values.form.status.active' | transloco"
                        [offLabel]="'admin.attributes.values.form.status.inactive' | transloco"
                        onIcon="pi pi-check"
                        offIcon="pi pi-times"
                        [style]="{ 'width': '120px' }"
                        [disabled]="saving">
                        </p-togglebutton>
                      </div>
                    </div>
                  </div>

                <!-- Botones del formulario -->
                <div class="flex justify-between col-12 mt-6">
                  <p-button
                    [label]="'admin.attributes.values.buttons.cancel' | transloco"
                    icon="pi pi-times"
                    text
                    (click)="cancelEditValue()"
                    [disabled]="saving"
                  />
                  <p-button
                    [label]="'admin.attributes.values.buttons.saveValue' | transloco"
                    icon="pi pi-check"
                    (click)="saveValue()"
                    [disabled]="!editingValue.value || saving"
                    [loading]="saving"
                  />
                </div>
                </div>
                <!-- Fin del contenedor grid -->
                <p-divider />
            }
        </div>

        <!-- Lista de valores existentes -->
        <div class="flex flex-col">
          <div class="flex justify-between">
            <h5 class="m-0">{{ 'admin.attributes.values.table.title' | transloco }}</h5>
            <p-button
              [label]="'admin.attributes.values.buttons.newValue' | transloco"
              icon="pi pi-plus"
              severity="secondary"
              size="small"
              (onClick)="addNewValue()"
              [disabled]="saving"
            />
          </div>

          <!-- Tabla de valores -->
          @if (attributeValues.length > 0) {
            <p-table
              [value]="attributeValues"
              [tableStyle]="{ 'min-width': '50rem' }"
              [rowHover]="true"
              [loading]="loadingValues"
            >
              <ng-template #header>
                <tr>
                  <th style="min-width: 8rem">
                    {{ 'admin.attributes.values.table.columns.value' | transloco }}
                  </th>
                  <th style="min-width: 10rem">
                    {{ 'admin.attributes.values.table.columns.modifier' | transloco }}
                  </th>
                  <th style="min-width: 5rem">
                    {{ 'admin.attributes.values.table.columns.order' | transloco }}
                  </th>
                  <th style="min-width: 6rem">
                    {{ 'admin.attributes.values.table.columns.status' | transloco }}
                  </th>
                  <th style="min-width: 8rem">
                    {{ 'admin.attributes.values.table.columns.actions' | transloco }}
                  </th>
                </tr>
              </ng-template>

              <ng-template #body let-value>
                <tr [ngClass]="{ 'bg-surface-100': editingValue.id === value.id }">
                  <td style="min-width: 8rem">
                    <span class="font-medium">{{ value.value }}</span>
                    @if (value.code) {
                      <div class="text-xs text-color-secondary">{{ value.code }}</div>
                    }
                  </td>
                  <td style="min-width: 10rem">
                    @if (value.modifierType === 'fixed') {
                      <span class="font-medium text-green-600">
                        +{{ value.priceModifier | currency:'USD':'symbol':'1.2-2' }}
                      </span>
                      <div class="text-xs text-color-secondary">
                        {{ 'admin.attributes.values.table.modifierTypes.fixed' | transloco }}
                      </div>
                    }
                    @if (value.modifierType === 'percent') {
                      <span class="font-medium text-blue-600">
                        +{{ value.priceModifier }}%
                      </span>
                      <div class="text-xs text-color-secondary">
                        {{ 'admin.attributes.values.table.modifierTypes.percent' | transloco }}
                      </div>
                    }
                    @if (value.priceModifier === 0) {
                      <span class="text-color-secondary">
                        {{ 'admin.attributes.values.table.modifierTypes.none' | transloco }}
                      </span>
                    }
                  </td>
                  <td style="min-width: 5rem">
                    <span class="font-medium">{{ value.order }}</span>
                  </td>
                  <td style="min-width: 6rem">
                    <p-tag
                      [value]="value.isActive ?
                        ('admin.attributes.values.form.status.active' | transloco) :
                        ('admin.attributes.values.form.status.inactive' | transloco)"
                      [severity]="value.isActive ? 'success' : 'secondary'"
                    />
                  </td>
                  <td style="min-width: 8rem">
                    <div class="flex gap-2">
                      <p-button
                        icon="pi pi-pencil"
                        [rounded]="true"
                        [text]="true"
                        severity="secondary"
                        (click)="editValue(value)"
                        [title]="'admin.attributes.values.buttons.edit' | transloco"
                      />
                      <p-button
                        icon="pi pi-trash"
                        [rounded]="true"
                        [text]="true"
                        severity="danger"
                        (click)="deleteValue(value)"
                        [title]="'admin.attributes.values.buttons.delete' | transloco"
                      />
                    </div>
                  </td>
                </tr>
              </ng-template>

              <ng-template #emptymessage>
                <tr>
                  <td colspan="5" class="text-center py-4">
                    <div class="flex flex-column items-center gap-2">
                      <i class="pi pi-inbox text-4xl text-color-secondary"></i>
                      <span class="text-color-secondary">
                        {{ 'admin.attributes.values.table.empty.title' | transloco }}
                      </span>
                    </div>
                  </td>
                </tr>
              </ng-template>
            </p-table>
          } @else {
            <div class="text-center py-8 border surface-border border-round">
              <i class="pi pi-inbox text-4xl text-color-secondary mb-3"></i>
              <p class="text-color-secondary mb-4">
                {{ 'admin.attributes.values.table.empty.description' | transloco }}
              </p>
              <p-button
                [label]="'admin.attributes.values.table.empty.addFirst' | transloco"
                icon="pi pi-plus"
                (onClick)="addNewValue()"
              />
            </div>
          }
        </div>
      </ng-template>
    </p-dialog>

    <p-confirmdialog [style]="{ width: '450px' }" />
  `,
  providers: [MessageService, ConfirmationService]
})
export class AttributeValuesDialogComponent implements OnInit, OnChanges {
  private attributeValueService = inject(AttributeValueService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private translocoService = inject(TranslocoService);

  @Input() visible: boolean = false;
  @Input() attribute: Attribute | null = null;
  @Input() saving: boolean = false;

  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();
  @Output() hide = new EventEmitter<void>();

  // Estado del componente
  attributeValues: AttributeValue[] = [];
  loadingValues: boolean = false;
  showForm: boolean = false;
  isEditingValue: boolean = false;

  // Valor que se está editando/creando
  editingValue: AttributeValue = this.getDefaultValue();

  ngOnInit() {
    if (this.attribute?.id) {
      this.loadAttributeValues();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['attribute'] && this.attribute?.id) {
      this.loadAttributeValues();
    }
  }

  // Obtener header del diálogo traducido
  getDialogHeader(): string {
    if (!this.attribute) return this.translocoService.translate('admin.attributes.values.dialog.header', { name: '' });

    const name = this.attribute.name || '';
    return this.translocoService.translate('admin.attributes.values.dialog.header', { name });
  }

  // Obtener título del formulario traducido
  getFormTitle(): string {
    return this.isEditingValue
      ? this.translocoService.translate('admin.attributes.values.dialog.editValue')
      : this.translocoService.translate('admin.attributes.values.dialog.newValue');
  }

  // Obtener ejemplo de modificador traducido
  getModifierExample(): string {
    const basePrice = 100;
    const modifier = this.editingValue.priceModifier || 0;

    if (this.editingValue.modifierType === 'fixed') {
      const result = basePrice + modifier;
      return this.translocoService.translate('admin.attributes.values.form.priceModifier.example', {
        price: basePrice.toFixed(2),
        modifier: `$${modifier.toFixed(2)}`,
        result: result.toFixed(2)
      });
    } else {
      const result = basePrice * (1 + modifier / 100);
      return this.translocoService.translate('admin.attributes.values.form.priceModifier.example', {
        price: basePrice.toFixed(2),
        modifier: `${modifier}%`,
        result: result.toFixed(2)
      });
    }
  }

  // Cargar valores del atributo
  loadAttributeValues(): void {
    if (!this.attribute?.id) return;

    this.loadingValues = true;

    this.attributeValueService.getValuesByAttribute(this.attribute.id, {
      page: 1,
      pageSize: 100
    }).subscribe({
      next: (response: ApiResponse<AttributeValue>) => {
        this.attributeValues = response.data || [];
        this.loadingValues = false;
      },
      error: (error) => {
        console.error('Error cargando valores:', error);
        this.loadingValues = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: this.translocoService.translate('admin.attributes.values.messages.error.loading'),
          life: 3000
        });
      }
    });
  }

  // Crear un nuevo valor
  addNewValue(): void {
    this.editingValue = this.getDefaultValue();
    this.isEditingValue = false;
    this.showForm = true;
  }

  // Editar un valor existente
  editValue(value: AttributeValue): void {
    this.editingValue = { ...value };
    this.isEditingValue = true;
    this.showForm = true;
  }

  // Cancelar edición/creación
  cancelEditValue(): void {
    this.showForm = false;
    this.editingValue = this.getDefaultValue();
  }

  // Guardar valor (crear o actualizar)
  saveValue(): void {
    if (!this.attribute?.id) return;

    const valueToSave: AttributeValue = {
      ...this.editingValue,
      attributeId: this.attribute.id
    };

    const successMessage = this.isEditingValue
      ? 'admin.attributes.values.messages.success.valueUpdated'
      : 'admin.attributes.values.messages.success.valueCreated';

    const errorMessage = this.isEditingValue
      ? 'admin.attributes.values.messages.error.updating'
      : 'admin.attributes.values.messages.error.creating';

    if (this.isEditingValue && valueToSave.id) {
      // Actualizar
      this.attributeValueService.updateAttributeValue(valueToSave.id, valueToSave).subscribe({
        next: (response: ApiResponse<AttributeValue>) => {
          // Actualizar en la lista local
          const index = this.attributeValues.findIndex(v => v.id === valueToSave.id);
          if (index !== -1 && response.data && response.data.length > 0) {
            this.attributeValues[index] = response.data[0] || valueToSave;
          }

          this.showForm = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: this.translocoService.translate(successMessage),
            life: 3000
          });
        },
        error: (error) => {
          console.error('Error actualizando valor:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: this.translocoService.translate(errorMessage),
            life: 3000
          });
        }
      });
    } else {
      // Crear nuevo
      this.attributeValueService.createAttributeValue(valueToSave).subscribe({
        next: (response: ApiResponse<AttributeValue>) => {
          let newValue: AttributeValue = valueToSave;

          if (response.data && response.data.length > 0) {
            newValue = response.data[0];
          }

          this.attributeValues = [...this.attributeValues, newValue];
          this.showForm = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: this.translocoService.translate(successMessage),
            life: 3000
          });
        },
        error: (error) => {
          console.error('Error creando valor:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: this.translocoService.translate(errorMessage),
            life: 3000
          });
        }
      });
    }
  }

  // Eliminar un valor
  deleteValue(value: AttributeValue): void {
    if (!value.id) return;

    // Interpolación manual del mensaje
    const message = this.translocoService.translate('admin.attributes.values.confirmations.delete.message')
      .replace('{value}', value.value);

    this.confirmationService.confirm({
      message: message,
      header: this.translocoService.translate('admin.attributes.values.confirmations.delete.header'),
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.attributeValueService.deleteAttributeValue(value.id!).subscribe({
          next: () => {
            this.attributeValues = this.attributeValues.filter(v => v.id !== value.id);
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: this.translocoService.translate('admin.attributes.values.messages.success.valueDeleted'),
              life: 3000
            });
          },
          error: (error) => {
            console.error('Error eliminando valor:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: this.translocoService.translate('admin.attributes.values.messages.error.deleting'),
              life: 3000
            });
          }
        });
      }
    });
  }

  // Valor por defecto para formulario
  getDefaultValue(): AttributeValue {
    return {
      value: '',
      modifierType: 'fixed',
      priceModifier: 0,
      order: this.attributeValues.length + 1,
      isActive: true,
      attributeId: this.attribute?.id || '',
    };
  }

  // Eventos del diálogo principal
  onSave(): void {
    this.save.emit({ attributeId: this.attribute?.id });
  }

  onCancel(): void {
    this.cancel.emit();
  }

  onHide(): void {
    this.hide.emit();
  }
}
