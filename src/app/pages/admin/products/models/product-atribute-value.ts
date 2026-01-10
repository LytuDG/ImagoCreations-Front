import { Product } from "@/core/models/product/product";
import { Attribute } from "../../attributes/models/attribute";
import { AttributeValue } from "../../attributes/models/attributeValue";

export interface ProductAttributeValue {
    id?: string;
    productId: string;
    attributeId: string;
    attributeValueId: string;
    required: boolean;
    sortOrder: number;
    product: Product;
    attribute: Attribute;
    attributeValue?: AttributeValue;
}

export interface CreateProductAttributeValueDto {
    productId: string;
    attributeId: string;
    attributeValueId: string;
    required: boolean;
    order: number;
}
