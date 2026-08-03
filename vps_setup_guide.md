# 🖥️ Panduan Setup VPS Tahap Pertama (Initial Server Hardening + Docker)

> **Spesifikasi VPS**: 2 vCPU / 4 GB RAM / 80 GB Storage / Ubuntu 22.04 atau 24.04  
> **Tools Yang Dibutuhkan**: PuTTY (sudah terinstal di PC lu)  
> **Waktu Estimasi**: ~15 - 20 menit  
> **Tujuan Akhir Tahap Ini**: VPS lu punya **Firewall aktif**, **SSH yang aman**, **Docker siap pakai**, dan **Nginx Proxy Manager** yang hidup di browser buat ngatur domain + SSL gratis.

---

## 📋 Overview Alur Tahap Pertama

```
Step 1  →  Login ke VPS via PuTTY (sebagai root)
Step 2  →  Update & Upgrade Semua Paket OS
Step 3  →  Buat User Admin Baru (Jangan pakai root terus!)
Step 4  →  Copy SSH Key ke User Baru
Step 5  →  Hardening SSH (Matikan Root Login & Password Login)
Step 6  →  Setup UFW Firewall (Buka Port yang diperlukan saja)
Step 7  →  Install Fail2ban (Anti Brute-Force SSH)
Step 8  →  Install Docker & Docker Compose
Step 9  →  Deploy Nginx Proxy Manager (Reverse Proxy + SSL Manager)
Step 10 →  Verifikasi Semua Service Berjalan
```

---

## Step 1: Login ke VPS via PuTTY

1. Buka **PuTTY** di PC lu.
2. Di kolom **Host Name (or IP address)**, masukkan **IP Publik VPS** lu (contoh: `103.xxx.xxx.xxx`).
3. Port tetap **22**, Connection type: **SSH**.
4. Kalau lu sudah setup SSH Key sebelumnya:
   - Klik menu kiri **Connection → SSH → Auth → Credentials**.
   - Di bagian **Private key file for authentication**, browse dan pilih file `.ppk` (private key PuTTY lu).
5. Klik **Open**.
6. Ketika muncul `login as:`, ketik:
   ```
   root
   ```
7. Kalau berhasil, lu bakal lihat terminal prompt seperti ini:
   ```
   root@vps-dancell:~#
   ```

> [!NOTE]
> Kalau lu belum setup SSH Key dan masih login pakai password, itu gak papa dulu. Nanti di Step 5 kita akan amankan.

---

## Step 2: Update & Upgrade Semua Paket OS

Ini wajib dilakukan **pertama kali** setelah VPS baru dibuat. Tujuannya supaya semua paket software di server lu pakai versi terbaru dan patch keamanan terbaru.

**Ketik command ini (copy-paste satu per satu):**

```bash
apt update
```
> Perintah ini mengecek dan mendownload daftar update terbaru dari repository Ubuntu.

```bash
apt upgrade -y
```
> Perintah ini menginstall semua update yang tersedia. Flag `-y` artinya otomatis jawab "Yes" ke semua pertanyaan konfirmasi.

```bash
apt install -y curl git htop unzip nano software-properties-common
```
> Ini menginstall tools dasar yang akan sering kita pakai:
> - `curl` → download file dari internet via command line
> - `git` → version control (buat deploy project nanti)
> - `htop` → monitoring RAM & CPU secara realtime (mirip Task Manager)
> - `unzip` → ekstrak file `.zip`
> - `nano` → text editor sederhana di terminal
> - `software-properties-common` → diperlukan buat menambah repository eksternal

---

## Step 3: Buat User Admin Baru

> [!IMPORTANT]
> **JANGAN PERNAH** pakai user `root` untuk kegiatan sehari-hari di server! Kalau lu salah ketik command, `root` bisa menghapus seluruh sistem tanpa konfirmasi. Kita bikin user baru yang punya akses `sudo` (hak admin saat dibutuhkan).

**Buat user baru** (ganti `dancell` dengan nama user yang lu mau):

```bash
adduser dancell
```

> Setelah tekan Enter, sistem akan menanyakan:
> 1. **New password**: Ketik password baru (TIDAK AKAN TERLIHAT saat diketik, ini normal!). Tekan Enter.
> 2. **Retype new password**: Ketik ulang password yang sama. Tekan Enter.
> 3. **Full Name, Room Number, dll**: Boleh dikosongin semua, langsung tekan Enter beberapa kali.
> 4. **Is the information correct? [Y/n]**: Ketik `Y` lalu Enter.

**Berikan hak sudo (akses administrator):**

