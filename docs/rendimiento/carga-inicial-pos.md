# Carga inicial del catálogo POS

## Cambios (16 de octubre de 2026)

- El listado conserva las relaciones precargadas en lugar de volver a consultar
  producto principal y variante al serializar cada producto.
- Los resúmenes de almacenes activos, medios, tipos de presentación y componentes
  de kits se precargan en conjunto. Los precios siguen resolviéndose por bodega.
- Los kits del catálogo usan el stock de componentes recién consultado; los
  llamadores sin relaciones precargadas (incluidas ventas) conservan la consulta
  de stock en vivo. Consultar el catálogo no modifica existencias.
- Al entrar/cambiar de bodega se elimina el retraso artificial de 300 ms. Se
  conserva ese debounce para filtros dentro de la misma bodega.
- Si hay una copia local del usuario/tienda/bodega actuales, puede mostrarse como
  **vista previa de solo lectura** mientras llega la respuesta del servidor.
  No se pueden agregar productos, variantes ni presentaciones desde esa vista.
  Una lectura local tardía no reemplaza precios frescos. El modo offline conserva
  su flujo de ventas protegidas; un error de autorización no habilita la vista.
- Peticiones simultáneas equivalentes comparten descarga y escritura offline.
  No se comparten entre usuarios/tiendas, y se mantienen las protecciones de
  respuesta obsoleta y filtro/bodega vigente.
- Las variantes se agrupan en dos recorridos lineales, sin buscar sus hermanos
  recorriendo repetidamente toda la lista.
- La transformación para el carrito se memoriza por instancia del POS y cambia
  cuando cambia el catálogo. Al agregar productos se copian las plantillas para
  que editar una línea del carrito no altere el siguiente producto agregado.
- Se difiere la descarga de imágenes fuera de las primeras 12 tarjetas, su
  decodificación es asíncrona y las tarjetas fuera de pantalla usan
  `content-visibility: auto` donde el navegador lo soporte. Se conserva todo el
  catálogo para búsqueda, filtros y funcionamiento offline; no se recorta la BD.
- El service worker consulta su caché de imágenes antes de descargar, con una
  cola global de máximo cuatro descargas simultáneas, incluso si llegan varios
  mensajes. Un error de imagen no interrumpe las demás. Se actualiza el shell a v8.

## Verificación reproducible

```bash
node --test tools/tests/pos-catalog-filter.test.cjs tools/tests/pos-catalog-performance.test.cjs tools/tests/pos-checkout-receipt.test.cjs
php vendor/phpunit/phpunit/phpunit --filter PosCatalogPerformanceTest --do-not-cache-result
php vendor/phpunit/phpunit/phpunit --testsuite Unit --do-not-cache-result
npm run production
```

Las pruebas PHP de catálogo construyen exclusivamente una conexión SQLite
`:memory:` y verifican ese destino antes de crear fixtures. No ejecutan migraciones
ni seeders sobre las bases de datos configuradas del negocio.

La prueba de consultas compara la respuesta real del controlador para 1 y 25
productos con variantes y presentaciones: las consultas no deben crecer por
producto, y deben mantenerse por debajo de 30. Verifica también precios de
bodega, costo por equivalencia, almacenes activos, aislamiento y stock de kits.

Las pruebas de JavaScript ejecutan acciones, selectores y manejadores reales con
HTTP/IndexedDB simulados. Para 5.000 variantes se exige trabajo lineal (máximo
15.000 accesos a la relación), y para imágenes se comprueba el límite global de
concurrencia y la reutilización de entradas ya cacheadas.

Estas son mediciones/control de trabajo y pruebas de regresión, **no tiempos
medidos en producción**. La latencia final también depende del tamaño real del
catálogo, recursos del hosting, imágenes, red y dispositivo. La carga de tarjetas
sigue siendo React; `content-visibility` reduce layout/pintado fuera de pantalla,
no convierte la cuadrícula en una lista virtualizada.

## Despliegue

No requiere migraciones, cambios en `.env` ni nuevas dependencias. Subir código,
service worker y compilados juntos, y recargar el POS para que tome la versión
nueva. No borrar IndexedDB ni las ventas pendientes para actualizar el navegador.
