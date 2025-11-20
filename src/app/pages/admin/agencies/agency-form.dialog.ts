import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
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
    PasswordModule
  ],
  template: `
    <p-dialog
      [(visible)]="visible"
      [style]="{ width: '600px' }"
      header="{{ isEditMode ? 'Editar Agencia' : 'Nueva Agencia' }}"
      [modal]="true"
      (onHide)="onCancel()"
    >
      <ng-template #content>
        <div class="flex flex-col gap-6">
          <!-- Sección de Datos de la Agencia -->
          <div class="border-round border-1 surface-border p-4">
            <h4 class="mt-0 mb-4 text-surface-900">Datos de la Agencia</h4>

            <div class="grid grid-cols-1 gap-4">
              <div>
                <label for="agencyName" class="block font-bold mb-2">Nombre de la Agencia *</label>
                <input type="text" pInputText id="agencyName" [(ngModel)]="agencyForm.name"
                       required class="w-full" placeholder="Ingrese el nombre de la agencia" />
                @if (submitted && !agencyForm.name) {
                  <small class="text-red-500">El nombre de la agencia es requerido</small>
                }
              </div>

              <div>
                <label for="agencyEmail" class="block font-bold mb-2">Email de la Agencia *</label>
                <input type="email" pInputText id="agencyEmail" [(ngModel)]="agencyForm.email"
                       required class="w-full" placeholder="email@agencia.com" />
                @if (submitted && !agencyForm.email) {
                  <small class="text-red-500">El email de la agencia es requerido</small>
                }
              </div>

              <div>
                <label for="agencyAddress" class="block font-bold mb-2">Dirección *</label>
                <textarea pInputText id="agencyAddress" [(ngModel)]="agencyForm.address"
                          required class="w-full" rows="3" placeholder="Dirección completa de la agencia"></textarea>
                @if (submitted && !agencyForm.address) {
                  <small class="text-red-500">La dirección es requerida</small>
                }
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label for="agencyPhoneCode" class="block font-bold mb-2">Código País</label>
                  <input type="text" pInputText id="agencyPhoneCode" [(ngModel)]="agencyForm.phoneCountryCode"
                         class="w-full" placeholder="57" maxlength="3" />
                </div>
                <div>
                  <label for="agencyPhone" class="block font-bold mb-2">Teléfono</label>
                  <input type="text" pInputText id="agencyPhone" [(ngModel)]="agencyForm.phone"
                         class="w-full" placeholder="Número telefónico" />
                </div>
              </div>
            </div>
          </div>

          <!-- Sección del Usuario Administrador (solo para creación) -->
          @if (!isEditMode) {
            <div class="border-round border-1 surface-border p-4">
              <h4 class="mt-0 mb-4 text-surface-900">Usuario Administrador</h4>

              <div class="grid grid-cols-1 gap-4">
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label for="adminName" class="block font-bold mb-2">Nombre *</label>
                    <input type="text" pInputText id="adminName" [(ngModel)]="agencyForm.user!.name"
                           required class="w-full" placeholder="Nombre del administrador" />
                    @if (submitted && !agencyForm.user!.name) {
                      <small class="text-red-500">El nombre del administrador es requerido</small>
                    }
                  </div>
                  <div>
                    <label for="adminLastName" class="block font-bold mb-2">Apellido</label>
                    <input type="text" pInputText id="adminLastName" [(ngModel)]="agencyForm.user!.lastName"
                           class="w-full" placeholder="Apellido del administrador" />
                  </div>
                </div>

                <div>
                  <label for="adminEmail" class="block font-bold mb-2">Email *</label>
                  <input type="email" pInputText id="adminEmail" [(ngModel)]="agencyForm.user!.email"
                         required class="w-full" placeholder="admin@email.com" />
                  @if (submitted && !agencyForm.user!.email) {
                    <small class="text-red-500">El email del administrador es requerido</small>
                  }
                </div>

                <div>
                  <label for="adminPassword" class="block font-bold mb-2">Contraseña *</label>
                  <p-password id="adminPassword" [(ngModel)]="agencyForm.user!.password"
                             [toggleMask]="true" [feedback]="false" class="w-full"
                             placeholder="Contraseña del administrador" />
                  @if (submitted && !agencyForm.user!.password) {
                    <small class="text-red-500">La contraseña es requerida</small>
                  }
                </div>

                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label for="adminPhoneCode" class="block font-bold mb-2">Código País</label>
                    <input type="text" pInputText id="adminPhoneCode" [(ngModel)]="agencyForm.user!.phoneCountryCode"
                           class="w-full" placeholder="57" maxlength="3" />
                  </div>
                  <div>
                    <label for="adminPhone" class="block font-bold mb-2">Teléfono</label>
                    <input type="text" pInputText id="adminPhone" [(ngModel)]="agencyForm.user!.phone"
                           class="w-full" placeholder="Número telefónico" />
                  </div>
                </div>
              </div>
            </div>
          }
        </div>
      </ng-template>

      <ng-template #footer>
        <p-button label="Cancelar" icon="pi pi-times" text (click)="onCancel()" />
        <p-button label="Guardar" icon="pi pi-check" (click)="onSave()" [loading]="saving" />
      </ng-template>
    </p-dialog>
  `
})
export class AgencyFormComponent {
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
      user: DEFAULT_CREATE_USER
    };
    this.submitted = false;
  }
}
