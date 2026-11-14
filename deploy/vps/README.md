# Despliegue de EcuaPos en un VPS (Ubuntu 24.04)

Guía para instalar EcuaPos en un VPS propio (probado para Hostinger KVM 2:
2 vCPU, 8 GB RAM, 100 GB) y mudar una tienda que hoy corre en cPanel.

| Archivo | Para qué |
|---|---|
| `setup-server.sh` | Prepara el servidor **una sola vez**: Nginx, MySQL 8, PHP 8.3 con SOAP, Composer, Supervisor, firewall. |
| `add-site.sh` | Crea una tienda: código, base de datos, `.env`, Nginx, worker de la cola y cron. |
| `update-site.sh` | Actualiza una tienda (o todas) con lo último de GitHub. |
| `backup.sh` | Respaldo diario de bases de datos, certificados e imágenes. |

Cada tienda (subdominio) es una instalación separada en `/var/www/<dominio>`,
con su propia base de datos y su propio worker de facturación.

---

## 1. Preparar el servidor (una sola vez)

Desde tu PC, entra al VPS:

```bash
ssh root@179.66.136.123
```

Copia los scripts al servidor. Desde tu PC, en la carpeta del proyecto:

```bash
scp deploy/vps/*.sh root@179.66.136.123:/root/
```

En el VPS:

```bash
cd /root && bash setup-server.sh
```

Si el VPS **ya aloja otro proyecto** (por ejemplo YAPA), usa el modo
compartido: no cambia la zona horaria del sistema, no actualiza todo el
sistema ni toca el firewall o la configuración global de Nginx:

```bash
cd /root && SHARED=1 bash setup-server.sh
```

Al terminar muestra la verificación de extensiones (todas deben decir `[ok]`,
en especial **soap** y **openssl**, que usa la facturación electrónica) y una
**llave pública**. Agrégala en GitHub para que el servidor pueda descargar el
repositorio privado:

GitHub → `JhonGuacho97/js-pos-final` → **Settings → Deploy keys → Add deploy key**
→ pega la llave → **sin** marcar "Allow write access".

Instala también el respaldo diario:

```bash
cp /root/backup.sh /usr/local/bin/ecuapos-backup && chmod 750 /usr/local/bin/ecuapos-backup
echo '30 3 * * * root /usr/local/bin/ecuapos-backup >> /var/log/ecuapos-backup.log 2>&1' > /etc/cron.d/ecuapos-backup
```

---

## 2a. Tienda NUEVA

```bash
bash add-site.sh nuevocliente.ecua-pos.com --seed
```

Luego sigue con el paso 3 (token, DNS y HTTPS).

## 2b. Mudar una tienda desde cPanel (ej. jhonsport)

> **Muy importante:** las dos instalaciones nunca deben facturar a la vez.
> Si ambas emiten, pueden repetir el mismo secuencial y el SRI rechazará
> facturas. Haz el cambio en un horario sin ventas y sigue el orden.

### En el VPS: crear el sitio vacío

```bash
bash add-site.sh jhonsport.ecua-pos.com
```

### En cPanel: detener y respaldar

1. **cPanel → Cron Jobs:** desactiva (o borra) el cron de `queue:work`.
2. En la **Terminal de cPanel**, revisa que no queden facturas en cola:

   ```bash
   cd ~/public_html/jhonsport.ecua-pos.com && /usr/local/bin/ea-php82 artisan tinker --execute="echo DB::table('jobs')->count();"
   ```

   Debe decir `0`. Si no, espera a que se procesen o córrelos a mano con el
   comando del cron antes de seguir.
3. Respalda la base y los archivos (usa los datos `DB_DATABASE`,
   `DB_USERNAME` y `DB_PASSWORD` del `.env` de cPanel):

   ```bash
   cd ~/public_html/jhonsport.ecua-pos.com
   mysqldump --single-transaction --no-tablespaces -u USUARIO_DB -p NOMBRE_DB | gzip > ~/jhonsport.sql.gz
   tar -czf ~/jhonsport-files.tar.gz storage/app public/uploads .env
   ```

4. Descarga `jhonsport.sql.gz` y `jhonsport-files.tar.gz` con el
   **Administrador de archivos** de cPanel (están en tu carpeta personal).

### Del PC al VPS

```bash
scp jhonsport.sql.gz jhonsport-files.tar.gz root@179.66.136.123:/root/
```

### En el VPS: importar

```bash
APP=/var/www/jhonsport.ecua-pos.com
DB=$(grep '^DB_DATABASE=' $APP/.env | cut -d= -f2)

# Base de datos
gunzip < /root/jhonsport.sql.gz | mysql "$DB"

# Archivos: certificados de firma, imágenes y el .env viejo (aparte)
mkdir -p /root/migracion && tar -xzf /root/jhonsport-files.tar.gz -C /root/migracion
cp -a /root/migracion/storage/app/. $APP/storage/app/
cp -a /root/migracion/public/uploads/. $APP/public/uploads/
chown -R deploy:www-data $APP/storage $APP/public/uploads
find $APP/storage $APP/public/uploads -type d -exec chmod 2775 {} +
find $APP/storage $APP/public/uploads -type f -exec chmod 664 {} +

# Ver los valores del .env anterior que hay que conservar
grep -E '^(APP_KEY|APICONSULT_TOKEN|SRI_|MAIL_)' /root/migracion/.env
```

