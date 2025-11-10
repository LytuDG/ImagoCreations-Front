import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthToken, JwtService } from '@/core/services/jwt.service';
import { Router } from '@angular/router';
import { CURRENT_USER_ENDPOINT, LOGIN_ENDPOINT } from '@/core/constants/endpoints/auth/auth';
import { User } from '../admin/users/models/user';
import { map, Observable } from 'rxjs';
import { RolesEnum } from '@/core/constants/general/roles';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  http = inject(HttpClient);
  jwt = inject(JwtService);
  router = inject(Router);

  isSuperAdmin(): Observable<boolean> {
    return this.getCurrentUser().pipe(
      map(user => user.roleName === RolesEnum.SUPERADMIN)
    )
  }

  getCurrentUser(): Observable<User>{
    return this.http.get<User>(CURRENT_USER_ENDPOINT);
  }

  isLogin(){
    return this.jwt.getToken() ? true : false;
  }

  login(email: string, password: string) {
    return this.http
    .post<AuthToken>(LOGIN_ENDPOINT, { email, password });
  }

  logout() {
    this.jwt.removeToken();
    this.router.navigate(['/login']);
  }
}
