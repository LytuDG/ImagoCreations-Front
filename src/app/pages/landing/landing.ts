import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { StyleClassModule } from 'primeng/styleclass';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { TopbarWidget } from './components/topbarwidget';
import { HeroWidget } from './components/herowidget';
import { FooterWidget } from './components/footerwidget';
import { ShopWindget } from './components/shop-widgets';

import { SeoService } from '@/core/services/seo.service';
import { inject, OnInit } from '@angular/core';

@Component({
    selector: 'app-landing',
    standalone: true,
    imports: [RouterModule, TopbarWidget, HeroWidget, FooterWidget, RippleModule, StyleClassModule, ButtonModule, DividerModule, ShopWindget, ToastModule],
    providers: [MessageService],
    template: `
        <div class="bg-surface-0 dark:bg-surface-900">
            <p-toast />
            <div id="home" class="landing-wrapper overflow-hidden">
                <topbar-widget class="fixed w-full top-0 left-0 z-50 bg-white dark:bg-surface-900 shadow-sm py-4 px-6 lg:px-20 flex items-center justify-between" />
                <hero-widget />
                <shop-widget />
                <footer-widget />
            </div>
        </div>
    `
})
export class Landing implements OnInit {
    private seoService = inject(SeoService);

    ngOnInit() {
        this.seoService.updateTitle('Imago Creations - Home');
        this.seoService.updateDescription('Premium custom business uniforms and workwear.');
        this.seoService.updateUrl('https://imagocreations.com/');
    }
}
