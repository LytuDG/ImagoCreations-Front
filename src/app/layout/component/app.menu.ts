import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { ADMIN_ROUTES, PRIVATE_ROUTES, PUBLIC_BASE_ROUTES } from '@/core/constants/routes/routes';
import { AuthService } from '@/core/services/auth.service';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
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
    </ul> `
})
export class AppMenu {
    authService = inject(AuthService);

    isSuperAdmin = false;

    model: MenuItem[] = [];

    ngOnInit() {
        // this.authService.isSuperAdmin().subscribe({
        //     next: (response) => {
        //         this.isSuperAdmin = response;
        //         this.buildMenu();
        //     },
        //     error: (error) => {
        //         console.error('Error verificando SUPERADMIN:', error);
        //         this.isSuperAdmin = false;
        //         this.buildMenu();
        //     }
        // });
        this.buildMenu();
    }

    private buildMenu() {
        this.model = [
            {
                label: 'Home',
                items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: [ADMIN_ROUTES.ADMIN_DASHBOARD] }]
            },
            {
                label: 'Admin',
                icon: 'pi pi-fw pi-briefcase',
                routerLink: ['/pages'],
                items: [
                    {
                        label: 'Products',
                        icon: 'pi pi-fw pi-shopping-cart',
                        routerLink: [ADMIN_ROUTES.ADMIN_PRODUCTS]
                    },
                    {
                        label: 'Orders',
                        icon: 'pi pi-fw pi-shop',
                        routerLink: [ADMIN_ROUTES.ADMIN_ORDERS]
                    },
                    // {
                    //     label: 'Quotes',
                    //     icon: 'pi pi-fw pi-credit-card',
                    //     routerLink: ['/pages/quotes']
                    // },
                    // {
                    //     label: 'Payments',
                    //     icon: 'pi pi-fw pi-dollar',
                    //     routerLink: ['/pages/pay']
                    // },
                    // {
                    //     label: 'Clients',
                    //     icon: 'pi pi-fw pi-building',
                    //     routerLink: ['/pages/pay']
                    // },
                    // {
                    //     label: 'Statistic',
                    //     icon: 'pi pi-fw pi-chart-bar',
                    //     routerLink: ['/pages/statistics']
                    // },
                    {
                        label: 'Configuration',
                        icon: 'pi pi-fw pi-cog',
                        routerLink: [ADMIN_ROUTES.ADMIN_CONFIG]
                    },
                    {
                        label: 'Users',
                        icon: 'pi pi-fw pi-users',
                        routerLink: [ADMIN_ROUTES.ADMIN_USERS]
                    },
                    ...(this.isSuperAdmin
                        ? [
                              {
                                  label: 'Agencies',
                                  icon: 'pi pi-fw pi-building',
                                  routerLink: [ADMIN_ROUTES.ADMIN_AGENCIES]
                              }
                          ]
                        : [])
                ]
            },
            {
                label: 'Pages',
                icon: 'pi pi-fw pi-briefcase',
                items: [
                    {
                        label: 'Landing',
                        icon: 'pi pi-fw pi-globe',
                        routerLink: [PUBLIC_BASE_ROUTES.HOME]
                    }
                ]
            }
        ];
    }
}
