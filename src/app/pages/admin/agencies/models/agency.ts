import { User } from "../../users/models/user";

export interface Agency {
    id?: string;
    email?: string;
    name?: string;
    address?: string;
    phone?: string;
    phoneCountryCode?: string;
    user?: User;
}
