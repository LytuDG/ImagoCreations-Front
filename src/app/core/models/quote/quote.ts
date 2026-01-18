// src/app/core/models/quote.model.ts

import { CustomerInfo } from '@/core/services/cart.service';
import { Product } from '../product/product';

// New Status Enum
export enum QuoteStatusEnum {
    DRAFT = 'draft',
    SENT = 'sent',
    CHANGES_REQUESTED = 'changes_requested',
    APPROVED = 'approved',
    CONVERTED_TO_ORDER = 'converted_to_order',
    REJECTED = 'rejected',
    TO_PAY = 'to_pay',
    PAID = 'paid'
}

export type QuoteStatus = QuoteStatusEnum | string;

export interface QuoteItem {
    productId: string;
    quantity: number;
    productAttributesIds: string[];
    price?: number;
    productName?: string;
    selectedAttributes?: any[];
}

// Interface for creating a quote (payload)
export interface Quote {
    id?: string;
    quoteNumber?: string;
    createQuotesItemsDtos: QuoteItem[];
    notes?: string;
    customerInfo?: CustomerInfo;
    companyName?: string;
    contactName?: string;
    email?: string;
    phone?: string;
    address?: string;
    personalizationFileUrl?: string;
    status?: QuoteStatus;
    totalAmount?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

// Detailed interfaces for API Response
export interface QuoteItemAttributeValue {
    id: string;
    quoteItemId: string;
    productAttributeValueId: string;
    productAttributeValue?: {
        id: string;
        attribute: {
            name: string;
        };
        attributeValue: {
            value: string;
            priceModifier: number;
        };
    };
}

export interface QuoteItemResponse {
    id: string;
    quoteId: string;
    productId: string;
    unitPrice: number;
    quantity: number;
    product: Product;
    quoteItemAttributeValue: QuoteItemAttributeValue[];
}

export interface QuoteResponse {
    id: string;
    quoteNumber?: string; // Sometimes not present in raw response, check backend
    notes: string | null;
    personalizationFileUrl: string | null;
    companyName: string;
    contactName: string;
    email: string;
    phone: string;
    address: string;
    status: QuoteStatus;
    total: number; // This corresponds to 'total' in the JSON, likely item count or distinct items
    totalAmount?: number; // Might need to calculate or check if backend sends 'totalAmount' separately
    version: number;
    agencyId: string;
    quoteItems: QuoteItemResponse[];
    publicToken: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    // Helper fields for UI that might map to above
    customerInfo?: {
        companyName: string;
        contactPerson: string;
        email: string;
        phone: string;
        address: string;
    };
}

// Update Filter Interface
export interface QuoteFilter {
    page?: number;
    limit?: number;
    search?: string;
    status?: QuoteStatus;
    customerEmail?: string;
    sort?: string[];
}
