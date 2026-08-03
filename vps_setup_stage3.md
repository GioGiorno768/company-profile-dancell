# 🔐 Panduan Setup VPS Tahap 3 — Setup Akses Vendor Terisolasi

> **Prasyarat**: Tahap 1 (Hardening) & Tahap 2 (MySQL, Redis, Deploy Dancell) sudah **selesai & berjalan**.  
> **Tujuan Akhir Tahap Ini**: Vendor punya akses SSH terbatas ke VPS, punya database sendiri yang terpisah dari Dancell, punya folder project sendiri yang terisolasi, dan bisa deploy project mereka tanpa bisa menyentuh/membaca file project Dancell lu.  
> **Waktu Estimasi**: ~15 - 20 menit per vendor

---

## 📋 Overview Alur Tahap Ketiga

```
Step 1  →  Buat User Linux Khusus Vendor
Step 2  →  Setup SSH Key Vendor (Agar Vendor Bisa Login)
Step 3  →  Batasi Akses Folder (Isolasi File Dancell dari Vendor)
Step 4  →  Buat Database & User MySQL Khusus Vendor
Step 5  →  Siapkan Folder Project Vendor
Step 6  →  Berikan Akses Docker ke Vendor
Step 7  →  Buat Template docker-compose.yml untuk Project Vendor
Step 8  →  Hubungkan Domain Vendor di Nginx Proxy Manager
Step 9  →  Verifikasi Isolasi Keamanan
Step 10 →  Panduan Onboarding Vendor (Info yang Perlu Dikirim ke Vendor)
```

---

## 🏗️ Arsitektur Isolasi yang Akan Kita Bangun

```
VPS Server (4 GB RAM)
│
├── User: dancell (Admin / Pemilik VPS)
│   ├── /var/www/dancell/          ← Project Dancell (TERKUNCI dari vendor!)
│   ├── /opt/databases/            ← MySQL & Redis shared services
│   └── /opt/nginx-proxy-manager/  ← Reverse proxy & SSL
│
├── User: vendor-projek-a (Vendor A)
│   └── /var/www/vendor-projek-a/  ← Project Vendor A (HANYA vendor A yg bisa akses)
│       ├── docker-compose.yml
│       ├── Dockerfile
│       ├── .env
│       └── (source code vendor)
│
├── User: vendor-projek-b (Vendor B — contoh vendor kedua)
│   └── /var/www/vendor-projek-b/  ← Project Vendor B (HANYA vendor B yg bisa akses)
│
└── Shared Docker Network: dancell-net
    ├── shared-mysql   (Semua project share 1 MySQL engine, tapi BEDA database & user)
    ├── shared-redis   (Semua project share 1 Redis engine, tapi BEDA password/DB index)
    ├── dancell-app    (Container Dancell — vendor gak bisa masuk)
    └── vendor-a-app   (Container Vendor A — dancell & vendor B gak bisa masuk)
```

> [!NOTE]
> Panduan ini menggunakan contoh nama vendor `vendor-projek-a`. Ganti dengan nama yang sesuai untuk setiap vendor yang lu tambahkan (misal: `vendor-toko-online`, `vendor-landing-page`, dll).

---

## Step 1: Buat User Linux Khusus Vendor

Setiap vendor yang diberi akses ke VPS lu **WAJIB** punya user Linux sendiri. Jangan pernah kasih password user `dancell` atau `root` ke vendor!

**Login ke VPS sebagai user `dancell`:**

```bash
ssh dancell@IP_VPS_LU
```

**Buat user baru untuk vendor:**

```bash
sudo adduser vendor-projek-a
```

> Saat diminta:
> 1. **New password**: Ketik password sementara (nanti vendor akan login pakai SSH Key, bukan password ini). Tekan Enter.
> 2. **Retype new password**: Ketik ulang. Tekan Enter.
> 3. **Full Name, Room Number, dll**: Boleh dikosongin, langsung tekan Enter.
> 4. **Is the information correct? [Y/n]**: Ketik `Y` lalu Enter.

> [!IMPORTANT]
> **JANGAN** tambahkan vendor ke grup `sudo`! Vendor tidak boleh punya akses administrator. Kalau mereka butuh sesuatu yang memerlukan `sudo`, mereka harus minta ke lu.

