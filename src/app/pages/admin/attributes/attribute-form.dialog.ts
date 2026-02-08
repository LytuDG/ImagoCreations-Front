import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { DialogModule } from 'primeng/dialog';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { Attribute } from './models/attribute';
import { AgencyService } from '../agencies/agency.service';
import { Agency } from '../agencies/models/agency';
import {
  AttributeInputType,
  ATTRIBUTE_TYPE_CONFIG,
  ATTRIBUTE_TYPE_OPTIONS,
  requiresValues,
  getAttributeTypeConfig
} from './constants/attribute-types';
import { AuthService } from '@/core/services/auth.service';

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
        DialogModule,
        TranslocoModule
    ],
    template: `
        <p-dialog
            [(visible)]="visible"
            [style]="{ width: '500px' }"
            [header]="getDialogTitle()"
            [modal]="true"
            [draggable]="false"
            [closable]="!saving"
            (onHide)="onHide()"
        >
            <ng-template #content>
                <div class="flex flex-col gap-4 p-fluid">
                    <!-- Nombre del Atributo -->
                    <div class="field">
                        <label for="name" class="block font-bold mb-2">
                            {{ 'admin.attributes.form.fields.name' | transloco }} *
                        </label>
                        <input
                            type="text"
                            pInputText
                            id="name"
                            [(ngModel)]="localAttribute.name"
                            required
                            class="w-full"
                            [placeholder]="'admin.attributes.form.placeholders.name' | transloco"
                            [disabled]="saving"
                        />
                    </div>

                    <!-- Tipo de Input -->
                    <div class="field">
                        <label for="inputType" class="block font-bold mb-2">
                            {{ 'admin.attributes.form.fields.inputType' | transloco }} *
                        </label>
                        <p-select
                            [options]="getTranslatedInputTypeOptions()"
                            optionLabel="label"
                            optionValue="value"
                            [(ngModel)]="localAttribute.inputType"
                            [placeholder]="'admin.attributes.form.placeholders.inputType' | transloco"
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
                                {{ getTranslatedTypeDescription(localAttribute.inputType) }}
                                @if (selectedTypeConfig.supportsValues) {
                                    <span class="ml-2 text-primary font-medium">
                                        {{ 'admin.attributes.form.messages.requiresValues' | transloco }}
                                    </span>
                                }
                            </small>
                        }
                    </div>

                    <!-- Campos Booleanos - Alineados a la izquierda -->
                    <div class="justify-start">
                        <label class="block font-bold mb-2">
                            {{ 'admin.attributes.form.fields.configuration' | transloco }}
                        </label>
                        <div
                            [style]="{ 'grid-template-columns': 'repeat(2, minmax(0, 0.3fr))' }"
                            class="grid gap-4 p-3 surface-border border-round"
                        >
                            <!-- Fila 1 -->
                            <span class="font-medium flex items-center">
                                {{ 'admin.attributes.form.labels.required' | transloco }}
                            </span>
                            <div class="flex justify-start">
                                <p-toggleButton
                                    [(ngModel)]="localAttribute.required"
                                    [onLabel]="'admin.attributes.form.toggle.yes' | transloco"
                                    [offLabel]="'admin.attributes.form.toggle.no' | transloco"
                                    onIcon="pi pi-check"
                                    offIcon="pi pi-times"
                                    [style]="{ width: '80px' }"
                                    [disabled]="saving"
                                />
                            </div>

                            <!-- Fila 2 -->
                            <span class="font-medium flex items-center">
                                {{ 'admin.attributes.form.labels.reusable' | transloco }}
                            </span>
                            <div class="flex justify-start">
                                <p-toggleButton
                                    [(ngModel)]="localAttribute.reusable"
                                    [onLabel]="'admin.attributes.form.toggle.yes' | transloco"
                                    [offLabel]="'admin.attributes.form.toggle.no' | transloco"
                                    onIcon="pi pi-check"
                                    offIcon="pi pi-times"
                                    [style]="{ width: '80px' }"
                                    [disabled]="saving"
                                />
                            </div>

                            <!-- Fila 3 -->
                            <span class="font-medium flex items-center">
                                {{ 'admin.attributes.form.labels.visibleB2B' | transloco }}
                            </span>
                            <div class="flex justify-start">
                                <p-toggleButton
                                    [(ngModel)]="localAttribute.visibleB2B"
                                    [onLabel]="'admin.attributes.form.toggle.yes' | transloco"
                                    [offLabel]="'admin.attributes.form.toggle.no' | transloco"
                                    onIcon="pi pi-check"
                                    offIcon="pi pi-times"
                                    [style]="{ width: '80px' }"
                                    [disabled]="saving"
                                />
                            </div>

                            <!-- Fila 4 -->
                            <span class="font-medium flex items-center">
                                {{ 'admin.attributes.form.labels.visibleB2C' | transloco }}
                            </span>
                            <div class="flex justify-start">
                                <p-toggleButton
                                    [(ngModel)]="localAttribute.visibleB2C"
                                    [onLabel]="'admin.attributes.form.toggle.yes' | transloco"
                                    [offLabel]="'admin.attributes.form.toggle.no' | transloco"
                                    onIcon="pi pi-check"
                                    offIcon="pi pi-times"
                                    [style]="{ width: '80px' }"
                                    [disabled]="saving"
                                />
                            </div>
                        </div>
                    </div>

                    <!-- Sección para gestión de valores (solo para tipos que los requieren) -->
                    @if (showValuesSection && attribute?.id) {
                        <div class="field mt-4">
                            <div class="flex items-center justify-content-between mb-3">
                                <label class="block font-bold mb-0">
                                    {{ 'admin.attributes.form.sections.predefinedValues' | transloco }}
                                </label>
                                <p-button
                                    [label]="'admin.attributes.form.buttons.manageValues' | transloco"
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
                                        {{ 'admin.attributes.form.messages.valuesInstruction' | transloco }}
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
                        [label]="'admin.attributes.form.buttons.cancel' | transloco"
                        icon="pi pi-times"
                        text
                        (click)="onCancel()"
                        [disabled]="saving"
                    />
                    <p-button
                        [label]="'admin.attributes.form.buttons.save' | transloco"
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
    private authService = inject(AuthService);
    private translocoService = inject(TranslocoService);

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
    userAgencyId: string = '';

    // Configuración del tipo seleccionado
    selectedTypeConfig: any = null;

    // Controlar si mostrar la sección de valores
    showValuesSection: boolean = false;

    ngOnInit() {
        this.authService.getCurrentUser().subscribe({
            next: (user) => {
                if (user.agencyId) {
                    this.userAgencyId = user.agencyId;
                    // Si estamos creando y aún no tiene agencia, asignarla
                    if (!this.attribute?.id && !this.localAttribute.agencyId) {
                        this.localAttribute.agencyId = user.agencyId;
                    }
                }
            }
        });

        this.resetForm();
        this.loadAgencies();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['attribute']) {
            this.resetForm();
        }
    }

    // Obtener título del diálogo traducido
    getDialogTitle(): string {
        return this.isEditMode
            ? this.translocoService.translate('admin.attributes.form.title.edit')
            : this.translocoService.translate('admin.attributes.form.title.new');
    }

    // Cargar todas las agencias
    loadAgencies() {
        this.loadingAgencies = true;
        const params = { page: 1, pageSize: 100 };
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
            // Asignar agencia del usuario si ya la tenemos cargada
            if (this.userAgencyId) {
                this.localAttribute.agencyId = this.userAgencyId;
            }
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
            this.selectedTypeConfig = getAttributeTypeConfig(this.localAttribute.inputType);
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
            console.warn(this.translocoService.translate('admin.attributes.form.messages.valuesWarning'));
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
            visibleB2C: true
        };
    }

    // Obtener opciones de tipos de input traducidas
    getTranslatedInputTypeOptions(): any[] {
        return ATTRIBUTE_TYPE_OPTIONS.map(option => ({
            ...option,
            label: this.getTranslatedTypeLabel(option.value),
            description: this.getTranslatedTypeDescription(option.value)
        }));
    }

    // Obtener etiqueta traducida para un tipo
    getTranslatedTypeLabel(inputType: AttributeInputType): string {
        const translationKey = `admin.attributes.inputTypes.${inputType}`;
        const translated = this.translocoService.translate(translationKey);
        return translated !== translationKey ? translated : inputType;
    }

    // Obtener descripción traducida para un tipo
    getTranslatedTypeDescription(inputType: AttributeInputType): string {
        const translationKey = `admin.attributes.typeDescriptions.${inputType}`;
        const translated = this.translocoService.translate(translationKey);
        // Si no hay traducción, usar la descripción por defecto
        if (translated !== translationKey) {
            return translated;
        }

        // Fallback a la descripción del archivo de constantes
        const typeConfig = getAttributeTypeConfig(inputType);
        return typeConfig?.description || '';
    }
}
