// modules/attributes/components/attribute-form.dialog.ts
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
            ></p-select>
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
            <div class="flex flex-col gap-3 p-3 surface-border border-round">
                <div class="flex justify-content-between">
                    <span class="font-medium mr-3 self-center">Requerido</span>
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
                <div class="flex justify-content-between">
                    <span class="font-medium mr-3 self-center">Reutilizable</span>
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
                <div class="flex justify-content-between">
                    <span class="font-medium mr-3 self-center">Visible B2B</span>
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
                <div class="flex justify-content-between">
                    <span class="font-medium mr-3 self-center">Visible B2C</span>
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

  // Datos locales para el formulario
  localAttribute: Attribute = this.getDefaultAttribute();

  // Para el select de Agencias
  allAgencies: Agency[] = [];
  filteredAgencies: Agency[] = [];
  loadingAgencies: boolean = false;

  // Opciones para el dropdown/select
  inputTypeOptions = [
    { label: 'Texto', value: 'text' },
    { label: 'Número', value: 'number' },
    { label: 'Select', value: 'select' },
    { label: 'Checkbox', value: 'checkbox' },
    { label: 'Radio', value: 'radio' },
    { label: 'Textarea', value: 'textarea' },
    { label: 'Fecha', value: 'date' }
  ];

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
      pageSize: 100, // Cargar suficientes agencias
/*       sortField: 'name',
      sortDirection: 'ASC' */
    };

    this.agencyService.getAgencies(params).subscribe({
      next: (response) => {
        this.allAgencies = response.data || [];
        this.filteredAgencies = [...this.allAgencies]; // Copia para filtrar
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
  }

  onSave() {
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
      inputType: 'text',
      agencyId: '',
      required: false,
      reusable: true,
      visibleB2B: true,
      visibleB2C: true,
    };
  }
}
