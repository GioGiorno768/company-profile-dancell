# 💾 Panduan Setup VPS Tahap 4 — Automated Backup System

> **Prasyarat**: Tahap 1–3 sudah selesai (Server hardened, Dancell deployed, vendor terisolasi).  
> **Tujuan Akhir Tahap Ini**: VPS lu punya sistem backup **otomatis** yang berjalan setiap hari, menyimpan backup database & file project ke **Google Drive** (cloud), dan mengirim **notifikasi Telegram** ke HP lu setiap kali backup selesai atau gagal.  
> **Waktu Estimasi**: ~20 - 30 menit

---

## 📋 Overview Alur Tahap Keempat

```
Step 1  →  Buat Folder Struktur Backup
Step 2  →  Buat Script Backup Database (MySQL Dump)
Step 3  →  Buat Script Backup File Project (Storage, Config, .env)
Step 4  →  Install & Setup Rclone (Upload ke Google Drive)
Step 5  →  Setup Bot Telegram (Notifikasi Backup ke HP Lu)
Step 6  →  Buat Master Script Backup (Gabungan + Upload + Notifikasi)
Step 7  →  Setup Cron Job (Jadwal Otomatis Harian & Mingguan)
Step 8  →  Test Menjalankan Backup Manual
Step 9  →  Panduan Restore (Mengembalikan Data dari Backup)
Step 10 →  Verifikasi & Final Check
```

---

## 🏗️ Arsitektur Backup yang Akan Kita Bangun

```
┌──────────────── VPS SERVER ────────────────────┐
│                                                 │
│  Cron Job (setiap hari jam 02:00 WIB)           │
│       │                                         │
│       ▼                                         │
│  Master Backup Script                           │
│       │                                         │
│       ├──► Backup Database (mysqldump)          │
│       │    └── dancell_db_2026-08-04.sql.gz     │
│       │                                         │
│       ├──► Backup Files (tar.gz)                │
│       │    └── dancell_files_2026-08-04.tar.gz  │
│       │                                         │
│       ├──► Upload ke Google Drive (Rclone)      │
│       │    └── 📁 VPS-Backups/                  │
│       │        ├── daily/                       │
│       │        └── weekly/                      │
│       │                                         │
│       ├──► Rotasi (Hapus backup > 7 hari lokal) │
│       │                                         │
│       └──► Kirim Notifikasi Telegram ✅/❌       │
│                                                 │
└─────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────┐     ┌──────────────────┐
│  Google Drive    │     │  Telegram Bot    │
│  (Cloud Backup) │     │  (Notifikasi HP) │
└─────────────────┘     └──────────────────┘
```

---

## Step 1: Buat Folder Struktur Backup

Kita akan membuat folder khusus untuk menyimpan semua file backup dan script backup di VPS.

```bash
sudo mkdir -p /opt/backups/{daily,weekly,scripts,logs}
sudo chown -R dancell:dancell /opt/backups
```

> Penjelasan struktur folder:
> - `/opt/backups/daily/` → Tempat backup harian (database dump + file project).
> - `/opt/backups/weekly/` → Tempat backup mingguan (arsip lengkap).
> - `/opt/backups/scripts/` → Tempat semua script backup.
> - `/opt/backups/logs/` → Log hasil backup (untuk debugging kalau ada error).

**Verifikasi folder terbuat:**

```bash
ls -la /opt/backups/
```

> Output:
> ```
> drwxr-xr-x  daily
> drwxr-xr-x  weekly
> drwxr-xr-x  scripts
> drwxr-xr-x  logs
> ```

**Kunci folder backup dari vendor:**

```bash
sudo chmod 750 /opt/backups
```

---

## Step 2: Buat Script Backup Database (MySQL Dump)

Script ini akan mengekspor (dump) seluruh isi database MySQL menjadi file `.sql.gz` (terkompresi).

```bash
nano /opt/backups/scripts/backup-database.sh
```

**Paste seluruh isi berikut:**

