// pages/attributes/attribute-form.dialog.ts
import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { DialogModule } from 'primeng/dialog';
import { Attribute } from './models/attribute';
import { AgencyService } from '../agencies/agency.service';
import { Agency } from '../agencies/models/agency';
import {
  AttributeInputType,
  ATTRIBUTE_TYPE_OPTIONS,
  ATTRIBUTE_TYPE_CONFIG,
  requiresValues
} from './constants/attribute-types';

@Component({
  selector: 'app-attribute-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    ToggleButtonModule,
    DialogModule
  ],
  template: `
    <p-dialog
      [(visible)]="visible"
      [style]="{ width: '500px' }"
      [header]="isEditMode ? 'Editar Atributo' : 'Nuevo Atributo'"
      [modal]="true"
      [draggable]="false"
      [closable]="!saving"
      (onHide)="onHide()"
    >
      <ng-template #content>
        <div class="flex flex-col gap-4 p-fluid">
          <!-- Nombre del Atributo -->
          <div class="field">
            <label for="name" class="block font-bold mb-2">Nombre *</label>
            <input
              type="text"
              pInputText
              id="name"
              [(ngModel)]="localAttribute.name"
              required
              class="w-full"
              placeholder="Ej: Color, Talla, Material"
              [disabled]="saving"
            />
          </div>

          <!-- Tipo de Input -->
          <div class="field">
            <label for="inputType" class="block font-bold mb-2">Tipo de Campo *</label>
            <p-select
              [options]="inputTypeOptions"
              optionLabel="label"
              optionValue="value"
              [(ngModel)]="localAttribute.inputType"
              placeholder="Selecciona un tipo"
              class="w-full"
              [disabled]="saving"
              (onChange)="onInputTypeChange()"
            >
              <ng-template #option let-option>
                <div class="flex items-center gap-2">
                  <i [class]="option.icon" class="text-color-secondary"></i>
                  <div class="flex flex-column">
                    <span class="font-medium">{{ option.label }}</span>
                    <small class="text-color-secondary text-sm">{{ option.description }}</small>
                  </div>
                </div>
              </ng-template>
            </p-select>
            @if (selectedTypeConfig) {
              <small class="text-color-secondary block mt-2">
                <i [class]="selectedTypeConfig.icon" class="mr-1"></i>
                {{ selectedTypeConfig.description }}
                @if (selectedTypeConfig.supportsValues) {
                  <span class="ml-2 text-primary font-medium">
                    (Requiere valores predefinidos)
                  </span>
                }
              </small>
            }
          </div>

          <!-- Campo Agency con Select y Filtro -->
          <div class="field">
            <label for="agencyId" class="block font-bold mb-2">Agencia</label>
            <p-select
              [options]="filteredAgencies"
              optionLabel="name"
              optionValue="id"
              [(ngModel)]="localAttribute.agencyId"
              placeholder="Selecciona una agencia"
              [filter]="true"
              filterBy="name"
              [showClear]="true"
              [filterPlaceholder]="'Buscar agencia...'"
              class="w-full"
              [disabled]="saving || loadingAgencies"
            >
              <ng-template #empty>
                <div class="p-2 text-center">
                  {{ loadingAgencies ? 'Cargando agencias...' : 'No se encontraron agencias' }}
                </div>
              </ng-template>
            </p-select>
            @if (loadingAgencies) {
              <small class="text-color-secondary">Cargando lista de agencias...</small>
            }
          </div>

          <!-- Campos Booleanos - Alineados a la izquierda -->
          <div class="justify-start">
            <label class="block font-bold mb-2">Configuración</label>
        <!--grid-cols-2-->
            <div [style]="{'grid-template-columns': 'repeat(2, minmax(0, 0.3fr))'}" class="grid gap-4 p-3 surface-border border-round">
                <!-- Fila 1 -->
                <span class="font-medium flex items-center">Requerido</span>
                <div class="flex justify-start">
                <p-toggleButton
                    [(ngModel)]="localAttribute.required"
                    onLabel="Sí"
                    offLabel="No"
                    onIcon="pi pi-check"
                    offIcon="pi pi-times"
                    [style]="{ 'width': '80px' }"
                    [disabled]="saving"
                />
                </div>

                <!-- Fila 2 -->
                <span class="font-medium flex items-center">Reutilizable</span>
                <div class="flex justify-start">
                <p-toggleButton
                    [(ngModel)]="localAttribute.reusable"
                    onLabel="Sí"
                    offLabel="No"
                    onIcon="pi pi-check"
                    offIcon="pi pi-times"
                    [style]="{ 'width': '80px' }"
                    [disabled]="saving"
                />
                </div>

                <!-- Fila 3 -->
                <span class="font-medium flex items-center">Visible B2B</span>
                <div class="flex justify-start">
                <p-toggleButton
                    [(ngModel)]="localAttribute.visibleB2B"
                    onLabel="Sí"
                    offLabel="No"
                    onIcon="pi pi-check"
                    offIcon="pi pi-times"
                    [style]="{ 'width': '80px' }"
                    [disabled]="saving"
                />
                </div>

                <!-- Fila 4 -->
                <span class="font-medium flex items-center">Visible B2C</span>
                <div class="flex justify-start">
                <p-toggleButton
                    [(ngModel)]="localAttribute.visibleB2C"
                    onLabel="Sí"
                    offLabel="No"
                    onIcon="pi pi-check"
                    offIcon="pi pi-times"
                    [style]="{ 'width': '80px' }"
                    [disabled]="saving"
                />
                </div>
            </div>
          </div>

          <!-- Sección para gestión de valores (solo para tipos que los requieren) -->
          @if (showValuesSection && attribute?.id) {
            <div class="field mt-4">
              <div class="flex items-center justify-content-between mb-3">
                <label class="block font-bold mb-0">Valores Predefinidos</label>
                <p-button
                  label="Gestionar Valores"
                  icon="pi pi-cog"
                  size="small"
                  (onClick)="manageAttributeValues()"
                  [disabled]="saving"
                />
              </div>
              <div class="p-3 border surface-border border-round bg-surface-50">
                <div class="text-center py-3">
                  <i class="pi pi-info-circle text-color-secondary text-xl mr-2"></i>
                  <span class="text-color-secondary">
                    Este atributo requiere valores predefinidos.
                    Haz clic en "Gestionar Valores" para agregarlos.
                  </span>
                </div>
              </div>
            </div>
          }
        </div>
      </ng-template>

      <ng-template #footer>
        <div class="flex justify-content-end gap-2">
          <p-button
            label="Cancelar"
            icon="pi pi-times"
            text
            (click)="onCancel()"
            [disabled]="saving"
          />
          <p-button
            label="Guardar"
            icon="pi pi-check"
            (click)="onSave()"
            [disabled]="!localAttribute.name || !localAttribute.inputType || saving"
            [loading]="saving"
          />
        </div>
      </ng-template>
    </p-dialog>
  `
})
export class AttributeFormComponent implements OnInit, OnChanges {
  private agencyService = inject(AgencyService);

