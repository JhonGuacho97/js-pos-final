# EcuaPos SaaS en el VPS

Los scripts de esta carpeta vienen del POS de una sola empresa. Allí se
instala un sitio por cliente; aquí se instala la plataforma **una sola
vez**, en un dominio, y todas las empresas viven en la misma base, separadas
por `organization_id` y `store_id` (ver `docs/saas/aislamiento-datos.md`).

## Qué cambia respecto del POS

| | POS (un cliente) | SaaS |
|---|---|---|
| Instalación | `add-site.sh` por cliente | `add-site.sh` una vez |
| Instalación nueva | `--seed` (datos iniciales) | `--new`: tablas vacías y luego `saas:install` |
| Workers de la cola | 1 por sitio | 2 por defecto (`--workers N`), compartidos por todas las empresas |
| PHP-FPM | pool `www` | pool propio `ecuapos-<slug>` (16 procesos) |
| Archivos privados | `public/uploads/certificados` bloqueado en Nginx | `storage/app/private` y `storage/app/tenant-private` (2770), fuera de `public/` |
| RUC del proveedor | — | `SAAS_SRI_PROVIDER_RUC` en `.env` (`--provider-ruc`) |
| Registro de empresas | — | `SAAS_SELF_REGISTRATION_ENABLED=false` hasta abrirlo a propósito |
| Rama | `main` | `codex/ecuapos-saas` |

`update-site.sh --all` y `backup.sh` ahora solo recorren los sitios con
`/etc/nginx/sites-available/zz-ecuapos-<dominio>`, es decir los creados por
`add-site.sh`. Otro proyecto Laravel del VPS (por ejemplo YAPA) no se
actualiza ni se respalda desde aquí.

## Plataforma nueva

```bash
bash add-site.sh app.ecuapos.tech --new --provider-ruc <RUC del proveedor>
sudo -u www-data php /var/www/app.ecuapos.tech/artisan saas:install
certbot --nginx -d app.ecuapos.tech --redirect
```

`saas:install` crea solo el superadministrador y pide la clave por consola.
Se niega a correr si la base ya tiene usuarios, tiendas u organizaciones.
Por eso no se usa `migrate --seed`.

### Firmador de XML

`SriFirmaService` usa el binario Go en
`bin/go-signer-cli-listo/go-xml-signer-cli`, que no está en Git. Cópialo de
la instalación del POS que ya firma en este VPS, o apunta
`SRI_GO_SIGNER_PATH` en `.env` al mismo binario:

```bash
install -d -o deploy -g www-data /var/www/app.ecuapos.tech/bin
cp -a /var/www/ecuapos.tech/bin/go-signer-cli-listo /var/www/app.ecuapos.tech/bin/
```

## Mudar una base existente

1. `bash add-site.sh <dominio>` sin `--new`. La base queda vacía y los
   workers quedan **apagados**.
2. Importa el respaldo y copia `storage/app/private` y
   `storage/app/tenant-private` del servidor anterior.
3. Copia el `APP_KEY` del `.env` anterior. Con otra clave no se pueden
   descifrar las contraseñas de las firmas guardadas en `settings`.
4. Corre `sudo -u www-data php artisan migrate --force` y luego
   `config:cache`.
5. Al cambiar el DNS, enciende los workers:
   `supervisorctl start 'ecuapos-queue-<slug>:*'`. Antes de eso, este
   servidor y el anterior facturarían a la vez.

Si la base viene de un POS de una sola empresa, la migración inicial del
SaaS la convierte en la organización "legacy". La migración
`2026_11_26_120000_copy_global_sri_settings_to_legacy_stores` copia a sus
tiendas los datos SRI que estaban como globales, para que siga emitiendo
igual.

## Capacidad en el VPS actual (2 vCPU, 7.9 GB, 96 GB)

Hoy el VPS usa ~1 GB. Con el SaaS:

| Componente | Memoria aproximada |
|---|---|
| PHP-FPM del SaaS (16 procesos × 60-90 MB) | 1.0-1.4 GB en el pico |
| 2 workers de la cola | ~200 MB |
| MariaDB con `innodb_buffer_pool_size=1G` | ~1.3 GB |
| POS actuales, YAPA y sistema | ~1 GB |

Queda más de la mitad de la RAM libre. El límite real son los **2 vCPU**:
firmar y enviar comprobantes, generar los PDF y convertir fotos ocupan
CPU. Como referencia, alcanzan para unas decenas de empresas pequeñas con
ventas al mismo tiempo. Si la carga sostenida pasa de ~70 % de CPU en horas
pico, el siguiente paso es subir a 4 vCPU; no hace falta separar bases.

### MariaDB (hacerlo a mano, en horario sin ventas)

La configuración por defecto usa un buffer de 128 MB. Con varias empresas,
los reportes terminan leyendo del disco. Recomendado:

```ini
# /etc/mysql/mariadb.conf.d/60-ecuapos.cnf
[mysqld]
innodb_buffer_pool_size = 1G
innodb_log_file_size    = 256M
max_connections         = 100
```

Aplicarlo requiere **reiniciar MariaDB**, y eso corta un par de segundos a
todos los proyectos que la usan, YAPA incluido. Por eso ningún script lo hace
solo. Coordínalo, aplícalo con `systemctl restart mariadb` y revisa que YAPA
responda.

### Respaldos

`backup.sh` todavía **no está programado** en el VPS. Instálalo con el
bloque de su encabezado. Respalda la base completa (todas las empresas) y
`storage/app`, que incluye las firmas `.p12` y los RIDE privados. Por ser una
base compartida, restaurar una sola empresa implica levantar el respaldo en
una base temporal y copiar sus filas. Copia los respaldos fuera del VPS con
regularidad.
