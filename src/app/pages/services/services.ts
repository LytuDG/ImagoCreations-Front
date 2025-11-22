import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { TopbarWidget } from '../landing/components/topbarwidget';
import { FooterWidget } from '../landing/components/footerwidget';

@Component({
    selector: 'app-services',
    standalone: true,
    imports: [CommonModule, RouterModule, ButtonModule, RippleModule, TopbarWidget, FooterWidget],
    template: `
        <div class="bg-surface-0 dark:bg-surface-900">
            <div class="landing-wrapper overflow-hidden">
                <topbar-widget class="py-6 px-6 mx-0 md:mx-12 lg:mx-20 lg:px-20 flex items-center justify-between relative lg:static" />

                <div
                    class="hero-section relative overflow-hidden flex flex-col justify-center items-center text-center py-20 px-6 lg:px-20"
                    style="background: url('img/services/hero-bg.png') no-repeat center center; background-size: cover; min-height: 60vh;"
                >
                    <div class="absolute inset-0 bg-black/60 z-0"></div>
                    <div class="z-10 relative text-white max-w-4xl">
                        <h1 class="text-5xl lg:text-7xl font-bold mb-6 drop-shadow-lg">Elevate Your Brand with Unique Designs</h1>
                        <p class="text-xl lg:text-2xl mb-8 opacity-90">At Imago Creations, we bring your vision to life through personalized merchandise and professional brand design.</p>
                        <button pButton pRipple label="Get Started" class="p-button-rounded p-button-lg text-xl px-8 py-4 font-bold bg-primary-500 border-none hover:bg-primary-600"></button>
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
                        <div class="order-1 lg:order-2">
                            <img src="img/services/personalization.png" alt="Personalization Service" class="w-full max-w-lg mx-auto rounded-3xl shadow-2xl hover:scale-105 transition-transform duration-500" />
                        </div>
                    </div>

                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <img src="img/services/brand-design.png" alt="Brand Design Service" class="w-full max-w-lg mx-auto rounded-3xl shadow-2xl hover:scale-105 transition-transform duration-500" />
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
export class ServicesComponent {}
