import { ProductType } from './product';

export interface CreateProductDto {
    basePrice: number;
    description: string;
    isActive: boolean;
    name: string;
    publicId: string;
    secureUrl: string;
    type: ProductType;
}

export interface CloudinaryUploadResponse {
    asset_id: string;
    public_id: string;
    version: number;
    version_id: string;
    signature: string;
    width: number;
    height: number;
    format: string;
    resource_type: string;
    created_at: string;
    tags: string[];
    bytes: number;
    type: string;
    etag: string;
    placeholder: boolean;
    url: string;
    secure_url: string;
    asset_folder: string;
    display_name: string;
    api_key: string;
}