```bash
usermod -aG sudo dancell
```

> Perintah ini menambahkan user `dancell` ke grup `sudo`, sehingga dia bisa menjalankan perintah admin dengan awalan `sudo`.

**Verifikasi user berhasil dibuat:**

```bash
id dancell
```

> Output yang diharapkan kira-kira:
> ```
> uid=1000(dancell) gid=1000(dancell) groups=1000(dancell),27(sudo)
> ```
> Pastikan ada tulisan `sudo` di dalam `groups`.

---

## Step 4: Copy SSH Key ke User Baru

Supaya nanti lu bisa login ke VPS pakai SSH Key langsung sebagai user `dancell` (tanpa password), kita perlu meng-copy SSH Key dari `root` ke user baru.

```bash
mkdir -p /home/dancell/.ssh
```
> Buat folder `.ssh` di home directory user `dancell`.

```bash
cp /root/.ssh/authorized_keys /home/dancell/.ssh/authorized_keys
```
> Copy file SSH public key yang sudah terdaftar di `root` ke user `dancell`.

```bash
chown -R dancell:dancell /home/dancell/.ssh
```
> Ubah kepemilikan folder `.ssh` menjadi milik user `dancell`.

```bash
chmod 700 /home/dancell/.ssh
chmod 600 /home/dancell/.ssh/authorized_keys
```
> Set permission yang tepat. `700` artinya hanya pemilik yang bisa akses folder. `600` artinya hanya pemilik yang bisa baca file key.

**Test login dengan user baru (JANGAN TUTUP PUTTY YANG SEKARANG!):**

1. Buka **PuTTY baru** (jendela kedua).
2. Masukkan IP VPS yang sama.
3. Login sebagai `dancell` (bukan `root`).
4. Kalau berhasil masuk, lanjut ke Step 5.

> [!CAUTION]
> **JANGAN TUTUP jendela PuTTY root yang pertama!** Kalau lu tutup sebelum memastikan user `dancell` bisa login, dan ternyata ada masalah di SSH config, lu bisa **terkunci dari server lu sendiri** (lockout). Selalu pastikan bisa login dengan user baru di jendela PuTTY terpisah sebelum menutup session root.

---

## Step 5: Hardening SSH (Amankan Akses SSH)

Sekarang kita akan melakukan 3 perubahan keamanan penting di konfigurasi SSH:
1. ❌ Matikan login `root` via SSH.
2. ❌ Matikan login pakai password (paksa wajib SSH Key).
3. ✅ Hanya user `dancell` yang bisa SSH ke server.

**Edit file konfigurasi SSH:**

```bash
sudo nano /etc/ssh/sshd_config
```

> Ini akan membuka file config SSH di text editor `nano`. Lu perlu mencari dan mengubah beberapa baris. Pakai `Ctrl + W` untuk mencari teks.

**Cari dan ubah baris-baris berikut:**

```
# Cari baris PermitRootLogin (tekan Ctrl+W, ketik PermitRootLogin)
# Ubah dari:
PermitRootLogin yes
# Menjadi:
PermitRootLogin no

# Cari baris PasswordAuthentication (tekan Ctrl+W, ketik PasswordAuthentication)
# Ubah dari:
PasswordAuthentication yes
# Menjadi:
PasswordAuthentication no
```

**Tambahkan baris ini di paling bawah file:**

```
AllowUsers dancell
```

> Baris ini membatasi hanya user `dancell` yang diperbolehkan login SSH. Vendor nanti akan ditambahkan di sini juga (misal: `AllowUsers dancell vendor-app`).

**Simpan dan keluar dari nano:**
- Tekan `Ctrl + O` lalu `Enter` (save).
- Tekan `Ctrl + X` (keluar).

**Restart service SSH agar perubahan berlaku:**

```bash
sudo systemctl restart sshd
```

> [!WARNING]
> Sekali lagi, **PASTIKAN** lu sudah bisa login sebagai user `dancell` di jendela PuTTY terpisah **SEBELUM** menutup session root! Coba buka PuTTY baru dan login sebagai `dancell` sekarang. Kalau berhasil, baru boleh tutup session root.

---

## Step 6: Setup UFW Firewall

UFW (Uncomplicated Firewall) adalah firewall bawaan Ubuntu yang simpel dan mudah dikonfigurasi. Kita akan menutup **semua port** kecuali yang kita butuhkan.

**Jalankan command berikut satu per satu** (sekarang lu sudah login sebagai `dancell`, jadi pakai `sudo`):

```bash
sudo ufw default deny incoming
```
> Blokir SEMUA koneksi masuk secara default.

