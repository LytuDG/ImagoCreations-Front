import { Response } from '@/core/models/response';
import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from './models/user';
import { Observable } from 'rxjs';
import { FilterParams } from '@/core/models/params';
import { USER_ENDPOINT } from '@/core/constants/endpoints/user/users';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  http = inject(HttpClient);

  getUsers( filterParams: any = {} ): Observable<Response<User>>{
    return this.http.post<Response<User>>(`${USER_ENDPOINT}/filter`, filterParams);
  }
}
