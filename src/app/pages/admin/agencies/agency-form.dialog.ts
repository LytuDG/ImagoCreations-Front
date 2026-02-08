import { Component, EventEmitter, Input, Output, OnChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { Agency } from './models/agency';
import { DEFAULT_CREATE_USER } from '../users/models/user';

@Component({
    selector: 'app-agency-form',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        DialogModule,
        ButtonModule,
        InputTextModule,
        PasswordModule,
        TranslocoModule
    ],
    template: `
        <p-dialog
            [(visible)]="visible"
            [style]="{ width: '600px' }"
            [header]="getDialogTitle()"
            [modal]="true"
            (onHide)="onCancel()"
        >
            <ng-template #content>
                <div class="flex flex-col gap-6">
                    <!-- Sección de Datos de la Agencia -->
                    <div class="border-round border-1 surface-border p-4">
                        <h4 class="mt-0 mb-4 text-surface-900">
                            {{ 'admin.agencies.dialog.sections.agencyData' | transloco }}
                        </h4>

                        <div class="grid grid-cols-1 gap-4">
                            <div>
                                <label for="agencyName" class="block font-bold mb-2">
                                    {{ 'admin.agencies.dialog.fields.agencyName' | transloco }} *
                                </label>
                                <input
                                    type="text"
                                    pInputText
                                    id="agencyName"
                                    [(ngModel)]="agencyForm.name"
                                    required
                                    class="w-full"
                                    [placeholder]="'admin.agencies.dialog.placeholders.agencyName' | transloco"
                                />
                                @if (submitted && !agencyForm.name) {
                                    <small class="text-red-500">
                                        {{ 'admin.agencies.dialog.validations.agencyName' | transloco }}
                                    </small>
                                }
                            </div>

                            <div>
                                <label for="agencyEmail" class="block font-bold mb-2">
                                    {{ 'admin.agencies.dialog.fields.agencyEmail' | transloco }} *
                                </label>
                                <input
                                    type="email"
                                    pInputText
                                    id="agencyEmail"
                                    [(ngModel)]="agencyForm.email"
                                    required
                                    class="w-full"
                                    [placeholder]="'admin.agencies.dialog.placeholders.agencyEmail' | transloco"
                                />
                                @if (submitted && !agencyForm.email) {
                                    <small class="text-red-500">
                                        {{ 'admin.agencies.dialog.validations.agencyEmail' | transloco }}
                                    </small>
                                }
                            </div>

                            <div>
                                <label for="agencyAddress" class="block font-bold mb-2">
                                    {{ 'admin.agencies.dialog.fields.address' | transloco }} *
                                </label>
                                <textarea
                                    pInputText
                                    id="agencyAddress"
                                    [(ngModel)]="agencyForm.address"
                                    required
                                    class="w-full"
                                    rows="3"
                                    [placeholder]="'admin.agencies.dialog.placeholders.address' | transloco"
                                ></textarea>
                                @if (submitted && !agencyForm.address) {
                                    <small class="text-red-500">
                                        {{ 'admin.agencies.dialog.validations.agencyAddress' | transloco }}
                                    </small>
                                }
                            </div>

                            <div class="grid grid-cols-2 gap-3">
                                <div>
                                    <label for="agencyPhoneCode" class="block font-bold mb-2">
                                        {{ 'admin.agencies.dialog.fields.countryCode' | transloco }}
                                    </label>
                                    <input
                                        type="text"
                                        pInputText
                                        id="agencyPhoneCode"
                                        [(ngModel)]="agencyForm.phoneCountryCode"
                                        class="w-full"
                                        [placeholder]="'admin.agencies.dialog.placeholders.countryCode' | transloco"
                                        maxlength="3"
                                    />
                                </div>
                                <div>
                                    <label for="agencyPhone" class="block font-bold mb-2">
                                        {{ 'admin.agencies.dialog.fields.phone' | transloco }}
                                    </label>
                                    <input
                                        type="text"
                                        pInputText
                                        id="agencyPhone"
                                        [(ngModel)]="agencyForm.phone"
                                        class="w-full"
                                        [placeholder]="'admin.agencies.dialog.placeholders.phone' | transloco"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Sección del Usuario Administrador (solo para creación) -->
                    @if (!isEditMode) {
                        <div class="border-round border-1 surface-border p-4">
                            <h4 class="mt-0 mb-4 text-surface-900">
                                {{ 'admin.agencies.dialog.sections.adminUser' | transloco }}
                            </h4>

                            <div class="grid grid-cols-1 gap-4">
                                <div class="grid grid-cols-2 gap-3">
                                    <div>
                                        <label for="adminName" class="block font-bold mb-2">
                                            {{ 'admin.agencies.dialog.fields.adminName' | transloco }} *
                                        </label>
                                        <input
                                            type="text"
                                            pInputText
                                            id="adminName"
                                            [(ngModel)]="agencyForm.user!.name"
                                            required
                                            class="w-full"
                                            [placeholder]="'admin.agencies.dialog.placeholders.adminName' | transloco"
                                        />
                                        @if (submitted && !agencyForm.user!.name) {
                                            <small class="text-red-500">
                                                {{ 'admin.agencies.dialog.validations.adminName' | transloco }}
                                            </small>
                                        }
                                    </div>
                                    <div>
                                        <label for="adminLastName" class="block font-bold mb-2">
                                            {{ 'admin.agencies.dialog.fields.adminLastName' | transloco }}
                                        </label>
                                        <input
                                            type="text"
                                            pInputText
                                            id="adminLastName"
                                            [(ngModel)]="agencyForm.user!.lastName"
                                            class="w-full"
                                            [placeholder]="'admin.agencies.dialog.placeholders.adminLastName' | transloco"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label for="adminEmail" class="block font-bold mb-2">
                                        {{ 'admin.agencies.dialog.fields.adminEmail' | transloco }} *
                                    </label>
                                    <input
                                        type="email"
                                        pInputText
                                        id="adminEmail"
                                        [(ngModel)]="agencyForm.user!.email"
                                        required
                                        class="w-full"
                                        [placeholder]="'admin.agencies.dialog.placeholders.adminEmail' | transloco"
                                    />
                                    @if (submitted && !agencyForm.user!.email) {
                                        <small class="text-red-500">
                                            {{ 'admin.agencies.dialog.validations.adminEmail' | transloco }}
                                        </small>
                                    }
                                </div>

                                <div class="grid grid-cols-2 gap-3">
                                    <div>
                                        <label for="adminPassword" class="block font-bold mb-2">
                                            {{ 'admin.agencies.dialog.fields.password' | transloco }} *
                                        </label>
                                        <p-password
                                            id="adminPassword"
                                            [(ngModel)]="agencyForm.user!.password"
                                            [toggleMask]="true"
                                            [feedback]="false"
                                            class="w-full"
                                            [placeholder]="'admin.agencies.dialog.placeholders.password' | transloco"
                                        />
                                        @if (submitted && !agencyForm.user!.password) {
                                            <small class="text-red-500">
                                                {{ 'admin.agencies.dialog.validations.adminPassword' | transloco }}
                                            </small>
                                        }
                                    </div>

                                    <div>
                                        <label for="adminPasswordConfirm" class="block font-bold mb-2">
                                            {{ 'admin.agencies.dialog.fields.confirmPassword' | transloco }} *
                                        </label>
                                        <p-password
                                            id="adminPasswordConfirm"
                                            [(ngModel)]="agencyForm.user!.passwordConfirm"
                                            [toggleMask]="true"
                                            [feedback]="false"
                                            class="w-full"
                                            [placeholder]="'admin.agencies.dialog.placeholders.confirmPassword' | transloco"
                                        />
                                        @if (submitted && !agencyForm.user!.passwordConfirm) {
                                            <small class="text-red-500 block">
                                                {{ 'admin.agencies.dialog.validations.confirmPassword' | transloco }}
                                            </small>
                                        }
                                        @if (submitted && agencyForm.user!.password && agencyForm.user!.passwordConfirm && agencyForm.user!.password !== agencyForm.user!.passwordConfirm) {
                                            <small class="text-red-500 block">
                                                {{ 'admin.agencies.dialog.validations.passwordsMatch' | transloco }}
                                            </small>
                                        }
                                    </div>
                                </div>

                                <div class="grid grid-cols-2 gap-3">
                                    <div>
                                        <label for="adminPhoneCode" class="block font-bold mb-2">
                                            {{ 'admin.agencies.dialog.fields.countryCode' | transloco }}
                                        </label>
                                        <input
                                            type="text"
                                            pInputText
                                            id="adminPhoneCode"
                                            [(ngModel)]="agencyForm.user!.phoneCountryCode"
                                            class="w-full"
                                            [placeholder]="'admin.agencies.dialog.placeholders.countryCode' | transloco"
                                            maxlength="3"
                                        />
                                    </div>
                                    <div>
                                        <label for="adminPhone" class="block font-bold mb-2">
                                            {{ 'admin.agencies.dialog.fields.phone' | transloco }}
                                        </label>
                                        <input
                                            type="text"
                                            pInputText
                                            id="adminPhone"
                                            [(ngModel)]="agencyForm.user!.phone"
                                            class="w-full"
                                            [placeholder]="'admin.agencies.dialog.placeholders.phone' | transloco"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </ng-template>

            <ng-template #footer>
                <p-button
                    [label]="'admin.agencies.buttons.cancel' | transloco"
                    icon="pi pi-times"
                    text
                    (click)="onCancel()"
                />
                <p-button
                    [label]="'admin.agencies.buttons.save' | transloco"
                    icon="pi pi-check"
                    (click)="onSave()"
                    [loading]="saving"
                />
            </ng-template>
        </p-dialog>
    `
})
export class AgencyFormComponent implements OnChanges {
    private translocoService = inject(TranslocoService);

