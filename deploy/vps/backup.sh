#!/usr/bin/env bash
# =============================================================================
# EcuaPos -- respaldo diario de todas las tiendas
#
# Por cada sitio en /var/www guarda en /var/backups/ecuapos/<fecha>/:
#   - <dominio>.sql.gz        la base de datos completa
#   - <dominio>-files.tar.gz  certificados de firma (storage/app),
#                             imágenes (public/uploads) y el .env
# Conserva los últimos KEEP_DAYS días.
#
# Instalar (como root):
#   cp backup.sh /usr/local/bin/ecuapos-backup && chmod 750 /usr/local/bin/ecuapos-backup
#   echo '30 3 * * * root /usr/local/bin/ecuapos-backup >> /var/log/ecuapos-backup.log 2>&1' > /etc/cron.d/ecuapos-backup
#
# IMPORTANTE: este respaldo vive en el mismo VPS. Descárgalo o cópialo a
# otro lugar con regularidad (ver README.md).
# =============================================================================
set -euo pipefail

KEEP_DAYS=14
DEST="/var/backups/ecuapos/$(date +%F)"
umask 077
mkdir -p "${DEST}"

for dir in /var/www/*/; do
    [[ -f "${dir}artisan" && -f "${dir}.env" ]] || continue
    domain="$(basename "${dir}")"
    # Solo sitios de EcuaPos (creados por add-site.sh); otros proyectos del
    # VPS tienen sus propios respaldos.
    [[ -e "/etc/nginx/sites-available/zz-ecuapos-${domain}" ]] || continue
    db="$(grep -E '^DB_DATABASE=' "${dir}.env" | cut -d= -f2- | tr -d '"')"

    echo "[$(date '+%F %T')] ${domain}: base ${db}"
    mysqldump --single-transaction --quick --routines --triggers --no-tablespaces "${db}" \
        | gzip -9 > "${DEST}/${domain}.sql.gz"

    echo "[$(date '+%F %T')] ${domain}: archivos"
    tar -czf "${DEST}/${domain}-files.tar.gz" -C "${dir}" \
        --ignore-failed-read storage/app public/uploads .env
done

find /var/backups/ecuapos -mindepth 1 -maxdepth 1 -type d -mtime "+${KEEP_DAYS}" -exec rm -rf {} +
echo "[$(date '+%F %T')] Respaldo terminado en ${DEST}"