```bash
sudo ufw default allow outgoing
```
> Izinkan semua koneksi keluar (server tetap bisa download update, dll).

```bash
sudo ufw allow 22/tcp
```
> Buka port 22 untuk SSH (supaya kita masih bisa login!).

```bash
sudo ufw allow 80/tcp
```
> Buka port 80 untuk HTTP (website).

```bash
sudo ufw allow 443/tcp
```
> Buka port 443 untuk HTTPS (website dengan SSL).

```bash
sudo ufw allow 81/tcp
```
> Buka port 81 untuk Dashboard Nginx Proxy Manager (nanti bisa ditutup setelah setup selesai jika mau lebih aman).

```bash
sudo ufw --force enable
```
> Aktifkan firewall. Flag `--force` supaya langsung aktif tanpa konfirmasi.

**Verifikasi status firewall:**

```bash
sudo ufw status verbose
```

> Output yang diharapkan:
> ```
> Status: active
> 
> To             Action      From
> --             ------      ----
> 22/tcp         ALLOW IN    Anywhere
> 80/tcp         ALLOW IN    Anywhere
> 443/tcp        ALLOW IN    Anywhere
> 81/tcp         ALLOW IN    Anywhere
> ```

> [!TIP]
> Port database MySQL (3306) dan Redis (6379) **SENGAJA TIDAK DIBUKA** ke publik. Database hanya bisa diakses dari dalam server saja (localhost). Ini sangat penting untuk keamanan!

---

## Step 7: Install Fail2ban (Anti Brute-Force SSH)

Fail2ban akan otomatis **memblokir IP** yang mencoba login SSH berkali-kali dan gagal (brute-force attack). Ini penting banget karena VPS dengan IP publik pasti akan diserang bot scanner 24/7.

```bash
sudo apt install -y fail2ban
```

**Buat file konfigurasi lokal:**

```bash
sudo nano /etc/fail2ban/jail.local
```

**Paste konfigurasi berikut:**

```ini
[DEFAULT]
bantime  = 3600
findtime = 600
maxretry = 5

[sshd]
enabled = true
port    = 22
logpath = %(sshd_log)s
backend = %(sshd_backend)s
```

> Penjelasan:
> - `bantime = 3600` → IP yang gagal login akan diblokir selama **1 jam** (3600 detik).
> - `findtime = 600` → Jendela waktu pengecekan: **10 menit**.
> - `maxretry = 5` → Kalau gagal login **5 kali** dalam 10 menit, langsung diblokir.

**Simpan file** (`Ctrl + O`, Enter, `Ctrl + X`), lalu restart Fail2ban:

```bash
sudo systemctl enable fail2ban
sudo systemctl restart fail2ban
```

**Verifikasi Fail2ban aktif:**

```bash
sudo fail2ban-client status sshd
```

> Output yang diharapkan:
> ```
> Status for the jail: sshd
> |- Filter
> |  |- Currently failed: 0
> |  `- Total failed:     0
> `- Actions
>    |- Currently banned: 0
>    `- Total banned:     0
> ```

---

## Step 8: Install Docker & Docker Compose

Docker adalah engine container yang akan menjalankan semua project lu secara terisolasi.

**Install Docker (Perintah Resmi dari Docker):**

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

> Script ini akan mendownload dan menginstall Docker Engine versi terbaru secara otomatis. Tunggu sampai selesai (~1-2 menit).

**Tambahkan user `dancell` ke grup Docker:**

```bash
sudo usermod -aG docker dancell
```

> Ini penting supaya lu bisa menjalankan perintah `docker` tanpa harus pakai `sudo` setiap kali.

**Aktifkan perubahan grup (tanpa harus logout):**

```bash
newgrp docker
```

**Verifikasi Docker terinstall:**

```bash
docker --version
```

> Output contoh: `Docker version 27.x.x, build xxxxxxx`

```bash
docker compose version
```

> Output contoh: `Docker Compose version v2.x.x`

> [!NOTE]
> Docker Compose sudah **otomatis terinstal** bersama Docker Engine versi terbaru. Gak perlu install terpisah lagi.

---

## Step 9: Deploy Nginx Proxy Manager

Nginx Proxy Manager (NPM) adalah reverse proxy dengan **Dashboard GUI di browser**. Fungsinya:
- Mengarahkan domain/subdomain ke container project yang tepat.
- Otomatis generate & perpanjang sertifikat SSL Gratis dari Let's Encrypt.
- Semua tinggal klik-klik di browser, gak perlu edit file Nginx manual.

**Buat folder khusus untuk Nginx Proxy Manager:**

```bash
mkdir -p /opt/nginx-proxy-manager
cd /opt/nginx-proxy-manager
```

**Buat file Docker Compose:**

```bash
nano docker-compose.yml
```

**Paste konfigurasi berikut:**

```yaml
services:
  npm:
    image: 'jc21/nginx-proxy-manager:latest'
    container_name: nginx-proxy-manager
    restart: unless-stopped
    ports:
      - '80:80'
      - '81:81'
      - '443:443'
    volumes:
      - ./data:/data
      - ./letsencrypt:/etc/letsencrypt
