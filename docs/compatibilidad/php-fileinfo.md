# Compatibilidad controlada cuando PHP Fileinfo no está disponible

## Diagnóstico

En PHP 8.2, el disco local de Laravel utiliza Flysystem. Al construir su
adaptador local, Flysystem instancia `FinfoMimeTypeDetector`, que necesita
la clase `finfo`. Incluso `Storage::disk(...)->url()` o `->path()` inicializan
ese adaptador, aunque la operación no necesite inspeccionar el contenido.

El login serializa `User`, que añade `image_url`. Si existe un avatar,
`getImageUrlAttribute()` llama a `$media->getFullUrl()`. Además, al cargar
la relación `media`, sus objetos añaden `original_url` y `preview_url`.
Proteger únicamente el accessor del usuario no cubre esta segunda vía.

La diferencia entre dos instalaciones sin Fileinfo puede depender de sus
imágenes y discos. No se ha verificado ninguna de las instalaciones de
producción; no se debe atribuir su diferencia a una causa no comprobada.

El proyecto usa Spatie MediaLibrary 10.13.0, Laravel 10 y
`App\MediaLibrary\CustomPathGenerator`. Los discos `public` y `local`
apuntan a `public/uploads`, con URL basada en `APP_URL` y `/uploads`.
Las rutas son por colección, por ejemplo `user_image/{id}/{archivo}` o
`product/{id}/{archivo}`; las conversiones usan `thumbnails/`.
El enlace `public/storage` declarado en la configuración no determina
la ubicación real de estos medios.

## Implementación

- `app/MediaLibrary/FileinfoCompatibleUrlGenerator.php`: extiende el
  generador original. Con Fileinfo activo delega sin cambiar el comportamiento.
  Sin Fileinfo construye únicamente URLs de discos `local`, con visibilidad
  `public`, raíz existente dentro de `public`, URL HTTP(S) explícita y sin
  prefijo de disco. Utiliza el generador de rutas configurado por Spatie,
  incluidos los overrides por modelo, el disco de conversiones y el versionado.
  No inicializa Storage ni comprueba tipos MIME.
- Para discos privados, remotos, raíces no verificadas, URLs no aptas o
  rutas inseguras devuelve `''` y registra una advertencia con ID y disco.
  No captura ni oculta excepciones de almacenamiento, ni errores arbitrarios
  del generador de rutas. No fabrica URLs privadas o firmadas.
- `app/MediaLibrary/Media.php`: conserva el modelo y la tabla de Spatie.
  Su `getFullUrl()` mantiene un resultado vacío en lugar de transformarlo
  en la URL de la página principal mediante `url('')`.
- `config/media-library.php`: selecciona esas dos clases mediante los
  puntos de extensión soportados por MediaLibrary. Las clases son subclases
  de las originales; no hay migraciones, nuevos paquetes o cambios de datos.

No se modificaron User, AuthController, rutas, permisos, roles, alcance de
tiendas, validaciones de archivos, registros de media ni archivos de vendor.

## Alcance y limitaciones

| Operación | Sin Fileinfo después de esta corrección |
| --- | --- |
| Login y perfil, con o sin avatar | Probados; un almacenamiento no compatible usa imagen vacía |
| URLs de imágenes existentes de productos, variantes, marcas, categorías y logos | Cubiertas por el generador común; público local verificado funciona |
| URLs de adjuntos existentes obtenidas con MediaLibrary | Mismo criterio; no equivale a poder leerlos mediante Storage |
| Cargar/reemplazar imágenes y adjuntos | Sigue requiriendo restaurar Fileinfo; validaciones MIME intactas |
| Crear productos/ventas que generan códigos de barras | Puede fallar: ProductRepository y SaleRepository escriben mediante Storage |
| Consultar código de barras del ticket | SaleAPIController utiliza Storage para comprobar existencia y generar URL |
| Exportar informes/PDF | Los controladores escriben los archivos con Storage |
| Certificados, firma y RIDE SRI | SriConfigController, SriFirmaService y SriRideService usan Storage; RIDE también usa mime_content_type |
| Storage directo, conversiones, borrado, disco privado/S3 y URLs temporales | Sin bypass; siguen sujetos a los requisitos originales del framework |

