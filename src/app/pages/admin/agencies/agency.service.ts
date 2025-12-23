// agency.service.ts - Actualizado
import { AGENCY_ENDPOINTS } from '@/core/constants/endpoints/agency/agency';
import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Agency } from './models/agency';
import { ApiResponse } from '@/core/models/apiResponse';

@Injectable({
  providedIn: 'root'
})
export class AgencyService {
  http = inject(HttpClient);

  getAgencies(params: any = {}): Observable<ApiResponse<Agency>> {
    // 1. Query Params: SOLO paginación
    let httpParams = new HttpParams()
      .set('page', params.page ? params.page.toString() : '1')
      .set('limit', params.pageSize ? params.pageSize.toString() : '10');

    // 2. Body: Filtros y ordenamiento
    const requestBody: any = {};

    // Ordenamiento
    if (params.sortField || params.sortDirection) {
      requestBody.sort = [];
      if (params.sortField) {
        requestBody.sort.push(params.sortField);
      }
      if (params.sortDirection) {
        requestBody.sort.push(params.sortDirection);
      }
    }

    // Filtros
    const filterKeys = ['name', 'email', 'address', 'phone'];
    filterKeys.forEach(key => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        requestBody[key] = params[key];
      }
    });

    // POST con body y query params separados
    return this.http.post<ApiResponse<Agency>>(
      `${AGENCY_ENDPOINTS}/filter`,
      requestBody,
      { params: httpParams }
    );
  }

    getAgencyById(id: string): Observable<ApiResponse<Agency>> {
        return this.http.get<ApiResponse<Agency>>(`${AGENCY_ENDPOINTS}/${id}`);
    }

  // Mantener los métodos existentes
  createAgency(agency: Agency): Observable<ApiResponse<Agency>> {
    return this.http.post<ApiResponse<Agency>>(AGENCY_ENDPOINTS, agency);
  }

  editAgency(id: string, agency: Partial<Agency>): Observable<ApiResponse<Agency>> {
    return this.http.patch<ApiResponse<Agency>>(`${AGENCY_ENDPOINTS}/${id}`, agency);
  }
}
