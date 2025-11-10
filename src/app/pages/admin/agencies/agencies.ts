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
import { MessageService, ConfirmationService } from 'primeng/api';
import { AgencyService } from './agency.service';
import { Agency } from './models/agency';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ApiResponse } from '@/core/models/apiResponse';
import { AgencyFormComponent } from './agency-form.dialog';

@Component({
    selector: 'app-agencies',
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
        AgencyFormComponent // Importar el nuevo componente
    ],
    template: `
        <p-toast />

        <p-toolbar class="mb-6">
            <ng-template #start>
                <p-button label="Nueva Agencia" icon="pi pi-plus" severity="secondary" class="mr-2" (onClick)="openNew()" />
                <p-button
                    label="Editar Agencia"
                    icon="pi pi-pencil"
                    severity="secondary"
                    class="mr-2"
                    (onClick)="editAgency()"
                    [disabled]="!selectedAgency"
                />
                <p-button severity="secondary" label="Eliminar" icon="pi pi-trash" outlined
                    (onClick)="deleteAgency()" [disabled]="!selectedAgency" />
            </ng-template>

            <ng-template #end>
                <p-button label="Exportar" icon="pi pi-upload" severity="secondary" (onClick)="exportCSV()" />
                <p-button label="Recargar" icon="pi pi-refresh" severity="secondary" class="ml-1"
                    (onClick)="loadAgencies()" [loading]="loading()" />
            </ng-template>
        </p-toolbar>

        <p-table
            #dt
            [value]="agencies()"
            [rows]="10"
            [paginator]="true"
            [globalFilterFields]="['name', 'email', 'address', 'phone']"
            [tableStyle]="{ 'min-width': '75rem' }"
            [(selection)]="selectedAgency"
            [rowHover]="true"
            dataKey="id"
            selectionMode="single"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} agencias"
            [showCurrentPageReport]="true"
            [rowsPerPageOptions]="[10, 20, 30]"
            [loading]="loading()"
        >
            <ng-template #caption>
                <div class="flex items-center justify-between">
                    <h5 class="m-0">Gestión de Agencias</h5>
                    <p-iconfield>
                        <p-inputicon class="pi pi-search" />
                        <input pInputText type="text" (keyup)="applyFilter($event, 'name')" placeholder="Buscar por nombre..." />
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
                    <th pSortableColumn="email" style="min-width:20rem">
                        Email
                        <p-sortIcon field="email" />
                    </th>
                    <th pSortableColumn="address" style="min-width:25rem">
                        Dirección
                        <p-sortIcon field="address" />
                    </th>
                    <th style="min-width:15rem">Teléfono</th>
                </tr>
            </ng-template>

            <ng-template #body let-agency>
                <tr [class.bg-primary-50]="selectedAgency?.id === agency.id">
                    <td style="width: 3rem">
                        <p-radioButton [value]="agency" [(ngModel)]="selectedAgency" />
                    </td>
                    <td style="min-width: 20rem">{{ agency.name }}</td>
                    <td style="min-width: 20rem">{{ agency.email }}</td>
                    <td style="min-width: 25rem">{{ agency.address || 'N/A' }}</td>
                    <td style="min-width: 15rem">
                        @if (agency.phone) {
                            +{{ agency.phoneCountryCode }} {{ agency.phone }}
                        } @else {
                            <span class="text-color-secondary">No especificado</span>
                        }
                    </td>
                </tr>
            </ng-template>

            <ng-template #emptymessage>
                <tr>
                    <td colspan="5" class="text-center py-6">
                        <div class="flex flex-column align-items-center gap-3">
                            <i class="pi pi-building text-6xl text-color-secondary"></i>
                            <span class="text-xl text-color-secondary font-medium">
                                No se encontraron agencias
                            </span>
                            <p-button label="Recargar" icon="pi pi-refresh" (onClick)="loadAgencies()" />
                        </div>
                    </td>
                </tr>
            </ng-template>
        </p-table>

        <!-- Usar el componente del formulario -->
        <app-agency-form
            [visible]="agencyDialog"
            [isEditMode]="isEditMode"
            [agency]="selectedAgencyForEdit"
            (save)="saveAgency($event)"
            (cancel)="hideDialog()"
            (hide)="hideDialog()"
            [saving]="saving()"
        ></app-agency-form>

        <p-confirmdialog [style]="{ width: '450px' }" />
    `,
    providers: [MessageService, ConfirmationService]
})
export class Agencies implements OnInit {
    private agencyService = inject(AgencyService);
    private messageService = inject(MessageService);
    private confirmationService = inject(ConfirmationService);

