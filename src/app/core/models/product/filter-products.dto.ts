import { ProductType } from './product';

export interface FilterProductsDto {
    // Pagination
    page?: number;
    limit?: number;

    // Filters
    deleted?: boolean;
    onlyDeleted?: boolean;
    id?: string;
    agencyId?: string;
    isActive?: boolean;
    name?: string;
    nameLike?: string;
    type?: ProductType;
    sku?: string;

    // Sorting
    sort?: string[];
}

export interface PaginationMeta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface FilterProductsResponse {
    data: any[]; // Will be Product[] but using any for flexibility
    meta: PaginationMeta;
}
