#!/usr/bin/env bash
# =============================================================================
# EcuaPos -- preparación inicial del VPS (Ubuntu 24.04 LTS)
#
# Se ejecuta UNA sola vez, como root, en un servidor recién creado:
#   bash setup-server.sh
#
# Instala Nginx, MariaDB, PHP 8.3 (con soap, openssl, gd, zip, intl...),
# Composer, Supervisor, Certbot, firewall y fail2ban. Crea el usuario
# "deploy", dueño del código, con una llave SSH para leer el repositorio
# de GitHub.
# =============================================================================
set -euo pipefail

PHP_VERSION="8.3"
DEPLOY_USER="deploy"
TIMEZONE="America/Guayaquil"

if [[ $EUID -ne 0 ]]; then
    echo "Este script debe ejecutarse como root." >&2
    exit 1
fi

export DEBIAN_FRONTEND=noninteractive
# needrestart en modo "solo listar": nunca reinicia servicios de otros
# proyectos que ya corran en el VPS.
export NEEDRESTART_MODE=l NEEDRESTART_SUSPEND=1

# SHARED=1 si el VPS ya aloja otro proyecto: no cambia la zona horaria del
# sistema, no actualiza todo el sistema, ni toca firewall, fail2ban o la
# configuración global de Nginx.   Uso: SHARED=1 bash setup-server.sh
SHARED="${SHARED:-0}"

apt-get update
if [[ "${SHARED}" != "1" ]]; then
    echo "==> Zona horaria: ${TIMEZONE}"
    timedatectl set-timezone "${TIMEZONE}"
    echo "==> Actualizando el sistema"
    apt-get -y upgrade
fi

echo "==> Instalando paquetes"
# MariaDB: el mismo motor que usa cPanel, así sus respaldos importan sin cambios.
apt-get install -y --no-upgrade \
    nginx mariadb-server git unzip curl ca-certificates openssl \
    supervisor certbot python3-certbot-nginx ufw fail2ban unattended-upgrades \
    "php${PHP_VERSION}-fpm" "php${PHP_VERSION}-cli" "php${PHP_VERSION}-common" \
    "php${PHP_VERSION}-mysql" "php${PHP_VERSION}-soap" "php${PHP_VERSION}-xml" \
    "php${PHP_VERSION}-mbstring" "php${PHP_VERSION}-curl" "php${PHP_VERSION}-zip" \
    "php${PHP_VERSION}-gd" "php${PHP_VERSION}-bcmath" "php${PHP_VERSION}-intl" \
    "php${PHP_VERSION}-opcache"

echo "==> Configurando PHP"
PHP_INI_CONTENT="; EcuaPos
date.timezone = ${TIMEZONE}
memory_limit = 512M
upload_max_filesize = 20M
post_max_size = 25M
max_execution_time = 60
expose_php = Off
opcache.enable = 1
opcache.memory_consumption = 192
opcache.max_accelerated_files = 20000
opcache.validate_timestamps = 1"
echo "${PHP_INI_CONTENT}" > "/etc/php/${PHP_VERSION}/fpm/conf.d/99-ecuapos.ini"
echo "${PHP_INI_CONTENT}" > "/etc/php/${PHP_VERSION}/cli/conf.d/99-ecuapos.ini"
systemctl restart "php${PHP_VERSION}-fpm"

echo "==> Instalando Composer (verificando la firma del instalador)"
EXPECTED_SIG="$(curl -fsSL https://composer.github.io/installer.sig)"
curl -fsSL https://getcomposer.org/installer -o /tmp/composer-setup.php
ACTUAL_SIG="$(php -r "echo hash_file('sha384', '/tmp/composer-setup.php');")"
if [[ "${EXPECTED_SIG}" != "${ACTUAL_SIG}" ]]; then
    echo "La firma del instalador de Composer no coincide. Abortando." >&2
    rm -f /tmp/composer-setup.php
    exit 1
fi
php /tmp/composer-setup.php --quiet --install-dir=/usr/local/bin --filename=composer
rm -f /tmp/composer-setup.php

if [[ "${SHARED}" != "1" ]]; then
    echo "==> Firewall (SSH, HTTP y HTTPS)"
    ufw allow OpenSSH
    ufw allow 'Nginx Full'
    ufw --force enable

    echo "==> fail2ban y actualizaciones de seguridad automáticas"
    systemctl enable --now fail2ban
    dpkg-reconfigure -f noninteractive unattended-upgrades

    echo "==> Nginx: quitar el sitio por defecto"
    rm -f /etc/nginx/sites-enabled/default
    sed -i 's/# server_tokens off;/server_tokens off;/' /etc/nginx/nginx.conf
    nginx -t && systemctl reload nginx
fi

echo "==> Usuario '${DEPLOY_USER}' (dueño del código)"
if ! id "${DEPLOY_USER}" &>/dev/null; then
    adduser --disabled-password --gecos "" "${DEPLOY_USER}"
fi
usermod -aG www-data "${DEPLOY_USER}"

DEPLOY_HOME="/home/${DEPLOY_USER}"
install -d -m 700 -o "${DEPLOY_USER}" -g "${DEPLOY_USER}" "${DEPLOY_HOME}/.ssh"
if [[ ! -f "${DEPLOY_HOME}/.ssh/id_ed25519" ]]; then
    sudo -u "${DEPLOY_USER}" ssh-keygen -t ed25519 -N "" -C "ecuapos-vps-deploy" -f "${DEPLOY_HOME}/.ssh/id_ed25519"
fi
sudo -u "${DEPLOY_USER}" bash -c "ssh-keyscan -t ed25519 github.com >> ~/.ssh/known_hosts 2>/dev/null; sort -u -o ~/.ssh/known_hosts ~/.ssh/known_hosts"

install -d -m 755 /var/www
install -d -m 700 /root/ecuapos-sitios
install -d -m 750 /var/backups/ecuapos

echo
echo "==> Verificación"
php -v | head -1
for ext in soap openssl pdo_mysql mbstring gd zip intl bcmath fileinfo curl; do
    if php -m | grep -qi "^${ext}$"; then echo "   [ok] ${ext}"; else echo "   [FALTA] ${ext}"; fi
done
openssl version
mariadb --version
composer --version

cat <<EOF

=============================================================================
 Servidor listo.

 SIGUIENTE PASO: agrega esta llave como "Deploy key" (solo lectura) en
 GitHub -> repositorio -> Settings -> Deploy keys -> Add deploy key:

$(cat "${DEPLOY_HOME}/.ssh/id_ed25519.pub")

 Luego crea el sitio:
   bash add-site.sh jhonsport.ecua-pos.com
=============================================================================
EOF