    agencyDialog: boolean = false;
    agencies = signal<Agency[]>([]);
    selectedAgency!: Agency;
    selectedAgencyForEdit: Agency | null = null;
    loading = signal(false);
    isEditMode: boolean = false;
    saving = signal(false);

    requestBody: any = {
        page: 1,
        limit: 10,
        sort: ['agency.name', 'desc']
    };

    @ViewChild('dt') dt!: Table;

    ngOnInit() {
        this.loadAgencies();
    }

    loadAgencies(): void {
        this.loading.set(true);
        this.agencyService.getAgencies(this.requestBody).subscribe({
            next: (response: ApiResponse<Agency>) => {
                this.agencies.set(response.data || []);
                this.loading.set(false);
            },
            error: (error) => {
                console.error('Error loading agencies:', error);
                this.loading.set(false);
                this.agencies.set([]);
            }
        });
    }

    timeOut: any;
    applyFilter(event: Event, column: string): void {
        clearTimeout(this.timeOut);

        this.timeOut = setTimeout(() => {
            if (column == 'name') {
                const filterValue = (event.target as HTMLInputElement).value.trim();
                this.requestBody.name = filterValue;
            }
            console.log(this.requestBody);
            this.loadAgencies();
        }, 500);
    }

    openNew() {
        this.isEditMode = false;
        this.selectedAgencyForEdit = null;
        this.agencyDialog = true;
    }

    editAgency() {
        if (!this.selectedAgency) return;

        this.isEditMode = true;
        this.selectedAgencyForEdit = this.selectedAgency;
        this.agencyDialog = true;
    }

    deleteAgency() {
        if (!this.selectedAgency) return;

        this.confirmationService.confirm({
            message: '¿Estás seguro de que quieres eliminar ' + this.selectedAgency.name + '?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.agencies.set(this.agencies().filter((val) => val.id !== this.selectedAgency.id));
                this.selectedAgency = null!;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: 'Agencia Eliminada',
                    life: 3000
                });
            }
        });
    }

    hideDialog() {
        this.agencyDialog = false;
        this.isEditMode = false;
        this.selectedAgencyForEdit = null;
    }

    saveAgency(agencyData: Agency) {
        this.saving.set(true);

        if (this.isEditMode) {
            const agencyUpdate: Partial<Agency> = {
                name: agencyData.name,
                email: agencyData.email,
                address: agencyData.address,
                phone: agencyData.phone,
                phoneCountryCode: agencyData.phoneCountryCode
            };

            this.agencyService.editAgency(this.selectedAgency.id!, agencyUpdate).subscribe({
                next: (response: ApiResponse<Agency>) => {
                    this.saving.set(false);
                    this.agencyDialog = false;
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Éxito',
                        detail: 'Agencia actualizada correctamente',
                        life: 5000
                    });
                    this.loadAgencies();
                    this.selectedAgency = null!;
                },
                error: (error) => {
                    this.saving.set(false);
                    console.error('Error updating agency:', error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error.error?.message || 'Error al actualizar la agencia',
                        life: 5000
                    });
                }
            });
        } else {
            this.agencyService.createAgency(agencyData).subscribe({
                next: (response: ApiResponse<Agency>) => {
                    this.saving.set(false);
                    this.agencyDialog = false;
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Éxito',
                        detail: 'Agencia creada correctamente',
                        life: 5000
                    });
                    this.loadAgencies();
                },
                error: (error) => {
                    this.saving.set(false);
                    console.error('Error creating agency:', error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error.error?.message || 'Error al crear la agencia',
                        life: 5000
                    });
                }
            });
        }
    }

    exportCSV() {
        this.dt.exportCSV();
    }
}
