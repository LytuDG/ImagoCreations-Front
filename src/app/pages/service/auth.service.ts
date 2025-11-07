import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthToken, JwtService } from '@/core/services/jwt.service';
import { Router } from '@angular/router';
import { LOGIN_ENDPOINT } from '@/core/constants/endpoints/auth/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  http = inject(HttpClient);
  jwt = inject(JwtService);
  router = inject(Router);

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
