export interface Role {
  name?: string;
//   agencyId?: string;
//   agency?: string;
  id: string;

}

export const DEFAULT_ROLE: Role = {
  name: '',
//   agencyId: '',
//   agency: '',
  id: ''
};
export const DEFAULT_ROLES_EMPTY: Role [] = []
export const DEFAULT_ROLES: Role [] = [
    {
        name: 'SUPERADMIN',
        id: '1'
    },
]
