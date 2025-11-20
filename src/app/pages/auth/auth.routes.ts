import { Routes } from '@angular/router';
import { Access } from './access';
import { Login } from './login';
import { Error } from './error';
import { AUTH_ROUTES } from '@/core/constants/routes/routes';

export default [
    { path: 'access', component: Access },
    { path: AUTH_ROUTES.ERROR, component: Error },
    { path: AUTH_ROUTES.LOGIN, component: Login }
] as Routes;
