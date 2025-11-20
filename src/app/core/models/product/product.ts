export interface Product {
    name: string;
    created_at: Date;
    updated_at: Date;
    base_price: number;
    description: string;
    isActive: string;
    sku: string;
    type: PRODUCT_TYPE;
    agency_id: string;
    image: string;
}

export enum PRODUCT_TYPE {}
