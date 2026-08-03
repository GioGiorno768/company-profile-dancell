# 🚀 Panduan Setup VPS Tahap 2 — Deploy MySQL, Redis & Project Dancell

> **Prasyarat**: Tahap 1 (Server Hardening, Docker, & Nginx Proxy Manager) sudah **selesai & berjalan**.  
> **Tujuan Akhir Tahap Ini**: Project Dancell jalan live di VPS, dilayani lewat Docker, terhubung ke MySQL & Redis, dan bisa diakses publik via domain + SSL gratis.  
> **Waktu Estimasi**: ~25 - 35 menit

---

## 📋 Overview Alur Tahap Kedua

```
Step 1  →  Buat Docker Network (Jembatan Komunikasi Antar Container)
Step 2  →  Deploy MySQL 8.0 Container (Database Engine)
Step 3  →  Deploy Redis 7 Container (Cache & Session Engine)
Step 4  →  Buat Database & User MySQL Khusus Dancell
Step 5  →  Clone Project Dancell dari GitHub
Step 6  →  Buat Dockerfile untuk Dancell (PHP + Nginx + Node Build)
Step 7  →  Buat docker-compose.yml untuk Dancell
Step 8  →  Konfigurasi .env Production
Step 9  →  Build & Start Semua Container Dancell
Step 10 →  Jalankan Migration & Seeder
Step 11 →  Hubungkan Domain di Nginx Proxy Manager + SSL Gratis
Step 12 →  Verifikasi Deployment & Final Check
```

---

## 🏗️ Arsitektur yang Akan Kita Bangun

```
                    ┌─────────────────────────────────────────────┐
   Internet         │            Nginx Proxy Manager              │
   (Pengunjung)  →  │  Port 80/443  →  Reverse Proxy + SSL       │
                    └──────────────┬──────────────────────────────┘
                                   │
                    ┌──────────────▼──────────────────────────────┐
                    │        Docker Network: dancell-net           │
                    │                                              │
                    │  ┌──────────┐ ┌───────┐ ┌────────────────┐  │
                    │  │  MySQL   │ │ Redis │ │ Dancell App    │  │
                    │  │  :3306   │ │ :6379 │ │ PHP+Nginx:8080 │  │
                    │  └──────────┘ └───────┘ └────────────────┘  │
                    └─────────────────────────────────────────────┘
```

> [!NOTE]
> Semua service saling berkomunikasi **di dalam Docker Network internal** (`dancell-net`). Port 3306 (MySQL) dan 6379 (Redis) **TIDAK** dibuka ke internet — hanya bisa diakses sesama container di dalam network yang sama.

---

## Step 1: Buat Docker Network

Docker Network adalah "jalan tol internal" yang menghubungkan semua container agar bisa saling berkomunikasi menggunakan nama container sebagai hostname (bukan IP).

```bash
docker network create dancell-net
```

**Verifikasi network berhasil dibuat:**

```bash
docker network ls
```

> Output yang diharapkan (ada `dancell-net` di daftar):
> ```
> NETWORK ID     NAME          DRIVER    SCOPE
> xxxxxxxxxxxx   bridge        bridge    local
> xxxxxxxxxxxx   dancell-net   bridge    local
> xxxxxxxxxxxx   host          host      local
> ```

**Hubungkan Nginx Proxy Manager ke network ini:**

NPM harus terhubung ke network `dancell-net` supaya bisa meneruskan traffic ke container Dancell nanti.

```bash
docker network connect dancell-net nginx-proxy-manager
```

> [!NOTE]
> Perintah di atas menghubungkan container NPM yang sudah jalan ke network `dancell-net` tanpa perlu restart NPM.

---

## Step 2: Deploy MySQL 8.0 Container

MySQL adalah database utama yang menyimpan semua data Dancell (cabang, settings, user admin, dll).

**Buat folder untuk data MySQL:**

```bash
sudo mkdir -p /opt/databases/mysql-data
sudo chown -R dancell:dancell /opt/databases
```

**Buat file docker-compose untuk shared databases:**

```bash
nano /opt/databases/docker-compose.yml
```

**Paste konfigurasi berikut:**

