import { Routes } from '@angular/router';
import { Documentation } from './documentation/documentation';
import { Crud } from './crud/crud';
import { Empty } from './empty/empty';
import { PRIVATE_ROUTES } from '@/core/constants/routes/routes';

export default [
    {
        path: PRIVATE_ROUTES.ADMIN,
        loadChildren: () => import('@/pages/admin/admin.routes').then(m => m.routes),
    },
    { path: 'documentation', component: Documentation },
    { path: 'crud', component: Crud },
    { path: 'empty', component: Empty },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