```

> Penjelasan:
> - `image: jc21/nginx-proxy-manager:latest` → Download dan pakai image NPM resmi terbaru.
> - `restart: unless-stopped` → Container otomatis nyala ulang kalau VPS reboot.
> - `ports 80, 443` → Port untuk traffic HTTP & HTTPS website.
> - `ports 81` → Port untuk dashboard admin NPM.
> - `volumes` → Data konfigurasi & sertifikat SSL disimpan di folder lokal supaya tidak hilang saat container di-restart.

**Simpan file** (`Ctrl + O`, Enter, `Ctrl + X`).

**Jalankan Nginx Proxy Manager:**

```bash
docker compose up -d
```

> Flag `-d` artinya *detached mode* (jalan di background). Tunggu sampai muncul pesan `Container nginx-proxy-manager Started`.

**Verifikasi container berjalan:**

```bash
docker ps
```

> Output yang diharapkan (container `nginx-proxy-manager` statusnya `Up`):
> ```
> CONTAINER ID   IMAGE                             STATUS         PORTS
> xxxxxxxxxxxx   jc21/nginx-proxy-manager:latest   Up X minutes   0.0.0.0:80-81->80-81/tcp, 0.0.0.0:443->443/tcp
> ```

---

## Step 10: Verifikasi & Akses Dashboard Nginx Proxy Manager

### 🌐 Buka Browser di PC Lu

Buka URL berikut di browser (Chrome / Firefox):

```
http://IP_VPS_LU:81
```

> Ganti `IP_VPS_LU` dengan IP publik VPS lu yang asli (contoh: `http://103.xxx.xxx.xxx:81`).

### 🔑 Login Pertama Kali

Gunakan kredensial default ini:

| Field | Value |
|---|---|
| **Email** | `admin@example.com` |
| **Password** | `changeme` |

Setelah login, NPM akan **memaksa lu mengubah password** dan email admin. **WAJIB GANTI** ke email & password lu sendiri yang kuat!

### ✅ Verifikasi Semua Service di Terminal

Kembali ke PuTTY, jalankan perintah ini untuk memastikan semua service aktif:

```bash
echo "=== UFW Firewall ===" && sudo ufw status | head -5
echo "=== Fail2ban ===" && sudo fail2ban-client status sshd | tail -5
echo "=== Docker ===" && docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo "=== Disk Usage ===" && df -h / | tail -1
echo "=== Memory Usage ===" && free -h | grep Mem
```

---

## ✅ Checklist Akhir Tahap Pertama

Setelah semua langkah di atas selesai, pastikan semua poin ini terpenuhi:

| No | Item | Status |
|---|---|---|
| 1 | OS Updated & Upgraded | ☐ |
| 2 | User `dancell` dibuat dengan akses `sudo` | ☐ |
| 3 | SSH Key ter-copy ke user `dancell` | ☐ |
| 4 | Login root via SSH sudah **dimatikan** | ☐ |
| 5 | Login password via SSH sudah **dimatikan** | ☐ |
| 6 | UFW Firewall aktif (port 22, 80, 81, 443 saja) | ☐ |
| 7 | Fail2ban aktif & monitoring SSH | ☐ |
| 8 | Docker & Docker Compose terinstall | ☐ |
| 9 | Nginx Proxy Manager **berjalan** di port 81 | ☐ |
| 10 | Bisa login ke Dashboard NPM di browser | ☐ |

---

## 🔜 Tahap Selanjutnya (Setelah Tahap Pertama Selesai)

Setelah tahap pertama ini selesai, tahap berikutnya yang akan kita setup:

1. **Tahap 2**: Install MySQL & Redis sebagai Docker Container, buat database & user terpisah per project.
2. **Tahap 3**: Deploy Project Dancell (Laravel + Inertia/React) ke Docker Container.
3. **Tahap 4**: Pointing Domain `dancell.id` ke VPS, pasang SSL Gratis via Nginx Proxy Manager.
4. **Tahap 5**: Setup User & Folder terisolasi untuk Vendor.