    @Input() visible: boolean = false;
    @Input() isEditMode: boolean = false;
    @Input() agency: Agency | null = null;
    @Input() saving: boolean = false;

    @Output() save = new EventEmitter<Agency>();
    @Output() cancel = new EventEmitter<void>();
    @Output() hide = new EventEmitter<void>();

    submitted = false;

    agencyForm: Agency = {
        name: '',
        email: '',
        address: '',
        phone: '',
        phoneCountryCode: '',
        user: {
            email: '',
            name: '',
            lastName: '',
            password: '',
            phone: '',
            phoneCountryCode: ''
        }
    };

    ngOnChanges() {
        if (this.agency) {
            this.agencyForm = { ...this.agency };
        } else {
            this.resetForm();
        }
    }

    getDialogTitle(): string {
        return this.isEditMode
            ? this.translocoService.translate('admin.agencies.dialog.editTitle')
            : this.translocoService.translate('admin.agencies.dialog.newTitle');
    }

    onSave() {
        this.submitted = true;

        if (this.isEditMode) {
            // Validación para edición
            if (!this.agencyForm.name || !this.agencyForm.email || !this.agencyForm.address) {
                return;
            }
        } else {
            // Validación para creación
            if (!this.agencyForm.name || !this.agencyForm.email || !this.agencyForm.address ||
                !this.agencyForm.user!.name || !this.agencyForm.user!.email || !this.agencyForm.user!.password) {
                return;
            }

            // Validar que las contraseñas coincidan
            if (this.agencyForm.user!.password !== this.agencyForm.user!.passwordConfirm) {
                return;
            }
        }

        this.save.emit(this.agencyForm);
    }

    onCancel() {
        this.cancel.emit();
        this.resetForm();
    }

    private resetForm() {
        this.agencyForm = {
            name: '',
            email: '',
            address: '',
            phone: '',
            phoneCountryCode: '',
            user: {
                ...DEFAULT_CREATE_USER,
                passwordConfirm: ''
            }
        };
        this.submitted = false;
    }
}
