import { inject, Injectable } from '@angular/core';
import { Attribute } from '../models/attribute';
import { ApiResponse } from '@/core/models/apiResponse';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ATTRIBUTE_ENDPOINTS } from '../constants/attribute.endpoints';

@Injectable({
  providedIn: 'root'
})
export class AttributeService {
    http = inject(HttpClient)

  getAttribute(params: any = {}): Observable<ApiResponse<Attribute>> {
    let httpParams = new HttpParams()
      .set('page', params.page ? params.page.toString() : '1')
      .set('limit', params.pageSize ? params.pageSize.toString() : '10');

    const requestBody: any = {};

    if (params.sortField || params.sortDirection) {
      requestBody.sort = [];
      if (params.sortField) {
        requestBody.sort.push(params.sortField);
      }
      if (params.sortDirection) {
        requestBody.sort.push(params.sortDirection);
      }
    }

    const filterKeys = [
      'name',
      'inputType',
      'required',
      'reusable',
      'visibleB2B',
      'visibleB2C',
      'agencyId',
      'createdAt',
    ];

    filterKeys.forEach(key => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        requestBody[key] = params[key];
      }
    });

    return this.http.post<ApiResponse<Attribute>>(
      `${ATTRIBUTE_ENDPOINTS.ATTRIBUTE.FILTER}`,
      requestBody,
      { params: httpParams }
    );
  }

  getAttributeById(id: string): Observable<Attribute> {
    return this.http.get<Attribute>(ATTRIBUTE_ENDPOINTS.ATTRIBUTE.BY_ID(id));
  }

  createAttribute(attribute: Attribute): Observable<ApiResponse<Attribute>>{
    return this.http.post<ApiResponse<Attribute>>(ATTRIBUTE_ENDPOINTS.ATTRIBUTE.BASE, attribute);
  }

  editAttribute(id: string, attribute: Partial<Attribute>): Observable<ApiResponse<Attribute>>{
    return this.http.patch<ApiResponse<Attribute>>(ATTRIBUTE_ENDPOINTS.ATTRIBUTE.BY_ID(id), attribute);
  }

  deleteAttribute(id: string): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(
      ATTRIBUTE_ENDPOINTS.ATTRIBUTE.BY_ID(id)
    );
  }

}
