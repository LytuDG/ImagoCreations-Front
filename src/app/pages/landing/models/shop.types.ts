export interface SortOption {
    label: string;
    value: string[];
}

export interface AttributeGroup {
    id: string;
    name: string;
    values: AttributeGroupValue[];
    selected: boolean;
}

export interface AttributeGroupValue {
    id: string;
    name: string;
    count: number;
    selected: boolean;
    priceModifier?: number;
}

export interface ProductAttributeGroup {
    id: string;
    name: string;
    values: ProductAttributeValueOption[];
}

export interface ProductAttributeValueOption {
    id: string;
    name: string;
    priceModifier?: number;
}

export interface ShopFilterState {
    searchTerm: string;
    priceRange: number[];
    inStockOnly: boolean;
    selectedSort: SortOption | null;
    selectedAttributeValues: Map<string, string[]>;
}
