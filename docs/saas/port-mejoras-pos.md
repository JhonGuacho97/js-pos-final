# Integración de las mejoras del POS al SaaS

Fecha: 2026-10-03.

Origen: `C:/proyectos/pos`, hasta el commit `6e341355`.
Destino: `C:/proyectos/ecuapos-saas`, sobre `6ce026b6`.
Base común utilizada para comparar: `d514e4f2`.

La integración se hizo comparando los tres estados, no reemplazando el SaaS
con archivos completos del POS. No se copiaron su `.env`, sus dependencias,
sus datos ni sus bundles compilados. Los bundles se generaron en el SaaS.

## Bloques integrados

1. Clientes: contacto opcional, normalización de correo vacío/N/A, etiquetas
   legibles e integridad del contexto de tienda. No se envía correo a N/A.
2. Productos: explicación del IVA incluido o agregado, sincronización de
   variantes marcadas para presentaciones y correcciones de edición/offline.
3. Ventas y caja: reparto de cobros mixtos, cambio atribuido al efectivo,
   control del total cobrado y tratamiento de devoluciones y cartera.
4. POS: modales de cobro, precio con permiso y motivo auditable, avisos,
   referencias en cobros mixtos y ticket después de cerrar el cobro.
5. Tickets: cantidades/precios de presentaciones y desglose de IVA,
   descuentos, envío y formas de pago.
6. Transferencias: módulo operativo independiente de los pagos de
   suscripciones SaaS, filtros automáticos, detalle y conciliación.
7. Informes: clientes, compras y almacén; búsqueda, pestañas y paginación
   compartida con jerarquía visual consistente y progreso de carga.
8. Acceso y catálogo: login/recuperación/registro de organización renovados,
   preservando 2FA; pedidos
   del catálogo sin cuenta de comprador, con datos del cliente al ordenar.
9. SRI: snapshot del RUC del proveedor y mejoras de configuración/XML/RIDE,
   manteniendo certificados y archivos fiscales en almacenamiento privado.

Las cuentas de compradores ya existentes no fueron eliminadas. Se retiraron
las rutas públicas de autenticación del catálogo y se reemplazó su prueba por
las pruebas del checkout invitado.

## Adaptaciones específicas de seguridad

- Clientes y variantes toman la tienda activa del servidor, no un `store_id`
  enviado por el formulario.
- Las opciones de una variante se buscan a través de esa variante; no es
  posible editar opciones de otra variante enviando sus identificadores.
- La actualización de presentaciones antiguas también comprueba la tienda
  del producto.
- Las transferencias respetan tienda, almacén, membresía, permisos y
  `subscription.active`. Referencias repetidas de otras organizaciones no
  aparecen en los indicadores ni en el detalle.
- Una suscripción vencida puede consultar transferencias, pero no conciliar.
  La interfaz oculta la escritura y el servidor la rechaza.
- Se conservaron el flujo de 2FA del superadministrador, los bloqueos de
  suscripción, los límites y las descargas fiscales autenticadas.
- Los errores de descarga de archivos protegidos no deben redirigir la
  pantalla completa ni cambiar la URL del módulo.

## Migraciones y actualización

Se agregaron cinco migraciones:

- `2026_09_11_000001_add_provider_ruc_to_electronic_invoices_table`
- `2026_09_12_000000_make_customer_contact_fields_nullable`
- `2026_09_15_000000_sync_presentation_variations_with_catalog`
- `2026_09_17_120000_add_pos_price_override_audit`
- `2026_09_20_120000_add_reconciliation_to_sales_payments`

En una actualización, hacer primero un respaldo privado y ejecutar:

```sh
php artisan migrate --force
php artisan db:seed --class=EnsureAllPermissionsSyncedSeeder --force
php artisan optimize:clear
php artisan permission:cache-reset
```

El seeder indicado sincroniza el catálogo de permisos y los roles operativos
admin existentes. No usar `DatabaseSeeder`, `migrate:fresh`, `refresh` ni
seeders de demostración en una base con datos. Los empleados con roles
restringidos necesitan recibir los permisos nuevos expresamente.

Los permisos nuevos son `override_pos_price`,
`view_bank_transfer_payments` y `reconcile_bank_transfer_payments`.

La instalación local ya tiene las cinco migraciones y la sincronización de
permisos aplicadas. El respaldo anterior a la actualización está en:

`storage/app/private/backups/before-pos-port-20261003-162634-d18f07.sql`

Se compararon conteos y hashes de los valores originales de 24 tablas de
negocio antes y después; no cambió ninguno. No se ejecutaron reconstrucciones
ni pruebas sobre la base real del negocio.

## Configuración de proveedor fiscal

El SaaS usa por defecto el origen `TERCERO`. La configuración de plataforma
se hace con:

```dotenv
SAAS_SRI_SOFTWARE_ORIGIN=TERCERO
SAAS_SRI_PROVIDER_RUC=
```

Completar el RUC real del proveedor antes de emitir desde organizaciones que
usen ese origen. No inventar un RUC ni usar el del emisor como sustituto.
La configuración explícita guardada por tienda tiene prioridad; no se
sobrescribieron sus valores ni el `.env` local. El RUC del emisor, la firma,
las claves y los secuenciales siguen siendo propios de cada tienda.

## Verificación

- Suite completa: **180 pruebas, 797 assertions, todas aprobadas**.
- Incluye instalación SaaS vacía, onboarding, 2FA, seguridad, suscripciones,
  pagos mixtos, arqueo, cartera, presentaciones, checkout invitado y
  transferencias. Los nuevos escenarios usan organizaciones con suscripción
  real, incluyendo organizaciones vencidas y accesos cruzados.
- Las pruebas se ejecutaron con una base MySQL y directorios de archivos
  separados. El test de instalación puede reconstruir únicamente esa base
  desechable, no la configurada para la aplicación.
- `npm run production`: compilación correcta. Continúan advertencias de
  deprecación de Sass del proyecto; no fueron errores de compilación.
- Registro de organizaciones adaptado al mismo `AuthLayout`: se retiraron
  las clases `lp-*` y variables antiguas de ese flujo. Se preservaron los dos
  pasos, campos y creación automática de empresa/tienda/almacén/caja.
  `node --test tests/OnboardingStyles.test.cjs`: 3 smoke tests de los dos pasos
  y del contrato CSS aprobados. La comprobación PHP del onboarding también
  pasó: 3 pruebas, 25 assertions. No son pruebas visuales de navegador.
- Sin conflictos de integración ni errores de espacios en `git diff --check`.
- La revisión visual automática quedó **sin completar**: Computer Use no
  pudo determinar con seguridad la URL del navegador y se detuvo. No se
  considera reemplazada por la compilación o las pruebas del servidor.
- No se hicieron emisiones reales al SRI, despliegue en cPanel ni push a GitHub
  como parte de esta integración.