```yaml
services:
  mysql:
    image: mysql:8.0
    container_name: shared-mysql
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD: DancellSuperSecureRoot2026!
    ports:
      - '127.0.0.1:3306:3306'
    volumes:
      - ./mysql-data:/var/lib/mysql
    networks:
      - dancell-net
    command: --default-authentication-plugin=mysql_native_password

  redis:
    image: redis:7-alpine
    container_name: shared-redis
    restart: unless-stopped
    command: redis-server --requirepass DancellRedisPass2026!
    ports:
      - '127.0.0.1:6379:6379'
    volumes:
      - ./redis-data:/data
    networks:
      - dancell-net

networks:
  dancell-net:
    external: true
```

> **Penjelasan penting:**
> - `MYSQL_ROOT_PASSWORD` → Password root MySQL. **WAJIB GANTI** dengan password lu sendiri yang kuat!
> - `--requirepass` → Password Redis. **WAJIB GANTI** juga!
> - `127.0.0.1:3306:3306` → Port MySQL **hanya bisa diakses dari dalam server** (localhost). Hacker dari internet tidak bisa konek!
> - `networks: dancell-net` → Kedua service terhubung ke network yang sama.
> - `volumes` → Data database disimpan di folder lokal, jadi data tidak hilang walau container di-restart.

**Simpan file** (`Ctrl + O`, Enter, `Ctrl + X`).

**Jalankan MySQL & Redis:**

```bash
cd /opt/databases
docker compose up -d
```

> Tunggu sampai muncul:
> ```
> ✔ Container shared-mysql   Started
> ✔ Container shared-redis   Started
> ```

**Verifikasi kedua container berjalan:**

```bash
docker ps
```

> Output yang diharapkan (3 container berjalan: NPM + MySQL + Redis):
> ```
> CONTAINER ID   IMAGE                             STATUS         NAMES
> xxxxxxxxxxxx   jc21/nginx-proxy-manager:latest   Up X hours     nginx-proxy-manager
> xxxxxxxxxxxx   mysql:8.0                         Up X seconds   shared-mysql
> xxxxxxxxxxxx   redis:7-alpine                    Up X seconds   shared-redis
> ```

---

## Step 3: Verifikasi MySQL & Redis Berjalan

**Test koneksi MySQL:**

```bash
docker exec -it shared-mysql mysql -u root -p
```

> Ketik password root MySQL yang lu set tadi (`DancellSuperSecureRoot2026!` atau yang lu ganti). Kalau muncul prompt `mysql>`, artinya MySQL **berhasil & siap!** Ketik `exit` untuk keluar.

**Test koneksi Redis:**

```bash
docker exec -it shared-redis redis-cli -a DancellRedisPass2026!
```

> Kalau muncul prompt `127.0.0.1:6379>`, ketik `PING`. Kalau dijawab `PONG`, Redis **berhasil & siap!** Ketik `exit` untuk keluar.

---

## Step 4: Buat Database & User MySQL Khusus Dancell

> [!IMPORTANT]
> Jangan pernah pakai user `root` MySQL untuk koneksi aplikasi! Kita buat user khusus yang hanya punya akses ke database Dancell saja. Ini penting untuk keamanan, terutama saat nanti ada vendor yang juga pakai MySQL yang sama.

**Masuk ke MySQL:**

```bash
docker exec -it shared-mysql mysql -u root -p
```

*(Masukkan password root MySQL lu)*

**Jalankan perintah SQL berikut satu per satu di dalam prompt `mysql>`:**

```sql
CREATE DATABASE dancell_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```
> Membuat database baru bernama `dancell_db` dengan encoding UTF-8 penuh (mendukung emoji & karakter Indonesia).

```sql
CREATE USER 'dancell_user'@'%' IDENTIFIED BY 'DancellDbPass2026!';
```
> Membuat user MySQL baru bernama `dancell_user`. **GANTI PASSWORD** `DancellDbPass2026!` dengan password lu sendiri yang kuat!

```sql
GRANT ALL PRIVILEGES ON dancell_db.* TO 'dancell_user'@'%';
```
> Memberikan user `dancell_user` akses penuh **HANYA** ke database `dancell_db`. User ini tidak bisa menyentuh database milik vendor nanti.

```sql
FLUSH PRIVILEGES;
```
> Mengaktifkan semua perubahan hak akses.

```sql
exit
```
> Keluar dari prompt MySQL.

**Verifikasi user baru bisa login:**

```bash
docker exec -it shared-mysql mysql -u dancell_user -p dancell_db
```

*(Masukkan password `dancell_user` yang lu buat tadi)*

