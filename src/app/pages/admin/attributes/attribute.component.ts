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
          label="Gestionar Valores"
          icon="pi pi-list"
          severity="secondary"
          class="mr-2"
          (onClick)="manageSelectedAttributeValues()"
          [disabled]="!selectedAttribute"
          pTooltip="Gestionar valores del atributo seleccionado"
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
          <th></th>
          <th pSortableColumn="name">
            Nombre
            <p-sortIcon field="name" />
          </th>
          <th pSortableColumn="inputType">
            Tipo de Campo
            <p-sortIcon field="inputType" />
          </th>
          <th>Requerido</th>
          <th>Reutilizable</th>
          <th>Visible B2B</th>
          <th>Visible B2C</th>
        </tr>
      </ng-template>

      <ng-template #body let-attribute>
        <tr
          (click)="selectRow(attribute)"
          [ngClass]="{
            'bg-primary-50': selectedAttribute?.id === attribute.id,
            'cursor-pointer': true
          }"
          class="hover:bg-surface-100 transition-colors duration-150"
        >
          <td class="w-12 p-3" (click)="$event.stopPropagation()">
            <div class="flex h-full items-center">
              <p-radioButton
                [value]="attribute"
                [(ngModel)]="selectedAttribute"
              />
            </div>
          </td>
          <td class="p-3">{{ attribute.name }}</td>
          <td class="p-3">
            <p-tag
              [value]="getInputTypeLabel(attribute.inputType)"
              [severity]="getInputTypeSeverity(attribute.inputType)"
            />
          </td>
          <td class="p-3">
            <p-tag
              [value]="attribute.required ? 'Sí' : 'No'"
              [severity]="attribute.required ? 'success' : 'secondary'"
            />
          </td>
          <td class="p-3">
            <p-tag
              [value]="attribute.reusable ? 'Sí' : 'No'"
              [severity]="attribute.reusable ? 'success' : 'secondary'"
            />
          </td>
          <td class="p-3">
            <p-tag
              [value]="attribute.visibleB2B ? 'Sí' : 'No'"
              [severity]="attribute.visibleB2B ? 'success' : 'secondary'"
            />
          </td>
          <td class="p-3">
            <p-tag
              [value]="attribute.visibleB2C ? 'Sí' : 'No'"
              [severity]="attribute.visibleB2C ? 'success' : 'secondary'"
            />
          </td>
        </tr>
      </ng-template>

      <ng-template #emptymessage>
        <tr>
          <td colspan="7" class="text-center py-6">
            <div class="flex flex-column items-center gap-3">
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
  attributeValuesDialog: boolean = false;
  attributes = signal<Attribute[]>([]);
  selectedAttribute: Attribute | null = null;
  selectedAttributeForEdit: Attribute | null = null;
  selectedAttributeForValues: Attribute | null = null;
  loading = signal(false);
  isEditMode: boolean = false;
  saving = signal(false);
  savingAttributeValues = signal(false);
  totalRecords: number = 0;

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

  // Seleccionar fila al hacer clic en cualquier parte (excepto el radio button)
  selectRow(attribute: Attribute): void {
    this.selectedAttribute = attribute;
  }

  // Deseleccionar fila
  deselectRow(): void {
    this.selectedAttribute = null;
  }

  onPageChange(event: any): void {
    const first = event?.first ?? 0;
    const rows = event?.rows ?? this.requestBody.limit;

    const pageNumber = Math.floor(first / rows) + 1;
    const pageSize = rows;

    // Actualizar parámetros
    this.requestBody.page = pageNumber;
    this.requestBody.limit = pageSize;

    this.selectedAttribute = null;

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

      this.selectedAttribute = null;

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

  // Método para gestionar valores del atributo seleccionado desde el toolbar
  manageSelectedAttributeValues() {
    if (!this.selectedAttribute?.id) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Selección requerida',
        detail: 'Por favor, selecciona un atributo para gestionar sus valores',
        life: 3000
      });
      return;
    }

    this.manageAttributeValues(this.selectedAttribute);
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
