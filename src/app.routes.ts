import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { Documentation } from './app/pages/documentation/documentation';
import { Landing } from './app/pages/landing/landing';
import { Notfound } from './app/pages/notfound/notfound';
import { PRIVATE_ROUTES, PUBLIC_ROUTES } from '@/core/constants/routes/routes';
import { authGuard } from '@/core/guards/auth-guard';

export const appRoutes: Routes = [
    {
        path: PUBLIC_ROUTES.BASE,
        component: Landing
    },
    { path: PUBLIC_ROUTES.HOME, component: Landing },
    {
        path: PRIVATE_ROUTES.ADMIN,
        component: AppLayout,
        loadChildren: () => import('./app/pages/admin/admin.routes')
        // canActivate: [authGuard]
    },
    // { path: 'documentation', component: Documentation },
    { path: PUBLIC_ROUTES.EXAMPLES, loadChildren: () => import('./app/pages/uikit/uikit.routes') },
    { path: PUBLIC_ROUTES.AUTH, loadChildren: () => import('./app/pages/auth/auth.routes') },
    {
        path: PUBLIC_ROUTES.CART,
        loadComponent: () => import('./app/pages/cart/cart').then((m) => m.Cart)
    },
    {
        path: PUBLIC_ROUTES.QUOTE_INFO,
        loadComponent: () => import('./app/pages/quote-customer-info/quote-customer-info').then((m) => m.QuoteCustomerInfo)
    },
    {
        path: PUBLIC_ROUTES.SERVICES,
        loadComponent: () => import('./app/pages/services/services').then((m) => m.ServicesComponent)
    },
    {
        path: PUBLIC_ROUTES.TRACKING,
        loadComponent: () => import('./app/pages/tracking/tracking').then((m) => m.Tracking)
    },
    {
        path: PUBLIC_ROUTES.TRACKING_SEARCH,
        loadComponent: () => import('./app/pages/tracking/tracker-search').then((m) => m.TrackerSearch)
    },
    { path: PUBLIC_ROUTES.NOTFOUND, component: Notfound },
    { path: '**', redirectTo: PUBLIC_ROUTES.NOTFOUND }
];