**Verifikasi user berhasil dibuat:**

```bash
id vendor-projek-a
```

> Output yang diharapkan (TIDAK ADA `sudo` di groups!):
> ```
> uid=1001(vendor-projek-a) gid=1001(vendor-projek-a) groups=1001(vendor-projek-a)
> ```

---

## Step 2: Setup SSH Key Vendor

Ada 2 skenario untuk memberikan akses SSH ke vendor:

### Skenario A: Vendor Sudah Punya SSH Key (Paling Umum & Direkomendasikan)

Minta vendor untuk mengirimkan **Public Key** mereka ke lu (biasanya file `id_ed25519.pub` atau `id_rsa.pub`). File ini **AMAN untuk dikirim** — ini bukan private key.

Setelah lu terima public key vendor (berupa teks yang diawali `ssh-ed25519 AAAA...` atau `ssh-rsa AAAA...`), jalankan perintah berikut:

```bash
sudo mkdir -p /home/vendor-projek-a/.ssh
```

```bash
sudo nano /home/vendor-projek-a/.ssh/authorized_keys
```

> Paste public key vendor ke dalam file ini (satu baris utuh). Simpan (`Ctrl + O`, Enter, `Ctrl + X`).

**Set permission yang tepat:**

```bash
sudo chown -R vendor-projek-a:vendor-projek-a /home/vendor-projek-a/.ssh
sudo chmod 700 /home/vendor-projek-a/.ssh
sudo chmod 600 /home/vendor-projek-a/.ssh/authorized_keys
```

### Skenario B: Lu yang Membuatkan SSH Key untuk Vendor

Kalau vendor belum punya SSH Key, lu bisa buatkan untuk mereka:

```bash
sudo -u vendor-projek-a ssh-keygen -t ed25519 -C "vendor-projek-a" -f /home/vendor-projek-a/.ssh/id_ed25519 -N ""
```

```bash
sudo cp /home/vendor-projek-a/.ssh/id_ed25519.pub /home/vendor-projek-a/.ssh/authorized_keys
sudo chmod 600 /home/vendor-projek-a/.ssh/authorized_keys
```

> Kemudian kirimkan file **private key** (`/home/vendor-projek-a/.ssh/id_ed25519`) ke vendor melalui jalur aman (WhatsApp/Telegram/email terenkripsi). 
>
> Untuk melihat isi private key yang akan dikirim ke vendor:
> ```bash
> sudo cat /home/vendor-projek-a/.ssh/id_ed25519
> ```
> Vendor harus menyimpan file ini di PC mereka di `~/.ssh/id_ed25519_vps` dan menggunakannya untuk login.

---

### Tambahkan Vendor ke Daftar AllowUsers SSH

Ingat di Tahap 1 kita menambahkan `AllowUsers dancell` di config SSH. Sekarang kita perlu menambahkan vendor juga:

```bash
sudo nano /etc/ssh/sshd_config
```

**Cari baris `AllowUsers` dan tambahkan nama user vendor:**

```text
AllowUsers dancell vendor-projek-a
```

> Kalau nanti ada vendor kedua, tinggal tambahkan lagi:
> ```text
> AllowUsers dancell vendor-projek-a vendor-projek-b
> ```

**Simpan** (`Ctrl + O`, Enter, `Ctrl + X`), lalu restart SSH:

```bash
sudo systemctl restart ssh
```

**Test login vendor (buka terminal/CMD baru di PC lu):**

```bash
ssh vendor-projek-a@IP_VPS_LU
```

> Kalau berhasil masuk sebagai `vendor-projek-a@vps:~$`, setup SSH vendor **berhasil!**

---

## Step 3: Batasi Akses Folder (Isolasi File Dancell dari Vendor)

Ini adalah langkah paling krusial dari sisi keamanan. Kita akan memastikan:
- ❌ Vendor **TIDAK BISA** membaca folder `/var/www/dancell/` (source code & `.env` lu aman!).
- ❌ Vendor **TIDAK BISA** membaca folder `/opt/databases/` (password MySQL/Redis lu aman!).
- ✅ Vendor **HANYA BISA** mengakses folder project mereka sendiri.

**Kunci folder project Dancell:**