```bash
#!/bin/bash
# ============================================
# Script: Backup Database MySQL
# Fungsi: Dump semua database project ke file .sql.gz
# ============================================

# --- Konfigurasi ---
BACKUP_DIR="/opt/backups"
DATE=$(date +%Y-%m-%d_%H%M)
MYSQL_CONTAINER="shared-mysql"
MYSQL_ROOT_PASSWORD="DancellSuperSecureRoot2026!"  # GANTI DENGAN PASSWORD ROOT MYSQL LU!

# --- Daftar Database yang Di-backup ---
DATABASES=(
    "dancell_db"
    # Tambahkan database vendor di sini nanti:
    # "vendor_projek_a_db"
    # "vendor_projek_b_db"
)

# --- Tentukan folder tujuan (daily/weekly) ---
DAY_OF_WEEK=$(date +%u)  # 1=Senin, 7=Minggu
if [ "$DAY_OF_WEEK" -eq 7 ]; then
    TARGET_DIR="$BACKUP_DIR/weekly"
    BACKUP_TYPE="weekly"
else
    TARGET_DIR="$BACKUP_DIR/daily"
    BACKUP_TYPE="daily"
fi

# --- Proses Backup ---
echo "[$(date)] Memulai backup database ($BACKUP_TYPE)..."
DB_SUCCESS=0
DB_FAIL=0

for DB_NAME in "${DATABASES[@]}"; do
    OUTPUT_FILE="$TARGET_DIR/${DB_NAME}_${DATE}.sql.gz"
    
    echo "  → Dumping database: $DB_NAME"
    docker exec "$MYSQL_CONTAINER" mysqldump \
        -u root \
        -p"$MYSQL_ROOT_PASSWORD" \
        --single-transaction \
        --routines \
        --triggers \
        --databases "$DB_NAME" 2>/dev/null | gzip > "$OUTPUT_FILE"
    
    if [ $? -eq 0 ] && [ -s "$OUTPUT_FILE" ]; then
        FILE_SIZE=$(du -sh "$OUTPUT_FILE" | cut -f1)
        echo "  ✅ Berhasil: $OUTPUT_FILE ($FILE_SIZE)"
        DB_SUCCESS=$((DB_SUCCESS + 1))
    else
        echo "  ❌ GAGAL: $DB_NAME"
        rm -f "$OUTPUT_FILE"
        DB_FAIL=$((DB_FAIL + 1))
    fi
done

echo "[$(date)] Backup database selesai. Sukses: $DB_SUCCESS, Gagal: $DB_FAIL"

# Return exit code
[ $DB_FAIL -eq 0 ] && exit 0 || exit 1
```

**Simpan** (`Ctrl + O`, Enter, `Ctrl + X`).

> [!WARNING]
> **WAJIB GANTI** `MYSQL_ROOT_PASSWORD` di baris 10 dengan password root MySQL yang lu set di Tahap 2!

> **Penjelasan flags mysqldump:**
> - `--single-transaction` → Backup dilakukan tanpa mengunci tabel (database tetap bisa diakses saat backup berlangsung).
> - `--routines` → Sertakan stored procedures & functions.
> - `--triggers` → Sertakan database triggers.
> - `| gzip` → Langsung kompres output, menghemat 60-80% storage.

**Buat script menjadi executable:**

```bash
chmod +x /opt/backups/scripts/backup-database.sh
```

---

## Step 3: Buat Script Backup File Project

Script ini akan membuat arsip terkompresi (`.tar.gz`) dari file-file penting project: storage (upload gambar, file), konfigurasi `.env`, dan file docker-compose.

```bash
nano /opt/backups/scripts/backup-files.sh
```

**Paste seluruh isi berikut:**

