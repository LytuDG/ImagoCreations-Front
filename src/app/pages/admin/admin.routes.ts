import { Routes } from "@angular/router";
import { Users } from "./users/users";
import { ADMIN_ROUTES } from "@/core/constants/routes/routes";

export const routes: Routes = [
    {
        path: ADMIN_ROUTES.ADMIN_USERS,
        component: Users
    },
    {
        path: '**',
        redirectTo: '/notfound'
    }
]
