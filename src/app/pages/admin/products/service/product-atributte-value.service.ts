import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '@/core/models/apiResponse';
import { FilterParams } from '@/core/models/params';
import { PRODUCT_ATTRIBUTE_VALUE } from '../constants/product-attribute-value.endpoints';
import { ProductAttributeValue, CreateProductAttributeValueDto } from '../models/product-atribute-value';


@Injectable({
  providedIn: 'root'
})
export class ProductAttributeValueService {
  http = inject(HttpClient);

    getProductAttributes(params: FilterParams = {}): Observable<ApiResponse<ProductAttributeValue>> {
        let httpParams = new HttpParams()
        .set('page', params.page ? params.page.toString() : '1')
        .set('limit', params.limit ? params.limit.toString() : '10');

        // Enviar directamente los filters como requestBody
        const requestBody: any = params.filters || {};
        requestBody.relations = ["pav","product", "attribute", "attributeValue"];

        return this.http.post<ApiResponse<ProductAttributeValue>>(
        PRODUCT_ATTRIBUTE_VALUE.FILTER,
        requestBody,
        { params: httpParams }
        );
    }

    getProductAttributeById(id: string): Observable<ProductAttributeValue> {
        return this.http.get<ProductAttributeValue>(PRODUCT_ATTRIBUTE_VALUE.BY_ID(id));
    }

    createProductAttributeValue(pavs: CreateProductAttributeValueDto[]): Observable<ProductAttributeValue[]> {
        return this.http.post<ProductAttributeValue[]>(PRODUCT_ATTRIBUTE_VALUE.BASE, {pavs});
    }

    updateProductAttributeValue(id: string, dto: Partial<CreateProductAttributeValueDto>): Observable<ProductAttributeValue> {
        return this.http.patch<ProductAttributeValue>(PRODUCT_ATTRIBUTE_VALUE.BY_ID(id), dto);
    }

    deleteProductAttribute(id: string): Observable<void> {
        return this.http.delete<void>(PRODUCT_ATTRIBUTE_VALUE.BY_ID(id));
    }
}