```bash
#!/bin/bash
# ============================================
# Script: Backup File Project
# Fungsi: Arsip file storage, .env, dan config
# ============================================

# --- Konfigurasi ---
BACKUP_DIR="/opt/backups"
DATE=$(date +%Y-%m-%d_%H%M)

# --- Daftar Project yang Di-backup ---
# Format: "NAMA_PROJECT:PATH_PROJECT"
PROJECTS=(
    "dancell:/var/www/dancell"
    # Tambahkan project vendor di sini nanti:
    # "vendor-a:/var/www/vendor-projek-a"
)

# --- Tentukan folder tujuan ---
DAY_OF_WEEK=$(date +%u)
if [ "$DAY_OF_WEEK" -eq 7 ]; then
    TARGET_DIR="$BACKUP_DIR/weekly"
    BACKUP_TYPE="weekly"
else
    TARGET_DIR="$BACKUP_DIR/daily"
    BACKUP_TYPE="daily"
fi

# --- Proses Backup ---
echo "[$(date)] Memulai backup file project ($BACKUP_TYPE)..."
FILE_SUCCESS=0
FILE_FAIL=0

for PROJECT_ENTRY in "${PROJECTS[@]}"; do
    # Pisahkan nama dan path
    PROJECT_NAME=$(echo "$PROJECT_ENTRY" | cut -d: -f1)
    PROJECT_PATH=$(echo "$PROJECT_ENTRY" | cut -d: -f2)
    
    OUTPUT_FILE="$TARGET_DIR/${PROJECT_NAME}_files_${DATE}.tar.gz"
    
    if [ ! -d "$PROJECT_PATH" ]; then
        echo "  ❌ Folder tidak ditemukan: $PROJECT_PATH"
        FILE_FAIL=$((FILE_FAIL + 1))
        continue
    fi
    
    echo "  → Archiving project: $PROJECT_NAME"
    
    # File/folder yang di-backup:
    # - storage/ (file upload, log, cache)
    # - .env (konfigurasi production)
    # - docker-compose.yml
    # - Dockerfile
    # TIDAK termasuk: vendor/, node_modules/ (bisa di-install ulang)
    
    tar -czf "$OUTPUT_FILE" \
        -C "$PROJECT_PATH" \
        --exclude='storage/logs/*.log' \
        --exclude='storage/framework/cache/*' \
        --exclude='storage/framework/views/*' \
        --exclude='storage/framework/sessions/*' \
        .env \
        docker-compose.yml \
        Dockerfile \
        storage/app/ \
        2>/dev/null
    
    if [ $? -eq 0 ] && [ -s "$OUTPUT_FILE" ]; then
        FILE_SIZE=$(du -sh "$OUTPUT_FILE" | cut -f1)
        echo "  ✅ Berhasil: $OUTPUT_FILE ($FILE_SIZE)"
        FILE_SUCCESS=$((FILE_SUCCESS + 1))
    else
        echo "  ❌ GAGAL: $PROJECT_NAME"
        rm -f "$OUTPUT_FILE"
        FILE_FAIL=$((FILE_FAIL + 1))
    fi
done

echo "[$(date)] Backup file selesai. Sukses: $FILE_SUCCESS, Gagal: $FILE_FAIL"

[ $FILE_FAIL -eq 0 ] && exit 0 || exit 1
```

**Simpan** (`Ctrl + O`, Enter, `Ctrl + X`).

**Buat script menjadi executable:**

```bash
chmod +x /opt/backups/scripts/backup-files.sh
```

> **Penjelasan apa yang di-backup dan TIDAK di-backup:**
> | Di-backup ✅ | TIDAK di-backup ❌ |
> |---|---|
> | `.env` (konfigurasi) | `vendor/` (bisa `composer install` ulang) |
> | `storage/app/` (file upload) | `node_modules/` (bisa `npm install` ulang) |
> | `docker-compose.yml` | `storage/logs/` (log lama gak penting) |
> | `Dockerfile` | `storage/framework/cache/` (auto-regenerate) |

---

## Step 4: Install & Setup Rclone (Upload ke Google Drive)

Rclone adalah tool yang bisa meng-upload file dari server ke berbagai cloud storage (Google Drive, Dropbox, OneDrive, AWS S3, dll). Kita akan pakai **Google Drive** karena gratis 15 GB.

### A. Install Rclone

```bash
curl https://rclone.org/install.sh | sudo bash
```

**Verifikasi instalasi:**

```bash
rclone version
```

> Output contoh: `rclone v1.68.x`

### B. Konfigurasi Rclone untuk Google Drive

> [!IMPORTANT]
> Karena VPS tidak punya browser GUI, kita akan menggunakan metode **"headless / remote authorization"**. Ini berarti proses otorisasi Google akan dilakukan di **browser PC lu**, lalu token-nya di-copy ke VPS.

**Mulai konfigurasi:**

```bash
rclone config
```

> Ikuti dialog interaktif berikut:

```
No remotes found, make a new one?
n) New remote
q) Quit config
n/s/q> n
```
→ Ketik `n` lalu Enter.

```
Enter name for new remote.
name> gdrive
```
→ Ketik `gdrive` lalu Enter.

```
Type of storage to configure.
Storage> drive
```
→ Ketik `drive` lalu Enter (atau ketik nomor untuk Google Drive).

```
Google Application Client Id - leave blank normally.
client_id>
```
→ **Kosongin**, langsung tekan Enter.

```
Google Application Client Secret - leave blank normally.
client_secret>
```
→ **Kosongin**, langsung tekan Enter.

```
Scope that rclone should use when requesting access from drive.
scope> 1
```
→ Ketik `1` (Full access to all files) lalu Enter.

```
Service Account File - leave blank normally.
service_account_file>
```
→ **Kosongin**, langsung tekan Enter.

