import { BASE_ENDPOINT } from '../base';

export const QUOTE_ENDPOINT = `${BASE_ENDPOINT}/quote`;
export const CREATE_QUOTE_ENDPOINT = `${QUOTE_ENDPOINT}/public`;
export const QUOTE_BY_ID_ENDPOINT = (id: string) => `${QUOTE_ENDPOINT}/${id}`;
export const UPLOAD_FILE_ENDPOINT = `${BASE_ENDPOINT}/utils/save-img`;
export const FILTER_QUOTE_ENDPOINT = `${QUOTE_ENDPOINT}/filter`;
export const QUOTE_BY_TOKEN_ENDPOINT = (token: string) => `${QUOTE_ENDPOINT}/public/${token}`;
export const QUOTE_PUBLIC_STATUS_ENDPOINT = (token: string) => `${QUOTE_ENDPOINT}/public/${token}/status`;
