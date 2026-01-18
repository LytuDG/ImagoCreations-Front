import { Role } from './role';

export interface User {
    id?: string;
    email?: string;
    password?: string;
    passwordConfirm?: string;
    lastName?: string;
    name?: string;
    role?: Role;
    roleName?: string;
    phone?: string;
    phoneCountryCode?: string;
    agencyId?: string;
}

export interface CreateUserDTO {
    email?: string;
    lastName?: string;
    name?: string;
    roleName?: string;
    phone?: string;
    phoneCountryCode?: string;
    password: string;
    passwordConfirm?: string;
}

export const DEFAULT_CREATE_USER: CreateUserDTO = {
    password: '',
    passwordConfirm: '',
    email: '',
    lastName: '',
    name: '',
    phone: '',
    phoneCountryCode: '',
    roleName: ''
};

export const DEFAULT_USER: User = {
    id: '',
    email: '',
    lastName: '',
    name: '',
    role: {
        name: '',
        id: ''
    },
    phone: '',
    phoneCountryCode: '',
    agencyId: ''
};