```
Edit advanced config?
y/n> n
```
→ Ketik `n` lalu Enter.

```
Use web browser to automatically authenticate rclone with remote?
y/n> n
```
→ Ketik **`n`** (karena VPS tidak punya browser!) lalu Enter.

> Sekarang Rclone akan menampilkan pesan seperti ini:
> ```
> For this to work, you will need rclone available on a machine that has
> a web browser available.
> 
> For more help and alternate methods see: https://rclone.org/remote_setup/
> 
> Execute the following on the machine with the web browser (same rclone version recommended):
> 
>     rclone authorize "drive"
> 
> Then paste the result.
> Enter a value>
> ```

### C. Otorisasi di PC Lu (Yang Ada Browser)

**JANGAN TUTUP terminal VPS!** Biarkan menunggu.

1. **Buka CMD/PowerShell di PC lu** (yang ada browser).
2. Download dan jalankan rclone di PC lu:

   **Untuk Windows (PowerShell):**
   ```powershell
   winget install Rclone.Rclone
   ```
   
   Setelah terinstal, jalankan:
   ```powershell
   rclone authorize "drive"
   ```

3. **Browser akan otomatis terbuka** menampilkan halaman login Google.
4. **Login dengan akun Google lu** dan klik **"Allow"** untuk memberikan izin akses Google Drive ke Rclone.
5. Setelah berhasil, **kembali ke CMD/PowerShell** — lu akan melihat token panjang seperti ini:
   ```
   Paste the following into your remote machine --->
   {"access_token":"ya29.a0AcM6C...","token_type":"Bearer","refresh_token":"1//0g...","expiry":"2026-08-04T..."}
   <---End paste
   ```

6. **Copy seluruh teks token** tersebut (dari `{` sampai `}`).

### D. Paste Token ke VPS

Kembali ke **terminal VPS** yang masih menunggu di `Enter a value>`:

1. **Paste/klik kanan** token yang sudah lu copy.
2. Tekan **Enter**.

```
Configure this as a Shared Drive (Team Drive)?
y/n> n
```
→ Ketik `n` lalu Enter.

```
Keep this "gdrive" remote?
y) Yes
n) No
y/n> y
```
→ Ketik `y` lalu Enter.

```
q) Quit config
q
```
→ Ketik `q` lalu Enter untuk keluar.

### E. Verifikasi Koneksi Google Drive

```bash
rclone lsd gdrive:
```

> Perintah ini menampilkan daftar folder di root Google Drive lu. Kalau muncul daftar folder, artinya **koneksi berhasil!**

**Buat folder backup di Google Drive:**

```bash
rclone mkdir gdrive:VPS-Backups/daily
rclone mkdir gdrive:VPS-Backups/weekly
```

**Verifikasi folder terbuat:**

```bash
rclone lsd gdrive:VPS-Backups/
```

> Output:
> ```
>           -1 2026-08-04 00:00:00        -1 daily
>           -1 2026-08-04 00:00:00        -1 weekly
> ```

---

## Step 5: Setup Bot Telegram (Notifikasi Backup ke HP Lu)

Kita akan membuat Bot Telegram yang mengirim pesan ke HP lu setiap kali proses backup selesai (baik berhasil maupun gagal).

### A. Buat Bot Telegram Baru

1. Buka **Telegram** di HP lu.
2. Cari user **`@BotFather`** dan buka chat dengannya.
3. Ketik `/newbot` dan tekan Enter.
4. **Masukkan nama bot**: `VPS Backup Alert` (atau nama terserah lu).
5. **Masukkan username bot**: `vps_backup_dancell_bot` (harus unik & diakhiri `_bot`).
6. BotFather akan memberikan **Token API** seperti ini:
   ```
   7123456789:AAH1bGciOiJSUzI1NiIsInR5cCI6Ikp...
   ```
   **SIMPAN TOKEN INI!** Kita butuh nanti.

### B. Dapatkan Chat ID Lu

1. Buka chat dengan bot baru lu di Telegram (cari username bot yang baru dibuat).
2. Ketik `/start` dan tekan Enter.
3. Buka URL berikut di browser (ganti `TOKEN_BOT_LU` dengan token dari langkah sebelumnya):
   ```
   https://api.telegram.org/botTOKEN_BOT_LU/getUpdates
   ```
4. Lu akan melihat JSON response. Cari bagian `"chat":{"id":XXXXXXXX}`. Angka `XXXXXXXX` itu adalah **Chat ID** lu.
   
   > Contoh:
   > ```json
   > "chat":{"id":123456789,"first_name":"Dancell"...}
   > ```
   > Chat ID lu: `123456789`

