// src/app/core/services/quote.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { CREATE_QUOTE_ENDPOINT, QUOTE_BY_ID_ENDPOINT, FILTER_QUOTE_ENDPOINT, QUOTE_ENDPOINT, UPLOAD_FILE_ENDPOINT, QUOTE_BY_TOKEN_ENDPOINT, QUOTE_PUBLIC_STATUS_ENDPOINT } from '../constants/endpoints/quote/quote';
import { Quote, QuoteResponse, QuoteFilter, QuoteItem } from '../models/quote/quote';
import { CartItem, CustomerInfo } from './cart.service';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class QuoteService {
    constructor(private http: HttpClient) {}

    /**
     * Crear una nueva cotización
     */
    createQuote(quoteData: Quote): Observable<QuoteResponse> {
        // Transformar los datos del carrito al formato requerido por la API
        const formattedQuote = this.formatQuoteForApi(quoteData);

        return this.http.post<QuoteResponse>(CREATE_QUOTE_ENDPOINT, formattedQuote);
    }

    /**
     * Subir archivo de personalización
     */
    uploadFile(file: File): Observable<{ secure_url: string }> {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('subfolder', 'quotes/personalization');
        formData.append('agencyId', environment.AGENCY_ID);
        return this.http.post<{ secure_url: string }>(UPLOAD_FILE_ENDPOINT, formData);
    }

    /**
     * Obtener una cotización por ID
     */
    getQuoteById(id: string): Observable<Quote> {
        return this.http.get<Quote>(QUOTE_BY_ID_ENDPOINT(id));
    }

    /**
     * Obtener una cotización por Token Público
     */
    getQuoteByToken(token: string): Observable<QuoteResponse> {
        return this.http.get<QuoteResponse>(QUOTE_BY_TOKEN_ENDPOINT(token));
    }

    /**
     * Actualizar estado de cotización pública
     */
    updatePublicQuoteStatus(token: string, status: string): Observable<any> {
        return this.http.patch(QUOTE_PUBLIC_STATUS_ENDPOINT(token), { status });
    }

    /**
     * Obtener todas las cotizaciones (con filtros)
     */
    getQuotes(filter?: QuoteFilter): Observable<{ data: QuoteResponse[]; total: number }> {
        return this.http.post<{ data: QuoteResponse[]; total: number }>(FILTER_QUOTE_ENDPOINT, filter || {});
    }

    /**
     * Actualizar el estado de una cotización
     */
    updateQuoteStatus(id: string, status: string, notes?: string): Observable<Quote> {
        return this.http.patch<Quote>(QUOTE_BY_ID_ENDPOINT(id), {
            status,
            adminNotes: notes
        });
    }

    /**
     * Eliminar una cotización
     */
    deleteQuote(id: string): Observable<void> {
        return this.http.delete<void>(QUOTE_BY_ID_ENDPOINT(id));
    }

    /**
     * Enviar cotización por email al cliente
     */
    sendQuoteEmail(quoteId: string, email: string): Observable<any> {
        return this.http.post(`${QUOTE_ENDPOINT}/${quoteId}/send`, { email });
    }

    /**
     * Convertir items del carrito al formato de la API
     */
    private formatQuoteForApi(quote: Quote): any {
        return {
            createQuotesItemsDtos: quote.createQuotesItemsDtos.map((item) => ({
                quantity: item.quantity,
                productId: item.productId,
                productAttributesValuesIds: item.productAttributesIds
            })),
            notes: quote.notes || quote.customerInfo?.notes || '',
            personalizationFileUrl: quote.personalizationFileUrl,
            companyName: quote.companyName || quote.customerInfo?.companyName,
            contactName: quote.contactName || quote.customerInfo?.contactPerson,
            email: quote.email || quote.customerInfo?.email,
            phone: quote.phone || quote.customerInfo?.phone,
            address: quote.address || quote.customerInfo?.address
        };
    }

    /**
     * Convertir items del carrito a items de cotización
     * Usando los tipos que ya existen en CartService
     */
    convertCartItemsToQuoteItems(cartItems: CartItem[]): QuoteItem[] {
        return cartItems.map((item) => ({
            productId: item.product.id!,
            quantity: item.quantity,
            productAttributesIds: item.selectedAttributes?.map((attr) => attr.valueId) || [],
            price: this.calculateItemPrice(item),
            productName: item.product.name,
            selectedAttributes: item.selectedAttributes || []
        }));
    }

    /**
     * Calcular el precio total de un item del carrito
     * Usando la misma lógica que CartService
     */
    private calculateItemPrice(item: CartItem): number {
        let price = item.product.basePrice;

        if (item.selectedAttributes?.length) {
            item.selectedAttributes.forEach((attr) => {
                if (attr.priceModifier) {
                    price += attr.priceModifier;
                }
            });
        }

        return price;
    }

    /**
     * Calcular el total de una cotización
     */
    calculateQuoteTotal(quoteItems: QuoteItem[]): number {
        return quoteItems.reduce((total, item) => {
            const itemPrice = item.price || 0;
            return total + itemPrice * item.quantity;
        }, 0);
    }

    /**
     * Crear objeto de cotización a partir del carrito e información del cliente
     */
    createQuoteFromCart(cartItems: CartItem[], customerInfo: CustomerInfo, notes?: string, personalizationFileUrl?: string): Quote {
        const quoteItems = this.convertCartItemsToQuoteItems(cartItems);
        const totalAmount = this.calculateQuoteTotal(quoteItems);

        return {
            createQuotesItemsDtos: quoteItems,
            customerInfo,
            notes: notes || '',
            personalizationFileUrl,
            totalAmount,
            status: 'PENDING'
        };
    }
}
