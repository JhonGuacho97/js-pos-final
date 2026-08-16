/**
 * Agrupación puramente visual de los permisos (planos, uno por módulo,
 * todo-o-nada -- no hay granularidad view/create/update/delete real en
 * el backend) para RoleForm.js. Reutiliza las mismas 7 secciones del
 * sidebar (ver asideConfig.js) más "Reportes" y "Configuración", que en
 * el sidebar quedaron como accordions propios sin un groupHeader.
 * Cualquier permiso que no matchee ningún slug de abajo cae en "general"
 * como red de seguridad -- así un permiso nuevo que se nos olvide mapear
 * sigue siendo visible (no desaparece), solo queda mal agrupado.
 */
export const PERMISSION_GROUP_ORDER = [
    'general',
    'sales',
    'purchases',
    'catalog',
    'inventory',
    'expenses',
    'people',
    'reports',
    'settings',
];

export const PERMISSION_GROUP_LABEL_KEYS = {
    general: 'sidebar.group.general',
    sales: 'sidebar.group.sales',
    purchases: 'sidebar.group.purchases',
    catalog: 'sidebar.group.catalog',
    inventory: 'sidebar.group.inventory',
    expenses: 'sidebar.group.expenses',
    people: 'sidebar.group.people',
    reports: 'role.permission-group.reports',
    settings: 'role.permission-group.settings',
};

const SLUG_TO_GROUP = {
    manage_dashboard: 'general',
    'manage_my-sales': 'general',
    manage_pos_screen: 'general',

    manage_sale: 'sales',
    manage_sale_return: 'sales',
    manage_quotations: 'sales',
    manage_electronic_invoices: 'sales',

    manage_purchase: 'purchases',
    manage_purchase_return: 'purchases',

    manage_products: 'catalog',
    manage_product_categories: 'catalog',
    manage_variations: 'catalog',
    manage_brands: 'catalog',
    manage_units: 'catalog',
    manage_print_barcode: 'catalog',

    manage_warehouses: 'inventory',
    manage_adjustments: 'inventory',
    manage_transfers: 'inventory',
    manage_kardex: 'inventory',

    manage_expenses: 'expenses',
    manage_expense_categories: 'expenses',

    manage_suppliers: 'people',
    manage_customers: 'people',
    manage_users: 'people',
    manage_login_logs: 'people',

    manage_report: 'reports',
    manage_reports: 'reports',

    manage_roles: 'settings',
    manage_stores: 'settings',
    manage_setting: 'settings',
    manage_currency: 'settings',
    manage_language: 'settings',
    manage_email_templates: 'settings',
    manage_sms_apis: 'settings',
    manage_sms_templates: 'settings',
    manage_sri_config: 'settings',
};

export const getPermissionGroup = (slug) => SLUG_TO_GROUP[slug] || 'general';
