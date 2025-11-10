import { AuthService } from '@/pages/service/auth.service';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const superAdminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isSuperAdmin()) {
    return true;
  } else {
    router.navigate(['/auth/access']);
    return false;
  }
};
