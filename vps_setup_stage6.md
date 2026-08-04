# ⚡ Panduan Setup VPS Tahap 6 (Bonus Final) — CI/CD Auto Deploy + Testing

> **Prasyarat**: Tahap 1–5 sudah selesai, project Dancell sudah live di VPS.  
> **Tujuan Akhir Tahap Ini**: Setiap kali lu `git push` ke branch `main`, GitHub Actions akan **otomatis menjalankan test**, dan kalau semua test lulus, **otomatis deploy ke VPS** tanpa lu perlu SSH manual. Ditambah **notifikasi Telegram** ke HP lu di setiap tahapan.  
> **Waktu Estimasi**: ~25 - 35 menit  
> **Biaya**: **100% GRATIS** (GitHub Free = 2.000 menit/bulan)

---

## 📋 Overview Alur Tahap Keenam

```
Step 1  →  Buat SSH Deploy Key Khusus GitHub Actions
Step 2  →  Setup GitHub Secrets (Credential Terenkripsi)
Step 3  →  Buat File .dockerignore (Optimasi Build)
Step 4  →  Buat Test PHPUnit Dasar (Landing Page, Admin, Settings)
Step 5  →  Buat Workflow CI — Automated Testing
Step 6  →  Buat Workflow CD — Auto Deploy ke VPS
Step 7  →  Integrasi Notifikasi Telegram
Step 8  →  Setup Branch Protection Rules
Step 9  →  Test Full Pipeline End-to-End
Step 10 →  Verifikasi & Cheat Sheet
```

---

## 🏗️ Arsitektur CI/CD yang Akan Kita Bangun

```
  Lu Push ke GitHub (main branch)
           │
           ▼
  ┌────────────────────────────────────────────────────────┐
  │              GITHUB ACTIONS (Cloud Server Gratis)       │
  │                                                         │
  │  ┌─────────────────────────────────────────────┐       │
  │  │  JOB 1: 🧪 TESTING (CI)                     │       │
  │  │  ├── Setup PHP 8.4 + Node 22                │       │
  │  │  ├── composer install                        │       │
  │  │  ├── npm ci && npm run build                 │       │
  │  │  ├── php artisan test                        │       │
  │  │  │                                           │       │
  │  │  ├── ❌ GAGAL → Stop! Kirim alert Telegram  │       │
  │  │  └── ✅ LULUS → Lanjut ke Job 2             │       │
  │  └──────────────────────┬──────────────────────┘       │
  │                         │                               │
  │  ┌──────────────────────▼──────────────────────┐       │
  │  │  JOB 2: 🚀 DEPLOY (CD)                      │       │
  │  │  ├── SSH ke VPS (pakai Deploy Key)           │       │
  │  │  ├── cd /var/www/dancell && git pull          │       │
  │  │  ├── docker compose up -d --build            │       │
  │  │  ├── php artisan migrate --force             │       │
  │  │  ├── php artisan optimize                    │       │
  │  │  │                                           │       │
  │  │  ├── ❌ GAGAL → Kirim alert Telegram        │       │
  │  │  └── ✅ SUKSES → Kirim laporan Telegram     │       │
  │  └─────────────────────────────────────────────┘       │
  └────────────────────────────────────────────────────────┘
           │
           ▼
     📱 Notifikasi Telegram
     "✅ Deploy berhasil! Commit 'Fix footer' sudah live."
```

---

## Step 1: Buat SSH Deploy Key Khusus GitHub Actions

> [!IMPORTANT]
> **JANGAN** pakai SSH Key pribadi lu (yang dari laptop) untuk GitHub Actions! Kita buat key terpisah khusus untuk deployment otomatis. Alasannya:
> 1. Kalau key ini bocor, lu tinggal hapus tanpa mengganggu akses SSH pribadi lu.
> 2. Key ini punya akses terbatas (hanya untuk deploy, bukan untuk login biasa).

**Login ke VPS sebagai `dancell`:**

```bash
ssh dancell@IP_VPS_LU
```

**Generate SSH Key baru khusus deployment:**

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

**Tampilkan private key (untuk di-copy ke GitHub nanti):**

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
> Setelah secret disimpan, lu tidak bisa melihat value-nya lagi di GitHub (demi keamanan). Kalau salah, lu bisa **Update** untuk menimpa dengan value baru.

**Verifikasi semua secrets sudah terdaftar:**

Di halaman Secrets, lu harus melihat 6 secrets yang sudah terdaftar:

