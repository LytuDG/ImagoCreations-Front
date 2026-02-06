import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { TopbarWidget } from '../landing/components/topbarwidget';
import { FooterWidget } from '../landing/components/footerwidget';
import { TranslocoModule } from '@ngneat/transloco';
import { SeoService } from '@/core/services/seo.service';
import { inject, OnInit } from '@angular/core';

@Component({
    selector: 'app-services',
    standalone: true,
    imports: [
      CommonModule,
      RouterModule,
      ButtonModule,
      RippleModule,
      TopbarWidget,
      FooterWidget,
      TranslocoModule,
    ],
    template: `
      <div class="bg-surface-0 dark:bg-surface-900">
          <div class="landing-wrapper overflow-hidden">
              <topbar-widget class="py-6 px-6 mx-0 md:mx-12 lg:mx-20 lg:px-20 flex items-center justify-between relative lg:static" />

              <div class="hero-section relative py-20 px-6 lg:px-20 overflow-hidden flex flex-col items-center justify-center min-h-[70vh]" style="background: url('img/services/mesh-bg.png') no-repeat center center; background-size: cover;">
                  <div class="text-center z-10 max-w-4xl mb-12">
                      <span class="inline-block py-1 px-3 rounded-full bg-white/30 backdrop-blur-md border border-white/20 text-surface-900 font-semibold text-sm mb-4">
                          {{ 'landing.services.hero.badge' | transloco }}
                      </span>
                      <h1 class="text-5xl lg:text-7xl font-bold mb-6 text-surface-900 leading-tight" [innerHTML]="'landing.services.hero.title' | transloco"></h1>
                      <p class="text-xl text-surface-700 font-medium leading-relaxed max-w-2xl mx-auto">
                          {{ 'landing.services.hero.subtitle' | transloco }}
                      </p>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-8 z-10 w-full max-w-5xl">
                      <!-- Glass Card 1 -->
                      <div class="bg-white/20 backdrop-blur-xl border border-white/30 p-8 rounded-3xl hover:bg-white/30 transition-all duration-300 cursor-pointer group shadow-xl">
                          <div class="flex items-center justify-between mb-6">
                              <div class="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 group-hover:scale-110 transition-transform">
                                  <i class="pi pi-palette text-xl"></i>
                              </div>
                              <i class="pi pi-arrow-right text-surface-600 group-hover:translate-x-1 transition-transform"></i>
                          </div>
                          <h3 class="text-2xl font-bold text-surface-900 mb-2">
                              {{ 'landing.services.hero.cards.personalization.title' | transloco }}
                          </h3>
                          <p class="text-surface-700">
                              {{ 'landing.services.hero.cards.personalization.description' | transloco }}
                          </p>
                      </div>

                      <!-- Glass Card 2 -->
                      <div class="bg-white/20 backdrop-blur-xl border border-white/30 p-8 rounded-3xl hover:bg-white/30 transition-all duration-300 cursor-pointer group shadow-xl">
                          <div class="flex items-center justify-between mb-6">
                              <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                                  <i class="pi pi-briefcase text-xl"></i>
                              </div>
                              <i class="pi pi-arrow-right text-surface-600 group-hover:translate-x-1 transition-transform"></i>
                          </div>
                          <h3 class="text-2xl font-bold text-surface-900 mb-2">
                              {{ 'landing.services.hero.cards.brandDesign.title' | transloco }}
                          </h3>
                          <p class="text-surface-700">
                              {{ 'landing.services.hero.cards.brandDesign.description' | transloco }}
                          </p>
                      </div>
                  </div>
              </div>

              <div class="services-section py-24 px-6 lg:px-20 bg-surface-50 dark:bg-surface-900 relative overflow-hidden">
                  <!-- Decorative Background Elements -->
                  <div class="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                      <div class="absolute top-[10%] left-[-5%] w-96 h-96 bg-primary-100/40 dark:bg-primary-900/10 rounded-full blur-3xl"></div>
                      <div class="absolute bottom-[10%] right-[-5%] w-96 h-96 bg-blue-100/40 dark:bg-blue-900/10 rounded-full blur-3xl"></div>
                  </div>

                  <div class="text-center mb-20 relative z-10">
                      <h2 class="text-4xl lg:text-5xl font-bold text-surface-900 dark:text-surface-0 !mb-16">
                          {{ 'landing.services.section.title' | transloco }}
                      </h2>
                      <p class="text-xl text-surface-600 dark:text-surface-300 max-w-2xl mx-auto">
                          {{ 'landing.services.section.subtitle' | transloco }}
                      </p>
                  </div>

                  <!-- Service 1: Personalization -->
                  <div class="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center mb-32 relative z-10">
                      <div class="lg:col-span-7 order-2 lg:order-1">
                          <div class="flex items-center gap-3 mb-4">
                              <div class="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                                  <i class="pi pi-star-fill"></i>
                              </div>
                              <span class="font-bold text-green-600 dark:text-green-400 tracking-wider text-sm uppercase">
                                  {{ 'landing.services.personalization.badge' | transloco }}
                              </span>
                          </div>
                          <h3 class="text-3xl lg:text-4xl font-bold text-surface-900 dark:text-surface-0 mb-6">
                              {{ 'landing.services.personalization.title' | transloco }}
                          </h3>
                          <p class="text-lg text-surface-600 dark:text-surface-300 mb-8 leading-relaxed">
                              {{ 'landing.services.personalization.description' | transloco }}
                          </p>

                          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                              <div class="flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-surface-800 shadow-sm border border-surface-100 dark:border-surface-700">
                                  <i class="pi pi-check-circle text-green-500 text-xl"></i>
                                  <span class="font-medium text-surface-700 dark:text-surface-200">
                                      {{ 'landing.services.personalization.features.apparel' | transloco }}
                                  </span>
                              </div>
                              <div class="flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-surface-800 shadow-sm border border-surface-100 dark:border-surface-700">
                                  <i class="pi pi-check-circle text-green-500 text-xl"></i>
                                  <span class="font-medium text-surface-700 dark:text-surface-200">
                                      {{ 'landing.services.personalization.features.gifts' | transloco }}
                                  </span>
                              </div>
                              <div class="flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-surface-800 shadow-sm border border-surface-100 dark:border-surface-700">
                                  <i class="pi pi-check-circle text-green-500 text-xl"></i>
                                  <span class="font-medium text-surface-700 dark:text-surface-200">
                                      {{ 'landing.services.personalization.features.printing' | transloco }}
                                  </span>
                              </div>
                              <div class="flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-surface-800 shadow-sm border border-surface-100 dark:border-surface-700">
                                  <i class="pi pi-check-circle text-green-500 text-xl"></i>
                                  <span class="font-medium text-surface-700 dark:text-surface-200">
                                      {{ 'landing.services.personalization.features.bulk' | transloco }}
                                  </span>
                              </div>
                          </div>

                          <button pButton pRipple
                                  [label]="'landing.services.personalization.button' | transloco"
                                  icon="pi pi-arrow-right"
                                  iconPos="right"
                                  class="p-button-rounded p-button-outlined px-6 py-3">
                          </button>
                      </div>

                      <div class="lg:col-span-5 order-1 lg:order-2 flex justify-center relative">
                          <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-green-100/50 dark:bg-green-900/20 rounded-full blur-2xl -z-10"></div>
                          <div class="relative">
                              <img src="img/services/personalization.png"
                                    [alt]="'landing.services.personalization.imageAlt' | transloco"
                                    class="w-72 h-auto rounded-2xl shadow-2xl rotate-3 hover:rotate-0 transition-all duration-500 border-4 border-white dark:border-surface-700" />
                              <div class="absolute -bottom-6 -right-6 bg-white dark:bg-surface-800 p-4 rounded-xl shadow-lg animate-bounce-slow">
                                  <i class="pi pi-heart-fill text-red-500 text-2xl"></i>
                              </div>
                          </div>
                      </div>
                  </div>

                  <!-- Service 2: Brand Design -->
                  <div class="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center relative z-10">
                      <div class="lg:col-span-5 flex justify-center relative">
                          <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-100/50 dark:bg-blue-900/20 rounded-full blur-2xl -z-10"></div>
                          <div class="relative">
                              <img src="img/services/brand-design.png"
                                    [alt]="'landing.services.brandDesign.imageAlt' | transloco"
                                    class="w-72 h-auto rounded-2xl shadow-2xl -rotate-3 hover:rotate-0 transition-all duration-500 border-4 border-white dark:border-surface-700" />
                              <div class="absolute -top-6 -left-6 bg-white dark:bg-surface-800 p-4 rounded-xl shadow-lg animate-bounce-slow" style="animation-delay: 1s;">
                                  <i class="pi pi-palette text-blue-500 text-2xl"></i>
                              </div>
                          </div>
                      </div>

                      <div class="lg:col-span-7">
                          <div class="flex items-center gap-3 mb-4">
                              <div class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                  <i class="pi pi-briefcase"></i>
                              </div>
                              <span class="font-bold text-blue-600 dark:text-blue-400 tracking-wider text-sm uppercase">
                                  {{ 'landing.services.brandDesign.badge' | transloco }}
                              </span>
                          </div>
                          <h3 class="text-3xl lg:text-4xl font-bold text-surface-900 dark:text-surface-0 mb-6">
                              {{ 'landing.services.brandDesign.title' | transloco }}
                          </h3>
                          <p class="text-lg text-surface-600 dark:text-surface-300 mb-8 leading-relaxed">
                              {{ 'landing.services.brandDesign.description' | transloco }}
                          </p>

                          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                              <div class="flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-surface-800 shadow-sm border border-surface-100 dark:border-surface-700">
                                  <i class="pi pi-check-circle text-blue-500 text-xl"></i>
                                  <span class="font-medium text-surface-700 dark:text-surface-200">
                                      {{ 'landing.services.brandDesign.features.logo' | transloco }}
                                  </span>
                              </div>
                              <div class="flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-surface-800 shadow-sm border border-surface-100 dark:border-surface-700">
                                  <i class="pi pi-check-circle text-blue-500 text-xl"></i>
                                  <span class="font-medium text-surface-700 dark:text-surface-200">
                                      {{ 'landing.services.brandDesign.features.guidelines' | transloco }}
                                  </span>
                              </div>
                              <div class="flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-surface-800 shadow-sm border border-surface-100 dark:border-surface-700">
                                  <i class="pi pi-check-circle text-blue-500 text-xl"></i>
                                  <span class="font-medium text-surface-700 dark:text-surface-200">
                                      {{ 'landing.services.brandDesign.features.collateral' | transloco }}
                                  </span>
                              </div>
                              <div class="flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-surface-800 shadow-sm border border-surface-100 dark:border-surface-700">
                                  <i class="pi pi-check-circle text-blue-500 text-xl"></i>
                                  <span class="font-medium text-surface-700 dark:text-surface-200">
                                      {{ 'landing.services.brandDesign.features.social' | transloco }}
                                  </span>
                              </div>
                          </div>

                          <button pButton pRipple
                                  [label]="'landing.services.brandDesign.button' | transloco"
                                  icon="pi pi-arrow-right"
                                  iconPos="right"
                                  class="p-button-rounded p-button-outlined px-6 py-3">
                          </button>
                      </div>
                  </div>
              </div>

              <div class="cta-section py-20 px-6 lg:px-20 bg-primary-500 text-white text-center">
                  <h2 class="text-4xl font-bold mb-6">
                      {{ 'landing.services.cta.title' | transloco }}
                  </h2>
                  <p class="text-xl mb-8 opacity-90">
                      {{ 'landing.services.cta.subtitle' | transloco }}
                  </p>
                  <button pButton pRipple
                          [label]="'landing.services.cta.button' | transloco"
                          class="p-button-rounded p-button-secondary text-primary-500 font-bold text-xl px-8 py-3 bg-white border-none hover:bg-gray-100">
                  </button>
              </div>

              <footer-widget />
          </div>
      </div>
    `
})
export class ServicesComponent implements OnInit {
    private seoService = inject(SeoService);

    ngOnInit() {
        this.seoService.updateTitle('Our Services - Imago Creations');
        this.seoService.updateDescription('Explore our custom uniform design and manufacturing services.');
        this.seoService.updateUrl('https://imagocreations.com/services');
    }
}