Esta es una compatibilidad de lectura de URLs, no una promesa de que todas
las funciones del POS operen sin Fileinfo. No usarla para justificar que el
servidor continúe indefinidamente con la extensión deshabilitada.

## Pruebas ejecutadas (8 de octubre de 2026)

```powershell
php vendor/phpunit/phpunit/phpunit --filter 'Fileinfo(MediaUrl|AuthCompatibility)Test' --do-not-cache-result
```

Resultado con PHP 8.2.12 y Fileinfo habilitado: **32 pruebas, 108 aserciones,
sin fallos**. Las pruebas incluyen delegación al comportamiento original,
URLs por colección, conversiones, versionado, overrides, respaldo seguro,
serialización de User y media, productos/logos y excepciones no ocultadas.

La suite HTTP crea una conexión SQLite exclusivamente en memoria y verifica
su nombre antes de crear tablas. Ejecuta los endpoints reales de login y
perfil, comprueba token, permisos, rechazo de una contraseña incorrecta,
perfil sin autenticar y cambio de contraseña sin permiso. No usa migraciones
ni la BD del proyecto, no guarda imágenes físicas y no consulta producción.

Se repitió en un proceso PHP con Fileinfo realmente ausente, no solo simulado:

```powershell
php -n -d extension_dir=C:\xampp\php\ext -d extension=mbstring -d extension=pdo_sqlite -d extension=openssl -r 'echo "fileinfo=",(int)extension_loaded("fileinfo")," finfo=",(int)class_exists("finfo"),PHP_EOL;'
php -n -d extension_dir=C:\xampp\php\ext -d extension=mbstring -d extension=pdo_sqlite -d extension=openssl vendor/phpunit/phpunit/phpunit --filter 'Fileinfo(MediaUrl|AuthCompatibility)Test' --do-not-cache-result
```

El primer comando confirmó `fileinfo=0 finfo=0`. Resultado: **31 pruebas
superadas, 107 aserciones y 1 omitida**: la comparación real con el generador
original cuando Fileinfo está cargado. Login con avatar y consulta del perfil
se ejecutaron correctamente en ambos procesos. No se probó el login remoto
de JHON SPORT ni del SaaS.

También se ejecutó `php vendor/phpunit/phpunit/phpunit --testsuite Unit
--do-not-cache-result`: **54 pruebas y 113 aserciones, sin fallos**, incluyendo
las nuevas pruebas unitarias. No se ejecutó toda la suite Feature porque
otros tests del proyecto usan la BD configurada del entorno.

## Activación y solución definitiva en hosting

Al desplegar estos archivos, limpiar y reconstruir la caché de configuración
para que Laravel seleccione el nuevo modelo y generador:

```bash
php artisan config:clear
php artisan config:cache
```

No requiere migraciones, seeders, cambios de APP_KEY, npm o nuevas dependencias.
No ejecutar composer con `--ignore-platform-reqs` para ocultar la ausencia de
Fileinfo: varias dependencias lo requieren explícitamente.

El proveedor debe instalar/habilitar Fileinfo para el PHP 8.2 **realmente
utilizado por cada dominio**, y verificar tanto el handler web de LiteSpeed
como el PHP de terminal/cron. cPanel documenta la instalación con privilegios
root en WHM → Software → EasyApache 4 → Customize → PHP Extensions → Fileinfo
→ Review → Provision:

- [Procedimiento oficial de cPanel](https://support.cpanel.net/hc/en-us/articles/1500000107181-How-do-I-install-Fileinfo)
- [Versiones y extensiones de EasyApache 4](https://docs.cpanel.net/ea4/php/how-to-locate-and-install-a-php-version-or-extension/)

Una prueba CLI debe confirmar `extension_loaded('fileinfo')` y
`class_exists('finfo')`, pero no sustituye la verificación por HTTP en ambos
dominios. No dejar phpinfo() o scripts de diagnóstico públicos tras comprobarlo.

Cuando Fileinfo vuelva a estar disponible, el generador delega automáticamente
al original. Para retirar la compatibilidad por completo, los valores previos
de configuración son `Spatie\MediaLibrary\MediaCollections\Models\Media::class`
y `Spatie\MediaLibrary\Support\UrlGenerator\DefaultUrlGenerator::class`;
después se reconstruye config:cache. No es necesario mover o borrar medios.
