// modules/attributes/services/attribute-value.service.ts
import { inject, Injectable } from '@angular/core';
import { AttributeValue } from '../models/attributeValue';
import { ApiResponse } from '@/core/models/apiResponse';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ATTRIBUTE_ENDPOINTS } from '../constants/attribute.endpoints';

@Injectable({
  providedIn: 'root'
})
export class AttributeValueService {
  http = inject(HttpClient);

  getAttributeValues(params: any = {}): Observable<ApiResponse<AttributeValue>> {
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
      'value',
      'modifierType',
      'priceModifier',
      'isActive',
      'attributeId',
      'code',
      'search'
    ];

    filterKeys.forEach(key => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        requestBody[key] = params[key];
      }
    });


    return this.http.post<ApiResponse<AttributeValue>>(
      `${ATTRIBUTE_ENDPOINTS.ATTRIBUTE_VALUE.FILTER}`,
      requestBody,
      { params: httpParams }
    );
  }

  /**
   * Crear un nuevo valor de atributo
   */
  createAttributeValue(value: AttributeValue): Observable<ApiResponse<AttributeValue>> {
    return this.http.post<ApiResponse<AttributeValue>>(
      ATTRIBUTE_ENDPOINTS.ATTRIBUTE_VALUE.BASE,
      value
    );
  }

  /**
   * Actualizar un valor de atributo existente
   */
  updateAttributeValue(id: string, value: Partial<AttributeValue>): Observable<ApiResponse<AttributeValue>> {
    return this.http.patch<ApiResponse<AttributeValue>>(
      ATTRIBUTE_ENDPOINTS.ATTRIBUTE_VALUE.BY_ID(id),
      value
    );
  }

  /**
   * Eliminar un valor de atributo
   */
  deleteAttributeValue(id: string): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(
      ATTRIBUTE_ENDPOINTS.ATTRIBUTE_VALUE.BY_ID(id)
    );
  }

  /**
   * Método conveniente: Obtener valores por attributeId
   * (Uso común cuando estás editando un atributo y necesitas sus valores)
   */
  getValuesByAttribute(attributeId: string, params: Omit<any, 'attributeId'> = {}): Observable<ApiResponse<AttributeValue>> {
    const filterParams: any = {
      ...params,
      attributeId: attributeId
    };
    return this.getAttributeValues(filterParams);
  }

    toggleAttributeValueStatus(id: string, isActive: boolean): Observable<ApiResponse<AttributeValue>> {
        return this.http.patch<ApiResponse<AttributeValue>>(
            `${ATTRIBUTE_ENDPOINTS.ATTRIBUTE_VALUE.BY_ID(id)}/status`,
            { isActive }
        );
    }
}
