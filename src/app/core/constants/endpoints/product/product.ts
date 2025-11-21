import { BASE_ENDPOINT } from '../base';

export const PRODUCT_ENDPOINT = `${BASE_ENDPOINT}/product`;
export const CREATE_PRODUCT_ENDPOINT = PRODUCT_ENDPOINT;
export const UPDATE_PRODUCT_ENDPOINT = (id: string) => `${PRODUCT_ENDPOINT}/${id}`;
export const FILTER_PRODUCTS_ENDPOINT = `${PRODUCT_ENDPOINT}/filter`;
export const PUBLIC_FILTER_PRODUCTS_ENDPOINT = `${PRODUCT_ENDPOINT}/public/filter`;
