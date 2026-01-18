import { BASE_ENDPOINT } from '../base';

export const QUOTE_ENDPOINT = `${BASE_ENDPOINT}/quote`;
export const CREATE_QUOTE_ENDPOINT = QUOTE_ENDPOINT;
export const QUOTE_BY_ID_ENDPOINT = (id: string) => `${QUOTE_ENDPOINT}/${id}`;
export const UPLOAD_FILE_ENDPOINT = `${BASE_ENDPOINT}/utils/save-img`;
export const FILTER_QUOTE_ENDPOINT = `${QUOTE_ENDPOINT}/filter`;