Edita el `.env` nuevo y copia esos valores:

```bash
nano $APP/.env
```

- **`APP_KEY` es obligatorio copiarlo igual.** La clave del certificado de
  firma está cifrada con él; con otro `APP_KEY` la factura electrónica deja
  de firmar.
- `APICONSULT_TOKEN` (consulta de cédula/RUC), `MAIL_*` (correos) y
  cualquier `SRI_*` que tuvieras.
- **No** copies `DB_*`, `APP_ENV`, `APP_DEBUG` ni `APP_URL`: los nuevos ya
  están bien.

Aplica migraciones nuevas y reinicia:

```bash
sudo -u www-data php $APP/artisan migrate --force
sudo -u www-data php $APP/artisan optimize:clear
supervisorctl restart ecuapos-queue-jhonsport
rm -rf /root/migracion /root/jhonsport-files.tar.gz   # contiene el .env viejo
```

### Probar antes de cambiar el DNS

En tu PC, abre el Bloc de notas **como administrador**, edita
`C:\Windows\System32\drivers\etc\hosts` y agrega al final:

```
179.66.136.123 jhonsport.ecua-pos.com
```

Entra a `http://jhonsport.ecua-pos.com`: estarás viendo el VPS. Revisa el
login, el POS, que se vean las imágenes y la configuración SRI. **Quita esa
línea del archivo hosts** al terminar.

---

## 3. DNS y HTTPS

0. **El día del cambio**, repite el respaldo de cPanel (base de datos e
   imágenes) justo después de apagar su cron e impórtalo de nuevo en el
   VPS: las ventas hechas en cPanel desde la primera importación no están
   en el VPS. La base del VPS se reemplaza completa:

   ```bash
   DB=$(grep '^DB_DATABASE=' $APP/.env | cut -d= -f2)
   mariadb -e "DROP DATABASE \`$DB\`; CREATE DATABASE \`$DB\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
   gunzip < /root/jhonsport.sql.gz | mariadb "$DB"
   sudo -u www-data php $APP/artisan migrate --force
   ```

1. Donde administres el dominio `ecua-pos.com`, cambia el registro **A** de
   `jhonsport` a `179.66.136.123`. **Ojo con el correo:** si el correo de
   `@jhonsport.ecua-pos.com` vive en cPanel, revisa que el registro **MX**
   no apunte al mismo nombre `jhonsport.ecua-pos.com`, y cambia
   `MAIL_HOST` en el `.env` del VPS por el nombre del servidor de cPanel.
2. Enciende la cola de facturación **solo ahora** (quedó apagada para que
   el VPS y cPanel nunca facturen a la vez):

   ```bash
   supervisorctl start ecuapos-queue-jhonsport
   ```
3. Cuando ya resuelva (puede tardar desde minutos hasta unas horas):

   ```bash
   certbot --nginx -d jhonsport.ecua-pos.com --redirect
   ```

   El certificado se renueva solo.
4. Pon el token de consultas si no lo copiaste: `APICONSULT_TOKEN=` en el `.env`.
5. Haz una venta de prueba con factura y confirma que llegue a **Autorizada**.
6. Cuando todo funcione en el VPS, deja la instalación de cPanel apagada:
   sin el cron y, de preferencia, con el sitio deshabilitado.

---

## Día a día

**Actualizar después de un `git push`:**

```bash
bash /root/update-site.sh jhonsport.ecua-pos.com
bash /root/update-site.sh --all        # todas las tiendas
```

**Ver la cola de facturación:**

```bash
supervisorctl status                                              # worker corriendo
tail -n 50 /var/www/jhonsport.ecua-pos.com/storage/logs/queue-worker.log
sudo -u www-data php /var/www/jhonsport.ecua-pos.com/artisan queue:failed
```

**Logs de errores de la aplicación:**

```bash
ls -t /var/www/jhonsport.ecua-pos.com/storage/logs/ | head
```

**Respaldos:** quedan en `/var/backups/ecuapos/<fecha>/`. Están en el mismo
VPS, así que si el servidor se pierde se pierden con él. Descarga una copia
con regularidad desde tu PC:

```bash
scp -r root@179.66.136.123:/var/backups/ecuapos/ ./respaldos-ecuapos/
```

**Restaurar una base desde el respaldo:**

```bash
gunzip < /var/backups/ecuapos/FECHA/jhonsport.ecua-pos.com.sql.gz | mysql ecuapos_jhonsport
```

---

## Seguridad recomendada

- Agrega tu llave SSH (`ssh-copy-id root@179.66.136.123` desde tu PC) y
  luego desactiva el acceso por contraseña:
  `PasswordAuthentication no` en `/etc/ssh/sshd_config` y
  `systemctl restart ssh`. Hazlo solo después de comprobar que entras con
  la llave.
- El firewall solo deja pasar SSH, HTTP y HTTPS. MySQL no queda expuesto
  a internet.
- `fail2ban` bloquea IPs que intentan adivinar contraseñas por SSH.
- Las actualizaciones de seguridad de Ubuntu se instalan solas.
