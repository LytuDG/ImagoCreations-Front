import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { SkeletonModule } from 'primeng/skeleton';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { AppMenuitem } from './app.menuitem';
import { ADMIN_ROUTES, PRIVATE_ROUTES, PUBLIC_BASE_ROUTES } from '@/core/constants/routes/routes';
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
export class AppMenu implements OnInit {
    authService = inject(AuthService);
    translocoService = inject(TranslocoService);

    isSuperAdmin = false;
    isLoading = true;

    model: MenuItem[] = [];

    ngOnInit() {
        this.authService.isSuperAdmin().subscribe({
            next: (response) => {
                this.isSuperAdmin = response;
                this.buildMenu();
                this.isLoading = false;
            },
            error: (error) => {
                console.error('Error verificando SUPERADMIN:', error);
                this.isSuperAdmin = false;
                this.buildMenu();
                this.isLoading = false;
            }
        });
    }

    logout() {
        this.authService.logout();
    }

    private buildMenu() {
        this.model = [
            {
                label: this.translocoService.translate('admin.menu.home'),
                items: [{
                    label: this.translocoService.translate('admin.menu.dashboard'),
                    icon: 'pi pi-fw pi-home',
                    routerLink: [ADMIN_ROUTES.ADMIN_DASHBOARD]
                }]
            },
            {
                label: this.translocoService.translate('admin.menu.admin'),
                icon: 'pi pi-fw pi-briefcase',
                routerLink: ['/pages'],
                items: [
                    {
                        label: this.translocoService.translate('admin.menu.products'),
                        icon: 'pi pi-fw pi-shopping-cart',
                        routerLink: [ADMIN_ROUTES.ADMIN_PRODUCTS]
                    },
                    {
                        label: this.translocoService.translate('admin.menu.attributes'),
                        icon: 'pi pi-fw pi-tag',
                        routerLink: [ADMIN_ROUTES.ADMIN_ATTRIBUTES]
                    },
                    {
                        label: this.translocoService.translate('admin.menu.orders'),
                        icon: 'pi pi-fw pi-shop',
                        routerLink: [ADMIN_ROUTES.ADMIN_ORDERS]
                    },
                    {
                        label: this.translocoService.translate('admin.menu.quotes'),
                        icon: 'pi pi-fw pi-credit-card',
                        routerLink: [ADMIN_ROUTES.ADMIN_QUOTES]
                    },
                    // {
                    //     label: this.translocoService.translate('admin.menu.payments'),
                    //     icon: 'pi pi-fw pi-dollar',
                    //     routerLink: ['/pages/pay']
                    // },
                    // {
                    //     label: this.translocoService.translate('admin.menu.clients'),
                    //     icon: 'pi pi-fw pi-building',
                    //     routerLink: ['/pages/pay']
                    // },
                    // {
                    //     label: this.translocoService.translate('admin.menu.statistics'),
                    //     icon: 'pi pi-fw pi-chart-bar',
                    //     routerLink: ['/pages/statistics']
                    // },
                    {
                        label: this.translocoService.translate('admin.menu.configuration'),
                        icon: 'pi pi-fw pi-cog',
                        routerLink: [ADMIN_ROUTES.ADMIN_CONFIG]
                    },
                    {
                        label: this.translocoService.translate('admin.menu.users'),
                        icon: 'pi pi-fw pi-users',
                        routerLink: [ADMIN_ROUTES.ADMIN_USERS]
                    },
                    ...(this.isSuperAdmin
                        ? [{
                            label: this.translocoService.translate('admin.menu.agencies'),
                            icon: 'pi pi-fw pi-building',
                            routerLink: [ADMIN_ROUTES.ADMIN_AGENCIES]
                        }]
                        : [])
                ]
            },
            {
                label: this.translocoService.translate('admin.menu.pages'),
                icon: 'pi pi-fw pi-briefcase',
                items: [{
                    label: this.translocoService.translate('admin.menu.landing'),
                    icon: 'pi pi-fw pi-globe',
                    routerLink: [PUBLIC_BASE_ROUTES.HOME]
                }]
            },
            {
                separator: true
            },
            {
                label: this.translocoService.translate('admin.menu.account'),
                items: [{
                    label: this.translocoService.translate('admin.menu.logout'),
                    icon: 'pi pi-fw pi-sign-out',
                    command: () => this.logout()
                }]
            }
        ];
    }
}