### C. Test Kirim Pesan dari VPS

Jalankan perintah ini di terminal VPS (ganti token & chat ID):

```bash
curl -s -X POST "https://api.telegram.org/botTOKEN_BOT_LU/sendMessage" \
    -d "chat_id=CHAT_ID_LU" \
    -d "text=🔔 Test notifikasi dari VPS Dancell! Backup system siap." \
    -d "parse_mode=HTML"
```

> Kalau lu terima pesan di Telegram, **setup bot berhasil!** 🎉

---

## Step 6: Buat Master Script Backup

Ini adalah script utama yang menggabungkan semua fungsi: backup database + backup file + upload ke Google Drive + kirim notifikasi Telegram + rotasi backup lama.

```bash
nano /opt/backups/scripts/master-backup.sh
```

**Paste seluruh isi berikut:**

```bash
#!/bin/bash
# ============================================
# Master Backup Script
# Menjalankan seluruh proses backup secara otomatis
# ============================================

# --- Konfigurasi ---
BACKUP_DIR="/opt/backups"
SCRIPTS_DIR="$BACKUP_DIR/scripts"
LOG_FILE="$BACKUP_DIR/logs/backup_$(date +%Y-%m-%d).log"
DATE=$(date +%Y-%m-%d_%H%M)

# Telegram Bot Config (GANTI DENGAN MILIK LU!)
TELEGRAM_BOT_TOKEN="TOKEN_BOT_LU"
TELEGRAM_CHAT_ID="CHAT_ID_LU"

# Rclone Remote Name
RCLONE_REMOTE="gdrive"

# Retention Policy (berapa hari backup lokal disimpan)
DAILY_RETENTION_DAYS=7
WEEKLY_RETENTION_DAYS=30

# --- Fungsi: Kirim Notifikasi Telegram ---
send_telegram() {
    local MESSAGE="$1"
    curl -s -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
        -d "chat_id=${TELEGRAM_CHAT_ID}" \
        -d "text=${MESSAGE}" \
        -d "parse_mode=HTML" > /dev/null 2>&1
}

# --- Fungsi: Hitung Ukuran Folder ---
get_folder_size() {
    du -sh "$1" 2>/dev/null | cut -f1
}

# --- Mulai Proses Backup ---
START_TIME=$(date +%s)
echo "========================================" >> "$LOG_FILE"
echo "[$(date)] Master Backup DIMULAI" >> "$LOG_FILE"
echo "========================================" >> "$LOG_FILE"

ERRORS=0

# ─── STEP 1: Backup Database ───
echo "[$(date)] Step 1: Backup Database..." >> "$LOG_FILE"
bash "$SCRIPTS_DIR/backup-database.sh" >> "$LOG_FILE" 2>&1
if [ $? -ne 0 ]; then
    ERRORS=$((ERRORS + 1))
    echo "[$(date)] ❌ Backup database GAGAL!" >> "$LOG_FILE"
fi

# ─── STEP 2: Backup Files ───
echo "[$(date)] Step 2: Backup Files..." >> "$LOG_FILE"
bash "$SCRIPTS_DIR/backup-files.sh" >> "$LOG_FILE" 2>&1
if [ $? -ne 0 ]; then
    ERRORS=$((ERRORS + 1))
    echo "[$(date)] ❌ Backup files GAGAL!" >> "$LOG_FILE"
fi

# ─── STEP 3: Upload ke Google Drive ───
echo "[$(date)] Step 3: Upload ke Google Drive..." >> "$LOG_FILE"

# Tentukan folder tujuan (daily/weekly)
DAY_OF_WEEK=$(date +%u)
if [ "$DAY_OF_WEEK" -eq 7 ]; then
    LOCAL_DIR="$BACKUP_DIR/weekly"
    REMOTE_DIR="VPS-Backups/weekly"
else
    LOCAL_DIR="$BACKUP_DIR/daily"
    REMOTE_DIR="VPS-Backups/daily"
fi

# Upload file backup hari ini ke Google Drive
rclone copy "$LOCAL_DIR/" "$RCLONE_REMOTE:$REMOTE_DIR/" \
    --include "*${DATE%_*}*" \
    --transfers 2 \
    --log-file="$LOG_FILE" \
    --log-level INFO 2>&1

if [ $? -ne 0 ]; then
    ERRORS=$((ERRORS + 1))
    echo "[$(date)] ❌ Upload Google Drive GAGAL!" >> "$LOG_FILE"
else
    echo "[$(date)] ✅ Upload Google Drive berhasil" >> "$LOG_FILE"
fi

# ─── STEP 4: Rotasi Backup Lama (Hapus yang Kedaluwarsa) ───
echo "[$(date)] Step 4: Rotasi backup lama..." >> "$LOG_FILE"

# Hapus backup daily yang lebih dari 7 hari
DAILY_DELETED=$(find "$BACKUP_DIR/daily/" -name "*.gz" -mtime +$DAILY_RETENTION_DAYS -delete -print | wc -l)
echo "  → Daily: $DAILY_DELETED file lama dihapus" >> "$LOG_FILE"

# Hapus backup weekly yang lebih dari 30 hari
WEEKLY_DELETED=$(find "$BACKUP_DIR/weekly/" -name "*.gz" -mtime +$WEEKLY_RETENTION_DAYS -delete -print | wc -l)
echo "  → Weekly: $WEEKLY_DELETED file lama dihapus" >> "$LOG_FILE"

# Hapus log yang lebih dari 14 hari
find "$BACKUP_DIR/logs/" -name "*.log" -mtime +14 -delete 2>/dev/null

# Rotasi di Google Drive juga (hapus daily > 14 hari, weekly > 60 hari)
rclone delete "$RCLONE_REMOTE:VPS-Backups/daily/" --min-age 14d >> "$LOG_FILE" 2>&1
rclone delete "$RCLONE_REMOTE:VPS-Backups/weekly/" --min-age 60d >> "$LOG_FILE" 2>&1

# ─── STEP 5: Kirim Notifikasi Telegram ───
END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))
DURATION_MIN=$((DURATION / 60))
DURATION_SEC=$((DURATION % 60))

DAILY_SIZE=$(get_folder_size "$BACKUP_DIR/daily")
WEEKLY_SIZE=$(get_folder_size "$BACKUP_DIR/weekly")
DISK_USAGE=$(df -h / | tail -1 | awk '{print $3 "/" $2 " (" $5 ")"}')
RAM_USAGE=$(free -h | grep Mem | awk '{print $3 "/" $2}')

if [ $ERRORS -eq 0 ]; then
    STATUS="✅ BERHASIL"
    EMOJI="🟢"
else
    STATUS="❌ ADA ERROR ($ERRORS)"
    EMOJI="🔴"
fi

MESSAGE="$EMOJI <b>VPS Backup Report</b>
━━━━━━━━━━━━━━━━━━━
📅 Tanggal: $(date '+%d %B %Y, %H:%M WIB')
📊 Status: $STATUS
⏱ Durasi: ${DURATION_MIN}m ${DURATION_SEC}s

💾 <b>Backup Lokal:</b>
• Daily: $DAILY_SIZE
• Weekly: $WEEKLY_SIZE

🖥 <b>Server Health:</b>
• Disk: $DISK_USAGE
• RAM: $RAM_USAGE

📤 Upload: Google Drive
🗑 Rotasi: Daily ${DAILY_DELETED} file, Weekly ${WEEKLY_DELETED} file dihapus"

send_telegram "$MESSAGE"

echo "[$(date)] Master Backup SELESAI (${DURATION_MIN}m ${DURATION_SEC}s, Errors: $ERRORS)" >> "$LOG_FILE"
echo "========================================" >> "$LOG_FILE"

exit $ERRORS
```

