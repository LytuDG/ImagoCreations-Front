import { AGENCY_ENDPOINTS } from '@/core/constants/endpoints/agency/agency';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Agency } from './models/agency';
import { ApiResponse } from '@/core/models/apiResponse';
import { FilterParams } from '@/core/models/params';

@Injectable({
  providedIn: 'root'
})
export class AgencyService {
  http = inject(HttpClient);

  getAgencies( filterParams: FilterParams = {} ): Observable<ApiResponse<Agency>>{
    return this.http.post<ApiResponse<Agency>>(`${AGENCY_ENDPOINTS}/filter`, filterParams);
  }

  createAgency(agency: Agency): Observable<ApiResponse<Agency>>{
    return this.http.post<ApiResponse<Agency>>(AGENCY_ENDPOINTS, agency);
  }

  editAgency(id: string, agency: Partial<Agency>): Observable<ApiResponse<Agency>>{
    return this.http.patch<ApiResponse<Agency>>(`${AGENCY_ENDPOINTS}/${id}`, agency);
  }
}
