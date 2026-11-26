#!/usr/bin/env bash
# =============================================================================
# EcuaPos SaaS -- crear la plataforma (UN dominio para todas las empresas)
#
# Uso (como root, después de setup-server.sh):
#   bash add-site.sh <dominio> [--new] [--provider-ruc <ruc>] [--workers <n>]
#                    [--repo <url>] [--branch <rama>]
#
#   bash add-site.sh app.ecuapos.tech --new --provider-ruc 0999999999001
#       Plataforma NUEVA: crea las tablas vacías. Después se crea el
#       superadministrador con `php artisan saas:install` (pide la clave).
#       No se siembran datos de ejemplo: saas:install exige una base limpia.
#
#   bash add-site.sh app.ecuapos.tech
#       Para MUDAR una base existente (respaldo del SaaS o un POS a
#       convertir): deja la base vacía, lista para importar (ver SAAS.md).
#
# Crea: código en /var/www/<dominio>, base y usuario MySQL, .env de
# producción, carpetas privadas de la plataforma y de las empresas, un pool
# de PHP-FPM propio (no toca el pool "www" de otros proyectos), sitio de
# Nginx, workers de la cola en Supervisor y el cron de Laravel.
# Las credenciales quedan en /root/ecuapos-sitios/<dominio>.txt
# =============================================================================
set -euo pipefail

PHP_VERSION="8.3"
DEPLOY_USER="deploy"
# Repositorio público: se clona por HTTPS sin llave. Si algún día se vuelve
# privado, usa --repo git@github.com:... con la deploy key de setup-server.sh.
REPO="https://github.com/JhonGuacho97/js-pos-final.git"
BRANCH="codex/ecuapos-saas"
SEED=0
PROVIDER_RUC=""
# Un solo worker atiende a TODAS las empresas: con dos, la factura de una
# no espera detrás del correo o la foto de otra. La cola es "database" y
# MariaDB reparte los trabajos sin duplicarlos (SKIP LOCKED).
WORKERS=2
# Pool de PHP-FPM propio: 2 vCPU / 8 GB. Cada proceso usa ~60-90 MB, así
# que 16 caben con holgura sin quitarle memoria a otros proyectos.
FPM_MAX_CHILDREN=16

DOMAIN="${1:-}"
shift || true
while [[ $# -gt 0 ]]; do
    case "$1" in
        --new|--seed) SEED=1; shift ;;
        --provider-ruc) PROVIDER_RUC="$2"; shift 2 ;;
        --workers) WORKERS="$2"; shift 2 ;;
        --repo)   REPO="$2"; shift 2 ;;
        --branch) BRANCH="$2"; shift 2 ;;
        *) echo "Opción desconocida: $1" >&2; exit 1 ;;
    esac
done

if [[ $EUID -ne 0 ]]; then
    echo "Este script debe ejecutarse como root." >&2
    exit 1
fi
if [[ ! "${DOMAIN}" =~ ^[a-z0-9]([a-z0-9.-]*[a-z0-9])?$ ]]; then
    echo "Uso: bash add-site.sh <dominio> [--new] [--provider-ruc <ruc>] [--workers <n>] [--repo <url>] [--branch <rama>]" >&2
    exit 1
fi

APP_DIR="/var/www/${DOMAIN}"
SLUG="$(echo "${DOMAIN%%.*}" | tr -c 'a-z0-9\n' '_')"
DB_NAME="ecuapos_${SLUG}"
DB_USER="$(echo "ep_${SLUG}" | cut -c1-32)"
DB_PASS="$(openssl rand -base64 32 | tr -dc 'A-Za-z0-9' | cut -c1-32)"
CRED_FILE="/root/ecuapos-sitios/${DOMAIN}.txt"
SUPERVISOR_CONF="/etc/supervisor/conf.d/ecuapos-queue-${SLUG}.conf"
FPM_POOL="ecuapos-${SLUG}"
FPM_SOCKET="/run/php/${FPM_POOL}.sock"
FPM_CONF="/etc/php/${PHP_VERSION}/fpm/pool.d/${FPM_POOL}.conf"
# "zz-": Nginx toma como sitio por defecto el primero en orden alfabético;
# así un proyecto que ya exista en el VPS sigue siendo el predeterminado.
NGINX_SITE="zz-ecuapos-${DOMAIN}"

if [[ -e "${APP_DIR}" ]]; then
    echo "Ya existe ${APP_DIR}. Para actualizarlo usa update-site.sh." >&2
    exit 1
fi

as_deploy() { sudo -u "${DEPLOY_USER}" -H "$@"; }
as_web()    { sudo -u www-data "$@"; }

set_env() {
    local key="$1" value="$2" file="${APP_DIR}/.env"
    if grep -qE "^${key}=" "${file}"; then
        local escaped
        escaped="$(printf '%s' "${value}" | sed -e 's/[\/&|]/\\&/g')"
        sed -i "s|^${key}=.*|${key}=${escaped}|" "${file}"
    else
        # Si el archivo no termina en salto de línea, la variable nueva
        # quedaría pegada a la última línea existente.
        [[ -n "$(tail -c1 "${file}")" ]] && echo >> "${file}"
        printf '%s=%s\n' "${key}" "${value}" >> "${file}"
    fi
}

