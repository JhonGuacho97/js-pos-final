# 🧾 POS System (Laravel + React)

Sistema de Punto de Venta (POS) desarrollado con **Laravel (backend)** y **React (frontend)**.

---

## 🚀 Requisitos previos

Antes de ejecutar el proyecto, asegúrate de tener instalado:

- PHP >= 8.x
- Laravel 10
- Composer  
- Node.js y npm  
- MySQL o MariaDB  
- Servidor local (XAMPP, Laragon, etc.)

---

## ⚙️ Instalación

Sigue estos pasos para levantar el proyecto en tu entorno local:

### 1. Instalar dependencias de Laravel
composer install

### 2. Configurar variables de entorno
Copia el archivo .env.example y renómbralo a .env:
Configura la conexión a la base de datos en el archivo .env:

### 3. Importar la base de datos

**Solo para entorno LOCAL de desarrollo.** Dirígete a la carpeta `/database`
e importa el archivo `pos.sql`.

⚠️ **No importes `pos.sql` en producción.** Es un dump de datos de
demostración/desarrollo e incluye un usuario `admin@infy-pos.com` con una
contraseña de ejemplo conocida. En producción usa en su lugar:

```bash
php artisan migrate --seed
```

Esto crea el esquema desde cero y genera un usuario admin con una
contraseña aleatoria (impresa una única vez en la consola al correr el
seeder — guárdala en ese momento, no se vuelve a mostrar, y cámbiala
después del primer login).

### 4. Instalar dependencias de Node.js
npm install

### 5. Levantar el proyecto
npm run dev

---

## 🚀 Despliegue en producción (checklist mínimo)

- `php artisan key:generate` en el `.env` real de producción — nunca
  reutilizar el `APP_KEY` de `.env.example`.
- `php artisan migrate --seed` (no importar `pos.sql`).
- `QUEUE_CONNECTION=database` (no `sync`) + cron para `php artisan queue:work`,
  necesario para que la facturación electrónica SRI funcione de forma
  asíncrona y no bloquee el request del usuario.
- Configurar explícitamente el ambiente del SRI (pruebas vs. producción)
  antes de emitir el primer comprobante real.
- `composer install --no-dev --optimize-autoloader`, `php artisan config:cache`,
  `route:cache`.
- Verificar permisos de escritura en `storage/` y `bootstrap/cache/`.
- Restringir `config/cors.php` al dominio real de producción.

### Tecnologías usadas
Laravel
React
MySQL
Node.js


### DESARROLLADOR
JHON DAVID GUACHO BASTIDAS
LICENCIA PATENTADA