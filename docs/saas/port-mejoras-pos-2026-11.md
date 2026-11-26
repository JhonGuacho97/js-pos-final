# Mejoras del POS integradas al SaaS (noviembre 2026)

Fecha: 2026-11-26. Rama: `saas/port-pos-2026-11`, sobre `codex/ecuapos-saas`.

Origen: `C:/proyectos/pos` desde `6e341355` (la integración anterior, ver
`port-mejoras-pos.md`) hasta `fce6e9c8`. Cada commit del POS se aplicó por
separado con `cherry-pick`. Su mensaje dice "Portado desde el POS (sha)".
Los bundles compilados del POS no se copiaron: el frontend se recompiló en
el SaaS (`7a55e600`).

## Seguridad (antes de portar)

`9a565ea0`, hecho a mano:

- **Datos fiscales sin herencia.** Las filas `settings` con prefijo `sri_`
  y `store_id NULL` (RUC, razón social, ruta y clave de la firma,
  establecimiento, ambiente) ya no se heredan a ninguna tienda. Antes, una
  empresa nueva sin configurar emitía con el RUC y la firma de la
  instalación original. Ahora todas las lecturas pasan por
  `Setting::scopeEffectiveFor()` (`getSettingValue`, `SriConfigService`,
  `SriConfigController`, `SettingAPIController`). Los ajustes no fiscales
  siguen cayendo al valor global, como antes. La migración
  `2026_11_26_120000_copy_global_sri_settings_to_legacy_stores` copia esas
  filas a las tiendas del plan `legacy` para que sigan emitiendo igual. Las
  filas globales no se borran.
- **Rutas públicas de migración eliminadas** (`routes/upgrade.php`): corrían
  `migrate --force` por GET sin autenticación. El mismo arreglo se subió al
  POS (`67da011a`).
- **Consulta de cédula/RUC** (`/api/sri/lookup`): exige sesión, tienda
  activa y límite de 30 por minuto. Antes cualquiera gastaba el token de
  ApiConsult y obtenía datos personales.

## Commits portados

| POS | SaaS | Tema |
|---|---|---|
| f86f2a40 | d375ec6f | Filtros de categorías durante la sincronización |
| ce5465e4 | 486ba73f | URLs de medios sin PHP Fileinfo |
| ef6b758b | 55655f63 | Ticket sin esperar la sincronización del catálogo |
| 96b4f83f | faf54c5a | Carga inicial del catálogo del POS |
| cb5f35d3 | ad85fc15 | Buscar ventas por referencia |
| 3a912039 | 9b7621c0 | Ventas del turno en la cabecera del POS |
| a6c43f01 | 0cb4d03b | Reintento de facturas (conserva `authorizeWarehouseAccess`) |
| 9b828341 | d112dfe4 | Correos fuera de la venta/devolución |
| b2ce13fd | 536f4e57 | Kit de despliegue VPS (se conservó `composer.lock` del SaaS, que ya tiene htmlpurifier 4.19) |
| e0b9e3ab | 5f92cd72 | Bundle principal a la mitad |
| 3773202c | e44a5823 | Sin consultas por fila en ventas, compras y productos |
| 36883322 | d315c05b | Rentabilidad por producto con ventas netas |
| 39a3bf6f | 70e3c852 | update-site.sh no enciende workers apagados |
| 3ba646cf | 85b3b5d0 | `last_used_at` del token y almacenes una vez por petición |
| 4e2db4e6 | b0fe9e3b | Permisos del token al omitir el UPDATE de último uso |
| 45ca629a | 1b1dd2ac | Catálogo virtual rediseñado y fotos WebP |
| 621bc728 | 2ea7f593 | No servir .p12 desde uploads |
| 040150fa | 1144bc2d | Certificado .p12 con OpenSSL 3 |
| 880b6d0e | 797bc07f | Renovar la credencial de sincronización ante un 401 |
| 65d13c26 | 7f718dbf | Aviso cuando el SRI autoriza o rechaza |
| 4551adcd | 38f3c7ca | Sin correos al consumidor final |
| 3520433a | 23be23f0 | Ficha técnica SRI 2.34 |
| fce6e9c8 | b21c468c | Logo del SRI en "Emitir factura" |

### Conflictos resueltos a favor del aislamiento

- **Devoluciones** (`SaleReturnRepository`): el envío diferido de correos y
  SMS usa las plantillas y los ajustes de SMS de la tienda de la devolución
  (`MailTemplate::effectiveForStore`, `SmsTemplate::effectiveForStore`,
  `SmsSetting::effectiveValue`). No usa las plantillas globales.
- **`AppBaseController::scopeQueryToCurrentStore`**: toma la caché por
  petición del POS, pero sigue exigiendo tienda con `requireCurrentStoreId()`.
  Sin tienda aborta; no devuelve datos de todas las tiendas.
- **Catálogo** (`CatalogPageController`): además de los productos dentro del
  HTML, mantiene la verificación de organización activa y suscripción
  vigente. `Product` y `MainProduct` conservan `BelongsToStore`.
- **RIDE**: sigue en el disco privado `saas_private`, con las leyendas RIMPE
  y los totales por tarifa de la ficha 2.34.

Código nuevo revisado sin hallazgos:

- El vigilante de facturas solo ve las ventas offline de la tienda activa,
  porque IndexedDB está separado por `usuario:tienda`.
- El endpoint que consulta verifica el almacén de la venta.

## Pruebas

- PHPUnit: **229 pruebas, 963 assertions, todas pasan**. La suite se corrió
  en la base desechable `ecuapos_saas_test`.
- Dos pruebas del POS se adaptaron al esquema multiempresa (`1dc5073c`):
  - `PosCatalogPerformanceTest`: las variaciones llevan `store_id`.
  - `FileinfoAuthCompatibilityTest`: usa organización, suscripción y tienda
    reales.
- Node: `pos-catalog-filter` 19/19 y `pos-catalog-performance` 12/12.
  `pos-checkout-receipt` falla 5 de 8 **también en el POS**: es una prueba
  desactualizada de antes de esta integración, no un efecto del port.
- `npx mix --production` compila. Solo quedan las advertencias de Sass que ya
  existían.

## No hecho

- No se hizo push ni merge de la rama, ni despliegue del SaaS.
- No hubo emisión real al SRI desde el SaaS.
- La guía del VPS está en `deploy/vps/SAAS.md`.