```bash
sudo chmod 750 /var/www/dancell
```

> Penjelasan permission `750`:
> - `7` (Owner = dancell): Bisa baca, tulis, eksekusi.
> - `5` (Group = dancell): Bisa baca & eksekusi.
> - `0` (Others = semua user lain termasuk vendor): **TIDAK BISA AKSES SAMA SEKALI!**

**Kunci folder shared databases (password MySQL & Redis):**

```bash
sudo chmod 750 /opt/databases
```

**Kunci folder Nginx Proxy Manager:**

```bash
sudo chmod 750 /opt/nginx-proxy-manager
```

**Verifikasi isolasi — coba akses sebagai vendor:**

```bash
sudo -u vendor-projek-a ls /var/www/dancell/
```

> Output yang diharapkan:
> ```
> ls: cannot open directory '/var/www/dancell/': Permission denied
> ```
> **PERFECT!** Vendor tidak bisa melihat isi folder Dancell lu! 🛡️

```bash
sudo -u vendor-projek-a cat /opt/databases/docker-compose.yml
```

> Output yang diharapkan:
> ```
> cat: /opt/databases/docker-compose.yml: Permission denied
> ```
> **PERFECT!** Vendor tidak bisa membaca password database lu! 🛡️

---

## Step 4: Buat Database & User MySQL Khusus Vendor

Sama seperti Dancell punya database & user MySQL sendiri, setiap vendor juga harus punya database terpisah.

**Masuk ke MySQL:**

```bash
docker exec -it shared-mysql mysql -u root -p
```

*(Masukkan password root MySQL lu)*

**Jalankan perintah SQL berikut:**

```sql
CREATE DATABASE vendor_projek_a_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```
> Membuat database baru khusus untuk project vendor.

```sql
CREATE USER 'vendor_a_user'@'%' IDENTIFIED BY 'VendorApass2026!';
```
> Membuat user MySQL baru untuk vendor. **GANTI PASSWORD** dengan yang kuat!

```sql
GRANT ALL PRIVILEGES ON vendor_projek_a_db.* TO 'vendor_a_user'@'%';
```
> Memberikan user `vendor_a_user` akses **HANYA** ke database `vendor_projek_a_db`. User ini **TIDAK BISA** mengakses database `dancell_db` milik lu!

```sql
FLUSH PRIVILEGES;
exit
```

> [!TIP]
> Kalau mau double-check bahwa vendor gak bisa akses database Dancell:
> ```bash
> docker exec -it shared-mysql mysql -u vendor_a_user -p
> ```
> Masukkan password vendor, lalu ketik:
> ```sql
> USE dancell_db;
> ```
> Harus muncul error: `Access denied for user 'vendor_a_user'` ✅

---

## Step 5: Siapkan Folder Project Vendor

**Buat folder project vendor:**

```bash
sudo mkdir -p /var/www/vendor-projek-a
```

**Set kepemilikan folder ke user vendor:**

```bash
sudo chown -R vendor-projek-a:vendor-projek-a /var/www/vendor-projek-a
```

**Set permission agar hanya vendor yang bisa akses:**

```bash
sudo chmod 750 /var/www/vendor-projek-a
```

> Dengan ini:
> - ✅ User `vendor-projek-a` bisa baca/tulis/eksekusi di foldernya sendiri.
> - ❌ User `dancell` dan vendor lain **tidak bisa** masuk ke folder ini (kecuali pakai `sudo`).

---

## Step 6: Berikan Akses Docker ke Vendor

Agar vendor bisa menjalankan `docker compose up -d` untuk project mereka, mereka perlu ditambahkan ke grup `docker`:

```bash
sudo usermod -aG docker vendor-projek-a
```

> [!WARNING]
> Memberikan akses Docker ke vendor artinya mereka secara teknis bisa menjalankan container apapun. Namun, karena mereka **tidak punya akses `sudo`** dan **tidak bisa membaca folder Dancell**, risiko keamanannya sudah sangat diminimalisir. Ini adalah *trade-off* yang diperlukan agar vendor bisa mandiri mengelola deployment mereka.

---

## Step 7: Buat Template docker-compose.yml untuk Project Vendor

