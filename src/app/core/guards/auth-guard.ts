import { AuthService } from '@/core/services/auth.service';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { PUBLIC_ROUTES } from '../constants/routes/routes';

export const authGuard: CanActivateFn = (route, state) => {

 const authService = inject(AuthService)
 const router = inject(Router)

    if(!authService.isLogin()){
        router.navigate([PUBLIC_ROUTES.LOGIN])
        return false;
    }

  return true;
};
