// src/app/core/models/quote.model.ts

import { CustomerInfo } from "@/core/services/cart.service";

export interface QuoteItem {
    productId: string;
    quantity: number;
    productAttributesIds: string[];
    price?: number; // Precio unitario del producto con atributos
    productName?: string; // Para mostrar en la UI
    selectedAttributes?: any[]; // Para mantener los detalles de los atributos
}

export interface Quote {
    id?: string;
    quoteNumber?: string;
    createQuotesItemsDtos: QuoteItem[];
    notes?: string;
    customerInfo?: CustomerInfo; // Usar el CustomerInfo del cart.service
    status?: QuoteStatus;
    totalAmount?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export type QuoteStatus = 'PENDING' | 'PROCESSING' | 'APPROVED' | 'REJECTED' | 'EXPIRED';

// Para la respuesta de la API
export interface QuoteResponse {
    id: string;
    quoteNumber: string;
    totalAmount: number;
    status: QuoteStatus;
    createdAt: string;
    customerEmail: string;
    customerCompany: string;
}

// Para filtrar cotizaciones
export interface QuoteFilter {
    page?: number;
    limit?: number;
    search?: string;
    status?: QuoteStatus;
    customerEmail?: string;
    sort?: string[];
}
