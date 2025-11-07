import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, Injectable, inject } from '@angular/core';

export interface AuthToken {
    accessToken: string;
}

@Injectable({
  providedIn: 'root'
})
export class JwtService {
    platformId = inject(PLATFORM_ID);

  setToken(token: AuthToken) {
    if (isPlatformBrowser(this.platformId))
    localStorage.setItem('token', token.accessToken);
  }

  removeToken() {
    if (isPlatformBrowser(this.platformId))
    localStorage.removeItem('token');
  }

  getToken() {
    const token = isPlatformBrowser(this.platformId) ? localStorage.getItem('token'): "";
    if (!token) {
      return "";
    }

    return token;
  }
}
