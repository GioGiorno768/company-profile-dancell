# 🔄 Panduan Setup VPS Tahap 6 (v2) — CI/CD Auto Deploy + Testing (Optimized)

> **Prasyarat**: Tahap 1–5 sudah selesai, project Dancell sudah live di VPS.
> **Tujuan Akhir Tahap Ini**: Setiap kali lu `git push` ke branch `main`, GitHub Actions akan **otomatis menjalankan test**, **build Docker image di cloud**, **push ke GitHub Container Registry (GHCR)**, dan kalau semua berhasil, **otomatis deploy ke VPS** — VPS lu **TIDAK perlu build apa-apa**. Ditambah **notifikasi Telegram** ke HP lu di setiap tahapan.
> **Waktu Estimasi**: ~30 - 45 menit
> **Biaya**: **100% GRATIS** (GitHub Free = 2.000 menit Actions/bulan + GHCR storage gratis)
> **VPS Specs**: 2 vCPU, 4GB RAM, 80GB SSD

> [!IMPORTANT]
> **Ini adalah versi v2 (revisi) dari guide CI/CD.** Perbedaan utama dengan v1:
> 1. ✅ **Docker image di-build di GitHub Actions** (server cloud gratis, 7GB RAM) — **bukan di VPS lu yang cuma 4GB**.
> 2. ✅ **Image di-push ke GHCR** — VPS cuma `docker pull` image jadi, super ringan.
> 3. ✅ **Swap File** ditambahkan sebagai safety net memory.
> 4. ✅ **Volume mount** untuk `public/uploads` — file upload user **gak hilang** saat deploy ulang.
> 5. ✅ **Auto-fix permissions** — error 500 upload file **gak bakal balik lagi**.
> 6. ✅ **Troubleshooting & FAQ** ditambahkan di akhir guide.

---

## 📋 Overview Alur Tahap Keenam (v2)

```
Step 0  →  Setup Swap File 4GB (Safety Net Memory)
Step 1  →  Buat SSH Deploy Key Khusus GitHub Actions
Step 2  →  Setup GitHub Secrets (Credential Terenkripsi)
Step 3  →  Setup GHCR & Git Access di VPS (One-Time Auth)
Step 4  →  Buat File .dockerignore (Optimasi Build)
Step 5  →  Pastikan Dockerfile Ada di Repository
Step 6  →  Update docker-compose.yml (GHCR Image + Volume Mount)
Step 7  →  Buat Test PHPUnit Dasar (Landing Page, Admin, Database)
Step 8  →  Buat Workflow CI/CD (GitHub Actions + GHCR Build + Deploy)
Step 9  →  Setup Branch Protection Rules (Opsional)
Step 10 →  Test Full Pipeline End-to-End
Step 11 →  Verifikasi & Cheat Sheet
Bonus   →  Troubleshooting & FAQ
```

---

## 🏗️ Arsitektur CI/CD yang Akan Kita Bangun

```
  Lu Push ke GitHub (main branch)
           │
           ▼
  ┌──────────────────────────────────────────────────────────────┐
  │              GITHUB ACTIONS (Cloud Server Gratis)            │
  │                     7GB RAM, Multi-Core                      │
  │                                                              │
  │  ┌────────────────────────────────────────────────────┐      │
  │  │  JOB 1: 🧪 TESTING (CI)                           │      │
  │  │  └── Setup PHP 8.3 + Node 22                      │      │
  │  │  └── composer install                              │      │
  │  │  └── npm ci && npm run build                       │      │
  │  │  └── php artisan test                              │      │
  │  │  │                                                 │      │
  │  │  └── ❌ GAGAL → Stop! Kirim alert Telegram        │      │
  │  │  └── ✅ LULUS → Lanjut ke Job 2                   │      │
  │  └────────────────────────────────────────────────────┘      │
  │                         │                                    │
  │  ┌──────────────────────▼─────────────────────────────┐      │
  │  │  JOB 2: 🏗️ BUILD & 🚀 DEPLOY                     │      │
  │  │  └── docker build (Multi-stage: Node + PHP)        │      │
  │  │  └── docker push ke GHCR ☁️                        │      │
  │  │  │        (ghcr.io/giogiorno768/dancell-app)       │      │
  │  │  └── SSH ke VPS:                                   │      │
  │  │       └── docker pull (download image jadi)        │      │
  │  │       └── docker compose up -d (restart container) │      │
  │  │       └── php artisan migrate --force              │      │
  │  │       └── Fix permissions otomatis                 │      │
  │  │  │                                                 │      │
  │  │  └── ❌ GAGAL → Kirim alert Telegram              │      │
  │  │  └── ✅ SUKSES → Kirim laporan Telegram           │      │
  │  └────────────────────────────────────────────────────┘      │
  └──────────────────────────────────────────────────────────────┘
           │
           ▼
     📱 Notifikasi Telegram
     "✅ Deploy berhasil! Commit 'Fix footer' sudah live."
```

### Kenapa Arsitektur Ini Lebih Baik?

| Aspek | v1 (Build di VPS) | v2 (Build di GHCR) |
|---|---|---|
| **RAM VPS saat deploy** | ~800MB–1.5GB (Docker build + Node + PHP) | **~50MB** (cuma pull & restart) |
| **Waktu deploy di VPS** | 3–5 menit (build from scratch) | **< 30 detik** (pull + restart) |
| **Risiko OOM** | Tinggi, apalagi kalau ada traffic | **Hampir 0** |
| **File upload user** | ❌ Hilang tiap rebuild | ✅ **Persist** via volume mount |
| **Permission error** | ❌ Bisa balik setelah rebuild | ✅ **Auto-fix** di deploy script |

---

## Step 0: Setup Swap File 4GB (Safety Net Memory)

VPS lu cuma punya 4GB RAM. Meskipun dengan arsitektur v2 ini VPS gak perlu build Docker image, tetap ada situasi dimana memory bisa kepake banyak (misalnya traffic tinggi + Redis + MySQL sekaligus). Swap file bertindak sebagai **"RAM cadangan"** yang menggunakan disk SSD.

> [!NOTE]
> Swap **bukan pengganti RAM** — dia jauh lebih lambat. Tapi fungsinya adalah **mencegah server crash (OOM Kill)** saat memory penuh. Anggap ini sebagai "airbag" — lu gak mau pake, tapi glad it's there.

**Login ke VPS sebagai `dancell`:**

