import { BASE_ENDPOINT } from "@/core/constants/endpoints/base";

export const ATTRIBUTE_ENDPOINTS = {
  ATTRIBUTE: {
    BASE: `${BASE_ENDPOINT}/attribute`,
    BY_ID: (id: string) => `${BASE_ENDPOINT}/attribute/${id}`,
    FILTER: `${BASE_ENDPOINT}/attribute/filter`,
  },

  ATTRIBUTE_VALUE: {
    BASE: `${BASE_ENDPOINT}/attribute-value`,
    BY_ID: (id: string) => `${BASE_ENDPOINT}/attribute-value/${id}`,
    FILTER: `${BASE_ENDPOINT}/attribute-value/filter`,
  }
} as const;