  @Input() visible: boolean = false;
  @Input() isEditMode: boolean = false;
  @Input() attribute: Attribute | null = null;
  @Input() saving: boolean = false;

  @Output() save = new EventEmitter<Attribute>();
  @Output() cancel = new EventEmitter<void>();
  @Output() hide = new EventEmitter<void>();
  @Output() manageValues = new EventEmitter<string>(); // Emitirá el attributeId

  // Datos locales para el formulario
  localAttribute: Attribute = this.getDefaultAttribute();

  // Para el select de Agencias
  allAgencies: Agency[] = [];
  filteredAgencies: Agency[] = [];
  loadingAgencies: boolean = false;

  // Opciones para el dropdown/select usando las constantes
  inputTypeOptions = ATTRIBUTE_TYPE_OPTIONS;

  // Configuración del tipo seleccionado
  selectedTypeConfig: any = null;

  // Controlar si mostrar la sección de valores
  showValuesSection: boolean = false;

  ngOnInit() {
    this.resetForm();
    this.loadAgencies();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['attribute']) {
      this.resetForm();
    }
  }

  // Cargar todas las agencias
  loadAgencies() {
    this.loadingAgencies = true;

    const params = {
      page: 1,
      pageSize: 100,
    };

    this.agencyService.getAgencies(params).subscribe({
      next: (response) => {
        this.allAgencies = response.data || [];
        this.filteredAgencies = [...this.allAgencies];
        this.loadingAgencies = false;
      },
      error: (error) => {
        console.error('Error cargando agencias:', error);
        this.allAgencies = [];
        this.filteredAgencies = [];
        this.loadingAgencies = false;
      }
    });
  }

  resetForm() {
    if (this.attribute) {
      this.localAttribute = { ...this.attribute };
    } else {
      this.localAttribute = this.getDefaultAttribute();
    }

    // Actualizar configuración del tipo seleccionado
    this.updateSelectedTypeConfig();
  }

  // Cuando cambia el tipo de input
  onInputTypeChange() {
    this.updateSelectedTypeConfig();
  }

  // Actualizar la configuración del tipo seleccionado
  updateSelectedTypeConfig() {
    if (this.localAttribute.inputType) {
      this.selectedTypeConfig = ATTRIBUTE_TYPE_CONFIG[this.localAttribute.inputType];
      this.showValuesSection = requiresValues(this.localAttribute.inputType);
    } else {
      this.selectedTypeConfig = null;
      this.showValuesSection = false;
    }
  }

  // Para gestionar valores (solo si es edición y el atributo ya tiene ID)
  manageAttributeValues() {
    if (this.attribute?.id) {
      this.manageValues.emit(this.attribute.id);
    }
  }

  onSave() {
    // Validación adicional: si requiere valores y es nuevo, mostrar advertencia
    if (requiresValues(this.localAttribute.inputType) && !this.attribute?.id) {
      console.warn('⚠️ Este tipo requiere valores predefinidos. Deberás agregarlos después de guardar.');
    }

    this.save.emit({ ...this.localAttribute });
  }

  onCancel() {
    this.cancel.emit();
  }

  onHide() {
    this.hide.emit();
  }

  getDefaultAttribute(): Attribute {
    return {
      name: '',
      inputType: AttributeInputType.TEXT, // Valor por defecto
      agencyId: '',
      required: false,
      reusable: true,
      visibleB2B: true,
      visibleB2C: true,
    };
  }
}
