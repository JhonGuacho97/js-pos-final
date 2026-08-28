/**
 * Traducción puramente de presentación para los permisos: el backend
 * sigue guardando/devolviendo `display_name` en inglés tal cual está en
 * la tabla `permissions` (ver Permission::prepareAttributes()) -- no se
 * toca nada de ahí. Este mapa slug -> clave de i18n vive solo en el
 * frontend y se usa para mostrar una etiqueta traducida en RoleForm.js
 * en vez del display_name crudo. Si un slug no está mapeado acá (un
 * permiso nuevo que todavía no se tradujo), el caller debe caer de
 * vuelta al display_name original -- así ningún permiso desaparece o
 * rompe la pantalla, sólo se ve en inglés hasta que se agregue su
 * entrada.
 */
const SLUG_TO_LABEL_KEY = {
    manage_dashboard: 'role.permission.manage_dashboard',
    'manage_my-sales': 'role.permission.manage_my-sales',
    manage_pos_screen: 'role.permission.manage_pos_screen',

    manage_sale: 'role.permission.manage_sale',
    manage_sale_return: 'role.permission.manage_sale_return',
    manage_quotations: 'role.permission.manage_quotations',
    manage_electronic_invoices: 'role.permission.manage_electronic_invoices',

    manage_purchase: 'role.permission.manage_purchase',
    manage_purchase_return: 'role.permission.manage_purchase_return',

    manage_products: 'role.permission.manage_products',
    manage_product_categories: 'role.permission.manage_product_categories',
    manage_variations: 'role.permission.manage_variations',
    manage_brands: 'role.permission.manage_brands',
    manage_units: 'role.permission.manage_units',
    manage_print_barcode: 'role.permission.manage_print_barcode',

    manage_warehouses: 'role.permission.manage_warehouses',
    manage_adjustments: 'role.permission.manage_adjustments',
    manage_transfers: 'role.permission.manage_transfers',
    manage_kardex: 'role.permission.manage_kardex',
    view_inventory_counts: 'role.permission.view_inventory_counts',
    perform_inventory_counts: 'role.permission.perform_inventory_counts',
    approve_inventory_counts: 'role.permission.approve_inventory_counts',

    manage_expenses: 'role.permission.manage_expenses',
    manage_expense_categories: 'role.permission.manage_expense_categories',

    manage_cash_control: 'role.permission.manage_cash_control',
    view_own_cash_session: 'role.permission.view_own_cash_session',
    create_cash_income: 'role.permission.create_cash_income',
    create_cash_expense: 'role.permission.create_cash_expense',
    withdraw_cash: 'role.permission.withdraw_cash',
    view_cash_supervision: 'role.permission.view_cash_supervision',
    view_cash_closures: 'role.permission.view_cash_closures',
    manage_cash_registers: 'role.permission.manage_cash_registers',
    reverse_cash_movement: 'role.permission.reverse_cash_movement',
    transfer_cash: 'role.permission.transfer_cash',
    review_cash_closure: 'role.permission.review_cash_closure',

    manage_suppliers: 'role.permission.manage_suppliers',
    manage_customers: 'role.permission.manage_customers',
    manage_users: 'role.permission.manage_users',
    change_user_passwords: 'role.permission.change_user_passwords',
    change_customer_passwords: 'role.permission.change_customer_passwords',
    manage_login_logs: 'role.permission.manage_login_logs',

    manage_report: 'role.permission.manage_report',
    manage_reports: 'role.permission.manage_reports',

    manage_roles: 'role.permission.manage_roles',
    manage_stores: 'role.permission.manage_stores',
    manage_catalog_orders: 'role.permission.manage_catalog_orders',
    manage_setting: 'role.permission.manage_setting',
    manage_currency: 'role.permission.manage_currency',
    manage_language: 'role.permission.manage_language',
    manage_email_templates: 'role.permission.manage_email_templates',
    manage_sms_apis: 'role.permission.manage_sms_apis',
    manage_sms_templates: 'role.permission.manage_sms_templates',
    manage_sri_config: 'role.permission.manage_sri_config',
};

export const getPermissionLabelKey = (slug) => SLUG_TO_LABEL_KEY[slug] || null;
