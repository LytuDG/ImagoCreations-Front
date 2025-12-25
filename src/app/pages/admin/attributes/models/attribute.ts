import { AttributeInputType } from "../constants/attribute-types";
export interface Attribute {
    id?: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
    inputType: AttributeInputType;
    name: string;
    agencyId: string;
    required: boolean;
    reusable: boolean;
    visibleB2B: boolean;
    visibleB2C: boolean;
}
