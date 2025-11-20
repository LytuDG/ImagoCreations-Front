import { HttpErrorResponse, HttpInterceptorFn, HttpStatusCode } from '@angular/common/http';
import { inject } from '@angular/core';
import { JwtService } from '../services/jwt.service';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '@/core/services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const jwtService = inject(JwtService);
  const token = jwtService.getToken();
  const auth = inject(AuthService)

  // Clona la solicitud y agrega el token al encabezado de autorización si existe
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  return next(req).pipe(
    catchError((response:HttpErrorResponse) => {
      if(response.status === HttpStatusCode.Unauthorized){
        auth.logout();
      }
      return throwError(() => response?.error);
    })
  )
};
