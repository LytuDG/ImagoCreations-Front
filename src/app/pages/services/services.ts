import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { TopbarWidget } from '../landing/components/topbarwidget';
import { FooterWidget } from '../landing/components/footerwidget';

import { SeoService } from '@/core/services/seo.service';
import { inject, OnInit } from '@angular/core';

@Component({
    selector: 'app-services',
    standalone: true,
    imports: [CommonModule, RouterModule, ButtonModule, RippleModule, TopbarWidget, FooterWidget],
    template: `
        <div class="bg-surface-0 dark:bg-surface-900">
            <div class="landing-wrapper overflow-hidden">
                <topbar-widget class="py-6 px-6 mx-0 md:mx-12 lg:mx-20 lg:px-20 flex items-center justify-between relative lg:static" />

                <div class="hero-section relative py-20 px-6 lg:px-20 overflow-hidden flex flex-col items-center justify-center min-h-[70vh]" style="background: url('img/services/mesh-bg.png') no-repeat center center; background-size: cover;">
                    <div class="text-center z-10 max-w-4xl mb-12">
                        <span class="inline-block py-1 px-3 rounded-full bg-white/30 backdrop-blur-md border border-white/20 text-surface-900 font-semibold text-sm mb-4"> PREMIUM SERVICES </span>
                        <h1 class="text-5xl lg:text-7xl font-bold mb-6 text-surface-900 leading-tight">Crafting Your <span class="text-primary-600">Identity</span></h1>
                        <p class="text-xl text-surface-700 font-medium leading-relaxed max-w-2xl mx-auto">From bespoke merchandise to comprehensive brand strategies, we design the future of your business.</p>
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
                            <h3 class="text-2xl font-bold text-surface-900 mb-2">Personalization</h3>
                            <p class="text-surface-700">Custom apparel, gifts, and accessories tailored to your unique style.</p>
                        </div>

                        <!-- Glass Card 2 -->
                        <div class="bg-white/20 backdrop-blur-xl border border-white/30 p-8 rounded-3xl hover:bg-white/30 transition-all duration-300 cursor-pointer group shadow-xl">
                            <div class="flex items-center justify-between mb-6">
                                <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                                    <i class="pi pi-briefcase text-xl"></i>
                                </div>
                                <i class="pi pi-arrow-right text-surface-600 group-hover:translate-x-1 transition-transform"></i>
                            </div>
                            <h3 class="text-2xl font-bold text-surface-900 mb-2">Brand Design</h3>
                            <p class="text-surface-700">Professional logos, identity systems, and marketing collateral.</p>
                        </div>
                    </div>
                </div>

                <div class="services-section py-20 px-6 lg:px-20 bg-surface-50 dark:bg-surface-800">
                    <div class="text-center mb-16">
                        <h2 class="text-4xl font-bold text-surface-900 dark:text-surface-0 mb-4">Our Premium Services</h2>
                        <p class="text-xl text-surface-600 dark:text-surface-200">Tailored solutions for individuals and businesses.</p>
                    </div>

                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
                        <div class="order-2 lg:order-1">
                            <h3 class="text-3xl font-bold text-surface-900 dark:text-surface-0 mb-4">Personalization Services</h3>
                            <p class="text-lg text-surface-600 dark:text-surface-200 mb-6 leading-relaxed">
                                Make it truly yours. We offer high-quality personalization for a wide range of products. From custom apparel to unique gifts, we ensure every detail reflects your style. Perfect for corporate gifts, events, or personal
                                use.
                            </p>
                            <ul class="list-none p-0 m-0 text-surface-600 dark:text-surface-200 mb-8">
                                <li class="flex items-center mb-3">
                                    <i class="pi pi-check-circle text-green-500 mr-3 text-xl"></i>
                                    <span class="text-lg">Custom Apparel & Accessories</span>
                                </li>
                                <li class="flex items-center mb-3">
                                    <i class="pi pi-check-circle text-green-500 mr-3 text-xl"></i>
                                    <span class="text-lg">Personalized Gifts & Mugs</span>
                                </li>
                                <li class="flex items-center">
                                    <i class="pi pi-check-circle text-green-500 mr-3 text-xl"></i>
                                    <span class="text-lg">High-Quality Printing</span>
                                </li>
                            </ul>
                            <button pButton pRipple label="Explore Personalization" class="p-button-outlined p-button-rounded"></button>
                        </div>
                        <div class="order-1 lg:order-2 flex justify-center">
                            <img src="img/services/personalization.png" alt="Personalization Service" class="w-full max-w-sm mx-auto rounded-3xl shadow-xl hover:scale-105 transition-transform duration-500 block" />
                        </div>
                    </div>

                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div class="flex justify-center">
                            <img src="img/services/brand-design.png" alt="Brand Design Service" class="w-full max-w-sm mx-auto rounded-3xl shadow-xl hover:scale-105 transition-transform duration-500 block" />
                        </div>
                        <div>
                            <h3 class="text-3xl font-bold text-surface-900 dark:text-surface-0 mb-4">Brand Design for Businesses</h3>
                            <p class="text-lg text-surface-600 dark:text-surface-200 mb-6 leading-relaxed">
                                Your brand is your story. We help you tell it with impact. Our professional design team creates cohesive brand identities that resonate with your audience. From logos to complete brand guidelines, we build the visual
                                foundation of your success.
                            </p>
                            <ul class="list-none p-0 m-0 text-surface-600 dark:text-surface-200 mb-8">
                                <li class="flex items-center mb-3">
                                    <i class="pi pi-check-circle text-blue-500 mr-3 text-xl"></i>
                                    <span class="text-lg">Logo Design & Identity</span>
                                </li>
                                <li class="flex items-center mb-3">
                                    <i class="pi pi-check-circle text-blue-500 mr-3 text-xl"></i>
                                    <span class="text-lg">Brand Guidelines & Strategy</span>
                                </li>
                                <li class="flex items-center">
                                    <i class="pi pi-check-circle text-blue-500 mr-3 text-xl"></i>
                                    <span class="text-lg">Marketing Collateral</span>
                                </li>
                            </ul>
                            <button pButton pRipple label="Start Your Brand Journey" class="p-button-outlined p-button-rounded"></button>
                        </div>
                    </div>
                </div>

                <div class="cta-section py-20 px-6 lg:px-20 bg-primary-500 text-white text-center">
                    <h2 class="text-4xl font-bold mb-6">Ready to Create Something Amazing?</h2>
                    <p class="text-xl mb-8 opacity-90">Let's collaborate to bring your ideas to reality. Contact us today.</p>
                    <button pButton pRipple label="Contact Us" class="p-button-rounded p-button-secondary text-primary-500 font-bold text-xl px-8 py-3 bg-white border-none hover:bg-gray-100"></button>
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
