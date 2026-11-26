#!/usr/bin/env bash
# =============================================================================
# EcuaPos -- actualizar un sitio con lo último de GitHub
#
# Uso (como root):
#   bash update-site.sh jhonsport.ecua-pos.com
#   bash update-site.sh --all          # todos los sitios de /var/www
#
# Deja el código igual a GitHub, instala dependencias de producción,
# aplica migraciones nuevas, limpia cachés y
# reinicia el worker de la cola para que tome el código nuevo.
# =============================================================================
set -euo pipefail

DEPLOY_USER="deploy"

if [[ $EUID -ne 0 ]]; then
    echo "Este script debe ejecutarse como root." >&2
    exit 1
fi

update_one() {
    local domain="$1"
    local app_dir="/var/www/${domain}"
    local slug
    slug="$(echo "${domain%%.*}" | tr -c 'a-z0-9\n' '_')"

    if [[ ! -f "${app_dir}/artisan" ]]; then
        echo "No existe una instalación en ${app_dir}" >&2
        return 1
    fi

    echo "=============== ${domain} ==============="
    local before
    before="$(sudo -u "${DEPLOY_USER}" -H git -C "${app_dir}" rev-parse --short HEAD)"

    # vendor/ está versionado en Git y `composer install --no-dev` borra de
    # ahí los paquetes de desarrollo, así que el árbol nunca queda "limpio"
    # y un `git pull` fallaría. En el servidor no se edita código a mano:
    # se alinea exactamente con GitHub. .env, storage/ y public/uploads/
    # no están versionados y no se tocan.
    local branch
    branch="$(sudo -u "${DEPLOY_USER}" -H git -C "${app_dir}" rev-parse --abbrev-ref HEAD)"
    sudo -u "${DEPLOY_USER}" -H git -C "${app_dir}" fetch --quiet origin "${branch}"
    sudo -u "${DEPLOY_USER}" -H git -C "${app_dir}" reset --quiet --hard "origin/${branch}"
    sudo -u "${DEPLOY_USER}" -H bash -c "cd '${app_dir}' && composer install --no-dev --optimize-autoloader --no-interaction"

    # Las migraciones y las cachés corren como www-data, el mismo usuario
    # del sitio y del worker, para que los archivos que generen sigan
    # siendo escribibles por ellos.
    # El estado de los workers se mira ANTES de queue:restart: justo después
    # están reiniciándose (STARTING) y el chequeo los daba por apagados.
    local workers_running=0
    if supervisorctl status "ecuapos-queue-${slug}:*" 2>/dev/null | grep -q RUNNING; then
        workers_running=1
    fi

    sudo -u www-data php "${app_dir}/artisan" migrate --force --no-interaction
    sudo -u www-data php "${app_dir}/artisan" optimize:clear
    sudo -u www-data php "${app_dir}/artisan" view:cache
    sudo -u www-data php "${app_dir}/artisan" queue:restart

    systemctl reload "php8.3-fpm"
    # Solo si ya estaba corriendo: `supervisorctl restart` también ENCIENDE
    # un worker apagado, y durante una mudanza el worker queda apagado a
    # propósito para que este servidor no facture a la vez que el anterior.
    # "nombre:*" sirve con uno o varios workers (numprocs).
    if [[ "${workers_running}" -eq 1 ]]; then
        supervisorctl restart "ecuapos-queue-${slug}:*" >/dev/null
    else
        echo "   Workers ecuapos-queue-${slug} apagados: no se encienden."
    fi

    local after
    after="$(sudo -u "${DEPLOY_USER}" -H git -C "${app_dir}" rev-parse --short HEAD)"
    echo "   ${before} -> ${after}"
}

if [[ "${1:-}" == "--all" ]]; then
    # Solo sitios creados por add-site.sh (tienen su "zz-ecuapos-" en
    # Nginx): otro proyecto Laravel del VPS nunca se toca.
    for dir in /var/www/*/; do
        domain="$(basename "${dir}")"
        [[ -f "${dir}artisan" && -e "/etc/nginx/sites-available/zz-ecuapos-${domain}" ]] \
            && update_one "${domain}"
    done
elif [[ -n "${1:-}" ]]; then
    update_one "$1"
else
    echo "Uso: bash update-site.sh <dominio> | --all" >&2
    exit 1
fi