Lu bisa menyiapkan file template `docker-compose.yml` di folder vendor agar mereka tinggal sesuaikan dengan project mereka.

**Buat file template:**

```bash
sudo nano /var/www/vendor-projek-a/docker-compose.yml
```

**Contoh template untuk project Laravel:**

```yaml
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: vendor-a-app
    restart: unless-stopped
    env_file:
      - .env
    volumes:
      - ./storage:/var/www/html/storage
    networks:
      - dancell-net

networks:
  dancell-net:
    external: true
```

**Contoh template untuk project Node.js / Next.js:**

```yaml
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: vendor-a-app
    restart: unless-stopped
    env_file:
      - .env
    ports:
      - '127.0.0.1:3001:3000'
    networks:
      - dancell-net

networks:
  dancell-net:
    external: true
```

> **Penjelasan:**
> - `container_name: vendor-a-app` → Nama unik untuk container vendor. Harus berbeda dari `dancell-app`.
> - `networks: dancell-net` → Terhubung ke network yang sama agar bisa akses MySQL & Redis.
> - `ports: 127.0.0.1:3001:3000` → Untuk project Node.js, expose port internal ke localhost saja. NPM akan meneruskan traffic dari domain vendor ke port ini.

**Set kepemilikan file ke vendor:**

```bash
sudo chown -R vendor-projek-a:vendor-projek-a /var/www/vendor-projek-a/
```

---

## Step 8: Hubungkan Domain Vendor di Nginx Proxy Manager

Setelah vendor deploy project mereka dan container-nya berjalan, lu perlu menambahkan **Proxy Host** baru di NPM.

### A. Minta Vendor Pointing DNS Domain Mereka ke IP VPS Lu

Vendor harus mengarahkan domain mereka ke IP VPS lu di DNS provider mereka:

| Type | Name | Value |
|---|---|---|
| `A` | `@` | `IP_VPS_LU` |
| `A` | `www` | `IP_VPS_LU` |

### B. Tambahkan Proxy Host Baru di NPM

1. Buka **Dashboard NPM**: `http://IP_VPS_LU:81`
2. Login sebagai admin.
3. Klik **"Proxy Hosts"** → **"Add Proxy Host"**.

**Tab "Details":**

| Field | Value |
|---|---|
| **Domain Names** | `domain-vendor.com` |
| **Scheme** | `http` |
| **Forward Hostname / IP** | `vendor-a-app` (nama container Docker vendor) |
| **Forward Port** | `8080` (untuk Laravel) atau `3000` (untuk Node.js) |
| **Block Common Exploits** | ✅ Centang |

**Tab "SSL":**

| Field | Value |
|---|---|
| **SSL Certificate** | `Request a new SSL Certificate` |
| **Force SSL** | ✅ Centang |
| **HTTP/2 Support** | ✅ Centang |
| **Email** | Email aktif lu |
| **I Agree** | ✅ Centang |

4. Klik **Save**.

---

## Step 9: Verifikasi Isolasi Keamanan

Ini adalah langkah final yang SANGAT PENTING untuk memastikan vendor benar-benar terisolasi.

**Jalankan perintah-perintah verifikasi ini:**

```bash
echo "=== Test 1: Vendor TIDAK BISA baca folder Dancell ==="
sudo -u vendor-projek-a ls /var/www/dancell/ 2>&1

echo ""
echo "=== Test 2: Vendor TIDAK BISA baca password database ==="
sudo -u vendor-projek-a cat /opt/databases/docker-compose.yml 2>&1

echo ""
echo "=== Test 3: Vendor TIDAK BISA baca NPM config ==="
sudo -u vendor-projek-a ls /opt/nginx-proxy-manager/ 2>&1

echo ""
echo "=== Test 4: Vendor TIDAK BISA pakai sudo ==="
sudo -u vendor-projek-a sudo ls / 2>&1

echo ""
echo "=== Test 5: Vendor BISA akses folder sendiri ==="
sudo -u vendor-projek-a ls /var/www/vendor-projek-a/ 2>&1

echo ""
echo "=== Test 6: Dancell TIDAK BISA baca folder vendor ==="
ls /var/www/vendor-projek-a/ 2>&1
```