> Kalau muncul prompt `mysql>`, artinya user & database **berhasil dibuat!** Ketik `exit`.

---

## Step 5: Clone Project Dancell dari GitHub

**Buat folder project:**

```bash
sudo mkdir -p /var/www/dancell
sudo chown -R dancell:dancell /var/www/dancell
```

**Clone repository:**

```bash
cd /var/www/dancell
git clone https://github.com/GioGiorno768/company-profile-dancell.git .
```

> [!NOTE]
> Tanda titik (`.`) di akhir perintah `git clone` artinya clone langsung ke dalam folder saat ini (`/var/www/dancell`), tanpa membuat subfolder tambahan.

> Kalau repository lu **private**, lu perlu setup GitHub Personal Access Token atau Deploy Key dulu. Jalankan:
> ```bash
> git clone https://USERNAME:GITHUB_TOKEN@github.com/GioGiorno768/company-profile-dancell.git .
> ```
> Ganti `USERNAME` dengan username GitHub lu dan `GITHUB_TOKEN` dengan token yang lu buat di GitHub Settings → Developer settings → Personal access tokens.

**Verifikasi file ter-clone:**

```bash
ls -la
```

> Harus muncul file-file Laravel seperti `artisan`, `composer.json`, `package.json`, folder `app/`, `resources/`, dll.

---

## Step 6: Buat Dockerfile untuk Dancell

Dockerfile adalah "resep" yang memberitahu Docker cara membangun environment untuk project Dancell. Di dalamnya kita akan:
1. Install PHP 8.3 + semua extension yang dibutuhkan Laravel.
2. Install Composer.
3. Install Node.js 22 + build frontend assets (Vite + React).
4. Konfigurasi Nginx internal container.

```bash
nano /var/www/dancell/Dockerfile
```

**Paste seluruh isi berikut:**

```dockerfile
# ============================================
# STAGE 1: Build Frontend Assets (Node.js)
# ============================================
FROM node:22-alpine AS frontend-builder

WORKDIR /app

# Copy package files dulu (supaya Docker bisa cache layer ini)
COPY package.json package-lock.json ./

# Install Node dependencies
RUN npm ci

# Copy seluruh source code project
COPY . .

# Build production assets (Vite + React/Inertia)
RUN npm run build


# ============================================
# STAGE 2: PHP Application + Nginx
# ============================================
FROM php:8.3-fpm-alpine

# Install system dependencies
RUN apk add --no-cache \
    nginx \
    supervisor \
    curl \
    zip \
    unzip \
    git \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    libzip-dev \
    icu-dev \
    oniguruma-dev \
    linux-headers

# Install PHP extensions yang dibutuhkan Laravel
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
    pdo_mysql \
    mbstring \
    exif \
    pcntl \
    bcmath \
    gd \
    zip \
    intl \
    opcache

# Install Redis PHP extension
RUN apk add --no-cache --virtual .build-deps $PHPIZE_DEPS \
    && pecl install redis \
    && docker-php-ext-enable redis \
    && apk del .build-deps

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copy composer files dulu (cache layer)
COPY composer.json composer.lock ./

# Install PHP dependencies (tanpa dev dependencies)
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist

# Copy seluruh source code
COPY . .

# Copy built frontend assets dari Stage 1
COPY --from=frontend-builder /app/public/build ./public/build

# Generate autoloader & optimize
RUN composer dump-autoload --optimize \
    && php artisan config:clear \
    && php artisan route:clear \
    && php artisan view:clear

# Set permissions untuk Laravel storage & cache
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# ============================================
# Nginx Configuration (Internal Container)
# ============================================
RUN rm -f /etc/nginx/http.d/default.conf

COPY <<'NGINX' /etc/nginx/http.d/dancell.conf
server {
    listen 8080;
    server_name _;
    root /var/www/html/public;
    index index.php;

    client_max_body_size 50M;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass 127.0.0.1:9000;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
        fastcgi_hide_header X-Powered-By;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
NGINX

# ============================================
# Supervisor (Menjalankan PHP-FPM + Nginx)
# ============================================
COPY <<'SUPERVISOR' /etc/supervisor/conf.d/dancell.conf
[supervisord]
nodaemon=true
user=root

[program:php-fpm]
command=php-fpm -F
autostart=true
autorestart=true
stdout_logfile=/dev/stdout
stdout_logfile_maxbytes=0
stderr_logfile=/dev/stderr
stderr_logfile_maxbytes=0

[program:nginx]
command=nginx -g 'daemon off;'
autostart=true
autorestart=true
stdout_logfile=/dev/stdout
stdout_logfile_maxbytes=0
stderr_logfile=/dev/stderr
stderr_logfile_maxbytes=0
SUPERVISOR

# Buat folder supervisor
RUN mkdir -p /etc/supervisor/conf.d

EXPOSE 8080

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/dancell.conf"]
```

