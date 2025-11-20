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
import { DialogModule } from 'primeng/dialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { UserService } from './services/user.service';
import { CreateUserDTO, DEFAULT_CREATE_USER, DEFAULT_USER, User } from './models/user';
import { FilterParams } from '@/core/models/params';
import { ApiResponse } from '@/core/models/apiResponse';
import { LOAD_STATE } from '@/core/models/load-state';
import { RoleService } from './services/role.service';
import { DEFAULT_ROLES, Role } from './models/role';
import { Select } from "primeng/select";
import { SelectModule } from 'primeng/select';

@Component({
    selector: 'app-users',
    standalone: true,
    imports: [
    CommonModule,
    TableModule,
    FormsModule,
    SelectModule,
    ButtonModule,
    RippleModule,
    ToastModule,
    ToolbarModule,
    InputTextModule,
    TagModule,
    InputIconModule,
    IconFieldModule,
    ConfirmDialogModule,
    DialogModule,
    Select
],
    template: `
        <p-toast />

        <p-toolbar class="mb-6">
            <ng-template #start>
                <p-button label="Nuevo Usuario" icon="pi pi-plus" severity="secondary" class="mr-2" (onClick)="openNew()" />
                <p-button severity="secondary" label="Eliminar" icon="pi pi-trash" outlined
                    (onClick)="deleteSelectedUsers()" [disabled]="!selectedUsers || !selectedUsers.length" />
            </ng-template>

            <ng-template #end>
                <p-button label="Exportar" icon="pi pi-upload" severity="secondary" (onClick)="exportCSV()" />
                <p-button label="Recargar" icon="pi pi-refresh" severity="secondary" class="ml-1"
                    (onClick)="loadUsers()" [loading]="loading()" />
            </ng-template>
        </p-toolbar>

        <p-table
            #dt
            [value]="users()"
            [rows]="10"
            [paginator]="true"
            [globalFilterFields]="['name', 'email', 'roleName', 'agencyId']"
            [tableStyle]="{ 'min-width': '75rem' }"
            [(selection)]="selectedUsers"
            [rowHover]="true"
            dataKey="id"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} usuarios"
            [showCurrentPageReport]="true"
            [rowsPerPageOptions]="[10, 20, 30]"
            [loading]="loading()"
        >
            <ng-template #caption>
                <div class="flex items-center justify-between">
                    <h5 class="m-0">Gestión de Usuarios</h5>
                    <p-iconfield>
                        <p-inputicon class="pi pi-search" />
                        <input pInputText type="text" (keyup)="applyFilter($event, 'name')" placeholder="Buscar..." />
                    </p-iconfield>
                </div>
            </ng-template>

            <ng-template #header>
                <tr>
                    <th style="width: 3rem">
                        <p-tableHeaderCheckbox />
                    </th>
                    <th pSortableColumn="name" style="min-width:16rem">
                        Nombre
                        <p-sortIcon field="name" />
                    </th>
                    <th pSortableColumn="email" style="min-width:20rem">
                        Email
                        <p-sortIcon field="email" />
                    </th>
                    <th pSortableColumn="roleName" style="min-width:12rem">
                        Rol
                        <p-sortIcon field="roleName" />
                    </th>
                    <th style="min-width:12rem">Teléfono</th>
                    <!-- <th pSortableColumn="agencyId" style="min-width:12rem">
                        Agencia
                        <p-sortIcon field="agencyId" />
                    </th> -->
                </tr>
            </ng-template>

            <ng-template #body let-user>
                <tr>
                    <td style="width: 3rem">
                        <p-tableCheckbox [value]="user" />
                    </td>
                    <td style="min-width: 16rem">{{ user.name }} {{ user.lastName }}</td>
                    <td style="min-width: 20rem">{{ user.email }}</td>
                    <td style="min-width: 12rem">
                        <p-tag [value]="user.role.name" [severity]="getRoleSeverity(user.roleName)" />
                    </td>
                    <td style="min-width: 12rem">
                        @if (user.phone) {
                            +{{ user.phoneCountryCode }} {{ user.phone }}
                        } @else {
                            <span class="text-color-secondary">No especificado</span>
                        }
                    </td>
                    <!-- <td style="min-width: 12rem">{{ user.agencyId || 'N/A' }}</td> -->
                </tr>
            </ng-template>

            <ng-template #emptymessage>
                <tr>
                    <td colspan="7" class="text-center py-6">
                        <div class="flex flex-column justify-center align-items-center gap-3">
                            <!-- <i class="pi pi-users text-color-secondary"></i> -->
                            <span class="text-xl my-4 text-color-secondary font-medium">
                                No se encontraron usuarios
                            </span>
                            <!-- <p-button label="Recargar" icon="pi pi-refresh" (onClick)="loadUsers()" /> -->
                        </div>
                    </td>
                </tr>
            </ng-template>
        </p-table>

        <p-dialog [(visible)]="userDialog" [style]="{ width: '450px' }" header="Detalles del Usuario" [modal]="true">
            <ng-template #content>
                <div class="flex flex-col gap-6">
                    <div>
                        <label for="name" class="block font-bold mb-3">Nombre</label>
                        <input type="text" pInputText id="name" [(ngModel)]="user.name" required autofocus class="w-full" />
                    </div>
                    <div>
                        <label for="lastName" class="block font-bold mb-3">Apellido</label>
                        <input type="text" pInputText id="lastName" [(ngModel)]="user.lastName" required class="w-full" />
                    </div>
                    <div>
                        <label for="email" class="block font-bold mb-3">Email</label>
                        <input type="email" pInputText id="email" [(ngModel)]="user.email" required class="w-full" />
                    </div>
                    <div>
                        <label for="roleName" class="block font-bold mb-3">Rol</label>
                        <p-select [options]="roles()" optionLabel="name" id="roleName" [(ngModel)]="user.roleName" class="w-full" />
                    </div>
                     <div>
                        <label for="password" class="block font-bold mb-3">Contraseña</label>
                        <input type="password" pInputText id="password" [(ngModel)]="user.password" required class="w-full" />
                    </div>
                     <div>
                        <label for="passwordConfirmation" class="block font-bold mb-3">Confirmar Contraseña</label>
                        <input type="password" pInputText id="passwordConfirm" [(ngModel)]="user.passwordConfirm" required class="w-full" />
                    </div>
                </div>
            </ng-template>

            <ng-template #footer>
                <p-button label="Cancelar" icon="pi pi-times" text (click)="hideDialog()" />
                <p-button label="Guardar" icon="pi pi-check" (click)="saveUser()" />
            </ng-template>
        </p-dialog>

        <p-confirmdialog [style]="{ width: '450px' }" />
    `,
    providers: [MessageService, ConfirmationService]
})
export class Users implements OnInit {
    private roleService = inject(RoleService);
    private userService = inject(UserService);
    private messageService = inject(MessageService);
    private confirmationService = inject(ConfirmationService);