```
VPS_HOST          Updated X seconds ago
VPS_USERNAME      Updated X seconds ago
VPS_SSH_KEY       Updated X seconds ago
VPS_SSH_PORT      Updated X seconds ago
TELEGRAM_BOT_TOKEN Updated X seconds ago
TELEGRAM_CHAT_ID  Updated X seconds ago
```

---

## Step 3: Buat File .dockerignore

Supaya saat Docker build di VPS, folder `.github/` dan file-file yang tidak perlu **tidak ikut ter-copy ke dalam image** (menghemat waktu build & ukuran image).

**Di PC lu (bukan VPS), buat file `.dockerignore` di root project:**

```bash
# Di folder e:\notepaste\company-profile-dancell\
```

Buat file `.dockerignore` dengan isi:

```
.git
.github
.gitignore
.env.example
node_modules
vendor
tests
storage/logs
storage/framework/cache
storage/framework/sessions
storage/framework/views
*.md
docker-compose.yml
```

> File ini memberitahu Docker untuk mengabaikan folder/file tersebut saat proses build, sehingga image menjadi lebih ringan dan build lebih cepat.

---

## Step 4: Buat Test PHPUnit Dasar

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

## Step 5: Buat Workflow CI — Automated Testing

Sekarang kita buat file workflow GitHub Actions yang menjalankan test otomatis.

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

      # 2. Setup PHP 8.4
      - name: 🐘 Setup PHP 8.4
        uses: shivammathur/setup-php@v2
        with:
          php-version: '8.4'
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
            📦 Repo: ${{ github.repository }}
            🌿 Branch: ${{ github.ref_name }}
            👤 Author: ${{ github.actor }}
            💬 Commit: <code>${{ github.event.head_commit.message }}</code>
            🔗 <a href="${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}">Lihat Detail Error</a>
            
            ⛔ Deployment DIBATALKAN karena test gagal!

  # ============================================
  # JOB 2: DEPLOY (CD - Continuous Deployment)
  # ============================================
  deploy:
    name: 🚀 Deploy to VPS
    runs-on: ubuntu-latest
    needs: test                    # HANYA jalan kalau Job "test" LULUS!
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    # ^ Hanya deploy kalau push ke main (bukan PR)

    steps:
      # 1. Deploy ke VPS via SSH
      - name: 🚀 Deploy via SSH
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USERNAME }}
          key: ${{ secrets.VPS_SSH_KEY }}
          port: ${{ secrets.VPS_SSH_PORT }}
          script_stop: true
          script: |
            set -e
            echo "📥 Pulling latest code..."
            cd /var/www/dancell
            git pull origin main

            echo "🐳 Building & restarting Docker container..."
            docker compose up -d --build

            echo "🗃️ Running migrations..."
            docker exec dancell-app php artisan migrate --force

            echo "⚡ Optimizing for production..."
            docker exec dancell-app php artisan optimize

            echo "✅ Deployment complete!"

      # 2. Notifikasi Telegram — DEPLOY BERHASIL
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
            📦 Repo: ${{ github.repository }}
            🌿 Branch: ${{ github.ref_name }}
            👤 Author: ${{ github.actor }}
            💬 Commit: <code>${{ github.event.head_commit.message }}</code>
            
            🧪 Tests: All Passed ✅
            🚀 VPS: Live & Updated
            🔗 <a href="${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}">Lihat Detail</a>

      # 3. Notifikasi Telegram — DEPLOY GAGAL
      - name: 📱 Notify Telegram (Deploy Failed)
        if: failure()
        uses: appleboy/telegram-action@master
        with:
          to: ${{ secrets.TELEGRAM_CHAT_ID }}
          token: ${{ secrets.TELEGRAM_BOT_TOKEN }}
          format: html
          message: |
            🔴 <b>DEPLOY GAGAL!</b>
            ━━━━━━━━━━━━━━━━━━━
            📦 Repo: ${{ github.repository }}
            🌿 Branch: ${{ github.ref_name }}
            👤 Author: ${{ github.actor }}
            💬 Commit: <code>${{ github.event.head_commit.message }}</code>
            
            🧪 Tests: Passed ✅ 
            🚀 Deploy: Failed ❌
            🔗 <a href="${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}">Lihat Detail Error</a>
            
            ⚠️ Test lulus tapi deployment gagal. Cek VPS segera!