```bash
ssh dancell@IP_VPS_LU
```

**Cek apakah sudah ada swap:**

```bash
sudo swapon --show
```

> Kalau output kosong (tidak ada apa-apa), berarti belum ada swap. Lanjut ke langkah berikut.
> Kalau sudah ada swap, **skip Step 0 ini**.

**Buat Swap File 4GB:**

```bash
# 1. Buat file swap 4GB
sudo fallocate -l 4G /swapfile

# 2. Set permission (hanya root yang boleh baca/tulis)
sudo chmod 600 /swapfile

# 3. Format sebagai swap
sudo mkswap /swapfile

# 4. Aktifkan swap
sudo swapon /swapfile
```

**Buat swap permanen (tetap aktif setelah reboot):**

```bash
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

**Optimasi Swappiness (agar swap hanya dipakai saat benar-benar perlu):**

```bash
# Set swappiness ke 10 (default 60, terlalu agresif untuk server)
sudo sysctl vm.swappiness=10

# Buat permanen
echo 'vm.swappiness=10' | sudo tee -a /etc/sysctl.conf
```

> Penjelasan: `swappiness=10` artinya kernel Linux **hanya akan mulai pakai swap kalau RAM tersisa < 10%**. Jadi di operasi normal, swap gak kepake sama sekali — website tetap kencang.

**Verifikasi swap aktif:**

```bash
free -h
```

> Output yang diharapkan:
> ```
>                total        used        free      shared  buff/cache   available
> Mem:           3.8Gi       1.2Gi       1.5Gi        32Mi       1.1Gi       2.3Gi
> Swap:          4.0Gi          0B       4.0Gi    ← Ini swap lu!
> ```

✅ **Swap 4GB sudah aktif!** Server lu sekarang punya total 8GB memory (4GB RAM + 4GB Swap).

---

## Step 1: Buat SSH Deploy Key Khusus GitHub Actions

> [!IMPORTANT]
> **JANGAN** pakai SSH Key pribadi lu (yang dari laptop) untuk GitHub Actions! Kita buat key terpisah khusus untuk deployment otomatis. Alasannya:
> 1. Kalau key ini bocor, lu tinggal hapus tanpa mengganggu akses SSH pribadi lu.
> 2. Key ini punya akses terbatas (hanya untuk deploy, bukan untuk login biasa).

**Masih di VPS sebagai `dancell`, generate SSH Key baru khusus deployment:**

```bash
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github_deploy_key -N ""
```

> Penjelasan:
> - `-C "github-actions-deploy"` → Label untuk identifikasi key ini.
> - `-f ~/.ssh/github_deploy_key` → Nama file key (terpisah dari key pribadi lu).
> - `-N ""` → Tanpa passphrase (wajib, karena GitHub Actions tidak bisa mengetik passphrase).

**Daftarkan public key ke authorized_keys:**

```bash
cat ~/.ssh/github_deploy_key.pub >> ~/.ssh/authorized_keys
```

> Ini mendaftarkan key baru ke daftar key yang diperbolehkan login SSH.

**Tampilkan private key (untuk di-copy ke GitHub nanti di Step 2):**

```bash
cat ~/.ssh/github_deploy_key
```

> Output akan berupa teks panjang yang dimulai dengan:
> ```
> -----BEGIN OPENSSH PRIVATE KEY-----
> b3BlbnNzaC1rZXktdjEAAAAABG5v...
> ...
> -----END OPENSSH PRIVATE KEY-----
> ```
> **COPY SELURUH TEKS INI** (dari `-----BEGIN` sampai `-----END` termasuk kedua baris itu). Kita butuh di Step 2!

> [!CAUTION]
> **JANGAN** pernah share private key ini ke siapapun selain disimpan di GitHub Secrets (yang terenkripsi). Setelah di-copy ke GitHub, lu tidak perlu menyimpannya di tempat lain.

---

## Step 2: Setup GitHub Secrets

GitHub Secrets adalah tempat menyimpan data sensitif (password, key, token) secara **terenkripsi**. Data yang disimpan di sini **tidak bisa dilihat** oleh siapapun (termasuk lu sendiri setelah disimpan) — hanya bisa digunakan oleh GitHub Actions workflow.

### Cara Menambahkan Secrets di GitHub:

1. Buka repository Dancell di browser: `https://github.com/GioGiorno768/company-profile-dancell`
2. Klik tab **Settings** (di navigation bar atas repo).
3. Di sidebar kiri, klik **Secrets and variables** → **Actions**.
4. Klik tombol **"New repository secret"**.

### Daftar Secrets yang Harus Ditambahkan:

Tambahkan **6 secrets** berikut satu per satu (klik "New repository secret" untuk setiap secret):

| Secret Name | Value (Isi dengan data lu) |
|---|---|
| `VPS_HOST` | IP publik VPS lu (contoh: `103.xxx.xxx.xxx`) |
| `VPS_USERNAME` | `dancell` |
| `VPS_SSH_KEY` | Seluruh isi private key dari Step 1 (mulai dari `-----BEGIN OPENSSH PRIVATE KEY-----` sampai `-----END OPENSSH PRIVATE KEY-----`) |
| `VPS_SSH_PORT` | `22` |
| `TELEGRAM_BOT_TOKEN` | Token bot Telegram lu (yang sama dengan di backup/monitoring script) |
| `TELEGRAM_CHAT_ID` | Chat ID Telegram lu |

> [!NOTE]
> **Kita TIDAK perlu menambahkan secret untuk GHCR!** GitHub Actions secara otomatis menyediakan `GITHUB_TOKEN` yang sudah punya akses push ke GHCR. Zero setup untuk push image — cukup tambahkan `permissions: packages: write` di workflow (nanti di Step 8).

**Verifikasi semua secrets sudah terdaftar:**

Di halaman Secrets, lu harus melihat 6 secrets:

```
VPS_HOST           Updated X seconds ago
VPS_USERNAME       Updated X seconds ago
VPS_SSH_KEY        Updated X seconds ago
VPS_SSH_PORT       Updated X seconds ago
TELEGRAM_BOT_TOKEN Updated X seconds ago
TELEGRAM_CHAT_ID   Updated X seconds ago
```

> [!NOTE]
> Setelah secret disimpan, lu tidak bisa melihat value-nya lagi di GitHub (demi keamanan). Kalau salah, lu bisa **Update** untuk menimpa dengan value baru.

