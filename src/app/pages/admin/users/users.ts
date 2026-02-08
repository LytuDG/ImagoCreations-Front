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
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
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
        Select,
        TranslocoModule
    ],
    template: `
        <p-toast />

        <p-toolbar class="mb-6">
            <ng-template #start>
                <p-button
                    [label]="'admin.users.buttons.newUser' | transloco"
                    icon="pi pi-plus"
                    severity="secondary"
                    class="mr-2"
                    (onClick)="openNew()"
                />
                <p-button
                    [label]="'admin.users.buttons.delete' | transloco"
                    severity="secondary"
                    icon="pi pi-trash"
                    outlined
                    (onClick)="deleteSelectedUsers()"
                    [disabled]="!selectedUsers || !selectedUsers.length"
                />
            </ng-template>

            <ng-template #end>
                <p-button
                    [label]="'admin.users.buttons.export' | transloco"
                    icon="pi pi-upload"
                    severity="secondary"
                    (onClick)="exportCSV()"
                />
                <p-button
                    [label]="'admin.users.buttons.reload' | transloco"
                    icon="pi pi-refresh"
                    severity="secondary"
                    class="ml-1"
                    (onClick)="loadUsers()"
                    [loading]="loading()"
                />
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
            [currentPageReportTemplate]="'admin.users.table.pagination.showingUsers' | transloco"
            [showCurrentPageReport]="true"
            [rowsPerPageOptions]="[10, 20, 30]"
            [loading]="loading()"
        >
            <ng-template #caption>
                <div class="flex items-center justify-between">
                    <h5 class="m-0">{{ 'admin.users.title' | transloco }}</h5>
                    <p-iconfield>
                        <p-inputicon class="pi pi-search" />
                        <input
                            pInputText
                            type="text"
                            (keyup)="applyFilter($event, 'name')"
                            [placeholder]="'admin.users.buttons.search' | transloco"
                        />
                    </p-iconfield>
                </div>
            </ng-template>

            <ng-template #header>
                <tr>
                    <th style="width: 3rem">
                        <p-tableHeaderCheckbox />
                    </th>
                    <th pSortableColumn="name" style="min-width:16rem">
                        {{ 'admin.users.table.columns.name' | transloco }}
                        <p-sortIcon field="name" />
                    </th>
                    <th pSortableColumn="email" style="min-width:20rem">
                        {{ 'admin.users.table.columns.email' | transloco }}
                        <p-sortIcon field="email" />
                    </th>
                    <th pSortableColumn="roleName" style="min-width:12rem">
                        {{ 'admin.users.table.columns.role' | transloco }}
                        <p-sortIcon field="roleName" />
                    </th>
                    <th style="min-width:12rem">{{ 'admin.users.table.columns.phone' | transloco }}</th>
                    <!-- <th pSortableColumn="agencyId" style="min-width:12rem">
                        {{ 'admin.users.table.columns.agency' | transloco }}
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
                        <p-tag
                            [value]="getTranslatedRoleName(user.roleName)"
                            [severity]="getRoleSeverity(user.roleName)"
                        />
                    </td>
                    <td style="min-width: 12rem">
                        @if (user.phone) {
                            +{{ user.phoneCountryCode }} {{ user.phone }}
                        } @else {
                            <span class="text-color-secondary">
                                {{ 'admin.users.table.phone.notSpecified' | transloco }}
                            </span>
                        }
                    </td>
                    <!-- <td style="min-width: 12rem">{{ user.agencyId || 'N/A' }}</td> -->
                </tr>
            </ng-template>

            <ng-template #emptymessage>
                <tr>
                    <td colspan="7" class="text-center py-6">
                        <div class="flex flex-column justify-center align-items-center gap-3">
                            <span class="text-xl my-4 text-color-secondary font-medium">
                                {{ 'admin.users.table.empty.title' | transloco }}
                            </span>
                        </div>
                    </td>
                </tr>
            </ng-template>
        </p-table>

        <p-dialog
            [(visible)]="userDialog"
            [style]="{ width: '450px' }"
            [header]="'admin.users.dialog.title' | transloco"
            [modal]="true"
        >
            <ng-template #content>
                <div class="flex flex-col gap-6">
                    <div>
                        <label for="name" class="block font-bold mb-3">
                            {{ 'admin.users.dialog.fields.name' | transloco }}
                        </label>
                        <input type="text" pInputText id="name" [(ngModel)]="user.name" required autofocus class="w-full" />
                    </div>
                    <div>
                        <label for="lastName" class="block font-bold mb-3">
                            {{ 'admin.users.dialog.fields.lastName' | transloco }}
                        </label>
                        <input type="text" pInputText id="lastName" [(ngModel)]="user.lastName" required class="w-full" />
                    </div>
                    <div>
                        <label for="email" class="block font-bold mb-3">
                            {{ 'admin.users.dialog.fields.email' | transloco }}
                        </label>
                        <input type="email" pInputText id="email" [(ngModel)]="user.email" required class="w-full" />
                    </div>
                    <div>
                        <label for="roleName" class="block font-bold mb-3">
                            {{ 'admin.users.dialog.fields.role' | transloco }}
                        </label>
                        <p-select
                            [options]="roles()"
                            optionLabel="name"
                            id="roleName"
                            [(ngModel)]="user.roleName"
                            class="w-full"
                        />
                    </div>
                    <div>
                        <label for="password" class="block font-bold mb-3">
                            {{ 'admin.users.dialog.fields.password' | transloco }}
                        </label>
                        <input type="password" pInputText id="password" [(ngModel)]="user.password" required class="w-full" />
                    </div>
                    <div>
                        <label for="passwordConfirmation" class="block font-bold mb-3">
                            {{ 'admin.users.dialog.fields.confirmPassword' | transloco }}
                        </label>
                        <input type="password" pInputText id="passwordConfirm" [(ngModel)]="user.passwordConfirm" required class="w-full" />
                    </div>
                </div>
            </ng-template>

            <ng-template #footer>
                <p-button
                    [label]="'admin.users.buttons.cancel' | transloco"
                    icon="pi pi-times"
                    text
                    (click)="hideDialog()"
                />
                <p-button
                    [label]="'admin.users.buttons.save' | transloco"
                    icon="pi pi-check"
                    (click)="saveUser()"
                />
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
    private translocoService = inject(TranslocoService);

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
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: this.translocoService.translate('admin.users.messages.error.loadingRoles'),
                    life: 5000
                });
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
                    detail: this.translocoService.translate('admin.users.messages.error.loadingUsers'),
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
            message: this.translocoService.translate('admin.users.confirmations.deleteSelected.message'),
            header: this.translocoService.translate('admin.users.confirmations.deleteSelected.header'),
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: this.translocoService.translate('admin.users.confirmations.deleteSelected.accept'),
            rejectLabel: this.translocoService.translate('admin.users.confirmations.deleteSelected.reject'),
            accept: () => {
                this.users.set(this.users().filter((val) => !this.selectedUsers?.includes(val)));
                this.selectedUsers = null;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: this.translocoService.translate('admin.users.messages.success.usersDeleted'),
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
            message: this.translocoService.translate('admin.users.confirmations.deleteSingle.message', { name: user.name }),
            header: this.translocoService.translate('admin.users.confirmations.deleteSingle.header'),
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.users.set(this.users().filter((val) => val.id !== user.id));
                this.user = DEFAULT_CREATE_USER;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: this.translocoService.translate('admin.users.messages.success.userDeleted'),
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
                summary: 'Success',
                detail: this.translocoService.translate('admin.users.messages.success.userSaved'),
                life: 3000
            });
        }
    }

    exportCSV() {
        this.dt.exportCSV();
    }

    getRoleSeverity(role: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | null {
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

    getTranslatedRoleName(roleName: string): string {
        if (!roleName) return '';

        const roleKey = roleName.toLowerCase();
        const translationKey = `admin.users.roles.${roleKey}`;

        return this.translocoService.translate(translationKey) || roleName;
    }
}