**Simpan** (`Ctrl + O`, Enter, `Ctrl + X`).

> [!WARNING]
> **WAJIB GANTI 2 hal penting:**
> - Baris 13: `TELEGRAM_BOT_TOKEN="TOKEN_BOT_LU"` → Ganti dengan token bot Telegram lu.
> - Baris 14: `TELEGRAM_CHAT_ID="CHAT_ID_LU"` → Ganti dengan Chat ID Telegram lu.

**Buat script menjadi executable:**

```bash
chmod +x /opt/backups/scripts/master-backup.sh
```

---

## Step 7: Setup Cron Job (Jadwal Otomatis)

Cron Job adalah *scheduler* bawaan Linux yang menjalankan script secara otomatis pada waktu yang ditentukan.

**Buka editor cron:**

```bash
crontab -e
```

> Kalau muncul pilihan editor, pilih **`1` (nano)**.

**Tambahkan baris berikut di paling bawah file:**

```cron
# ============================================
# Automated Backup - Setiap hari jam 02:00 WIB
# ============================================
0 2 * * * /opt/backups/scripts/master-backup.sh >> /opt/backups/logs/cron.log 2>&1
```

**Simpan** (`Ctrl + O`, Enter, `Ctrl + X`).

> **Penjelasan format cron `0 2 * * *`:**
> ```
> ┌───────── Menit (0-59)        → 0  (tepat di menit ke-0)
> │ ┌─────── Jam (0-23)          → 2  (jam 2 pagi)
> │ │ ┌───── Hari dalam bulan    → *  (setiap hari)
> │ │ │ ┌─── Bulan (1-12)        → *  (setiap bulan)
> │ │ │ │ ┌─ Hari dalam minggu   → *  (setiap hari)
> │ │ │ │ │
> 0 2 * * *
> ```
> Artinya: **Setiap hari jam 02:00** (pagi, saat traffic paling sepi).

