export interface FilterParams {
    page?: number;
    limit?: number;
    sort?: Record<string, any>[];
    filters?: Record<string, any>;
}
