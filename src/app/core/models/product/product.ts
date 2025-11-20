export interface Product {
    id?: string;
    name: string;
    created_at?: Date;
    updated_at?: Date;
    basePrice: number;
    description: string;
    isActive: boolean;
    sku?: string;
    type: ProductType;
    agency_id?: string;
    publicId: string;
    secureUrl: string;
}

export type ProductType = 'simple' | 'variant';

export enum PRODUCT_TYPE {
    SIMPLE = 'simple',
    VARIANT = 'variant'
}
