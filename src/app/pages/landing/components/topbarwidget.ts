import { Component, inject } from '@angular/core';
import { StyleClassModule } from 'primeng/styleclass';
import { Router, RouterModule } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { AppFloatingConfigurator } from '@/layout/component/app.floatingconfigurator';
import { BadgeModule } from 'primeng/badge';
import { CartService } from '@/core/services/cart.service';
import { MessageService } from 'primeng/api';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { AuthService } from '@/core/services/auth.service';

@Component({
    selector: 'topbar-widget',
    imports: [RouterModule, StyleClassModule, ButtonModule, RippleModule, BadgeModule, OverlayBadgeModule, AppFloatingConfigurator],
    template: `<a class="flex items-center mr-10" href="#">
            <img src="img/imago.svg" alt="imago logo" class="h-24 inline-block" />
            <span class="flex ml-2 text-xl font-bold w-60 ">IMAGO CREATIONS</span>
        </a>

        <a pButton [text]="true" severity="secondary" [rounded]="true" pRipple class="lg:hidden!" pStyleClass="@next" enterFromClass="hidden" leaveToClass="hidden" [hideOnOutsideClick]="true">
            <i class="pi pi-bars text-2xl!"></i>
        </a>

        <div class="items-center bg-surface-0 dark:bg-surface-900 grow justify-between hidden lg:flex absolute lg:static w-full left-0 top-full px-12 lg:px-0 z-20 rounded-border">
            <ul class="list-none p-0 m-0 flex lg:items-center select-none flex-col lg:flex-row cursor-pointer gap-8">
                <li>
                    <a (click)="router.navigate(['/'], { fragment: 'home' })" pRipple class="px-0 py-4 text-surface-900 dark:text-surface-0 font-medium text-xl">
                        <span>Home</span>
                    </a>
                </li>
                <li>
                    <a (click)="router.navigate(['/'], { fragment: 'shop' })" pRipple class="px-0 py-4 text-surface-900 dark:text-surface-0 font-medium text-xl">
                        <span>Shop</span>
                    </a>
                </li>
            </ul>
            <div class="flex border-t lg:border-t-0 border-surface py-4 lg:py-0 mt-4 lg:mt-0 gap-2">
                <p-overlaybadge [value]="cart.totalItems()">
                    <button type="button" class="topbar-widget-cart" routerLink="/cart">
                        <i class="pi pi-shopping-cart"></i>
                    </button>
                </p-overlaybadge>
                @if (authService.isLogin()) {
                    <button pRipple routerLink="/admin" class="topbar-widget-cart mx-2">
                        <i class="pi pi-home"></i>
                    </button>
                } @else {
                    <button pButton pRipple label="Login" routerLink="/auth/login" [rounded]="true" [text]="true"></button>
                }
                <!-- <button pButton pRipple label="Register" routerLink="/auth/login" [rounded]="true"></button> -->
                <app-floating-configurator [float]="false" />
            </div>
        </div> `
})
export class TopbarWidget {
    router = inject(Router);
    cart = inject(CartService);
    authService = inject(AuthService);
}