```

> **Penjelasan Alur Workflow:**
> - `on: push: branches: [main]` → Workflow aktif setiap kali ada push ke branch `main`.
> - `on: pull_request` → Juga aktif saat ada Pull Request ke `main` (tapi hanya test, tanpa deploy).
> - `needs: test` → Job `deploy` **HANYA** jalan kalau job `test` berhasil (exit code 0).
> - `if: github.ref == 'refs/heads/main' && github.event_name == 'push'` → Deploy hanya kalau push langsung ke `main` (bukan PR).
> - `script_stop: true` → Kalau ada 1 command SSH yang gagal, langsung berhenti dan laporkan error.

---

## Step 6: Setup VPS untuk Menerima Git Pull dari GitHub Actions

Agar command `git pull` di VPS bisa berjalan tanpa diminta password GitHub, kita perlu setup akses Git.

### Opsi A: Pakai HTTPS + Personal Access Token (Paling Mudah)

**Di VPS, konfigurasi Git credential:**

```bash
cd /var/www/dancell
git remote set-url origin https://GioGiorno768:GITHUB_TOKEN@github.com/GioGiorno768/company-profile-dancell.git
```

> **Ganti `GITHUB_TOKEN`** dengan Personal Access Token yang lu buat di:
> GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic) → Generate new token
>
> Scope yang dibutuhkan: centang `repo` (Full control of private repositories).

### Opsi B: Pakai SSH Deploy Key di GitHub (Lebih Aman)

**Tampilkan public key deploy di VPS:**

```bash
cat ~/.ssh/github_deploy_key.pub
```

**Daftarkan di GitHub Repository:**

1. Buka repo Dancell di GitHub.
2. Klik **Settings** → **Deploy keys** (di sidebar kiri).
3. Klik **"Add deploy key"**.
4. **Title**: `VPS Deploy Key`
5. **Key**: Paste isi public key dari command di atas.
6. **Allow write access**: ❌ Jangan centang (read-only sudah cukup untuk `git pull`).
7. Klik **Add key**.

**Ubah remote URL ke SSH:**

```bash
cd /var/www/dancell
git remote set-url origin git@github.com:GioGiorno768/company-profile-dancell.git
```

**Konfigurasi SSH agent di VPS untuk pakai key deploy:**

```bash
nano ~/.ssh/config
```

**Tambahkan:**

```
Host github.com
    HostName github.com
    User git
    IdentityFile ~/.ssh/github_deploy_key
    IdentitiesOnly yes
```

**Simpan** (`Ctrl + O`, Enter, `Ctrl + X`).

**Test koneksi:**

```bash
ssh -T git@github.com
```

> Output yang diharapkan: `Hi GioGiorno768/company-profile-dancell! You've successfully authenticated...`

---

## Step 7: Setup Branch Protection Rules (Opsional tapi Direkomendasikan)

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

## Step 8: Test Full Pipeline End-to-End

Sekarang saatnya menguji seluruh pipeline dari ujung ke ujung!

### A. Commit & Push Semua File Baru

**Di PC lu (folder project Dancell):**

```bash
cd e:\notepaste\company-profile-dancell

# Tambahkan semua file baru
git add .github/workflows/ci-cd.yml
git add .dockerignore
git add tests/Feature/LandingPageTest.php
git add tests/Feature/AdminAuthTest.php
git add tests/Feature/DatabaseTest.php

# Commit
git commit -m "feat: setup CI/CD pipeline with GitHub Actions + automated testing"

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
📥 Checkout Code          ───── ✅ (beberapa detik)
🐘 Setup PHP 8.4          ───── ✅ (~15 detik)
📦 Composer Install        ───── ✅ (~30 detik)
🟢 Setup Node.js 22       ───── ✅ (~10 detik)
📦 NPM Install & Build    ───── ✅ (~40 detik)
⚙️ Prepare Laravel        ───── ✅ (~5 detik)
🧪 Run PHPUnit Tests      ───── ✅ (~10 detik)
                                 │
                                 ▼ (Test lulus, lanjut deploy!)
🚀 Deploy via SSH          ───── ✅ (~2-5 menit)
📱 Notify Telegram         ───── ✅ (instan)
```

### C. Cek Notifikasi Telegram di HP Lu

Setelah pipeline selesai, lu akan menerima pesan di Telegram:

```
✅ DEPLOY BERHASIL!
━━━━━━━━━━━━━━━━━━━
📦 Repo: GioGiorno768/company-profile-dancell
🌿 Branch: main
👤 Author: GioGiorno768
💬 Commit: feat: setup CI/CD pipeline with GitHub Actions + automated testing

🧪 Tests: All Passed ✅
🚀 VPS: Live & Updated
🔗 Lihat Detail
```

**🎉 SELAMAT! CI/CD PIPELINE LU SUDAH AKTIF DAN BERJALAN!** 🎉

---