    userDialog: boolean = false;
    users = signal<User[]>([]);
    roles = signal<Role[]>([]);
    user: CreateUserDTO & {passwordConfirm? : string}  = DEFAULT_CREATE_USER ;
    selectedUsers: User[] | null = [];
    submitted: boolean = false;
    loading = signal(false);
    loadRoleState = signal<LOAD_STATE>(LOAD_STATE.NOT_LOAD)
    requestBody: any = {
        page: 1,
        limit: 10,
        sort:['user.name', 'desc']
    };

    LOAD_STATE = LOAD_STATE

    @ViewChild('dt') dt!: Table;

    ngOnInit() {
        this.loadUsers();
        this.loadRoles();
    }

    loadRoles(){
        this.loadRoleState.set(LOAD_STATE.LOADING);
        this.roleService.getRoles()
        .subscribe({
            next: (response: Role[]) => {
                this.roles.set(response);
                this.loadRoleState.set(LOAD_STATE.SUCCESS);
            },
            error: (error: any) => {
                this.roles.set(DEFAULT_ROLES);
                this.loadRoleState.set(LOAD_STATE.ERROR);
                console.error('Error loading roles:', error);
            }
        })

    }


    loadUsers(): void {
        this.loading.set(true);
        this.userService.getUsers(this.requestBody).subscribe({
            next: (response: ApiResponse<User>) => {
                this.users.set(response.data || []);
                this.loading.set(false);
            },
            error: (error) => {
                console.error('Error loading users:', error);
                this.loading.set(false);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Error loading users',
                    life: 5000
                });
                this.users.set([]);
            }
        });
    }

    timeOut:any;
    applyFilter(event: Event, column: string): void{
        clearTimeout(this.timeOut);

        this.timeOut = setTimeout(() => {
        if(column == 'name'){
            const filterValue = (event.target as HTMLInputElement).value.trim();
            this.requestBody.name = filterValue;
        }
        console.log(this.requestBody)
        this.loadUsers();
        }, 500);
    }

    openNew() {
        this.user = DEFAULT_CREATE_USER;
        this.submitted = false;
        this.userDialog = true;
    }

    editUser(user: User) {
        // this.user = { ...user };
        this.userDialog = true;
    }

    deleteSelectedUsers() {
        this.confirmationService.confirm({
            message: '¿Estás seguro de que quieres eliminar los usuarios seleccionados?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.users.set(this.users().filter((val) => !this.selectedUsers?.includes(val)));
                this.selectedUsers = null;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: 'Usuarios Eliminados',
                    life: 3000
                });
            }
        });
    }

    hideDialog() {
        this.userDialog = false;
        this.submitted = false;
    }

    deleteUser(user: User) {
        this.confirmationService.confirm({
            message: '¿Estás seguro de que quieres eliminar ' + user.name + '?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.users.set(this.users().filter((val) => val.id !== user.id));
                this.user = DEFAULT_CREATE_USER;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: 'Usuario Eliminado',
                    life: 3000
                });
            }
        });
    }

    saveUser() {
        this.submitted = true;

        if (this.user.name?.trim() && this.user.email?.trim()) {
            // Aquí iría la lógica para guardar el usuario
            this.userDialog = false;
            this.user = DEFAULT_CREATE_USER;
            this.messageService.add({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Usuario Guardado',
                life: 3000
            });
        }
    }

    exportCSV() {
        this.dt.exportCSV();
    }

    getRoleSeverity(role: string): string {
        if (!role) return 'secondary';

        switch (role.toUpperCase()) {
            case 'ADMIN':
                return 'danger';
            case 'USER':
                return 'info';
            case 'SUPERADMIN':
                return 'success';
            case 'MANAGER':
                return 'success';
            default:
                return 'secondary';
        }
    }
}