---

## Step 3: Setup GHCR & Git Access di VPS (One-Time)

Di step ini kita setup 2 hal di VPS:
1. **Docker login ke GHCR** — agar VPS bisa `docker pull` image dari GitHub Container Registry.
2. **Git remote URL** — agar VPS bisa `git pull` perubahan `docker-compose.yml`.

### A. Buat Personal Access Token (PAT) di GitHub

Token ini dipakai agar Docker di VPS lu bisa download (pull) image dari GHCR.

1. Buka: `https://github.com/settings/tokens`
2. Klik **"Generate new token"** → pilih **"Generate new token (classic)"**.
3. Isi form:

| Field | Value |
|---|---|
| **Note** | `VPS Docker Pull GHCR` |
| **Expiration** | Pilih **"No expiration"** (atau set expiry 1 tahun, terserah lu) |
| **Scopes** | Centang **`read:packages`** saja ✅ (ini cukup untuk pull image) |

4. Klik **"Generate token"**.
5. **COPY TOKEN YANG MUNCUL!** (format: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`). Lu gak bisa lihat lagi setelah meninggalkan halaman ini.

> [!WARNING]
> Simpan token ini sementara di notepad. Setelah di-paste ke VPS (langkah berikut), lu boleh hapus dari notepad.

### B. Login Docker ke GHCR di VPS

**Kembali ke terminal VPS:**

```bash
echo "ghp_TOKEN_LU_DI_SINI" | docker login ghcr.io -u GioGiorno768 --password-stdin
```

> **Ganti `ghp_TOKEN_LU_DI_SINI`** dengan token PAT yang baru lu buat di atas.

> Output yang diharapkan:
> ```
> Login Succeeded
> ```

**Verifikasi login tersimpan:**

```bash
cat ~/.docker/config.json
```

> Lu harus lihat entry `ghcr.io` di file ini. Login ini **permanen** — akan tetap aktif bahkan setelah VPS reboot. Lu gak perlu login ulang.

### C. Setup Git Remote URL di VPS

Agar command `git pull` di VPS bisa berjalan tanpa diminta password GitHub, kita setup akses Git.

**Opsi A: Pakai SSH Deploy Key (Direkomendasikan — Lebih Aman)**

Tampilkan public key deploy di VPS:

```bash
cat ~/.ssh/github_deploy_key.pub
```

Daftarkan di GitHub Repository:

1. Buka repo Dancell di GitHub.
2. Klik **Settings** → **Deploy keys** (di sidebar kiri).
3. Klik **"Add deploy key"**.
4. **Title**: `VPS Deploy Key`
5. **Key**: Paste isi public key dari command di atas.
6. **Allow write access**: ❌ Jangan centang (read-only sudah cukup untuk `git pull`).
7. Klik **Add key**.

Ubah remote URL ke SSH:

```bash
cd /var/www/dancell
git remote set-url origin git@github.com:GioGiorno768/company-profile-dancell.git
```

Konfigurasi SSH agent di VPS untuk pakai key deploy:

```bash
nano ~/.ssh/config
```

Tambahkan:

```
Host github.com
    HostName github.com
    User git
    IdentityFile ~/.ssh/github_deploy_key
    IdentitiesOnly yes
```

Simpan (`Ctrl + O`, Enter, `Ctrl + X`).

Test koneksi:

```bash
ssh -T git@github.com
```

> Output yang diharapkan: `Hi GioGiorno768/company-profile-dancell! You've successfully authenticated...`

**Opsi B: Pakai HTTPS + Personal Access Token (Lebih Mudah)**

```bash
cd /var/www/dancell
git remote set-url origin https://GioGiorno768:TOKEN_PAT_LU@github.com/GioGiorno768/company-profile-dancell.git
```

> **Ganti `TOKEN_PAT_LU`** dengan PAT yang lu buat di Step 3A. Token dengan scope `read:packages` juga bisa baca repo, jadi bisa dipakai di sini.

**Test git pull:**

```bash
cd /var/www/dancell
git pull origin main
```

> Harus berhasil tanpa diminta password.

---

## Step 4: Buat File .dockerignore

Supaya saat Docker build di GitHub Actions, folder/file yang tidak perlu **tidak ikut ter-copy ke dalam image** (menghemat waktu build & ukuran image).

**Di PC lu (bukan VPS), buat file `.dockerignore` di root project:**

Buat file `.dockerignore` dengan isi:

```
.git
.github
.gitignore
.env
.env.example
node_modules
tests
storage/logs/*
storage/framework/cache/*
storage/framework/sessions/*
storage/framework/views/*
*.md
docker-compose.yml
```

> [!WARNING]
> **JANGAN** tambahkan `public/uploads` ke `.dockerignore`! Meskipun kita mount folder uploads sebagai volume, base image tetap perlu folder ini exist di dalam container.

> [!NOTE]
> **Kenapa `vendor` TIDAK ada di daftar?** Karena Dockerfile menjalankan `composer install` sendiri di dalam container. Tapi kalau lu mau exclude `vendor` dari context untuk mempercepat transfer, lu bisa tambahkan — hasilnya sama saja karena Dockerfile install ulang dependencies.

---

## Step 5: Pastikan Dockerfile Ada di Repository

> [!IMPORTANT]
> Dockerfile yang sudah dibuat di Tahap 2 (Setup VPS) kemungkinan hanya ada di VPS (`/var/www/dancell/Dockerfile`) dan **belum di-commit ke repository GitHub**. Karena arsitektur v2 ini mem-build Docker image di GitHub Actions, **Dockerfile WAJIB ada di repository**.

### Cek apakah Dockerfile sudah ada di local project lu:

Lihat di root folder project Dancell di PC lu. Kalau **belum ada file `Dockerfile`**, buat file baru `Dockerfile` di root project dengan isi berikut:

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

# Buat folder uploads (akan di-mount sebagai volume, tapi folder harus exist)
RUN mkdir -p /var/www/html/public/uploads/articles

# Set permissions untuk Laravel storage, cache, & uploads
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/public/uploads \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/public/uploads

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

> [!NOTE]
> Dockerfile ini **identik** dengan yang sudah dibuat di Tahap 2, dengan satu tambahan penting: `mkdir -p /var/www/html/public/uploads/articles` dan permission fix untuk folder uploads. Ini mencegah error 500 saat upload file.

---

## Step 6: Update docker-compose.yml (GHCR Image + Volume Mount)

Ini adalah perubahan **paling penting** di v2. Kita mengubah `docker-compose.yml` dari **build lokal** menjadi **pull image dari GHCR**, dan menambahkan **volume mount** agar file upload user tidak hilang.

**Di PC lu, edit file `docker-compose.yml` di root project:**

```yaml
services:
  app:
    # === PERUBAHAN UTAMA v2 ===
    # SEBELUMNYA: build: .
    # SEKARANG: pakai image dari GHCR (sudah di-build di GitHub Actions)
    image: ghcr.io/giogiorno768/dancell-app:latest
    container_name: dancell-app
    ports:
      - "8080:8080"
    # === VOLUME MOUNT (BARU di v2) ===
    # File di folder ini TIDAK AKAN HILANG saat container di-recreate
    volumes:
      - ./public/uploads:/var/www/html/public/uploads    # Gambar artikel, dll
      - ./storage/logs:/var/www/html/storage/logs        # Log Laravel
    networks:
      - dancell-net
    env_file:
      - .env
    restart: unless-stopped

networks:
  dancell-net:
    external: true
```

### Penjelasan Perubahan:

| Perubahan | Sebelum (v1) | Sesudah (v2) | Kenapa? |
|---|---|---|---|
| `build: .` → `image: ...` | Docker build image di VPS | Pull image jadi dari GHCR | **Hemat RAM VPS** — gak perlu build |
| Volume `public/uploads` | Tidak ada | ✅ Ditambahkan | **File upload user persist** — gak hilang saat deploy |
| Volume `storage/logs` | Tidak ada | ✅ Ditambahkan | **Log persist** — bisa debug meski container restart |

> [!WARNING]
> **Pastikan folder `public/uploads` sudah ada di VPS** sebelum menjalankan container. Kalau belum, buat dulu:
> ```bash
> # Di VPS:
> mkdir -p /var/www/dancell/public/uploads/articles
> mkdir -p /var/www/dancell/storage/logs
> ```

---

## Step 7: Buat Test PHPUnit Dasar

Kita akan membuat beberapa test otomatis sederhana yang mengecek fungsi-fungsi dasar website Dancell. Test ini akan dijalankan oleh GitHub Actions setiap kali ada push/PR.

### A. Test Landing Page (Cek Halaman Utama Bisa Diakses)

**Buat file `tests/Feature/LandingPageTest.php`:**

```php
<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class LandingPageTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test: Halaman utama (landing page) bisa diakses dan return status 200.
     */
    public function test_landing_page_returns_200(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
    }

    /**
     * Test: Halaman login bisa diakses.
     */
    public function test_login_page_returns_200(): void
    {
        $response = $this->get('/login');

        $response->assertStatus(200);
    }
}
```

### B. Test Admin Authentication (Cek Login Admin)

**Buat file `tests/Feature/AdminAuthTest.php`:**

```php
<?php

namespace Tests\Feature;

use App\Models\User;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class AdminAuthTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test: User bisa login dengan kredensial yang benar.
     */
    public function test_user_can_login_with_correct_credentials(): void
    {
        $user = User::factory()->create([
            'email' => 'test@dancell.id',
            'password' => bcrypt('password123'),
        ]);

        $response = $this->post('/login', [
            'email' => 'test@dancell.id',
            'password' => 'password123',
        ]);

        $this->assertAuthenticated();
    }

    /**
     * Test: User TIDAK bisa login dengan password salah.
     */
    public function test_user_cannot_login_with_wrong_password(): void
    {
        $user = User::factory()->create([
            'email' => 'test@dancell.id',
            'password' => bcrypt('password123'),
        ]);

        $response = $this->post('/login', [
            'email' => 'test@dancell.id',
            'password' => 'wrong_password',
        ]);

        $this->assertGuest();
    }

    /**
     * Test: Halaman admin tidak bisa diakses tanpa login.
     */
    public function test_admin_page_requires_authentication(): void
    {
        $response = $this->get('/admin');

        $response->assertRedirect('/login');
    }
}
```

### C. Test Database Migration

**Buat file `tests/Feature/DatabaseTest.php`:**

```php
<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Schema;

class DatabaseTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test: Semua tabel penting berhasil dibuat oleh migration.
     */
    public function test_all_required_tables_exist(): void
    {
        $requiredTables = [
            'users',
            'hero_settings',
            'visi_misi_settings',
            'sejarah_settings',
            'partner_brand_settings',
            'branches',
            'footer_settings',
            'social_impact_settings',
        ];

        foreach ($requiredTables as $table) {
            $this->assertTrue(
                Schema::hasTable($table),
                "Tabel '{$table}' tidak ditemukan di database!"
            );
        }
    }
}
```

> [!NOTE]
> Test-test di atas menggunakan `RefreshDatabase` trait yang secara otomatis menjalankan migration dan me-reset database sebelum setiap test. GitHub Actions akan menggunakan SQLite in-memory (`:memory:`) supaya ringan dan cepat.

### D. Pastikan phpunit.xml Mendukung SQLite Testing

**Cek file `phpunit.xml` di root project lu, pastikan ada baris ini di dalam tag `<php>`:**

```xml
<env name="DB_CONNECTION" value="sqlite"/>
<env name="DB_DATABASE" value=":memory:"/>
```

> Kalau belum ada, tambahkan di dalam block `<php>...</php>`. Ini memaksa PHPUnit menggunakan SQLite in-memory saat testing, jadi tidak perlu MySQL sungguhan.

---

## Step 8: Buat Workflow CI/CD (GitHub Actions + GHCR Build + Deploy)

Ini adalah **jantung dari seluruh pipeline**. File YAML ini memberitahu GitHub Actions apa yang harus dilakukan setiap kali ada push ke `main`.

**Buat folder dan file workflow:**

```
.github/
└── workflows/
    └── ci-cd.yml
```

**Buat file `.github/workflows/ci-cd.yml`:**

```yaml
name: 🧪 Test & 🚀 Deploy Dancell

# ============================================
# KAPAN WORKFLOW INI JALAN?
# ============================================
on:
  push:
    branches: [main]        # Setiap push ke branch main
  pull_request:
    branches: [main]        # Setiap PR yang target ke main

# ============================================
# JOB 1: TESTING (CI - Continuous Integration)
# ============================================
jobs:
  test:
    name: 🧪 Run Tests
    runs-on: ubuntu-latest

    steps:
      # 1. Checkout kode dari repository
      - name: 📥 Checkout Code
        uses: actions/checkout@v4

      # 2. Setup PHP 8.3 (sama dengan versi di Dockerfile production)
      - name: 🐘 Setup PHP 8.3
        uses: shivammathur/setup-php@v2
        with:
          php-version: '8.3'
          extensions: mbstring, xml, ctype, json, bcmath, pdo_sqlite, gd, zip, intl
          coverage: none

      # 3. Cache Composer dependencies (biar gak download ulang setiap kali)
      - name: 📦 Cache Composer
        uses: actions/cache@v4
        with:
          path: vendor
          key: composer-${{ hashFiles('composer.lock') }}
          restore-keys: composer-

      # 4. Install PHP dependencies
      - name: 📦 Composer Install
        run: composer install --no-interaction --prefer-dist --optimize-autoloader

      # 5. Setup Node.js 22
      - name: 🟢 Setup Node.js 22
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'

      # 6. Install & Build Frontend Assets
      - name: 📦 NPM Install & Build
        run: |
          npm ci
          npm run build

      # 7. Prepare Laravel for Testing
      - name: ⚙️ Prepare Laravel
        run: |
          cp .env.example .env
          php artisan key:generate
          php artisan config:clear

      # 8. Jalankan Test Suite
      - name: 🧪 Run PHPUnit Tests
        run: php artisan test --parallel
        env:
          DB_CONNECTION: sqlite
          DB_DATABASE: ':memory:'
          APP_ENV: testing

      # 9. Notifikasi Telegram kalau TEST GAGAL
      - name: 📱 Notify Telegram (Test Failed)
        if: failure()
        uses: appleboy/telegram-action@master
        with:
          to: ${{ secrets.TELEGRAM_CHAT_ID }}
          token: ${{ secrets.TELEGRAM_BOT_TOKEN }}
          format: html
          message: |
            ❌ <b>TEST GAGAL!</b>
            ━━━━━━━━━━━━━━━━━━━
            📁 Repo: ${{ github.repository }}
            🌿 Branch: ${{ github.ref_name }}
            👤 Author: ${{ github.actor }}
            💬 Commit: <code>${{ github.event.head_commit.message }}</code>
            🔗 <a href="${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}">Lihat Detail Error</a>

            ⛔ Deployment DIBATALKAN karena test gagal!

  # ============================================
  # JOB 2: BUILD IMAGE & DEPLOY
  # (CD - Continuous Deployment)
  # ============================================
  build-and-deploy:
    name: 🏗️ Build & 🚀 Deploy
    runs-on: ubuntu-latest
    needs: test                    # HANYA jalan kalau Job "test" LULUS!
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    # ^ Hanya deploy kalau push ke main (bukan PR)

    # Permission untuk push image ke GHCR
    permissions:
      contents: read
      packages: write

    steps:
      # 1. Checkout kode dari repository
      - name: 📥 Checkout Code
        uses: actions/checkout@v4

      # 2. Setup Docker Buildx (build engine yang lebih canggih)
      - name: 🐳 Setup Docker Buildx
        uses: docker/setup-buildx-action@v3

      # 3. Login ke GitHub Container Registry (GHCR)
      - name: 🔑 Login to GHCR
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
          # ^ GITHUB_TOKEN otomatis tersedia, gak perlu bikin secret manual!

      # 4. Build Docker Image & Push ke GHCR
      - name: 🏗️ Build & Push Docker Image
        uses: docker/build-push-action@v6
        with:
          context: .
          push: true
          tags: |
            ghcr.io/giogiorno768/dancell-app:latest
            ghcr.io/giogiorno768/dancell-app:${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
          # ^ Cache layer Docker di GitHub Actions → build selanjutnya JAUH lebih cepat!

      # 5. Deploy ke VPS via SSH
      - name: 🚀 Deploy to VPS
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USERNAME }}
          key: ${{ secrets.VPS_SSH_KEY }}
          port: ${{ secrets.VPS_SSH_PORT }}
          script_stop: true
          script: |
            set -e
            echo "📦 Pulling latest image from GHCR..."
            docker pull ghcr.io/giogiorno768/dancell-app:latest

            echo "🔄 Updating project files..."
            cd /var/www/dancell
            git pull origin main

            echo "🔄 Restarting container with new image..."
            docker compose up -d

            echo "🗃️ Running migrations..."
            docker exec dancell-app php artisan migrate --force

            echo "⚡ Optimizing for production..."
            docker exec dancell-app php artisan optimize

            echo "🔧 Fixing permissions..."
            docker exec dancell-app chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
            docker exec dancell-app chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache
            docker exec dancell-app mkdir -p /var/www/html/public/uploads/articles
            docker exec dancell-app chown -R www-data:www-data /var/www/html/public/uploads
            docker exec dancell-app chmod -R 775 /var/www/html/public/uploads

            echo "🧹 Cleaning up old Docker images..."
            docker image prune -f

            echo "✅ Deployment complete!"

      # 6. Notifikasi Telegram — DEPLOY BERHASIL
      - name: 📱 Notify Telegram (Deploy Success)
        if: success()
        uses: appleboy/telegram-action@master
        with:
          to: ${{ secrets.TELEGRAM_CHAT_ID }}
          token: ${{ secrets.TELEGRAM_BOT_TOKEN }}
          format: html
          message: |
            ✅ <b>DEPLOY BERHASIL!</b>
            ━━━━━━━━━━━━━━━━━━━
            📁 Repo: ${{ github.repository }}
            🌿 Branch: ${{ github.ref_name }}
            👤 Author: ${{ github.actor }}
            💬 Commit: <code>${{ github.event.head_commit.message }}</code>

            🧪 Tests: All Passed ✅
            🚀 VPS: Live & Updated
            🔗 <a href="${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}">Lihat Detail</a>

      # 7. Notifikasi Telegram — DEPLOY GAGAL
      - name: 📱 Notify Telegram (Deploy Failed)
        if: failure()
        uses: appleboy/telegram-action@master
        with:
          to: ${{ secrets.TELEGRAM_CHAT_ID }}
          token: ${{ secrets.TELEGRAM_BOT_TOKEN }}
          format: html
          message: |
            🔥 <b>DEPLOY GAGAL!</b>
            ━━━━━━━━━━━━━━━━━━━
            📁 Repo: ${{ github.repository }}
            🌿 Branch: ${{ github.ref_name }}
            👤 Author: ${{ github.actor }}
            💬 Commit: <code>${{ github.event.head_commit.message }}</code>

            🧪 Tests: Passed ✅
            🚀 Deploy: Failed ❌
            🔗 <a href="${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}">Lihat Detail Error</a>

            ⚠️ Test lulus tapi deployment gagal. Cek VPS segera!
```

### Penjelasan Alur Workflow:

```
Push ke main
    │
    ▼
Job 1: 🧪 Test
    ├── Setup PHP 8.3 + Node 22
    ├── composer install + npm ci + npm build
    ├── php artisan test
    ├── ❌ Gagal → Telegram alert, STOP
    └── ✅ Lulus → Lanjut Job 2
              │
              ▼
Job 2: 🏗️ Build & 🚀 Deploy
    ├── Docker build (di GitHub Actions, BUKAN di VPS!)
    ├── Push image ke ghcr.io/giogiorno768/dancell-app:latest
    ├── SSH ke VPS:
    │     ├── docker pull (download image ~20-150MB)
    │     ├── git pull (update docker-compose.yml dll)
    │     ├── docker compose up -d (restart dengan image baru)
    │     ├── php artisan migrate --force
    │     ├── php artisan optimize
    │     ├── Fix permissions (uploads, storage, cache)
    │     └── Cleanup old images
    ├── ❌ Gagal → Telegram alert
    └── ✅ Sukses → Telegram report
```

> **Point-point Penting:**
> - `needs: test` → Job `build-and-deploy` **HANYA** jalan kalau job `test` berhasil.
> - `if: github.ref == 'refs/heads/main' && github.event_name == 'push'` → Deploy hanya kalau push ke `main` (bukan PR).
> - `permissions: packages: write` → Izinkan workflow push image ke GHCR.
> - `cache-from/cache-to: type=gha` → Cache Docker layer di GitHub → build ke-2, ke-3, dst **jauh lebih cepat** (hanya rebuild layer yang berubah).
> - `script_stop: true` → Kalau ada 1 command SSH yang gagal, langsung berhenti dan laporkan error.
> - `docker image prune -f` → Bersihkan image lama di VPS supaya disk gak penuh.

---

## Step 9: Setup Branch Protection Rules (Opsional tapi Direkomendasikan)

Branch Protection memastikan **tidak ada push langsung ke `main`** tanpa test lulus terlebih dahulu. Ini mencegah kodingan error masuk ke production.

### Cara Setup di GitHub:

1. Buka repo Dancell di GitHub.
2. Klik **Settings** → **Branches** (di sidebar kiri).
3. Klik **"Add branch protection rule"** (atau "Add classic branch protection rule").
4. Isi konfigurasi:

| Field | Value |
|---|---|
| **Branch name pattern** | `main` |
| **Require a pull request before merging** | ✅ Centang (opsional, kalau lu kerja sendiri bisa skip) |
| **Require status checks to pass before merging** | ✅ **Centang!** |
| **Status checks that are required** | Cari dan pilih: `Run Tests` |
| **Require branches to be up to date** | ✅ Centang |

5. Klik **"Create"** atau **"Save changes"**.

> **Apa efeknya?**
> - Kalau lu push langsung ke `main` dan test gagal, commit tetap masuk tapi deployment **tidak jalan**.
> - Kalau lu pakai PR (Pull Request), PR **tidak bisa di-merge** kalau test belum lulus. Ini best practice standar industri!

> [!TIP]
> Kalau lu kerja sendirian dan merasa PR workflow terlalu ribet, lu bisa skip opsi "Require a pull request". Cukup centang "Require status checks to pass" saja — ini sudah cukup untuk mencegah deploy yang rusak.

---

## Step 10: Test Full Pipeline End-to-End

Sekarang saatnya menguji seluruh pipeline dari ujung ke ujung!

### A. Commit & Push Semua File Baru

```bash
cd e:\notepaste\company-profile-dancell

# Tambahkan semua file baru
git add .github/workflows/ci-cd.yml
git add .dockerignore
git add Dockerfile
git add docker-compose.yml
git add tests/Feature/LandingPageTest.php
git add tests/Feature/AdminAuthTest.php
git add tests/Feature/DatabaseTest.php

# Commit
git commit -m "feat: setup CI/CD pipeline v2 with GHCR + auto deploy"

# Push ke main
git push origin main
```

### B. Pantau Pipeline di GitHub

1. Buka repo Dancell di browser: `https://github.com/GioGiorno768/company-profile-dancell`
2. Klik tab **"Actions"** di navigation bar atas.
3. Lu akan melihat workflow **"🧪 Test & 🚀 Deploy Dancell"** sedang berjalan!
4. Klik workflow tersebut untuk melihat detail progress.

**Yang akan terjadi secara berurutan:**

```
📥 Checkout Code          ━━━━━ ✅ (beberapa detik)
🐘 Setup PHP 8.3          ━━━━━ ✅ (~15 detik)
📦 Composer Install        ━━━━━ ✅ (~30 detik)
🟢 Setup Node.js 22       ━━━━━ ✅ (~10 detik)
📦 NPM Install & Build    ━━━━━ ✅ (~40 detik)
⚙️ Prepare Laravel        ━━━━━ ✅ (~5 detik)
🧪 Run PHPUnit Tests      ━━━━━ ✅ (~10 detik)
                                 │
                                 ▼ (Test lulus, lanjut build & deploy!)
🐳 Setup Docker Buildx    ━━━━━ ✅ (beberapa detik)
🔑 Login to GHCR          ━━━━━ ✅ (beberapa detik)
🏗️ Build & Push Image     ━━━━━ ✅ (~2-4 menit, pertama kali agak lama)
🚀 Deploy to VPS          ━━━━━ ✅ (~30-60 detik)
📱 Notify Telegram         ━━━━━ ✅ (instan)
```

> [!NOTE]
> **Build pertama kali** akan memakan waktu lebih lama (~4-6 menit) karena belum ada cache. Build ke-2 dan seterusnya akan **jauh lebih cepat** (~1-2 menit) karena Docker layer caching aktif.

### C. Cek Notifikasi Telegram di HP Lu

Setelah pipeline selesai, lu akan menerima pesan di Telegram:

```
✅ DEPLOY BERHASIL!
━━━━━━━━━━━━━━━━━━━
📁 Repo: GioGiorno768/company-profile-dancell
🌿 Branch: main
👤 Author: GioGiorno768
💬 Commit: feat: setup CI/CD pipeline v2 with GHCR + auto deploy

🧪 Tests: All Passed ✅
🚀 VPS: Live & Updated
🔗 Lihat Detail
```

**🎉 SELAMAT! CI/CD PIPELINE v2 LU SUDAH AKTIF DAN BERJALAN!** 🎉

### D. Verifikasi Website Masih Berjalan Normal

Setelah deploy berhasil, cek website lu di browser:

```bash
# Atau dari VPS:
curl -I https://dancell.id
```

> Harus return `HTTP/2 200`. Kalau error, lihat bagian Troubleshooting di bawah.

### E. Verifikasi File Upload Persist

1. Upload artikel baru dengan gambar via admin panel.
2. Trigger deploy lagi (push commit kecil apapun).
3. Setelah deploy selesai, **cek gambar artikel masih muncul**.

> Kalau gambar masih muncul setelah deploy = volume mount berhasil! ✅

---

## Step 10.5: Test Skenario Gagal (Pastikan Safety Net Bekerja)

Untuk memastikan pipeline benar-benar melindungi VPS lu, kita test skenario dimana kodingan ada error.

### Simulasi Test Gagal:

**Buat branch baru dan tambahkan test yang sengaja gagal:**

```bash
git checkout -b test/simulasi-gagal
```

**Buat file `tests/Feature/FailTest.php`:**

```php
<?php

namespace Tests\Feature;

use Tests\TestCase;

class FailTest extends TestCase
{
    public function test_ini_pasti_gagal(): void
    {
        // Sengaja dibuat gagal untuk testing pipeline
        $this->assertTrue(false, 'Test ini sengaja dibuat gagal!');
    }
}
```

```bash
git add .
git commit -m "test: simulasi test gagal untuk testing pipeline"
git push origin test/simulasi-gagal
```

**Buat Pull Request di GitHub:**
1. Buka repo di browser.
2. Klik **"Compare & pull request"**.
3. Buat PR dari `test/simulasi-gagal` ke `main`.

**Hasil yang diharapkan:**
- ❌ Job **"Run Tests"** **GAGAL** (karena test `FailTest` sengaja gagal).
- ❌ Job **"Build & Deploy"** **TIDAK JALAN** (karena test gagal, deploy dibatalkan!).
- 📱 Lu dapat **notifikasi Telegram**: `"❌ TEST GAGAL!"`
- 🛡️ **VPS LU TETAP AMAN** — website tetap berjalan normal!

**Setelah selesai testing, hapus branch dan PR tersebut:**

```bash
git checkout main
git branch -D test/simulasi-gagal
git push origin --delete test/simulasi-gagal
```

---

## Step 11: Verifikasi Final & Cheat Sheet

### Verifikasi Final

| No | Item | Status |
|---|---|---|
| 1 | Swap 4GB aktif di VPS | ⬜ |
| 2 | SSH Deploy Key dibuat & terdaftar di VPS | ⬜ |
| 3 | 6 GitHub Secrets tersimpan | ⬜ |
| 4 | Docker login GHCR berhasil di VPS | ⬜ |
| 5 | Git remote URL di VPS sudah dikonfigurasi | ⬜ |
| 6 | File `.dockerignore` dibuat | ⬜ |
| 7 | `Dockerfile` ada di repository | ⬜ |
| 8 | `docker-compose.yml` pakai `image:` (bukan `build:`) + volume mount | ⬜ |
| 9 | 3 file test PHPUnit dibuat | ⬜ |
| 10 | File `.github/workflows/ci-cd.yml` dibuat | ⬜ |
| 11 | Push ke `main` → test + build + deploy otomatis jalan | ⬜ |
| 12 | Notifikasi Telegram diterima (berhasil & gagal) | ⬜ |
| 13 | File upload persist setelah deploy ulang | ⬜ |
| 14 | Branch protection rule aktif (opsional) | ⬜ |

---

### 📋 Cheat Sheet — Alur Kerja Sehari-hari Setelah CI/CD Aktif

Mulai sekarang, setiap kali lu mau update website Dancell, alurnya jadi **SUPER SIMPEL**:

```
# 1. Edit kodingan di laptop lu
# 2. Commit perubahan
git add .
git commit -m "fix: perbaiki tampilan footer di mobile"

# 3. Push ke GitHub
git push origin main

# 4. SELESAI! Duduk santai & tunggu notifikasi Telegram 🍵
#    GitHub Actions otomatis:
#    → Jalankan test
#    → Build Docker image
#    → Push ke GHCR
#    → Deploy ke VPS (pull image + restart)
#    → Fix permissions
#    → Kirim laporan ke HP lu
```

**Gak perlu buka PuTTY, gak perlu SSH ke VPS, gak perlu ketik command manual lagi!** 🎉

### 🛠️ Command Manual (Darurat / Troubleshooting)

Kalau lu perlu maintenance manual di VPS:

```bash
# SSH ke VPS
ssh dancell@IP_VPS_LU

# Lihat status container
docker ps

# Lihat log container
docker logs dancell-app --tail 50

# Lihat log Laravel
docker exec dancell-app tail -n 50 storage/logs/laravel.log

# Restart container tanpa rebuild
cd /var/www/dancell
docker compose restart

# Pull image terbaru manual (kalau deploy gagal)
docker pull ghcr.io/giogiorno768/dancell-app:latest
docker compose up -d

# Fix permissions manual
docker exec dancell-app chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/public/uploads
docker exec dancell-app chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/public/uploads

# Cek disk space (image Docker bisa gede)
df -h
docker system df

# Bersihkan image Docker lama
docker image prune -a -f
```

---

## Troubleshooting & FAQ

### ❓ FAQ

**Q: Berapa biaya GHCR?**
A: **Gratis!** GitHub Free memberikan 500MB storage untuk container packages di private repo. Satu image Dancell ~150-200MB, jadi masih sangat cukup. Kalau repo lu public, storage unlimited.

**Q: Kalau internet VPS mati saat deploy, apa yang terjadi?**
A: Job `Deploy to VPS` di GitHub Actions akan **timeout dan gagal**. Lu akan dapat notifikasi Telegram "Deploy Gagal". Website **tetap jalan** dengan versi sebelumnya (container lama masih running). Setelah internet VPS pulih, push commit baru atau re-run workflow di GitHub Actions.

**Q: Kalau lu mau rollback ke versi sebelumnya?**
A: Setiap build di-tag dengan commit SHA. Contoh rollback:
```bash
# Di VPS:
docker pull ghcr.io/giogiorno768/dancell-app:abc123def  # ganti dengan SHA commit yang mau di-rollback
docker compose up -d
```

**Q: Berapa banyak GitHub Actions minutes yang terpakai per deploy?**
A: Sekitar **3-6 menit** per deploy. GitHub Free memberikan **2.000 menit/bulan**. Artinya lu bisa deploy **~300-600 kali per bulan** — lebih dari cukup!

**Q: Apakah Dockerfile perlu diubah kalau menambah fitur baru?**
A: **Biasanya tidak.** Dockerfile hanya perlu diubah kalau:
- Menambah PHP extension baru (contoh: `imagick`)
- Mengubah versi PHP (misal dari 8.3 ke 8.4)
- Mengubah konfigurasi Nginx (misal menaikkan `client_max_body_size`)

**Q: Nanti kalau e-commerce vendor juga di-deploy di VPS yang sama, gimana?**
A: Buat Dockerfile + docker-compose.yml + workflow terpisah untuk project e-commerce. Mereka bisa **share MySQL & Redis** yang sudah ada (seperti yang sudah disetup di Tahap 3 - Vendor Isolation). Karena VPS gak perlu build apa-apa, multiple project bisa di-deploy tanpa overload memory.

---

### 🔧 Common Errors & Solusinya

#### Error: "denied: permission_denied: write_package"
**Penyebab:** Workflow gak punya permission push ke GHCR.
**Solusi:** Pastikan ada block `permissions` di job `build-and-deploy`:
```yaml
permissions:
  contents: read
  packages: write
```

#### Error: "unauthorized: authentication required" saat docker pull di VPS
**Penyebab:** Docker di VPS belum login ke GHCR.
**Solusi:** Jalankan ulang Step 3B:
```bash
echo "ghp_TOKEN_LU" | docker login ghcr.io -u GioGiorno768 --password-stdin
```

#### Error: "Unable to write in /var/www/html/public/uploads/articles"
**Penyebab:** Folder permissions salah setelah deploy.
**Solusi:** Deploy script v2 sudah auto-fix ini. Kalau masih muncul, jalankan manual:
```bash
docker exec dancell-app mkdir -p /var/www/html/public/uploads/articles
docker exec dancell-app chown -R www-data:www-data /var/www/html/public/uploads
docker exec dancell-app chmod -R 775 /var/www/html/public/uploads
```

#### Error: "No space left on device" di VPS
**Penyebab:** Image Docker lama menumpuk.
**Solusi:**
```bash
# Hapus semua image yang tidak dipakai
docker image prune -a -f

# Hapus semua yang tidak terpakai (container, network, image, build cache)
docker system prune -a -f

# Cek hasilnya
df -h
```

#### Error: GitHub Actions build sangat lambat
**Penyebab:** Pertama kali build belum ada cache.
**Solusi:** Build pertama memang lambat (~5-6 menit). Build selanjutnya akan **jauh lebih cepat** (~1-2 menit) karena Docker layer caching (`cache-from: type=gha`). Pastikan baris `cache-from` dan `cache-to` ada di workflow YAML.

#### Error: Container tidak mau restart setelah pull
**Penyebab:** `docker compose up -d` kadang tidak detect image baru.
**Solusi:**
```bash
cd /var/www/dancell
docker compose down
docker compose up -d
```

#### Gambar upload hilang setelah deploy
**Penyebab:** Volume mount `public/uploads` belum dikonfigurasi.
**Solusi:** Pastikan `docker-compose.yml` sudah ada volume mount (lihat Step 6). Juga pastikan folder exist di host:
```bash
mkdir -p /var/www/dancell/public/uploads/articles
```

---

## 📊 Ringkasan Akhir — SELURUH SETUP VPS SELESAI!

```
┌──────────────────────────────────────────────────────────────────────┐
│           🏆 VPS DANCELL — FULLY PRODUCTION READY 🏆                │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ✅ Tahap 1: Security Hardening (SSH, UFW, Fail2ban)                 │
│  ✅ Tahap 2: MySQL, Redis & Deploy Dancell (Docker)                  │
│  ✅ Tahap 3: Vendor Isolation (User, DB, Folder terpisah)            │
│  ✅ Tahap 4: Automated Backup (MySQL dump → Google Drive)            │
│  ✅ Tahap 5: Monitoring & Alerting (Health check → Telegram)         │
│  ✅ Tahap 6: CI/CD Pipeline v2 (GHCR + Auto Deploy, Optimized!)     │
│                                                                      │
│  📊 Resource Usage Saat Deploy (v2 vs v1):                           │
│  ┌──────────────────────────────────────────────────┐                │
│  │  v1: RAM ~800MB-1.5GB (build di VPS)    ❌ Berat │                │
│  │  v2: RAM ~50MB (pull image only)         ✅ Ringan│                │
│  └──────────────────────────────────────────────────┘                │
│                                                                      │
│  🔄 Otomatisasi Aktif:                                               │
│  • Setiap 5 menit  → Server health monitoring                        │
│  • Jam 02:00       → Backup otomatis + upload Google Drive           │
│  • Jam 08:00       → Daily report ke Telegram                        │
│  • Setiap git push → Test + Build GHCR + Auto Deploy (RINGAN!)       │
│                                                                      │
│  📱 Notifikasi Telegram:                                             │
│  • 🚨 Alert darurat (container crash, disk penuh)                    │
│  • 💾 Laporan backup harian                                          │
│  • 📊 Daily health report                                            │
│  • 🚀 Deploy report (berhasil/gagal)                                 │
│                                                                      │
│  🛡️ Keamanan:                                                       │
│  • SSH Key-only, Firewall, Fail2ban                                  │
│  • Vendor terisolasi (folder, database, container)                   │
│  • Test wajib lulus sebelum deploy ke production                     │
│  • Backup otomatis ke cloud (disaster recovery ready)                │
│  • File upload persist via volume mount                              │
│  • Permissions auto-fix di setiap deploy                             │
│                                                                      │
│              💎 ENTERPRISE-GRADE INFRASTRUCTURE 💎                    │
└──────────────────────────────────────────────────────────────────────┘
```
