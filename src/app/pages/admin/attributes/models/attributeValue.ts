import { Attribute } from "./attribute";

export interface AttributeValue{
    id?: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
    isActive: boolean;
    modifierType: string;
    order: number;
    priceModifier: number;
    value: string;
    attributeId: string
    code?: string;
    attribute?: Attribute
}