## Step 9: Test Skenario Gagal (Pastikan Safety Net Bekerja)

Untuk memastikan pipeline benar-benar melindungi VPS lu, kita test skenario dimana kodingan ada error:

### Simulasi Test Gagal:

**Buat branch baru dan tambahkan test yang sengaja gagal:**

```bash
git checkout -b test/simulasi-gagal

# Buat test yang pasti gagal
```

Buat file `tests/Feature/FailTest.php`:

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
- ❌ Job **"Deploy"** **TIDAK JALAN** (karena test gagal, deploy dibatalkan!).
- 📱 Lu dapat **notifikasi Telegram**: `"❌ TEST GAGAL!"`
- 🛡️ **VPS LU TETAP AMAN** — website tetap berjalan normal!

**Setelah selesai testing, hapus branch dan PR tersebut:**

```bash
git checkout main
git branch -D test/simulasi-gagal
git push origin --delete test/simulasi-gagal
```

---

## Step 10: Verifikasi & Cheat Sheet

### Verifikasi Final

| No | Item | Status |
|---|---|---|
| 1 | SSH Deploy Key dibuat & terdaftar di VPS | ☐ |
| 2 | 6 GitHub Secrets tersimpan | ☐ |
| 3 | File `.dockerignore` dibuat | ☐ |
| 4 | 3 file test PHPUnit dibuat | ☐ |
| 5 | File `.github/workflows/ci-cd.yml` dibuat | ☐ |
| 6 | Git remote URL di VPS sudah dikonfigurasi | ☐ |
| 7 | Push ke `main` → test otomatis jalan di GitHub Actions | ☐ |
| 8 | Test lulus → auto deploy ke VPS berhasil | ☐ |
| 9 | Notifikasi Telegram diterima (berhasil & gagal) | ☐ |
| 10 | Branch protection rule aktif (opsional) | ☐ |

---

### 🗺️ Cheat Sheet — Alur Kerja Sehari-hari Setelah CI/CD Aktif

Mulai sekarang, setiap kali lu mau update website Dancell, alurnya jadi **SUPER SIMPEL**:

```
# 1. Edit kodingan di laptop lu
# 2. Commit perubahan
git add .
git commit -m "fix: perbaiki tampilan footer di mobile"

# 3. Push ke GitHub
git push origin main

# 4. SELESAI! Duduk santai & tunggu notifikasi Telegram ☕
#    GitHub Actions otomatis:
#    → Jalankan test
#    → Deploy ke VPS
#    → Kirim laporan ke HP lu
```

**Gak perlu buka PuTTY, gak perlu SSH ke VPS, gak perlu ketik command manual lagi!** 🎉

---

### 📊 Ringkasan Akhir — SELURUH SETUP VPS SELESAI!

```
┌─────────────────────────────────────────────────────────────────┐
│           🏆 VPS DANCELL — FULLY PRODUCTION READY 🏆            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ✅ Tahap 1: Security Hardening (SSH, UFW, Fail2ban)            │
│  ✅ Tahap 2: MySQL, Redis & Deploy Dancell (Docker)             │
│  ✅ Tahap 3: Vendor Isolation (User, DB, Folder terpisah)       │
│  ✅ Tahap 4: Automated Backup (MySQL dump → Google Drive)       │
│  ✅ Tahap 5: Monitoring & Alerting (Health check → Telegram)    │
│  ✅ Tahap 6: CI/CD Pipeline (GitHub Actions → Auto Deploy)      │
│                                                                 │
│  🤖 Otomatisasi Aktif:                                          │
│  • Setiap 5 menit  → Server health monitoring                   │
│  • Jam 02:00       → Backup otomatis + upload Google Drive      │
│  • Jam 08:00       → Daily report ke Telegram                   │
│  • Setiap git push → Test otomatis + auto deploy                │
│                                                                 │
│  📱 Notifikasi Telegram:                                        │
│  • 🚨 Alert darurat (container crash, disk penuh)                │
│  • 💾 Laporan backup harian                                     │
│  • 📊 Daily health report                                       │
│  • 🚀 Deploy report (berhasil/gagal)                            │
│                                                                 │
│  🛡️ Keamanan:                                                   │
│  • SSH Key-only, Firewall, Fail2ban                             │
│  • Vendor terisolasi (folder, database, container)              │
│  • Test wajib lulus sebelum deploy ke production                 │
│  • Backup otomatis ke cloud (disaster recovery ready)           │
│                                                                 │
│              💎 ENTERPRISE-GRADE INFRASTRUCTURE 💎               │
└─────────────────────────────────────────────────────────────────┘
```
