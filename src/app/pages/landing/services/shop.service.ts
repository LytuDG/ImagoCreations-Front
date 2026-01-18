import { Injectable, inject } from '@angular/core';
import { ProductService } from '@/core/services/product.service';
import { Product } from '@/core/models/product/product';
import { AttributeGroup, ProductAttributeGroup, ShopFilterState } from '../models/shop.types';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ShopService {
    private productService = inject(ProductService);

    getProducts(params: any): Observable<{ data: Product[]; total: number }> {
        return this.productService.filterPublicProducts(params);
    }

    processAttributes(products: Product[], currentSelection: Map<string, string[]>): AttributeGroup[] {
        const attributeMap = new Map<string, Map<string, { name: string; count: number; priceModifier?: number }>>();

        products.forEach((product) => {
            const attributes = product.productsAttributesValues || [];
            attributes.forEach((attr) => {
                if (attr.attribute && attr.attributeValue) {
                    const attributeId = attr.attribute.id!;
                    const attributeName = attr.attribute.name;
                    const valueId = attr.attributeValue.id!;
                    const valueName = attr.attributeValue.value;
                    const priceModifier = attr.attributeValue.priceModifier;

                    if (!attributeMap.has(attributeId)) {
                        attributeMap.set(attributeId, new Map());
                    }

                    const valueMap = attributeMap.get(attributeId)!;
                    if (!valueMap.has(valueId)) {
                        valueMap.set(valueId, { name: valueName, count: 0, priceModifier });
                    }

                    valueMap.get(valueId)!.count++;
                }
            });
        });

        return Array.from(attributeMap.entries()).map(([id, valueMap]) => ({
            id,
            name: products.flatMap((p) => p.productsAttributesValues || []).find((attr) => attr.attribute?.id === id)?.attribute?.name || 'Unknown',
            values: Array.from(valueMap.entries()).map(([valueId, data]) => ({
                id: valueId,
                name: data.name,
                count: data.count,
                priceModifier: data.priceModifier,
                selected: currentSelection.get(id)?.includes(valueId) || false
            })),
            selected: (currentSelection.get(id) || []).length > 0
        }));
    }

    filterProducts(products: Product[], state: ShopFilterState): Product[] {
        return products.filter((product) => {
            // Price Range
            const price = product.basePrice;
            if (price < state.priceRange[0] || price > state.priceRange[1]) {
                return false;
            }

            // In Stock
            if (state.inStockOnly && !product.isActive) {
                return false;
            }

            // Attribute Filters
            if (state.selectedAttributeValues.size > 0) {
                const productAttributes = product.productsAttributesValues || [];

                // Check each selected attribute group
                for (const [attributeId, selectedValueIds] of state.selectedAttributeValues.entries()) {
                    if (selectedValueIds.length === 0) continue;

                    const hasMatchingValue = productAttributes.some((attr) => attr.attributeId === attributeId && selectedValueIds.includes(attr.attributeValueId));

                    if (!hasMatchingValue) {
                        return false;
                    }
                }
            }

            return true;
        });
    }

    prepareProductAttributeGroups(product: Product): ProductAttributeGroup[] {
        const attributes = product.productsAttributesValues || [];
        const attributeMap = new Map<string, ProductAttributeGroup>();

        attributes.forEach((attr) => {
            if (attr.attribute && attr.attributeValue) {
                const attributeId = attr.attribute.id!;
                const attributeName = attr.attribute.name;
                // Use the Link ID (ProductAttributeValue ID)
                const valueId = attr.id!;
                const valueName = attr.attributeValue.value;
                const priceModifier = attr.attributeValue.priceModifier;

                if (!attributeMap.has(attributeId)) {
                    attributeMap.set(attributeId, {
                        id: attributeId,
                        name: attributeName,
                        values: []
                    });
                }

                const group = attributeMap.get(attributeId)!;

                // Check if value already exists in group
                const existingValue = group.values.find((v) => v.id === valueId);
                if (!existingValue) {
                    group.values.push({
                        id: valueId,
                        name: valueName,
                        priceModifier: priceModifier
                    });
                }
            }
        });

        return Array.from(attributeMap.values());
    }
    calculatePrice(basePrice: number, selectedAttributes: { [key: string]: string }, groups: ProductAttributeGroup[]): number {
        let finalPrice = basePrice;
        Object.values(selectedAttributes).forEach((valueId) => {
            if (!valueId) return;
            const modifier = this.getAttributePriceModifierFromGroups(valueId, groups);
            finalPrice += modifier;
        });
        return finalPrice;
    }

    getAttributePriceModifierFromGroups(valueId: string, groups: ProductAttributeGroup[]): number {
        for (const group of groups) {
            const value = group.values.find((v) => v.id === valueId);
            if (value) {
                return value.priceModifier || 0;
            }
        }
        return 0;
    }

    getAttributePriceModifier(attributeId: string, valueId: string, groups: ProductAttributeGroup[]): number {
        if (!valueId) return 0;
        const group = groups.find((g) => g.id === attributeId);
        if (!group) return 0;
        const value = group.values.find((v) => v.id === valueId);
        return value?.priceModifier || 0;
    }

    hasAttributeModifiers(selectedAttributes: { [key: string]: string }, groups: ProductAttributeGroup[]): boolean {
        return Object.entries(selectedAttributes).some(([attributeId, valueId]) => {
            if (!valueId) return false;
            return this.getAttributePriceModifier(attributeId, valueId, groups) !== 0;
        });
    }
}
