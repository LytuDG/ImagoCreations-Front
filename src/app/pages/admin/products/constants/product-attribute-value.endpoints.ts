import { BASE_ENDPOINT } from "@/core/constants/endpoints/base";

export const PRODUCT_ATTRIBUTE_VALUE= {
    BASE: `${BASE_ENDPOINT}/product-attribute-value`,
    BY_ID: (id: string) => `${BASE_ENDPOINT}/product-attribute-value/${id}`,
    FILTER: `${BASE_ENDPOINT}/product-attribute-value/filter`,
} as const;