> **Hasil yang diharapkan:**
> ```
> === Test 1: Vendor TIDAK BISA baca folder Dancell ===
> ls: cannot open directory '/var/www/dancell/': Permission denied
> 
> === Test 2: Vendor TIDAK BISA baca password database ===
> cat: /opt/databases/docker-compose.yml: Permission denied
> 
> === Test 3: Vendor TIDAK BISA baca NPM config ===
> ls: cannot open directory '/opt/nginx-proxy-manager/': Permission denied
> 
> === Test 4: Vendor TIDAK BISA pakai sudo ===
> vendor-projek-a is not in the sudoers file.
> 
> === Test 5: Vendor BISA akses folder sendiri ===
> docker-compose.yml
> 
> === Test 6: Dancell TIDAK BISA baca folder vendor ===
> ls: cannot open directory '/var/www/vendor-projek-a/': Permission denied
> ```
> 
> Kalau semua test menunjukkan hasil di atas, **ISOLASI KEAMANAN 100% BERHASIL!** 🛡️

---

## Step 10: Panduan Onboarding Vendor

Setelah semua setup selesai, berikut adalah informasi yang perlu lu kirimkan ke vendor agar mereka bisa mulai bekerja.

### 📋 Template Pesan untuk Vendor

```
Halo [Nama Vendor],

Berikut akses VPS untuk project [Nama Project]:

═══════════════════════════════════════
  AKSES SSH
═══════════════════════════════════════
  Host     : [IP_VPS_LU]
  Port     : 22
  Username : vendor-projek-a
  Auth     : SSH Key (private key terlampir / yang sudah kamu kirim)
  
  Cara login:
  ssh vendor-projek-a@[IP_VPS_LU]

═══════════════════════════════════════
  AKSES DATABASE (MySQL 8.0)
═══════════════════════════════════════
  Host     : shared-mysql  (gunakan nama ini di .env / config)
  Port     : 3306
  Database : vendor_projek_a_db
  Username : vendor_a_user
  Password : [PASSWORD_VENDOR_DB]
  
  Untuk akses via GUI (TablePlus/DBeaver), 
  gunakan fitur SSH Tunnel dengan kredensial SSH di atas.

═══════════════════════════════════════
  AKSES REDIS (Redis 7)
═══════════════════════════════════════
  Host     : shared-redis  (gunakan nama ini di .env / config)
  Port     : 6379
  Password : [REDIS_PASSWORD]
  DB Index : 2  (gunakan DB index 2 agar terpisah dari project lain)

═══════════════════════════════════════
  FOLDER PROJECT
═══════════════════════════════════════
  Path     : /var/www/vendor-projek-a/
  
  Template docker-compose.yml sudah disiapkan di folder tersebut.
  Silakan clone repo project ke folder ini dan sesuaikan Dockerfile.

═══════════════════════════════════════
  DOCKER (Deployment)
═══════════════════════════════════════
  Kamu sudah punya akses Docker.
  
  Cara deploy:
  1. cd /var/www/vendor-projek-a
  2. git clone [REPO_URL] .
  3. Sesuaikan Dockerfile & .env
  4. docker compose up -d --build
  
  Container name: vendor-a-app
  Internal port : 8080 (Laravel) atau 3000 (Node.js)

═══════════════════════════════════════
  DOMAIN & SSL
═══════════════════════════════════════
  Pointing DNS domain kamu ke IP: [IP_VPS_LU]
  SSL HTTPS akan diaktifkan otomatis setelah DNS aktif.

═══════════════════════════════════════
  ATURAN & BATASAN
═══════════════════════════════════════
  ⛔ Kamu TIDAK memiliki akses sudo/root.
  ⛔ Kamu TIDAK bisa mengakses folder/project lain di server ini.
  ⛔ Jangan mengubah konfigurasi Nginx/Firewall/SSH.
  ⛔ Jangan membuka port baru atau menjalankan service di luar Docker.
  ✅ Kalau butuh bantuan terkait server, hubungi saya.

Terima kasih!
```

---

## 🔄 Menambahkan Vendor Baru di Kemudian Hari

Kalau di masa depan lu perlu menambahkan vendor baru lagi, tinggal ulangi langkah-langkah berikut:

