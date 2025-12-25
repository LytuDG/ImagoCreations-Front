// pages/attributes/attribute-values.dialog.ts
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
import { Attribute } from './models/attribute';
import { AttributeValue } from './models/attributeValue';
import { AttributeValueService } from './services/attribute-value.service';
import { ApiResponse } from '@/core/models/apiResponse';
import { Divider } from 'primeng/divider';
import { InputGroupAddon } from 'primeng/inputgroupaddon';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';

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
    Divider,
    InputGroupAddon,
    DividerModule,
    TagModule,
    InputGroupModule,
    InputGroupAddonModule
  ],
  template: `
    <p-toast />

    <p-dialog
      [(visible)]="visible"
      [style]="{ maxHeight: '80vh' }"
      [header]="dialogHeader"
      [modal]="true"
      [draggable]="false"
      [closable]="!saving"
      (onHide)="onHide()"
    >
      <ng-template #content>
        <!-- Formulario para crear/editar valor -->
        <div class="flex flex-col gap-4 p-fluid mb-4">
            @if(showForm){
                <h5 class="m-0">{{ isEditingValue ? 'Editar Valor' : 'Nuevo Valor' }}</h5>

                <!-- Contenedor principal en grid -->
                <div class="grid">
                <!-- Valor (texto) - Ocupa toda la fila -->
                <div class="col-12 field">
                    <label for="value" class="block font-bold mb-2">Valor *</label>
                    <input
                    type="text"
                    pInputText
                    id="value"
                    [(ngModel)]="editingValue.value"
                    required
                    class="w-full"
                    placeholder="Ej: Rojo, XL, Algodón..."
                    [disabled]="saving"
                    />
                </div>

                <!-- Sección de Modificador de Precio -->
                <div class="col-12 field">
                    <label class="block font-bold mb-2">Modificador de Precio</label>
                    <div class="grid">
                    <!-- Tipo de Modificador -->
                    <div class="col-12 md:col-6">
                        <label class="block text-sm mb-2">Tipo</label>
                        <div class="flex gap-3">
                        <!-- Opciones de radio button -->
                        <div class="flex align-items-center">
                            <p-radiobutton inputId="fixed" name="modifierType" value="fixed" [(ngModel)]="editingValue.modifierType" [disabled]="saving" />
                            <label for="fixed" class="ml-2 cursor-pointer">Fijo</label>
                        </div>
                        <div class="flex align-items-center">
                            <p-radiobutton inputId="percent" name="modifierType" value="percent" [(ngModel)]="editingValue.modifierType" [disabled]="saving" />
                            <label for="percent" class="ml-2 cursor-pointer">Porcentaje</label>
                        </div>
                        </div>
                    </div>

                    <!-- Monto del Modificador -->
                    <div class="col-12 md:col-6">
                        <label for="priceModifier" class="block text-sm mb-2">Monto</label>
                        <!-- Uso correcto de p-inputgroup -->
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
                    </div>
                    </div>
                </div>

                <!-- Orden y Estado en la misma fila -->
                <div class="col-12 grid">
                    <div class="col-12 md:col-6 field">
                    <label for="order" class="block font-bold mb-2">Orden</label>
                    <p-inputnumber
                        id="order"
                        [(ngModel)]="editingValue.order"
                        [min]="0"
                        [max]="1000"
                        class="w-full"
                        [disabled]="saving">
                    </p-inputnumber>
                    <small class="text-color-secondary">Controla el orden de visualización</small>
                    </div>

                    <div class="col-12 md:col-6 field">
                    <label class="block font-bold mb-2">Estado</label>
                    <div class="flex align-items-center">
                        <p-togglebutton
                        [(ngModel)]="editingValue.isActive"
                        onLabel="Activo"
                        offLabel="Inactivo"
                        onIcon="pi pi-check"
                        offIcon="pi pi-times"
                        [style]="{ 'width': '120px' }"
                        [disabled]="saving">
                        </p-togglebutton>
                    </div>
                    </div>
                </div>
                </div>
                <!-- Fin del contenedor grid -->

                <!-- Botones del formulario -->
                <div class="flex justify-end gap-2 mt-4">
                <p-button label="Cancelar" icon="pi pi-times" text (click)="cancelEditValue()" [disabled]="saving" />
                <p-button label="Guardar Valor" icon="pi pi-check" (click)="saveValue()" [disabled]="!editingValue.value || saving" [loading]="saving" />
                </div>

                <p-divider />
            }
        </div>

        <!-- Lista de valores existentes -->
        <div class="flex flex-col">
          <div class="flex justify-content-between align-items-center mb-3">
            <h5 class="m-0">Valores Configurados</h5>
            <p-button
              label="Nuevo Valor"
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
                  <th style="min-width: 8rem">Valor</th>
                  <th style="min-width: 10rem">Modificador</th>
                  <th style="min-width: 5rem">Orden</th>
                  <th style="min-width: 6rem">Estado</th>
                  <th style="min-width: 8rem">Acciones</th>
                </tr>
              </ng-template>

              <ng-template #body let-value>
                <tr [ngClass]="{ 'bg-surface-100': editingValue?.id === value.id }">
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
                      <div class="text-xs text-color-secondary">Fijo</div>
                    }
                    @if (value.modifierType === 'percent') {
                      <span class="font-medium text-blue-600">
                        +{{ value.priceModifier }}%
                      </span>
                      <div class="text-xs text-color-secondary">Porcentaje</div>
                    }
                    @if (value.priceModifier === 0) {
                      <span class="text-color-secondary">Sin modificador</span>
                    }
                  </td>
                  <td style="min-width: 5rem">
                    <span class="font-medium">{{ value.order }}</span>
                  </td>
                  <td style="min-width: 6rem">
                    <p-tag
                      [value]="value.isActive ? 'Activo' : 'Inactivo'"
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
                        [title]="'Editar ' + value.value"
                      />
                      <p-button
                        icon="pi pi-trash"
                        [rounded]="true"
                        [text]="true"
                        severity="danger"
                        (click)="deleteValue(value)"
                        [title]="'Eliminar ' + value.value"
                      />
                    </div>
                  </td>
                </tr>
              </ng-template>

              <ng-template #emptymessage>
                <tr>
                  <td colspan="5" class="text-center py-4">
                    <div class="flex flex-column align-items-center gap-2">
                      <i class="pi pi-inbox text-4xl text-color-secondary"></i>
                      <span class="text-color-secondary">No hay valores configurados</span>
                    </div>
                  </td>
                </tr>
              </ng-template>
            </p-table>
          } @else {
            <div class="text-center py-8 border surface-border border-round">
              <i class="pi pi-inbox text-4xl text-color-secondary mb-3"></i>
              <p class="text-color-secondary mb-4">No hay valores configurados para este atributo</p>
              <p-button
                label="Agregar Primer Valor"
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

  // Header dinámico del diálogo
  get dialogHeader(): string {
    if (!this.attribute) return 'Valores de Atributo';
    return `Valores de: ${this.attribute.name}`;
  }

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

  // Cargar valores del atributo
  loadAttributeValues(): void {
    if (!this.attribute?.id) return;

    this.loadingValues = true;

    this.attributeValueService.getValuesByAttribute(this.attribute.id, {
      page: 1,
      pageSize: 100, // Cargar muchos valores para este atributo
/*       sortField: 'order',
      sortDirection: 'asc' */
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
          detail: 'Error cargando valores del atributo',
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
            summary: 'Éxito',
            detail: 'Valor actualizado correctamente',
            life: 3000
          });
        },
        error: (error) => {
          console.error('Error actualizando valor:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al actualizar el valor',
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
                summary: 'Éxito',
                detail: 'Valor creado correctamente',
                life: 3000
                });
            },
            error: (error) => {
                console.error('Error creando valor:', error);
                this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Error al crear el valor',
                life: 3000
                });
            }
        });
    }
  }

  // Eliminar un valor
  deleteValue(value: AttributeValue): void {
    if (!value.id) return;

    this.confirmationService.confirm({
      message: `¿Estás seguro de eliminar el valor "${value.value}"?`,
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.attributeValueService.deleteAttributeValue(value.id!).subscribe({
          next: () => {
            this.attributeValues = this.attributeValues.filter(v => v.id !== value.id);
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Valor eliminado correctamente',
              life: 3000
            });
          },
          error: (error) => {
            console.error('Error eliminando valor:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al eliminar el valor',
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

// Añade estos métodos en tu clase:

    getFixedModifierExample(): string {
        const modifier = this.editingValue.priceModifier || 0;
        const result = 100 + modifier;
        // Formatea a 2 decimales
        return result.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    getPercentModifierExample(): string {
        const percent = this.editingValue.priceModifier || 0;
        const result = 100 * (1 + percent / 100);
        // Formatea a 2 decimales
        return result.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
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
