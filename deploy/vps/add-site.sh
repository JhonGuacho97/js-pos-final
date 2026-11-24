#!/usr/bin/env bash
# =============================================================================
# EcuaPos -- crear un sitio (una instalación por dominio)
#
# Uso (como root, después de setup-server.sh):
#   bash add-site.sh <dominio> [--seed] [--repo <url-ssh>] [--branch <rama>]
#
#   bash add-site.sh jhonsport.ecua-pos.com
#       Para MUDAR una instalación existente: deja la base vacía, lista para
#       importar el respaldo de cPanel (ver README.md).
#
#   bash add-site.sh nuevocliente.ecua-pos.com --seed
#       Instalación NUEVA: crea las tablas y los datos iniciales.
#
# Crea: código en /var/www/<dominio>, base de datos y usuario MySQL, .env de
# producción, sitio de Nginx, worker de la cola en Supervisor y el cron de
# Laravel. Las credenciales quedan en /root/ecuapos-sitios/<dominio>.txt
# =============================================================================
set -euo pipefail

PHP_VERSION="8.3"
DEPLOY_USER="deploy"
# Repositorio público: se clona por HTTPS sin llave. Si algún día se vuelve
# privado, usa --repo git@github.com:... con la deploy key de setup-server.sh.
REPO="https://github.com/JhonGuacho97/js-pos-final.git"
BRANCH="main"
SEED=0

DOMAIN="${1:-}"
shift || true
while [[ $# -gt 0 ]]; do
    case "$1" in
        --seed)   SEED=1; shift ;;
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
    echo "Uso: bash add-site.sh <dominio> [--seed] [--repo <url>] [--branch <rama>]" >&2
    exit 1
fi

APP_DIR="/var/www/${DOMAIN}"
SLUG="$(echo "${DOMAIN%%.*}" | tr -c 'a-z0-9\n' '_')"
DB_NAME="ecuapos_${SLUG}"
DB_USER="$(echo "ep_${SLUG}" | cut -c1-32)"
DB_PASS="$(openssl rand -base64 32 | tr -dc 'A-Za-z0-9' | cut -c1-32)"
CRED_FILE="/root/ecuapos-sitios/${DOMAIN}.txt"
SUPERVISOR_CONF="/etc/supervisor/conf.d/ecuapos-queue-${SLUG}.conf"
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

if [[ "${SEED}" -eq 1 ]]; then
    echo "==> Instalación nueva: migraciones y datos iniciales"
    as_web php "${APP_DIR}/artisan" migrate --seed --force --no-interaction
fi

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
        fastcgi_pass unix:/run/php/php${PHP_VERSION}-fpm.sock;
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
command=/usr/bin/php ${APP_DIR}/artisan queue:work database --sleep=3 --tries=6 --timeout=80 --max-time=3600
directory=${APP_DIR}
user=www-data
numprocs=1
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
Worker cola:    ecuapos-queue-${SLUG}  (supervisorctl status)
Creado:         $(date '+%Y-%m-%d %H:%M')
CRED
chmod 600 "${CRED_FILE}"

cat <<EOF

=============================================================================
 Sitio ${DOMAIN} creado. Credenciales en ${CRED_FILE}

 Falta:
EOF
if [[ "${SEED}" -eq 0 ]]; then
cat <<EOF
  1. Importar la base y los archivos del servidor anterior, y copiar su
     APP_KEY al .env (README.md, sección "Mudar una tienda desde cPanel").
     El worker de la cola quedó APAGADO: enciéndelo al cambiar el DNS con
       supervisorctl start ecuapos-queue-${SLUG}
EOF
fi
cat <<EOF
  - Poner el token de ApiConsult en ${APP_DIR}/.env (APICONSULT_TOKEN=).
  - Apuntar el DNS de ${DOMAIN} a la IP de este servidor y luego activar
    HTTPS con:   certbot --nginx -d ${DOMAIN} --redirect
=============================================================================
EOF