**Simpan file** (`Ctrl + O`, Enter, `Ctrl + X`).

> **Penjelasan Arsitektur Dockerfile:**
> - **Stage 1 (frontend-builder)**: Menggunakan Node.js 22 untuk menjalankan `npm run build` yang mengcompile React/Inertia + Vite menjadi file static production di folder `public/build/`.
> - **Stage 2 (app)**: Menggunakan PHP 8.3-FPM + Nginx Alpine (image super ringan ~50MB). PHP-FPM menjalankan kode Laravel, sedangkan Nginx melayani file static dan meneruskan request PHP.
> - **Supervisor**: Menjalankan PHP-FPM dan Nginx secara bersamaan di dalam satu container.
> - **Port 8080**: Container mendengarkan di port ini. NPM akan meneruskan traffic dari port 80/443 ke sini.

---

## Step 7: Buat docker-compose.yml untuk Dancell

```bash
nano /var/www/dancell/docker-compose.yml
```

**Paste konfigurasi berikut:**

```yaml
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: dancell-app
    restart: unless-stopped
    env_file:
      - .env
    volumes:
      - ./storage:/var/www/html/storage
    depends_on:
      - mysql-ready
    networks:
      - dancell-net

  # Helper: tunggu MySQL siap sebelum app start
  mysql-ready:
    image: busybox
    container_name: dancell-mysql-check
    command: >
      sh -c "echo 'Waiting for MySQL...' && sleep 5 && echo 'MySQL should be ready!'"
    networks:
      - dancell-net

networks:
  dancell-net:
    external: true
```

**Simpan file** (`Ctrl + O`, Enter, `Ctrl + X`).

> **Penjelasan:**
> - `build: .` → Docker akan membaca `Dockerfile` di folder yang sama untuk membangun image.
> - `env_file: .env` → Menggunakan file `.env` Laravel sebagai environment variables.
> - `volumes: ./storage` → Folder `storage/` di-mount supaya file upload, log, dan cache tidak hilang saat container di-rebuild.
> - `networks: dancell-net` → Terhubung ke network yang sama dengan MySQL & Redis.

---

## Step 8: Konfigurasi .env Production

**Copy file .env.example menjadi .env:**

```bash
cd /var/www/dancell
cp .env.example .env
```

**Edit file .env:**

```bash
nano .env
```

**Ubah baris-baris berikut sesuai environment production:**

```ini
APP_NAME="Dancell Company Profile"
APP_ENV=production
APP_KEY=
APP_DEBUG=false
APP_URL=https://namadomain-lu.com

# Database — sambungkan ke container MySQL via nama container
DB_CONNECTION=mysql
DB_HOST=shared-mysql
DB_PORT=3306
DB_DATABASE=dancell_db
DB_USERNAME=dancell_user
DB_PASSWORD=DancellDbPass2026!

# Redis — sambungkan ke container Redis via nama container
CACHE_STORE=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis
REDIS_CLIENT=phpredis
REDIS_HOST=shared-redis
REDIS_PASSWORD=DancellRedisPass2026!
REDIS_PORT=6379

# Session
SESSION_LIFETIME=120
SESSION_ENCRYPT=false
```

> [!IMPORTANT]
> **Perhatikan `DB_HOST` dan `REDIS_HOST`!**
> - Kita TIDAK menggunakan `127.0.0.1` atau `localhost`.
> - Kita menggunakan **nama container Docker** (`shared-mysql` dan `shared-redis`).
> - Ini karena di dalam Docker Network, container berkomunikasi menggunakan nama container sebagai hostname, bukan IP address. Docker secara otomatis mengurus DNS resolution-nya.

> [!WARNING]
> **Ganti semua password** (`DB_PASSWORD`, `REDIS_PASSWORD`) dengan password yang sama persis dengan yang lu set di Step 2 & Step 4!

**Simpan file** (`Ctrl + O`, Enter, `Ctrl + X`).

