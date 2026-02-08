// app.menu.component.ts
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { SkeletonModule } from 'primeng/skeleton';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { Subject, takeUntil } from 'rxjs';
import { AppMenuitem } from './app.menuitem';
import { ADMIN_ROUTES, PUBLIC_BASE_ROUTES } from '@/core/constants/routes/routes';
import { AuthService } from '@/core/services/auth.service';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule, SkeletonModule, TranslocoModule],
    template: `<ul class="layout-menu">
        @if (isLoading) {
            <!-- Skeleton Loader -->
            <li class="layout-root-menuitem">
                <div class="layout-menuitem-root-text">
                    <p-skeleton width="4rem" height="1rem" styleClass="mb-2"></p-skeleton>
                </div>
                <ul>
                    @for (item of [1]; track $index) {
                        <li class="px-4 py-2">
                            <div class="flex items-center gap-3">
                                <p-skeleton shape="circle" size="1.5rem"></p-skeleton>
                                <p-skeleton width="8rem" height="1rem"></p-skeleton>
                            </div>
                        </li>
                    }
                </ul>
            </li>

            <li class="layout-root-menuitem">
                <div class="layout-menuitem-root-text">
                    <p-skeleton width="3rem" height="1rem" styleClass="mb-2"></p-skeleton>
                </div>
                <ul>
                    @for (item of [1, 2, 3, 4, 5]; track $index) {
                        <li class="px-4 py-2">
                            <div class="flex items-center gap-3">
                                <p-skeleton shape="circle" size="1.5rem"></p-skeleton>
                                <p-skeleton width="7rem" height="1rem"></p-skeleton>
                            </div>
                        </li>
                    }
                </ul>
            </li>

            <li class="layout-root-menuitem">
                <div class="layout-menuitem-root-text">
                    <p-skeleton width="3.5rem" height="1rem" styleClass="mb-2"></p-skeleton>
                </div>
                <ul>
                    @for (item of [1]; track $index) {
                        <li class="px-4 py-2">
                            <div class="flex items-center gap-3">
                                <p-skeleton shape="circle" size="1.5rem"></p-skeleton>
                                <p-skeleton width="6rem" height="1rem"></p-skeleton>
                            </div>
                        </li>
                    }
                </ul>
            </li>

            <li class="menu-separator"></li>

            <li class="layout-root-menuitem">
                <div class="layout-menuitem-root-text">
                    <p-skeleton width="4.5rem" height="1rem" styleClass="mb-2"></p-skeleton>
                </div>
                <ul>
                    @for (item of [1]; track $index) {
                        <li class="px-4 py-2">
                            <div class="flex items-center gap-3">
                                <p-skeleton shape="circle" size="1.5rem"></p-skeleton>
                                <p-skeleton width="5rem" height="1rem"></p-skeleton>
                            </div>
                        </li>
                    }
                </ul>
            </li>
        } @else {
            <!-- Actual Menu -->
            @for (item of model; track $index; let i = $index) {
                <ng-container>
                    @if (!item.separator) {
                        <li app-menuitem [item]="item" [index]="i" [root]="true"></li>
                    }
                    @if (item.separator) {
                        <li class="menu-separator"></li>
                    }
                </ng-container>
            }
        }
    </ul>`
})
export class AppMenu implements OnInit, OnDestroy {
    authService = inject(AuthService);
    translocoService = inject(TranslocoService);

    private destroy$ = new Subject<void>();

    isSuperAdmin = false;
    isLoading = true;

    model: MenuItem[] = [];

    ngOnInit() {
        this.authService.isSuperAdmin().subscribe({
            next: (response) => {
                this.isSuperAdmin = response;
                this.buildStaticMenu();
                this.isLoading = false;
            },
            error: (error) => {
                console.error('Error verificando SUPERADMIN:', error);
                this.isSuperAdmin = false;
                this.buildStaticMenu();
                this.isLoading = false;
            }
        });
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    logout() {
        this.authService.logout();
    }

    private buildStaticMenu() {
        console.log('Construyendo menú estático con keys de traducción...');

        this.model = [
            {
                label: 'admin.menu.home', // ← Key de traducción
                items: [{
                    label: 'admin.menu.dashboard', // ← Key de traducción
                    icon: 'pi pi-fw pi-home',
                    routerLink: [ADMIN_ROUTES.ADMIN_DASHBOARD]
                }]
            },
            {
                label: 'admin.menu.admin', // ← Key de traducción
                icon: 'pi pi-fw pi-briefcase',
                routerLink: ['/pages'],
                items: [
                    {
                        label: 'admin.menu.products', // ← Key de traducción
                        icon: 'pi pi-fw pi-shopping-cart',
                        routerLink: [ADMIN_ROUTES.ADMIN_PRODUCTS]
                    },
                    {
                        label: 'admin.menu.attributes', // ← Key de traducción
                        icon: 'pi pi-fw pi-tag',
                        routerLink: [ADMIN_ROUTES.ADMIN_ATTRIBUTES]
                    },
                    {
                        label: 'admin.menu.orders', // ← Key de traducción
                        icon: 'pi pi-fw pi-shop',
                        routerLink: [ADMIN_ROUTES.ADMIN_ORDERS]
                    },
                    {
                        label: 'admin.menu.quotes', // ← Key de traducción
                        icon: 'pi pi-fw pi-credit-card',
                        routerLink: [ADMIN_ROUTES.ADMIN_QUOTES]
                    },
                    {
                        label: 'admin.menu.configuration', // ← Key de traducción
                        icon: 'pi pi-fw pi-cog',
                        routerLink: [ADMIN_ROUTES.ADMIN_CONFIG]
                    },
                    {
                        label: 'admin.menu.users', // ← Key de traducción
                        icon: 'pi pi-fw pi-users',
                        routerLink: [ADMIN_ROUTES.ADMIN_USERS]
                    },
                    ...(this.isSuperAdmin
                        ? [{
                            label: 'admin.menu.agencies', // ← Key de traducción
                            icon: 'pi pi-fw pi-building',
                            routerLink: [ADMIN_ROUTES.ADMIN_AGENCIES]
                        }]
                        : [])
                ]
            },
            {
                label: 'admin.menu.pages', // ← Key de traducción
                icon: 'pi pi-fw pi-briefcase',
                items: [{
                    label: 'admin.menu.landing', // ← Key de traducción
                    icon: 'pi pi-fw pi-globe',
                    routerLink: [PUBLIC_BASE_ROUTES.HOME]
                }]
            },
            {
                separator: true
            },
            {
                label: 'admin.menu.account', // ← Key de traducción
                items: [{
                    label: 'admin.menu.logout', // ← Key de traducción
                    icon: 'pi pi-fw pi-sign-out',
                    command: () => this.logout()
                }]
            }
        ];

        console.log('Menú construido con keys:', this.model);
    }
}
