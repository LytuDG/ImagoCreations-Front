import { Routes } from "@angular/router";
import { Users } from "./users/users";
import { ADMIN_ROUTES } from "@/core/constants/routes/routes";
import { Agencies } from "./agencies/agencies";
import { superAdminGuard } from "@/core/guards/super-admin.guard";

export const routes: Routes = [
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
        path: '**',
        redirectTo: '/notfound'
    }
]