---

## Step 9: Build & Start Container Dancell

Sekarang saatnya Docker membangun image dari Dockerfile dan menjalankan container Dancell!

```bash
cd /var/www/dancell
docker compose up -d --build
```

> **Penjelasan flag:**
> - `--build` → Paksa Docker untuk rebuild image dari Dockerfile (penting untuk pertama kali).
> - `-d` → Detached mode (jalan di background).

> [!NOTE]
> **Proses pertama kali akan memakan waktu 3-8 menit** karena Docker harus:
> 1. Download base image PHP 8.3 + Node.js 22.
> 2. Install semua PHP extensions.
> 3. Jalankan `composer install`.
> 4. Jalankan `npm ci && npm run build`.
>
> Build selanjutnya akan **jauh lebih cepat** (~30 detik) karena Docker meng-cache layer yang tidak berubah.

**Pantau proses build secara realtime (opsional):**

```bash
docker compose logs -f app
```

*(Tekan `Ctrl + C` untuk berhenti melihat log)*

**Verifikasi container berjalan:**

```bash
docker ps
```

> Output yang diharapkan (4 container berjalan):
> ```
> CONTAINER ID   IMAGE                             STATUS         NAMES
> xxxxxxxxxxxx   jc21/nginx-proxy-manager:latest   Up X hours     nginx-proxy-manager
> xxxxxxxxxxxx   mysql:8.0                         Up X minutes   shared-mysql
> xxxxxxxxxxxx   redis:7-alpine                    Up X minutes   shared-redis
> xxxxxxxxxxxx   dancell-app                       Up X seconds   dancell-app
> ```

---

## Step 10: Generate App Key, Jalankan Migration & Seeder

**Generate Laravel Application Key:**

```bash
docker exec dancell-app php artisan key:generate
```

> Perintah ini menghasilkan `APP_KEY` enkripsi unik yang disimpan otomatis ke file `.env`.

**Jalankan Database Migration:**

```bash
docker exec dancell-app php artisan migrate --seed
```

> Perintah ini membuat semua tabel di database MySQL (`hero_settings`, `branches`, `footer_settings`, dll) dan mengisi data awal dari seeder.

> Kalau muncul pertanyaan `Are you sure you want to run this command?`, ketik `yes` lalu Enter.

**Verifikasi migration berhasil:**

```bash
docker exec dancell-app php artisan migrate:status
```

> Semua baris harus menunjukkan status `Ran` atau `✓`.

**Optimize untuk production:**

```bash
docker exec dancell-app php artisan optimize
```

> Perintah ini meng-cache konfigurasi, routes, dan views untuk performa maksimal di production.

---

## Step 11: Hubungkan Domain di Nginx Proxy Manager + SSL Gratis

### A. Pointing DNS Domain ke IP VPS

Sebelum setup di NPM, lu harus mengarahkan domain lu ke IP VPS dulu di **DNS provider** (tempat lu beli domain: Niagahoster, Cloudflare, Namecheap, dll):

| Type | Name | Value | TTL |
|---|---|---|---|
| `A` | `@` | `IP_VPS_LU` | Auto |
| `A` | `www` | `IP_VPS_LU` | Auto |