**Verifikasi cron terdaftar:**

```bash
crontab -l
```

> Harus muncul baris `0 2 * * * /opt/backups/scripts/master-backup.sh ...`

> [!TIP]
> **Kenapa jam 2 pagi?** Karena itu adalah waktu dengan traffic website paling rendah. Proses backup (terutama `mysqldump`) bisa sedikit membebani server, jadi lebih baik dijalankan saat sepi.

---

## Step 8: Test Menjalankan Backup Manual

Sebelum mengandalkan cron otomatis, kita test dulu secara manual untuk memastikan semua berjalan sempurna.

**Jalankan master backup secara manual:**

```bash
bash /opt/backups/scripts/master-backup.sh
```

> Tunggu proses selesai (~1-3 menit). Lu akan melihat output progress di terminal.

**Verifikasi file backup terbuat:**

```bash
echo "=== Backup Files Lokal ===" && ls -lh /opt/backups/daily/
echo ""
echo "=== Backup di Google Drive ===" && rclone ls gdrive:VPS-Backups/daily/
echo ""
echo "=== Log Terakhir ===" && tail -20 /opt/backups/logs/backup_$(date +%Y-%m-%d).log
```

**Cek HP lu** — seharusnya ada **pesan Telegram** dari bot backup lu yang berisi laporan lengkap! 📱✅

---

## Step 9: Panduan Restore (Mengembalikan Data dari Backup)

> [!CAUTION]
> Langkah restore di bawah ini hanya digunakan dalam **KEADAAN DARURAT** (misal: database terhapus, file corrupt, server kena hack). Jangan dijalankan sembarangan di server production!

### A. Restore Database dari Backup Lokal

```bash
# 1. Cari file backup yang ingin di-restore
ls -lh /opt/backups/daily/ | grep dancell_db

# 2. Dekompresi file backup
gunzip -k /opt/backups/daily/dancell_db_2026-08-04_0200.sql.gz

# 3. Import ke MySQL
docker exec -i shared-mysql mysql -u root -p"PASSWORD_ROOT_MYSQL" dancell_db < /opt/backups/daily/dancell_db_2026-08-04_0200.sql

# 4. Verifikasi data ter-restore
docker exec -it shared-mysql mysql -u dancell_user -p -e "USE dancell_db; SHOW TABLES;"

# 5. Hapus file SQL yang sudah di-dekompresi (biar hemat storage)
rm /opt/backups/daily/dancell_db_2026-08-04_0200.sql
```

### B. Restore Database dari Google Drive

Kalau backup lokal sudah terhapus (misal VPS lu kena wipe), download dulu dari Google Drive:

```bash
# 1. Lihat daftar backup di Google Drive
rclone ls gdrive:VPS-Backups/daily/ | grep dancell_db

# 2. Download file backup tertentu
rclone copy gdrive:VPS-Backups/daily/dancell_db_2026-08-04_0200.sql.gz /opt/backups/daily/

# 3. Lanjutkan proses restore seperti langkah A di atas
```

### C. Restore File Project dari Backup

```bash
# 1. Lihat isi arsip backup (tanpa mengekstrak)
tar -tzf /opt/backups/daily/dancell_files_2026-08-04_0200.tar.gz

# 2. Restore file .env
tar -xzf /opt/backups/daily/dancell_files_2026-08-04_0200.tar.gz -C /var/www/dancell/ .env

# 3. Restore folder storage/app/ (file upload)
tar -xzf /opt/backups/daily/dancell_files_2026-08-04_0200.tar.gz -C /var/www/dancell/ storage/app/

# 4. Set ulang permissions
sudo chown -R www-data:www-data /var/www/dancell/storage
sudo chmod -R 775 /var/www/dancell/storage
```

