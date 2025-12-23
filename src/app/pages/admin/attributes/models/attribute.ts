export interface Attribute {
    id?: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
    inputType: string;
    name: string;
    agencyId: string;
    required: boolean;
    reusable: boolean;
    visibleB2B: boolean;
    visibleB2C: boolean;
}