echo "==> Clonando ${REPO} (${BRANCH}) en ${APP_DIR}"
install -d -o "${DEPLOY_USER}" -g www-data -m 755 "${APP_DIR}"
as_deploy git clone --branch "${BRANCH}" "${REPO}" "${APP_DIR}"

echo "==> Dependencias de PHP (Composer)"
as_deploy bash -c "cd '${APP_DIR}' && composer install --no-dev --optimize-autoloader --no-interaction"

echo "==> Base de datos ${DB_NAME}"
mariadb <<SQL
CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASS}';
ALTER USER '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASS}';
GRANT ALL PRIVILEGES ON \`${DB_NAME}\`.* TO '${DB_USER}'@'localhost';
FLUSH PRIVILEGES;
SQL

echo "==> Archivo .env de producción"
as_deploy cp "${APP_DIR}/.env.example" "${APP_DIR}/.env"
set_env APP_NAME "EcuaPos"
set_env APP_ENV "production"
set_env APP_DEBUG "false"
set_env APP_URL "https://${DOMAIN}"
set_env CORS_ALLOWED_ORIGINS "https://${DOMAIN}"
set_env LOG_CHANNEL "daily"
set_env LOG_LEVEL "warning"
set_env DB_CONNECTION "mysql"
set_env DB_HOST "127.0.0.1"
set_env DB_PORT "3306"
set_env DB_DATABASE "${DB_NAME}"
set_env DB_USERNAME "${DB_USER}"
set_env DB_PASSWORD "${DB_PASS}"
set_env QUEUE_CONNECTION "database"
set_env CACHE_DRIVER "file"
set_env SESSION_DRIVER "file"
set_env FILESYSTEM_DISK "local"
set_env APICONSULT_TOKEN ""
set_env MEDIA_DISK "public"
# Las sesiones del panel duran 2 horas (config/sanctum.php).
set_env SANCTUM_TTL "120"
# El registro público de empresas queda cerrado hasta que el
# superadministrador lo abra a propósito.
set_env SAAS_SELF_REGISTRATION_ENABLED "false"
# El software es de un tercero (la plataforma): el RUC es del PROVEEDOR,
# nunca el de una empresa cliente.
set_env SAAS_SRI_SOFTWARE_ORIGIN "TERCERO"
set_env SAAS_SRI_PROVIDER_RUC "${PROVIDER_RUC}"
set_env UPGRADE_MODE "false"
as_deploy bash -c "cd '${APP_DIR}' && php artisan key:generate --force --no-interaction"
chown "${DEPLOY_USER}:www-data" "${APP_DIR}/.env"
chmod 640 "${APP_DIR}/.env"

echo "==> Permisos de escritura (storage, bootstrap/cache, public/uploads)"
install -d -o "${DEPLOY_USER}" -g www-data -m 2775 "${APP_DIR}/public/uploads"
for dir in storage bootstrap/cache public/uploads; do
    chown -R "${DEPLOY_USER}:www-data" "${APP_DIR}/${dir}"
    find "${APP_DIR}/${dir}" -type d -exec chmod 2775 {} +
    find "${APP_DIR}/${dir}" -type f -exec chmod 664 {} +
done

echo "==> Carpetas privadas (firmas .p12, RIDE, XML, comprobantes de pago)"
# Discos saas_private y tenant_private (config/filesystems.php): fuera de
# public/ y sin permiso de lectura para "otros" usuarios del servidor.
for dir in storage/app/private storage/app/tenant-private; do
    install -d -o "${DEPLOY_USER}" -g www-data -m 2770 "${APP_DIR}/${dir}"
done

if [[ "${SEED}" -eq 1 ]]; then
    echo "==> Plataforma nueva: migraciones (sin datos de ejemplo)"
    as_web php "${APP_DIR}/artisan" migrate --force --no-interaction
fi

echo "==> Pool de PHP-FPM propio (${FPM_POOL})"
# Un pool aparte en lugar de tocar el "www": así los límites del SaaS no
# cambian nada de otros proyectos del VPS, y un pico de una empresa no deja
# sin procesos a los demás sitios.
cat > "${FPM_CONF}" <<FPM
[${FPM_POOL}]
user = www-data
group = www-data
listen = ${FPM_SOCKET}
listen.owner = www-data
listen.group = www-data
listen.mode = 0660

pm = dynamic
pm.max_children = ${FPM_MAX_CHILDREN}
pm.start_servers = 4
pm.min_spare_servers = 2
pm.max_spare_servers = 6
; Recicla procesos para que una fuga de memoria no crezca sin techo.
pm.max_requests = 500
request_terminate_timeout = 120s

php_admin_value[memory_limit] = 256M
php_admin_value[upload_max_filesize] = 25M
php_admin_value[post_max_size] = 25M
FPM
php-fpm${PHP_VERSION} -t
# reload: los procesos de otros pools terminan su petición actual.
systemctl reload "php${PHP_VERSION}-fpm"

echo "==> Nginx"
cat > "/etc/nginx/sites-available/${NGINX_SITE}" <<NGINX
server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN};
    root ${APP_DIR}/public;
    index index.php;
    charset utf-8;

    client_max_body_size 25M;

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    gzip on;
    gzip_comp_level 5;
    gzip_types text/plain text/css application/javascript application/json image/svg+xml;

    location / {
        try_files \$uri \$uri/ /index.php?\$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    location ~* \.(?:js|css|png|jpe?g|gif|webp|svg|ico|woff2?)$ {
        expires 30d;
        access_log off;
        try_files \$uri =404;
    }

    location ~ \.php$ {
        fastcgi_pass unix:${FPM_SOCKET};
        fastcgi_param SCRIPT_FILENAME \$realpath_root\$fastcgi_script_name;
        include fastcgi_params;
        fastcgi_read_timeout 90s;
        fastcgi_hide_header X-Powered-By;
    }

    # Archivos ocultos (.env, .git...) y scripts dentro de uploads nunca se sirven.
    location ~ /\.(?!well-known) { deny all; }
    location ~* ^/uploads/.*\.php$ { deny all; }
    # Los certificados .p12 del SRI viven en public/uploads/certificados
    # (disco "local"); nunca deben poder descargarse por la web.
    location ^~ /uploads/certificados/ { deny all; }
}
NGINX
ln -sf "/etc/nginx/sites-available/${NGINX_SITE}" "/etc/nginx/sites-enabled/${NGINX_SITE}"
nginx -t
systemctl reload nginx

echo "==> Worker de la cola (facturación electrónica) en Supervisor"
# --timeout debe ser menor que retry_after (90 s en config/queue.php) para
# que un trabajo lento nunca se ejecute dos veces a la vez.
# Al MUDAR una tienda el worker queda apagado y se enciende recién al
# cambiar el DNS, para que este servidor y cPanel nunca facturen a la vez.
AUTOSTART=$([[ "${SEED}" -eq 1 ]] && echo true || echo false)
cat > "${SUPERVISOR_CONF}" <<SUP
[program:ecuapos-queue-${SLUG}]
process_name=%(program_name)s_%(process_num)02d
command=/usr/bin/php ${APP_DIR}/artisan queue:work database --sleep=3 --tries=6 --timeout=80 --max-time=3600
directory=${APP_DIR}
user=www-data
numprocs=${WORKERS}
autostart=${AUTOSTART}
autorestart=true
startsecs=5
stopwaitsecs=100
stopasgroup=true
killasgroup=true
redirect_stderr=true
stdout_logfile=${APP_DIR}/storage/logs/queue-worker.log
stdout_logfile_maxbytes=10MB
stdout_logfile_backups=5
SUP
supervisorctl reread
supervisorctl update

echo "==> Cron de Laravel (schedule:run)"
cat > "/etc/cron.d/ecuapos-${SLUG}" <<CRON
* * * * * www-data cd ${APP_DIR} && /usr/bin/php artisan schedule:run >> /dev/null 2>&1
CRON
chmod 644 "/etc/cron.d/ecuapos-${SLUG}"

cat > "${CRED_FILE}" <<CRED
Sitio:          ${DOMAIN}
Carpeta:        ${APP_DIR}
Base de datos:  ${DB_NAME}
Usuario MySQL:  ${DB_USER}
Clave MySQL:    ${DB_PASS}
Workers cola:   ecuapos-queue-${SLUG}:* x${WORKERS}  (supervisorctl status)
Pool PHP-FPM:   ${FPM_POOL} (${FPM_CONF})
Creado:         $(date '+%Y-%m-%d %H:%M')
CRED
chmod 600 "${CRED_FILE}"

cat <<EOF

=============================================================================
 Sitio ${DOMAIN} creado. Credenciales en ${CRED_FILE}

 Falta:
EOF
if [[ "${SEED}" -eq 1 ]]; then
cat <<EOF
  1. Crear el superadministrador (pide nombre, correo y clave):
       sudo -u www-data php ${APP_DIR}/artisan saas:install
EOF
else
cat <<EOF
  1. Importar la base y los archivos del servidor anterior, y copiar su
     APP_KEY al .env (SAAS.md, sección "Mudar una base existente").
     Los workers quedaron APAGADOS: enciéndelos al cambiar el DNS con
       supervisorctl start 'ecuapos-queue-${SLUG}:*'
EOF
fi
if [[ -z "${PROVIDER_RUC}" ]]; then
cat <<EOF
  - Poner el RUC del proveedor del software en ${APP_DIR}/.env
    (SAAS_SRI_PROVIDER_RUC=) y correr: sudo -u www-data php ${APP_DIR}/artisan config:cache
EOF
fi
cat <<EOF
  - Poner el token de ApiConsult en ${APP_DIR}/.env (APICONSULT_TOKEN=).
  - Apuntar el DNS de ${DOMAIN} a la IP de este servidor y luego activar
    HTTPS con:   certbot --nginx -d ${DOMAIN} --redirect
=============================================================================
EOF
