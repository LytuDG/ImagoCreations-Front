export enum RolesEnum {
    SUPERADMIN = 'SUPERADMIN',
    AdminModerator = 'AdminModerator',
    AgencyAdmin = 'AgencyAdmin',
    AgencyWorker = 'AgencyWorker',
    USER = 'USER',
}

export const AllRolesArray = [
    RolesEnum.SUPERADMIN,
    RolesEnum.AdminModerator,
    RolesEnum.AgencyAdmin,
    RolesEnum.AgencyWorker,
    RolesEnum.USER,
];

export const RolesAdminArray = [
    RolesEnum.SUPERADMIN,
    RolesEnum.AdminModerator,
];

export const RolesAgencyArray = [
    RolesEnum.AgencyAdmin,
    RolesEnum.AgencyWorker,
];