```bash
# 1. Buat user baru
sudo adduser vendor-projek-b

# 2. Setup SSH Key (minta public key dari vendor)
sudo mkdir -p /home/vendor-projek-b/.ssh
sudo nano /home/vendor-projek-b/.ssh/authorized_keys
# (paste public key vendor)
sudo chown -R vendor-projek-b:vendor-projek-b /home/vendor-projek-b/.ssh
sudo chmod 700 /home/vendor-projek-b/.ssh
sudo chmod 600 /home/vendor-projek-b/.ssh/authorized_keys

# 3. Tambahkan ke AllowUsers SSH
sudo nano /etc/ssh/sshd_config
# Ubah: AllowUsers dancell vendor-projek-a vendor-projek-b
sudo systemctl restart ssh

# 4. Buat folder project
sudo mkdir -p /var/www/vendor-projek-b
sudo chown -R vendor-projek-b:vendor-projek-b /var/www/vendor-projek-b
sudo chmod 750 /var/www/vendor-projek-b

# 5. Berikan akses Docker
sudo usermod -aG docker vendor-projek-b

# 6. Buat database terpisah
docker exec -it shared-mysql mysql -u root -p
# CREATE DATABASE vendor_projek_b_db ...
# CREATE USER 'vendor_b_user'@'%' ...
# GRANT ALL PRIVILEGES ON vendor_projek_b_db.* TO 'vendor_b_user'@'%';
# FLUSH PRIVILEGES; exit

# 7. Tambahkan Proxy Host di NPM untuk domain vendor baru
```

---

## ✅ Checklist Akhir Tahap Ketiga

| No | Item | Status |
|---|---|---|
| 1 | User Linux `vendor-projek-a` dibuat (**tanpa** sudo) | ☐ |
| 2 | SSH Key vendor terpasang di `authorized_keys` | ☐ |
| 3 | Vendor ditambahkan ke `AllowUsers` di `sshd_config` | ☐ |
| 4 | Folder `/var/www/dancell` terkunci dari vendor (`chmod 750`) | ☐ |
| 5 | Folder `/opt/databases` terkunci dari vendor | ☐ |
| 6 | Database `vendor_projek_a_db` & user MySQL vendor dibuat | ☐ |
| 7 | Folder `/var/www/vendor-projek-a` dibuat & dimiliki vendor | ☐ |
| 8 | Vendor ditambahkan ke grup `docker` | ☐ |
| 9 | Template `docker-compose.yml` disiapkan di folder vendor | ☐ |
| 10 | Proxy Host vendor dikonfigurasi di NPM (setelah vendor deploy) | ☐ |
| 11 | Semua tes isolasi keamanan (Step 9) **LULUS** | ☐ |
| 12 | Info onboarding dikirim ke vendor | ☐ |

---

## 📊 Estimasi Penggunaan Resource Setelah Tahap 3

```
┌───────────────────────────────────────────────────────────┐
│ ESTIMASI RAM VPS SETELAH + 1 VENDOR (TOTAL: 4.000 MB)     │
├───────────────────────────────────────────────────────────┤
│ 🔹 Ubuntu OS Baseline           : ~ 250 MB                │
│ 🔹 Docker Daemon                : ~  30 MB                │
│ 🔹 Nginx Proxy Manager          : ~  60 MB                │
│ 🔹 MySQL (shared)               : ~ 250 MB                │
│ 🔹 Redis (shared)               : ~  30 MB                │
│ 🔹 Dancell App Container        : ~  80 MB                │
│ 🔹 Vendor A App Container       : ~  80 MB                │
├───────────────────────────────────────────────────────────┤
│ 📊 TOTAL TERPAKAI               : ~ 780 MB                │
│ 🚀 RAM BEBAS SISA               : ~ 3.220 MB (3,2 GB!)    │
│ 📦 Masih bisa tampung           : ~ 3-4 vendor tambahan    │
└───────────────────────────────────────────────────────────┘
```

---

## 🔜 Tahap Selanjutnya

Setelah tahap 3 ini selesai:
1. **Tahap 4**: Setup Automated Backup (backup database & file otomatis ke cloud storage harian/mingguan).
2. **Tahap 5**: Monitoring & Alerting (notifikasi Telegram/WA kalau server down, disk penuh, atau container crash).
