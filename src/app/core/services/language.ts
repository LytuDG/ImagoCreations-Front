// src/app/core/services/language.service.ts
import { Injectable, inject, signal, computed } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';

export interface LanguageOption {
    value: string;
    label: string;
    flag: string;
}

@Injectable({
    providedIn: 'root'
})
export class LanguageService {
    private translocoService = inject(TranslocoService);

    // Opciones de idioma disponibles
    readonly languageOptions: LanguageOption[] = [
        { value: 'en', label: 'English', flag: '🇺🇸' },
        { value: 'es', label: 'Español', flag: '🇪🇸' }
    ];

    // Idioma actual como signal (reactivo)
    public currentLangSignal = signal<LanguageOption>(
        this.getInitialLanguage()
    );

    // Computed para acceder al idioma actual
    currentLang = computed(() => this.currentLangSignal());

    // Computed para el valor simple (string)
    currentLangValue = computed(() => this.currentLangSignal().value);

    /**
     * Obtiene el idioma inicial basado en:
     * 1. localStorage
     * 2. Idioma activo de Transloco
     * 3. Opción por defecto (en)
     */
    private getInitialLanguage(): LanguageOption {
        // 1. Intentar desde localStorage
        const savedLang = localStorage.getItem('userLanguage');
        if (savedLang) {
            const option = this.languageOptions.find(opt => opt.value === savedLang);
            if (option) {
                // Sincronizar Transloco con localStorage
                this.translocoService.setActiveLang(savedLang);
                return option;
            }
        }

        // 2. Usar el idioma activo de Transloco
        const activeLang = this.translocoService.getActiveLang();
        const translocoOption = this.languageOptions.find(opt => opt.value === activeLang);
        if (translocoOption) {
            return translocoOption;
        }

        // 3. Usar la primera opción por defecto
        return this.languageOptions[0];
    }

    /**
     * Cambia el idioma de la aplicación
     */
    changeLanguage(langValue: string): void;
    changeLanguage(langOption: LanguageOption): void;
    changeLanguage(lang: string | LanguageOption): void {
        let langValue: string;

        // Manejar ambos casos: string u objeto
        if (typeof lang === 'string') {
            langValue = lang;
        } else {
            langValue = lang.value;
        }

        // Validar que el idioma sea válido
        const option = this.languageOptions.find(opt => opt.value === langValue);
        if (!option) {
            console.warn(`Idioma no válido: ${langValue}`);
            return;
        }

        // Actualizar signals y servicios
        this.currentLangSignal.set(option);
        this.translocoService.setActiveLang(langValue);
        localStorage.setItem('userLanguage', langValue);

        console.log(`Idioma cambiado a: ${langValue}`);
    }

    /**
     * Obtiene la opción de idioma por su valor
     */
    getLanguageOption(value: string): LanguageOption | undefined {
        return this.languageOptions.find(opt => opt.value === value);
    }

    /**
     * Lista de valores de idioma disponibles (para selectores simples)
     */
    get availableLanguages(): string[] {
        return this.languageOptions.map(opt => opt.value);
    }
}
