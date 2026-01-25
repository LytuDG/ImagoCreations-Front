import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
    selector: 'footer-widget',
    imports: [RouterModule, TranslocoModule],
    template: `
        <div class="py-8 px-6 mx-0 mt-12 border-t border-surface-200 dark:border-surface-700">
            <div class="max-w-7xl mx-auto">
                <div class="flex flex-col items-center gap-6">
                    <!-- Logo -->
                    <a (click)="router.navigate(['/'], { fragment: 'home' })" class="cursor-pointer">
                        <img src="img/imago.svg" [alt]="'landing.footer.logoAlt' | transloco" class="h-16 inline-block opacity-80 hover:opacity-100 transition-opacity" />
                    </a>

                    <!-- Links -->
                    <div class="flex flex-wrap items-center justify-center gap-6 text-surface-600 dark:text-surface-400">
                        <a class="text-sm hover:text-surface-900 dark:hover:text-surface-0 cursor-pointer transition-colors">{{ 'landing.footer.links.about' | transloco }}</a>
                        <span class="text-surface-300 dark:text-surface-600">•</span>
                        <a class="text-sm hover:text-surface-900 dark:hover:text-surface-0 cursor-pointer transition-colors">{{ 'landing.footer.links.contact' | transloco }}</a>
                        <span class="text-surface-300 dark:text-surface-600">•</span>
                        <a class="text-sm hover:text-surface-900 dark:hover:text-surface-0 cursor-pointer transition-colors">{{ 'landing.footer.links.privacy' | transloco }}</a>
                        <span class="text-surface-300 dark:text-surface-600">•</span>
                        <a class="text-sm hover:text-surface-900 dark:hover:text-surface-0 cursor-pointer transition-colors">{{ 'landing.footer.links.terms' | transloco }}</a>
                    </div>

                    <!-- Copyright con parámetro dinámico -->
                    <p class="text-xs text-surface-500 dark:text-surface-500">
                        {{ 'landing.footer.copyright' | transloco: { year: currentYear } }}
                    </p>
                </div>
            </div>
        </div>
    `
})
export class FooterWidget {
    currentYear = new Date().getFullYear();

    constructor(public router: Router) {}
}
