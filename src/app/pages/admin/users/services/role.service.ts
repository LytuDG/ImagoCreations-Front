import { ROLE_ENDPOINT } from '@/core/constants/endpoints/roles/roles';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Role } from '../models/role';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
   http = inject(HttpClient);

  getRoles(): Observable<Role[]>{
    return this.http.get<Role[]>(`${ROLE_ENDPOINT}`);
  }
}