### D. Full Disaster Recovery (Server Baru / VPS Baru)

Kalau VPS lu benar-benar hilang dan lu harus setup dari awal di VPS baru:

```
1. Ikuti Tahap 1 (Hardening) di VPS baru.
2. Ikuti Tahap 2 Step 1-4 (Docker, MySQL, Redis, buat database).
3. Clone project dari GitHub: git clone ... /var/www/dancell
4. Download backup .env dari Google Drive: rclone copy gdrive:VPS-Backups/daily/*files*.gz /tmp/
5. Restore .env: tar -xzf /tmp/dancell_files*.tar.gz -C /var/www/dancell/ .env
6. Restore storage/app: tar -xzf /tmp/dancell_files*.tar.gz -C /var/www/dancell/ storage/app/
7. Build & start container: docker compose up -d --build
8. Download backup database: rclone copy gdrive:VPS-Backups/daily/*dancell_db*.gz /tmp/
9. Decompress: gunzip /tmp/dancell_db*.sql.gz
10. Import database: docker exec -i shared-mysql mysql -u root -p"PASS" dancell_db < /tmp/dancell_db*.sql
11. Setup NPM & SSL ulang.
```

---

## Step 10: Verifikasi & Final Check

**Jalankan perintah verifikasi menyeluruh:**

```bash
echo "=== Cron Jobs Terdaftar ==="
crontab -l | grep -v "^#"

echo ""
echo "=== Script Files ==="
ls -lh /opt/backups/scripts/

echo ""
echo "=== Backup Files Lokal ==="
ls -lh /opt/backups/daily/ 2>/dev/null || echo "  (kosong)"
ls -lh /opt/backups/weekly/ 2>/dev/null || echo "  (kosong)"

echo ""
echo "=== Google Drive Connection ==="
rclone about gdrive: 2>/dev/null | head -3

echo ""
echo "=== Disk Usage ==="
df -h / | tail -1
```

---

## ✅ Checklist Akhir Tahap Keempat

| No | Item | Status |
|---|---|---|
| 1 | Folder `/opt/backups/` dengan subfolder terbuat | ☐ |
| 2 | Script `backup-database.sh` dibuat & executable | ☐ |
| 3 | Script `backup-files.sh` dibuat & executable | ☐ |
| 4 | Rclone terinstal & terhubung ke Google Drive | ☐ |
| 5 | Folder `VPS-Backups/daily/` & `weekly/` di Google Drive terbuat | ☐ |
| 6 | Bot Telegram dibuat & bisa mengirim pesan | ☐ |
| 7 | Script `master-backup.sh` dibuat dengan token Telegram yang benar | ☐ |
| 8 | Cron Job terdaftar (setiap hari jam 02:00) | ☐ |
| 9 | Test manual backup **BERHASIL** | ☐ |
| 10 | File backup muncul di folder lokal | ☐ |
| 11 | File backup **ter-upload** ke Google Drive | ☐ |
| 12 | **Notifikasi Telegram** diterima di HP | ☐ |

---

## 📊 Estimasi Penggunaan Storage Backup

```
┌──────────────────────────────────────────────────┐
│ ESTIMASI STORAGE BACKUP                           │
├──────────────────────────────────────────────────┤
│                                                   │
│ 📦 Backup Harian (per hari):                      │
│    • Database dump (.sql.gz) : ~ 1-5 MB           │
│    • File project (.tar.gz)  : ~ 5-20 MB          │
│    • Total per hari          : ~ 6-25 MB           │
│                                                   │
│ 🗓 Retensi Lokal (7 hari daily + 4 weekly):       │
│    • Daily: 7 × 25 MB   = ~ 175 MB               │
│    • Weekly: 4 × 25 MB  = ~ 100 MB               │
│    • Total lokal max    : ~ 275 MB (0.3 GB)       │
│                                                   │
│ ☁️ Google Drive (14 hari daily + 60 hari weekly):  │
│    • Total cloud max    : ~ 1.5 GB                │
│    • Free tier Google   : 15 GB (LEBIH DARI CUKUP)│
│                                                   │
└──────────────────────────────────────────────────┘
```

---

## 🔜 Tahap Selanjutnya

Setelah tahap 4 ini selesai:
1. **Tahap 5**: Monitoring & Alerting (notifikasi Telegram kalau container crash, disk penuh > 80%, atau RAM habis).
