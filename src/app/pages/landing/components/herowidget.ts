import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { Router } from '@angular/router';

@Component({
    selector: 'hero-widget',
    imports: [ButtonModule, RippleModule],
    template: `
        <div class="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden bg-surface-0 dark:bg-surface-900">
            <div class="container mx-auto px-6 lg:px-20">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div class="text-center lg:text-left z-10">
                        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300 font-medium text-sm mb-6">
                            <span class="w-2 h-2 rounded-full bg-primary-500"></span>
                            Premium Corporate Branding
                        </div>
                        <h1 class="text-5xl lg:text-7xl font-bold text-surface-900 dark:text-surface-0 leading-tight mb-6">Elevate Your Brand with <span class="text-primary-500">Custom Apparel</span></h1>
                        <p class="text-xl text-surface-600 dark:text-surface-300 leading-relaxed mb-8 max-w-2xl mx-auto lg:mx-0">
                            We specialize in high-quality B2B customization for uniforms, merchandise, and corporate gifts. Transform your corporate identity into tangible quality.
                        </p>
                        <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <button pButton pRipple label="Explore Catalog" class="p-button-primary p-button-lg rounded-xl px-8" (click)="router.navigate(['/'], { fragment: 'shop' })"></button>
                            <button pButton pRipple label="Why Choose Us" class="p-button-outlined p-button-secondary p-button-lg rounded-xl px-8" (click)="router.navigate(['/'], { fragment: 'features' })"></button>
                        </div>

                        <div class="mt-12 flex items-center justify-center lg:justify-start gap-8 text-surface-500 dark:text-surface-400">
                            <div class="flex items-center gap-2">
                                <i class="pi pi-check-circle text-primary-500"></i>
                                <span class="font-medium">Premium Quality</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <i class="pi pi-check-circle text-primary-500"></i>
                                <span class="font-medium">Bulk Orders</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <i class="pi pi-check-circle text-primary-500"></i>
                                <span class="font-medium">Fast Turnaround</span>
                            </div>
                        </div>
                    </div>

                    <div class="relative z-0">
                        <!-- Decorative blob or shape behind image -->
                        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary-100/50 dark:bg-primary-900/20 rounded-full blur-3xl -z-10"></div>

                        <img src="img/hero-corporate.png" alt="Corporate Customization" class="w-full h-auto rounded-3xl shadow-2xl transform hover:scale-[1.02] transition-transform duration-500" />

                        <!-- Floating badge example -->
                        <div class="absolute -bottom-6 -left-6 bg-surface-0 dark:bg-surface-800 p-4 rounded-2xl shadow-xl hidden lg:block">
                            <div class="flex items-center gap-4">
                                <div class="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                    <i class="pi pi-star-fill text-xl"></i>
                                </div>
                                <div>
                                    <p class="text-sm text-surface-500 dark:text-surface-400 font-medium">Trusted by</p>
                                    <p class="text-lg font-bold text-surface-900 dark:text-surface-0">500+ Companies</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class HeroWidget {
    router = inject(Router);
}