> Tunggu propagasi DNS selesai (biasanya 5-30 menit). Lu bisa cek di [dnschecker.org](https://dnschecker.org).

### B. Setup Proxy Host di Nginx Proxy Manager

1. **Buka Dashboard NPM** di browser: `http://IP_VPS_LU:81`
2. Login dengan email & password yang sudah lu ganti di Tahap 1.
3. Klik menu **"Proxy Hosts"** di sidebar kiri.
4. Klik tombol **"Add Proxy Host"**.

**Tab "Details" — isi seperti berikut:**

| Field | Value |
|---|---|
| **Domain Names** | `namadomain-lu.com` (tekan Enter), tambahkan juga `www.namadomain-lu.com` |
| **Scheme** | `http` |
| **Forward Hostname / IP** | `dancell-app` |
| **Forward Port** | `8080` |
| **Cache Assets** | ✅ Centang |
| **Block Common Exploits** | ✅ Centang |
| **Websockets Support** | ❌ Tidak perlu |

> [!IMPORTANT]
> Di kolom **Forward Hostname / IP**, kita menggunakan **nama container Docker** (`dancell-app`), BUKAN IP address! Ini bisa dilakukan karena NPM sudah kita hubungkan ke network `dancell-net` di Step 1.

**Tab "SSL" — aktifkan HTTPS gratis:**

| Field | Value |
|---|---|
| **SSL Certificate** | Pilih `Request a new SSL Certificate` |
| **Force SSL** | ✅ Centang |
| **HTTP/2 Support** | ✅ Centang |
| **Email Address for Let's Encrypt** | Isi email aktif lu |
| **I Agree to the Let's Encrypt Terms** | ✅ Centang |

5. Klik **Save**.

> NPM akan otomatis meminta sertifikat SSL dari Let's Encrypt (gratis!) dan mengaktifkan HTTPS. Proses ini memakan waktu sekitar 30 detik.

---

## Step 12: Verifikasi Deployment & Final Check

### A. Buka Website di Browser

Buka domain lu di browser:

```
https://namadomain-lu.com
```

> Landing page Dancell dengan Hero Section, Visi & Misi, History Timeline, Brand Partners, Branch Network, dan Footer harus tampil sempurna! 🎉

### B. Test Admin Panel

Buka halaman login admin:

```
https://namadomain-lu.com/login
```

> Login dengan kredensial default:
> - **Email**: `admin@dancell.id`
> - **Password**: `password`

### C. Verifikasi Semua Service di Terminal

```bash
echo "=== Docker Containers ==="
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo ""
echo "=== MySQL Connection ==="
docker exec dancell-app php artisan db:show 2>/dev/null | head -5 || echo "OK"
echo ""
echo "=== Redis Connection ==="
docker exec dancell-app php artisan cache:clear && echo "Redis OK!"
echo ""
echo "=== Disk & Memory ==="
df -h / | tail -1
free -h | grep Mem
```

---

## 🛠️ Perintah Berguna Sehari-hari

Setelah deployment selesai, berikut beberapa perintah yang akan sering lu gunakan:

### Melihat Log Aplikasi
```bash
# Log Laravel (error & info)
docker exec dancell-app tail -f storage/logs/laravel.log

# Log container Docker (Nginx + PHP-FPM)
docker compose -f /var/www/dancell/docker-compose.yml logs -f app
```

### Update / Re-deploy Setelah Push Kode Baru
```bash
cd /var/www/dancell
git pull origin main
docker compose up -d --build
docker exec dancell-app php artisan migrate --force
docker exec dancell-app php artisan optimize
```

### Restart Container Tanpa Rebuild
```bash
docker compose -f /var/www/dancell/docker-compose.yml restart
```

### Masuk ke Shell Container (Debugging)
```bash
docker exec -it dancell-app sh
```

### Backup Database
```bash
docker exec shared-mysql mysqldump -u dancell_user -p dancell_db > ~/backup_dancell_$(date +%Y%m%d).sql
```

---

## ✅ Checklist Akhir Tahap Kedua

| No | Item | Status |
|---|---|---|
| 1 | Docker Network `dancell-net` dibuat | ☐ |
| 2 | MySQL 8.0 container berjalan (`shared-mysql`) | ☐ |
| 3 | Redis 7 container berjalan (`shared-redis`) | ☐ |
| 4 | Database `dancell_db` & user `dancell_user` dibuat | ☐ |
| 5 | Project Dancell ter-clone di `/var/www/dancell` | ☐ |
| 6 | Dockerfile & docker-compose.yml dibuat | ☐ |
| 7 | File `.env` dikonfigurasi untuk production | ☐ |
| 8 | Container `dancell-app` berhasil di-build & berjalan | ☐ |
| 9 | `php artisan migrate --seed` berhasil | ☐ |
| 10 | Domain pointing ke IP VPS (DNS A Record) | ☐ |
| 11 | Proxy Host di NPM terkonfigurasi | ☐ |
| 12 | SSL HTTPS aktif (Let's Encrypt) | ☐ |
| 13 | Landing page tampil di browser | ☐ |
| 14 | Admin panel bisa login | ☐ |

---

## 🔜 Tahap Selanjutnya

Setelah tahap 2 ini selesai:
1. **Tahap 3**: Setup User & Folder Terisolasi untuk Vendor (buat user SSH terbatas, database terpisah, container terpisah).
2. **Tahap 4**: Setup Automated Backup (backup database & file secara otomatis ke cloud storage).
3. **Tahap 5**: Monitoring & Alerting (notifikasi kalau server down atau disk penuh).
