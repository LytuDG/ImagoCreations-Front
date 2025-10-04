import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { StyleClassModule } from 'primeng/styleclass';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { TopbarWidget } from './components/topbarwidget';
import { HeroWidget } from './components/herowidget';
import { FooterWidget } from './components/footerwidget';
import { ShopWindget } from './components/shop-widgets';

@Component({
    selector: 'app-landing',
    standalone: true,
    imports: [RouterModule, TopbarWidget, HeroWidget, FooterWidget, RippleModule, StyleClassModule, ButtonModule, DividerModule, ShopWindget],
    template: `
        <div class="bg-surface-0 dark:bg-surface-900">
            <div id="home" class="landing-wrapper overflow-hidden">
                <topbar-widget class="py-6 px-6 mx-0 md:mx-12 lg:mx-20 lg:px-20 flex items-center justify-between relative lg:static" />
                <hero-widget />
                <shop-widget/>
                <footer-widget />
            </div>
        </div>
    `
})
export class Landing {}
