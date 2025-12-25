// pages/attributes/components/attribute-list/attribute-list.component.ts
import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule, Table } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { RadioButtonModule } from 'primeng/radiobutton';
import { MessageService, ConfirmationService } from 'primeng/api';
import { AttributeService } from './services/attribute.service';
import { Attribute } from './models/attribute';
import { ApiResponse } from '@/core/models/apiResponse';
import { AttributeFormComponent } from './attribute-form.dialog';
import { AttributeValuesDialogComponent } from './attribute-values.dialog';

type TagSeverity = "success" | "info" | "warn" | "danger" | "secondary" | "contrast" | null | undefined;

@Component({
  selector: 'app-attributes',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    FormsModule,
    ButtonModule,
    RippleModule,
    ToastModule,
    ToolbarModule,
    InputTextModule,
    TagModule,
    InputIconModule,
    IconFieldModule,
    ConfirmDialogModule,
    RadioButtonModule,
    AttributeFormComponent,
    AttributeValuesDialogComponent
  ],
  template: `
    <p-toast />

    <p-toolbar class="mb-6">
      <ng-template #start>
        <p-button
          label="Nuevo Atributo"
          icon="pi pi-plus"
          severity="secondary"
          class="mr-2"
          (onClick)="openNew()"
        />
        <p-button
          label="Editar Atributo"
          icon="pi pi-pencil"
          severity="secondary"
          class="mr-2"
          (onClick)="editAttribute()"
          [disabled]="!selectedAttribute"
        />
        <p-button
          severity="secondary"
          label="Eliminar"
          icon="pi pi-trash"
          outlined
          (onClick)="deleteAttribute()"
          [disabled]="!selectedAttribute"
        />
      </ng-template>

      <ng-template #end>
        <p-button
          label="Exportar"
          icon="pi pi-upload"
          severity="secondary"
          (onClick)="exportCSV()"
        />
        <p-button
          label="Recargar"
          icon="pi pi-refresh"
          severity="secondary"
          class="ml-1"
          (onClick)="loadAttributes()"
          [loading]="loading()"
        />
      </ng-template>
    </p-toolbar>

    <p-table
      #dt
      [value]="attributes()"
      [rows]="requestBody.limit"
      [paginator]="true"
      [globalFilterFields]="['name', 'inputType']"
      [tableStyle]="{ 'min-width': '75rem' }"
      [(selection)]="selectedAttribute"
      [rowHover]="true"
      dataKey="id"
      selectionMode="single"
      currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} atributos"
      [showCurrentPageReport]="true"
      [rowsPerPageOptions]="[10, 20, 30]"
      [loading]="loading()"
      [totalRecords]="totalRecords"
      [first]="(requestBody.page - 1) * requestBody.limit"
      (onPage)="onPageChange($event)"
      [lazy]="true"
    >
      <ng-template #caption>
        <div class="flex items-center justify-between">
          <h5 class="m-0">Gestión de Atributos</h5>
          <p-iconfield>
            <p-inputicon class="pi pi-search" />
            <input
              pInputText
              type="text"
              (keyup)="applyFilter($event, 'name')"
              placeholder="Buscar por nombre..."
            />
          </p-iconfield>
        </div>
      </ng-template>

      <ng-template #header>
        <tr>
          <th style="width: 3rem"></th>
          <th pSortableColumn="name" style="min-width:20rem">
            Nombre
            <p-sortIcon field="name" />
          </th>
          <th pSortableColumn="inputType" style="min-width:15rem">
            Tipo de Campo
            <p-sortIcon field="inputType" />
          </th>
          <th style="min-width:12rem">Requerido</th>
          <th style="min-width:12rem">Reutilizable</th>
          <th style="min-width:12rem">Visible B2B</th>
          <th style="min-width:12rem">Visible B2C</th>
          <th style="min-width:10rem">Acciones</th> <!-- Nueva columna -->
        </tr>
      </ng-template>

      <ng-template #body let-attribute>
        <tr [ngClass]="{ 'bg-primary-50': selectedAttribute?.id === attribute.id }">
          <td style="width: 3rem">
            <p-radioButton [value]="attribute" [(ngModel)]="selectedAttribute" />
          </td>
          <td style="min-width: 20rem">{{ attribute.name }}</td>
          <td style="min-width: 15rem">
            <p-tag
              [value]="getInputTypeLabel(attribute.inputType)"
              [severity]="getInputTypeSeverity(attribute.inputType)"
            />
          </td>
          <td style="min-width: 12rem">
            <p-tag
              [value]="attribute.required ? 'Sí' : 'No'"
              [severity]="attribute.required ? 'success' : 'secondary'"
            />
          </td>
          <td style="min-width: 12rem">
            <p-tag
              [value]="attribute.reusable ? 'Sí' : 'No'"
              [severity]="attribute.reusable ? 'success' : 'secondary'"
            />
          </td>
          <td style="min-width: 12rem">
            <p-tag
              [value]="attribute.visibleB2B ? 'Sí' : 'No'"
              [severity]="attribute.visibleB2B ? 'success' : 'secondary'"
            />
          </td>
          <td style="min-width: 12rem">
            <p-tag
              [value]="attribute.visibleB2C ? 'Sí' : 'No'"
              [severity]="attribute.visibleB2C ? 'success' : 'secondary'"
            />
          </td>
          <td style="min-width: 10rem">
            <!-- Botón para gestionar valores (solo si el atributo tiene ID) -->
            @if (attribute.id) {
              <p-button
                icon="pi pi-list"
                [rounded]="true"
                [text]="true"
                severity="help"
                [title]="'Gestionar valores de ' + attribute.name"
                (onClick)="manageAttributeValues(attribute)"
              />
            }
          </td>
        </tr>
      </ng-template>

      <ng-template #emptymessage>
        <tr>
          <td colspan="8" class="text-center py-6">
            <div class="flex flex-column align-items-center gap-3">
              <i class="pi pi-tag text-6xl text-color-secondary"></i>
              <span class="text-xl text-color-secondary font-medium">
                No se encontraron atributos
              </span>
              <p-button label="Recargar" icon="pi pi-refresh" (onClick)="loadAttributes()" />
            </div>
          </td>
        </tr>
      </ng-template>
    </p-table>

    <!-- Componente de formulario para atributos -->
    <app-attribute-form
      [visible]="attributeDialog"
      [isEditMode]="isEditMode"
      [attribute]="selectedAttributeForEdit"
      (save)="saveAttribute($event)"
      (cancel)="hideDialog()"
      (hide)="hideDialog()"
      [saving]="saving()"
      (manageValues)="onManageValues($event)"
    ></app-attribute-form>

    <!-- Componente para gestionar valores de atributo -->
    <app-attribute-values-dialog
      [visible]="attributeValuesDialog"
      [attribute]="selectedAttributeForValues"
      (save)="onAttributeValuesSaved($event)"
      (cancel)="hideAttributeValuesDialog()"
      (hide)="hideAttributeValuesDialog()"
      [saving]="savingAttributeValues()"
    ></app-attribute-values-dialog>

    <p-confirmdialog [style]="{ width: '450px' }" />
  `,
  providers: [MessageService, ConfirmationService]
})
export class Attributes implements OnInit {
  private attributeService = inject(AttributeService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  attributeDialog: boolean = false;
  attributeValuesDialog: boolean = false; // <-- Nuevo estado para el diálogo de valores
  attributes = signal<Attribute[]>([]);
  selectedAttribute: Attribute | null = null;
  selectedAttributeForEdit: Attribute | null = null;
  selectedAttributeForValues: Attribute | null = null; // <-- Atributo seleccionado para gestionar valores
  loading = signal(false);
  isEditMode: boolean = false;
  saving = signal(false);
  savingAttributeValues = signal(false); // <-- Nuevo estado para guardar valores
  totalRecords: number = 0;

  // Calcular first record
  get firstRecord(): number {
    return (this.requestBody.page - 1) * this.requestBody.limit;
  }

  requestBody: any = {
    page: 1,
    limit: 10,
  };

  @ViewChild('dt') dt!: Table;

  ngOnInit() {
    this.loadAttributes();
  }

  loadAttributes(): void {
    this.loading.set(true);

    const params: any = {
        page: this.requestBody.page,
        pageSize: this.requestBody.limit
    };

    if (this.requestBody.name) {
        params.name = this.requestBody.name;
    }

    this.attributeService.getAttribute(params).subscribe({
        next: (response: ApiResponse<Attribute>) => {
        this.attributes.set(response.data || []);
        this.totalRecords = response.total || 0;
        this.loading.set(false);
        },
        error: (error) => {
        console.error('Error loading attributes:', error);
        this.loading.set(false);
        this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error cargando atributos',
            life: 5000
        });
        this.attributes.set([]);
        this.totalRecords = 0;
        }
    });
  }

  onPageChange(event: any): void {
    const first = event?.first ?? 0;
    const rows = event?.rows ?? this.requestBody.limit;

    const pageNumber = Math.floor(first / rows) + 1;
    const pageSize = rows;

    // Actualizar parámetros
    this.requestBody.page = pageNumber;
    this.requestBody.limit = pageSize;

    // Recargar datos
    this.loadAttributes();
  }

  timeOut: any;
  applyFilter(event: Event, column: string): void {
    clearTimeout(this.timeOut);

    this.timeOut = setTimeout(() => {
      const filterValue = (event.target as HTMLInputElement).value.trim();

      if (column === 'name') {
        this.requestBody.name = filterValue;
      }

      // Volver a la primera página cuando se filtra
      this.requestBody.page = 1;

      this.loadAttributes();
    }, 500);
  }

  openNew() {
    this.isEditMode = false;
    this.selectedAttributeForEdit = null;
    this.attributeDialog = true;
  }

  editAttribute() {
    if (!this.selectedAttribute) return;

    this.isEditMode = true;
    this.selectedAttributeForEdit = this.selectedAttribute;
    this.attributeDialog = true;
  }

  manageAttributeValues(attribute: Attribute) {
    if (!attribute.id) return;

    this.selectedAttributeForValues = attribute;
    this.attributeValuesDialog = true;
  }

  onManageValues(attributeId: string) {
    const attribute = this.attributes().find(attr => attr.id === attributeId);
    if (attribute) {
      this.selectedAttributeForValues = attribute;
      this.attributeValuesDialog = true;
    }
  }

  onAttributeValuesSaved(event: any) {
    this.savingAttributeValues.set(false);
    this.attributeValuesDialog = false;
    this.selectedAttributeForValues = null;

    this.messageService.add({
      severity: 'success',
      summary: 'Éxito',
      detail: 'Valores guardados correctamente',
      life: 3000
    });
  }

  hideAttributeValuesDialog() {
    this.attributeValuesDialog = false;
    this.selectedAttributeForValues = null;
    this.savingAttributeValues.set(false);
  }

  deleteAttribute() {
    if (!this.selectedAttribute) return;

    this.confirmationService.confirm({
      message: `¿Estás seguro de eliminar "${this.selectedAttribute.name}"?`,
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.attributeService.deleteAttribute(this.selectedAttribute!.id!).subscribe({
          next: () => {
            // Actualizar lista localmente
            this.attributes.set(
              this.attributes().filter((val) => val.id !== this.selectedAttribute?.id)
            );

            // Actualizar totalRecords
            this.totalRecords = Math.max(0, this.totalRecords - 1);

            this.selectedAttribute = null;

            // Si la página queda vacía y no es la primera, ir a página anterior
            if (this.attributes().length === 0 && this.requestBody.page > 1) {
              this.requestBody.page--;
              this.loadAttributes();
            }

            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Atributo eliminado',
              life: 3000
            });
          },
          error: (error) => {
            console.error('Error eliminando atributo:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo eliminar el atributo',
              life: 3000
            });
          }
        });
      }
    });
  }

  hideDialog() {
    this.attributeDialog = false;
    this.isEditMode = false;
    this.selectedAttributeForEdit = null;
  }

  saveAttribute(attributeData: Attribute) {
    this.saving.set(true);

    if (this.isEditMode) {
      const attributeUpdate: Partial<Attribute> = {
        name: attributeData.name,
        inputType: attributeData.inputType,
        required: attributeData.required,
        reusable: attributeData.reusable,
        visibleB2B: attributeData.visibleB2B,
        visibleB2C: attributeData.visibleB2C,
        agencyId: attributeData.agencyId
      };

      this.attributeService.editAttribute(this.selectedAttribute?.id!, attributeUpdate).subscribe({
        next: (response: ApiResponse<Attribute>) => {
          this.saving.set(false);
          this.attributeDialog = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Atributo actualizado correctamente',
            life: 5000
          });
          this.loadAttributes();
          this.selectedAttribute = null;
        },
        error: (error) => {
          this.saving.set(false);
          console.error('Error updating attribute:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error?.message || 'Error al actualizar el atributo',
            life: 5000
          });
        }
      });
    } else {
      this.attributeService.createAttribute(attributeData).subscribe({
        next: (response: ApiResponse<Attribute>) => {
          this.saving.set(false);
          this.attributeDialog = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Atributo creado correctamente',
            life: 5000
          });
          this.loadAttributes();
        },
        error: (error) => {
          this.saving.set(false);
          console.error('Error creating attribute:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error?.message || 'Error al crear el atributo',
            life: 5000
          });
        }
      });
    }
  }

  exportCSV() {
    this.dt.exportCSV();
  }

  // Métodos auxiliares para visualización
  getInputTypeLabel(inputType: string): string {
    const labels: { [key: string]: string } = {
      'text': 'Texto',
      'number': 'Número',
      'select': 'Select',
      'checkbox': 'Checkbox',
      'radio': 'Radio',
      'textarea': 'Textarea',
      'date': 'Fecha'
    };
    return labels[inputType] || inputType;
  }

  getInputTypeSeverity(inputType: string): TagSeverity {
    const severityMap: { [key: string]: TagSeverity } = {
      'text': 'info',
      'number': 'warn',
      'select': 'success',
      'checkbox': 'contrast',
      'radio': 'secondary',
      'textarea': 'info',
      'date': 'warn'
    };
    return severityMap[inputType] || 'secondary';
  }
}
