export enum PRIVATE_ROUTES {
    ADMIN = 'admin'
}

export enum ADMIN_ROUTES {
    ADMIN_USERS = 'user',
    ADMIN_AGENCIES = 'agency',
    ADMIN_PRODUCTS = 'product',
    ADMIN_ATTRIBUTES = 'attribute',
    ADMIN_DASHBOARD = 'dashboard',
    ADMIN_ORDERS = 'orders',
    ADMIN_QUOTES = 'quotes',
    ADMIN_CONFIG = 'config'
}

export enum PUBLIC_ROUTES {
    BASE = '',
    HOME = 'home',
    NOTFOUND = 'notfound',
    LOGIN = 'auth/login',
    EXAMPLES = 'examples',
    AUTH = 'auth',
    CART = 'cart',
    QUOTE_INFO = 'quote-info',
    SERVICES = 'services',
    TRACKING = 'track/:token',
    TRACKING_SEARCH = 'track',
    TSHIRT_EDITOR = 'tshirt-editor'
}

export enum PUBLIC_BASE_ROUTES {
    BASE = '/',
    HOME = '/home',
    NOTFOUND = '/notfound',
    LOGIN = '/auth/login',
    EXAMPLES = '/examples',
    AUTH = '/auth'
}

export enum AUTH_ROUTES {
    LOGIN = 'login',
    ERROR = 'error'
}
