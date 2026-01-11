import { Route, Routes } from '@angular/router';
import { Users } from './users/users';
import { ADMIN_ROUTES } from '@/core/constants/routes/routes';
import { Agencies } from './agencies/agencies';
import { superAdminGuard } from '@/core/guards/super-admin.guard';
import { Crud } from '../crud/crud';
import { Dashboard } from '../dashboard/dashboard';
import { Empty } from '../empty/empty';
import { Products } from './products/products';
import { Attributes } from './attributes/attribute.component';
import { Quotes } from './quotes/quotes';

export default [
    {
        path: '',
        redirectTo: ADMIN_ROUTES.ADMIN_DASHBOARD,
        pathMatch: 'full'
    },
    {
        path: ADMIN_ROUTES.ADMIN_DASHBOARD,
        component: Dashboard
    },
    {
        path: ADMIN_ROUTES.ADMIN_USERS,
        component: Users
    },
    {
        path: ADMIN_ROUTES.ADMIN_AGENCIES,
        component: Agencies,
        canActivate: [superAdminGuard]
    },
    {
        path: ADMIN_ROUTES.ADMIN_ORDERS,
        component: Empty
    },
    {
        path: ADMIN_ROUTES.ADMIN_PRODUCTS,
        component: Products
    },
    {
        path: ADMIN_ROUTES.ADMIN_ATTRIBUTES,
        component: Attributes
    },
    {
        path: ADMIN_ROUTES.ADMIN_QUOTES,
        component: Quotes
    }
] as Routes;
