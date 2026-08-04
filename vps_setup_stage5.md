# 📡 Panduan Setup VPS Tahap 5 (Final) — Monitoring & Alerting System

> **Prasyarat**: Tahap 1–4 sudah selesai (Server hardened, Dancell deployed, vendor terisolasi, backup otomatis).  
> **Tujuan Akhir Tahap Ini**: VPS lu punya sistem monitoring yang **mengecek kesehatan server setiap 5 menit**, dan otomatis mengirim **alert Telegram ke HP lu** kalau ada masalah (container crash, disk hampir penuh, RAM habis, website down, atau SSL certificate mau expired).  
> **Waktu Estimasi**: ~15 - 20 menit

---

## 📋 Overview Alur Tahap Kelima

```
Step 1  →  Buat Script Health Check Server (Disk, RAM, CPU)
Step 2  →  Buat Script Monitor Container Docker (Crash Detection)
Step 3  →  Buat Script Monitor Website Uptime (HTTP Check)
Step 4  →  Buat Script Monitor SSL Certificate Expiry
Step 5  →  Buat Master Monitoring Script (Gabungan + Telegram Alert)
Step 6  →  Setup Cron Job (Pengecekan Setiap 5 Menit)
Step 7  →  Buat Command Shortcut untuk Quick Status
Step 8  →  Test Semua Alert
Step 9  →  Verifikasi & Final Check
Step 10 →  Ringkasan Keseluruhan Setup VPS (Tahap 1 - 5)
```

---

## 🏗️ Arsitektur Monitoring yang Akan Kita Bangun

```
    Cron Job (setiap 5 menit)
         │
         ▼
  Master Monitoring Script
         │
         ├──► Health Check Server
         │    ├── Disk usage > 80%?  → 🔴 ALERT!
         │    ├── RAM usage > 85%?   → 🔴 ALERT!
         │    └── CPU load > 90%?    → 🔴 ALERT!
         │
         ├──► Monitor Docker Containers
         │    ├── dancell-app running?      → ❌ ALERT + Auto-restart!
         │    ├── shared-mysql running?     → ❌ ALERT!
         │    ├── shared-redis running?     → ❌ ALERT!
         │    └── nginx-proxy-manager?     → ❌ ALERT!
         │
         ├──► Monitor Website Uptime
         │    ├── https://domain-lu.com → HTTP 200 OK? ✅
         │    └── Response time > 5s?  → ⚠️ WARNING!
         │
         └──► Monitor SSL Certificate
              └── Expired dalam < 7 hari? → 🔴 ALERT!
                    │
                    ▼
            ┌──────────────┐
            │ Telegram Bot │ → 📱 Notifikasi ke HP lu
            └──────────────┘
```

---

## Step 1: Buat Script Health Check Server

Script ini mengecek 3 vital sign server: **Disk Usage**, **RAM Usage**, dan **CPU Load**.

**Buat folder monitoring:**

```bash
mkdir -p /opt/monitoring/{scripts,logs,state}
sudo chown -R dancell:dancell /opt/monitoring
sudo chmod 750 /opt/monitoring
```

> Penjelasan folder:
> - `/opt/monitoring/scripts/` → Semua script monitoring.
> - `/opt/monitoring/logs/` → Log hasil pengecekan.
> - `/opt/monitoring/state/` → File state untuk mencegah spam alert (cooldown).

```bash
nano /opt/monitoring/scripts/check-server.sh
```

**Paste seluruh isi berikut:**

```bash
#!/bin/bash
# ============================================
# Script: Server Health Check
# Cek Disk, RAM, dan CPU Load
# ============================================

# --- Threshold (Batas Peringatan) ---
DISK_THRESHOLD=80    # Alert kalau disk usage > 80%
RAM_THRESHOLD=85     # Alert kalau RAM usage > 85%
CPU_THRESHOLD=90     # Alert kalau CPU load > 90%

ALERTS=""

# --- Cek Disk Usage ---
DISK_USAGE=$(df -h / | tail -1 | awk '{print $5}' | tr -d '%')
DISK_TOTAL=$(df -h / | tail -1 | awk '{print $2}')
DISK_USED=$(df -h / | tail -1 | awk '{print $3}')
DISK_AVAIL=$(df -h / | tail -1 | awk '{print $4}')

if [ "$DISK_USAGE" -gt "$DISK_THRESHOLD" ]; then
    ALERTS="${ALERTS}🔴 <b>DISK KRITIS!</b>
   Terpakai: ${DISK_USED} / ${DISK_TOTAL} (${DISK_USAGE}%)
   Sisa: ${DISK_AVAIL}
   Threshold: ${DISK_THRESHOLD}%

"
fi

# --- Cek RAM Usage ---
RAM_TOTAL=$(free -m | grep Mem | awk '{print $2}')
RAM_USED=$(free -m | grep Mem | awk '{print $3}')
RAM_USAGE=$((RAM_USED * 100 / RAM_TOTAL))

if [ "$RAM_USAGE" -gt "$RAM_THRESHOLD" ]; then
    ALERTS="${ALERTS}🔴 <b>RAM KRITIS!</b>
   Terpakai: ${RAM_USED}MB / ${RAM_TOTAL}MB (${RAM_USAGE}%)
   Threshold: ${RAM_THRESHOLD}%

"
fi

# --- Cek CPU Load (rata-rata 5 menit) ---
CPU_CORES=$(nproc)
LOAD_5MIN=$(cat /proc/loadavg | awk '{print $2}')
# Hitung persentase: (load / cores) * 100
CPU_PERCENT=$(awk "BEGIN {printf \"%.0f\", ($LOAD_5MIN / $CPU_CORES) * 100}")

if [ "$CPU_PERCENT" -gt "$CPU_THRESHOLD" ]; then
    ALERTS="${ALERTS}🔴 <b>CPU KRITIS!</b>
   Load (5 min): ${LOAD_5MIN} / ${CPU_CORES} cores (${CPU_PERCENT}%)
   Threshold: ${CPU_THRESHOLD}%

"
fi

# --- Output ---
if [ -n "$ALERTS" ]; then
    echo "$ALERTS"
    exit 1
else
    exit 0
fi
```

**Simpan** (`Ctrl + O`, Enter, `Ctrl + X`) dan buat executable:

```bash
chmod +x /opt/monitoring/scripts/check-server.sh
```

---

## Step 2: Buat Script Monitor Container Docker

Script ini mengecek apakah semua container Docker yang seharusnya berjalan masih **hidup dan sehat**. Kalau ada yang mati, script otomatis mencoba me-restart container tersebut.

```bash
nano /opt/monitoring/scripts/check-containers.sh
```

**Paste seluruh isi berikut:**

```bash
#!/bin/bash
# ============================================
# Script: Docker Container Monitor
# Cek status semua container penting
# ============================================

# --- Daftar container yang HARUS berjalan ---
REQUIRED_CONTAINERS=(
    "nginx-proxy-manager"
    "shared-mysql"
    "shared-redis"
    "dancell-app"
    # Tambahkan container vendor di sini nanti:
    # "vendor-a-app"
)

ALERTS=""
RESTARTED=""

for CONTAINER in "${REQUIRED_CONTAINERS[@]}"; do
    # Cek apakah container berjalan
    STATUS=$(docker inspect -f '{{.State.Status}}' "$CONTAINER" 2>/dev/null)
    
    if [ "$STATUS" != "running" ]; then
        # Container mati! Coba restart otomatis
        echo "[$(date)] ⚠️ Container $CONTAINER status: $STATUS. Mencoba restart..." 
        docker restart "$CONTAINER" 2>/dev/null
        sleep 5
        
        # Cek lagi setelah restart
        NEW_STATUS=$(docker inspect -f '{{.State.Status}}' "$CONTAINER" 2>/dev/null)
        
        if [ "$NEW_STATUS" == "running" ]; then
            RESTARTED="${RESTARTED}⚠️ Container <b>${CONTAINER}</b> sempat mati, berhasil di-restart otomatis ✅

"
        else
            ALERTS="${ALERTS}🔴 <b>CONTAINER MATI!</b>
   Container: <code>${CONTAINER}</code>
   Status: ${STATUS:-not found}
   Auto-restart: GAGAL ❌
   Action: Cek manual dengan <code>docker logs ${CONTAINER}</code>

"
        fi
    fi
done

# Cek container yang restart berulang kali (restart loop)
for CONTAINER in "${REQUIRED_CONTAINERS[@]}"; do
    RESTART_COUNT=$(docker inspect -f '{{.RestartCount}}' "$CONTAINER" 2>/dev/null)
    if [ -n "$RESTART_COUNT" ] && [ "$RESTART_COUNT" -gt 10 ]; then
        ALERTS="${ALERTS}⚠️ <b>RESTART LOOP!</b>
   Container: <code>${CONTAINER}</code>
   Sudah restart ${RESTART_COUNT}x
   Kemungkinan ada error di aplikasi/config.

"
    fi
done

# --- Output ---
OUTPUT="${ALERTS}${RESTARTED}"
if [ -n "$OUTPUT" ]; then
    echo "$OUTPUT"
    exit 1
else
    exit 0
fi
```

**Simpan** dan buat executable:

```bash
chmod +x /opt/monitoring/scripts/check-containers.sh
```

---

## Step 3: Buat Script Monitor Website Uptime

Script ini mengecek apakah website Dancell lu **benar-benar bisa diakses** dari sisi HTTP (bukan cuma container-nya jalan, tapi website-nya juga bisa dibuka).

```bash
nano /opt/monitoring/scripts/check-uptime.sh
```

**Paste seluruh isi berikut:**

```bash
#!/bin/bash
# ============================================
# Script: Website Uptime Monitor
# Cek apakah website bisa diakses via HTTP
# ============================================

# --- Daftar URL yang dipantau ---
# Format: "NAMA|URL"
WEBSITES=(
    "Dancell|https://namadomain-lu.com"
    # Tambahkan domain vendor nanti:
    # "Vendor A|https://domain-vendor-a.com"
)

# Batas waktu response (detik)
TIMEOUT=10
SLOW_THRESHOLD=5

ALERTS=""

for ENTRY in "${WEBSITES[@]}"; do
    SITE_NAME=$(echo "$ENTRY" | cut -d'|' -f1)
    SITE_URL=$(echo "$ENTRY" | cut -d'|' -f2)
    
    # Lakukan HTTP request dan catat response time
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time "$TIMEOUT" "$SITE_URL" 2>/dev/null)
    RESPONSE_TIME=$(curl -s -o /dev/null -w "%{time_total}" --max-time "$TIMEOUT" "$SITE_URL" 2>/dev/null)
    
    if [ "$HTTP_CODE" -eq 0 ] || [ "$HTTP_CODE" -ge 500 ]; then
        ALERTS="${ALERTS}🔴 <b>WEBSITE DOWN!</b>
   Site: ${SITE_NAME}
   URL: ${SITE_URL}
   HTTP Code: ${HTTP_CODE:-timeout}
   Action: Cek container & log segera!

"
    elif [ "$HTTP_CODE" -ge 400 ]; then
        ALERTS="${ALERTS}⚠️ <b>WEBSITE ERROR!</b>
   Site: ${SITE_NAME}
   URL: ${SITE_URL}
   HTTP Code: ${HTTP_CODE}

"
    else
        # Cek apakah response lambat
        RESPONSE_MS=$(awk "BEGIN {printf \"%.0f\", $RESPONSE_TIME * 1000}")
        if (( $(awk "BEGIN {print ($RESPONSE_TIME > $SLOW_THRESHOLD)}") )); then
            ALERTS="${ALERTS}🟡 <b>WEBSITE LAMBAT!</b>
   Site: ${SITE_NAME}
   Response Time: ${RESPONSE_MS}ms (>${SLOW_THRESHOLD}s)

"
        fi
    fi
done

# --- Output ---
if [ -n "$ALERTS" ]; then
    echo "$ALERTS"
    exit 1
else
    exit 0
fi
```

> [!WARNING]
> **GANTI** `https://namadomain-lu.com` di baris 10 dengan domain asli lu! Kalau domain belum dipointing, untuk sementara bisa pakai IP VPS: `http://IP_VPS_LU`

**Simpan** dan buat executable:

```bash
chmod +x /opt/monitoring/scripts/check-uptime.sh
```

---

## Step 4: Buat Script Monitor SSL Certificate Expiry

Script ini mengecek tanggal kadaluarsa sertifikat SSL (Let's Encrypt) dan mengirim alert kalau sertifikat akan expired dalam 7 hari ke depan.

```bash
nano /opt/monitoring/scripts/check-ssl.sh
```

**Paste seluruh isi berikut:**

```bash
#!/bin/bash
# ============================================
# Script: SSL Certificate Expiry Monitor
# Alert kalau SSL expired dalam < 7 hari
# ============================================

# --- Daftar Domain yang Dipantau ---
DOMAINS=(
    "namadomain-lu.com"
    # Tambahkan domain vendor nanti:
    # "domain-vendor-a.com"
)

WARNING_DAYS=7
ALERTS=""

for DOMAIN in "${DOMAINS[@]}"; do
    # Ambil tanggal expiry SSL
    EXPIRY_DATE=$(echo | openssl s_client -servername "$DOMAIN" -connect "$DOMAIN:443" 2>/dev/null | openssl x509 -noout -enddate 2>/dev/null | cut -d= -f2)
    
    if [ -z "$EXPIRY_DATE" ]; then
        ALERTS="${ALERTS}⚠️ <b>SSL CHECK GAGAL!</b>
   Domain: ${DOMAIN}
   Tidak bisa membaca sertifikat SSL.

"
        continue
    fi
    
    # Hitung sisa hari
    EXPIRY_EPOCH=$(date -d "$EXPIRY_DATE" +%s 2>/dev/null)
    NOW_EPOCH=$(date +%s)
    DAYS_LEFT=$(( (EXPIRY_EPOCH - NOW_EPOCH) / 86400 ))
    
    if [ "$DAYS_LEFT" -lt 0 ]; then
        ALERTS="${ALERTS}🔴 <b>SSL SUDAH EXPIRED!</b>
   Domain: ${DOMAIN}
   Expired: ${EXPIRY_DATE}
   Action: Renew SSL segera di Nginx Proxy Manager!

"
    elif [ "$DAYS_LEFT" -lt "$WARNING_DAYS" ]; then
        ALERTS="${ALERTS}🟡 <b>SSL HAMPIR EXPIRED!</b>
   Domain: ${DOMAIN}
   Expired dalam: ${DAYS_LEFT} hari
   Tanggal: ${EXPIRY_DATE}
   Action: Cek auto-renew di NPM.

"
    fi
done

# --- Output ---
if [ -n "$ALERTS" ]; then
    echo "$ALERTS"
    exit 1
else
    exit 0
fi
```

> [!WARNING]
> **GANTI** `namadomain-lu.com` di baris 9 dengan domain asli lu!

**Simpan** dan buat executable:

```bash
chmod +x /opt/monitoring/scripts/check-ssl.sh
```

---

## Step 5: Buat Master Monitoring Script

Ini adalah script utama yang menjalankan semua pengecekan di atas, menggabungkan hasilnya, dan mengirim **alert Telegram** kalau ada masalah. Script ini juga punya fitur **cooldown** agar tidak mengirim alert berulang-ulang untuk masalah yang sama.

```bash
nano /opt/monitoring/scripts/master-monitor.sh
```

**Paste seluruh isi berikut:**

```bash
#!/bin/bash
# ============================================
# Master Monitoring Script
# Menjalankan semua pengecekan & kirim alert
# ============================================

# --- Konfigurasi ---
SCRIPTS_DIR="/opt/monitoring/scripts"
LOG_FILE="/opt/monitoring/logs/monitor_$(date +%Y-%m-%d).log"
STATE_DIR="/opt/monitoring/state"

# Telegram Config (SAMA dengan yang di backup script)
TELEGRAM_BOT_TOKEN="TOKEN_BOT_LU"
TELEGRAM_CHAT_ID="CHAT_ID_LU"

# Cooldown: Jangan kirim alert yang sama dalam 30 menit
COOLDOWN_MINUTES=30

# --- Fungsi: Kirim Alert Telegram ---
send_alert() {
    local MESSAGE="$1"
    curl -s -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
        -d "chat_id=${TELEGRAM_CHAT_ID}" \
        -d "text=${MESSAGE}" \
        -d "parse_mode=HTML" > /dev/null 2>&1
}

# --- Fungsi: Cek Cooldown (Anti-Spam) ---
should_alert() {
    local ALERT_ID="$1"
    local STATE_FILE="$STATE_DIR/$ALERT_ID"
    
    if [ -f "$STATE_FILE" ]; then
        LAST_ALERT=$(cat "$STATE_FILE")
        NOW=$(date +%s)
        DIFF=$(( (NOW - LAST_ALERT) / 60 ))
        
        if [ "$DIFF" -lt "$COOLDOWN_MINUTES" ]; then
            # Masih dalam cooldown, jangan kirim alert
            return 1
        fi
    fi
    
    # Simpan timestamp alert terakhir
    date +%s > "$STATE_FILE"
    return 0
}

# --- Fungsi: Clear Cooldown (Masalah Sudah Teratasi) ---
clear_cooldown() {
    local ALERT_ID="$1"
    rm -f "$STATE_DIR/$ALERT_ID"
}

# --- Mulai Monitoring ---
echo "[$(date)] Monitoring check dimulai..." >> "$LOG_FILE"
ALL_ALERTS=""

# ─── CHECK 1: Server Health ───
SERVER_ALERTS=$("$SCRIPTS_DIR/check-server.sh" 2>&1)
if [ $? -ne 0 ]; then
    if should_alert "server-health"; then
        ALL_ALERTS="${ALL_ALERTS}${SERVER_ALERTS}"
    fi
    echo "[$(date)] ⚠️ Server health issue detected" >> "$LOG_FILE"
else
    clear_cooldown "server-health"
fi

# ─── CHECK 2: Docker Containers ───
CONTAINER_ALERTS=$("$SCRIPTS_DIR/check-containers.sh" 2>&1)
if [ $? -ne 0 ]; then
    if should_alert "containers"; then
        ALL_ALERTS="${ALL_ALERTS}${CONTAINER_ALERTS}"
    fi
    echo "[$(date)] ⚠️ Container issue detected" >> "$LOG_FILE"
else
    clear_cooldown "containers"
fi

# ─── CHECK 3: Website Uptime ───
UPTIME_ALERTS=$("$SCRIPTS_DIR/check-uptime.sh" 2>&1)
if [ $? -ne 0 ]; then
    if should_alert "uptime"; then
        ALL_ALERTS="${ALL_ALERTS}${UPTIME_ALERTS}"
    fi
    echo "[$(date)] ⚠️ Website uptime issue detected" >> "$LOG_FILE"
else
    clear_cooldown "uptime"
fi

# ─── CHECK 4: SSL Certificate (Cek 2x sehari saja, bukan tiap 5 menit) ───
CURRENT_HOUR=$(date +%H)
if [ "$CURRENT_HOUR" -eq 8 ] || [ "$CURRENT_HOUR" -eq 20 ]; then
    SSL_ALERTS=$("$SCRIPTS_DIR/check-ssl.sh" 2>&1)
    if [ $? -ne 0 ]; then
        if should_alert "ssl"; then
            ALL_ALERTS="${ALL_ALERTS}${SSL_ALERTS}"
        fi
        echo "[$(date)] ⚠️ SSL issue detected" >> "$LOG_FILE"
    else
        clear_cooldown "ssl"
    fi
fi

# ─── Kirim Alert Telegram (Kalau Ada Masalah) ───
if [ -n "$ALL_ALERTS" ]; then
    HEADER="🚨 <b>VPS ALERT — $(date '+%d %b %Y %H:%M WIB')</b>
━━━━━━━━━━━━━━━━━━━
"
    send_alert "${HEADER}${ALL_ALERTS}"
    echo "[$(date)] 📱 Alert Telegram dikirim!" >> "$LOG_FILE"
else
    echo "[$(date)] ✅ Semua OK" >> "$LOG_FILE"
fi

# ─── Rotasi Log Monitoring (Hapus > 7 hari) ───
find /opt/monitoring/logs/ -name "*.log" -mtime +7 -delete 2>/dev/null

exit 0
```

**Simpan** (`Ctrl + O`, Enter, `Ctrl + X`).

> [!WARNING]
> **WAJIB GANTI 2 hal penting (sama dengan backup script):**
> - Baris 13: `TELEGRAM_BOT_TOKEN="TOKEN_BOT_LU"` → Token bot Telegram lu.
> - Baris 14: `TELEGRAM_CHAT_ID="CHAT_ID_LU"` → Chat ID Telegram lu.

**Buat executable:**

```bash
chmod +x /opt/monitoring/scripts/master-monitor.sh
```

> **Penjelasan Fitur Cooldown Anti-Spam:**
> Tanpa cooldown, kalau disk lu penuh, lu bakal dapet **288 pesan Telegram per hari** (setiap 5 menit)! Dengan cooldown 30 menit, lu cuma dapet **max 48 pesan** — cukup untuk mengingatkan tanpa bikin HP lu meledak notifikasi 😄

---

## Step 6: Setup Cron Job (Pengecekan Setiap 5 Menit)

**Buka editor cron:**

```bash
crontab -e
```

**Tambahkan baris berikut di bawah baris backup yang sudah ada:**

```cron
# ============================================
# Monitoring - Setiap 5 menit
# ============================================
*/5 * * * * /opt/monitoring/scripts/master-monitor.sh >> /opt/monitoring/logs/cron.log 2>&1

# ============================================
# Health Report Harian - Jam 08:00 WIB
# ============================================
0 8 * * * /opt/monitoring/scripts/daily-report.sh >> /opt/monitoring/logs/cron.log 2>&1
```

**Simpan** (`Ctrl + O`, Enter, `Ctrl + X`).

> **Penjelasan `*/5 * * * *`:**
> ```
> */5 → Setiap 5 menit (menit ke-0, 5, 10, 15, 20, ...)
> *   → Setiap jam
> *   → Setiap hari
> *   → Setiap bulan
> *   → Setiap hari dalam minggu
> ```

### Buat Script Daily Report (Laporan Harian Jam 8 Pagi)

Selain alert darurat, kita juga bikin **laporan rutin harian** yang dikirim jam 8 pagi, berisi ringkasan kesehatan server. Ini supaya lu tenang bahwa semuanya baik-baik saja.

```bash
nano /opt/monitoring/scripts/daily-report.sh
```

**Paste isi berikut:**

```bash
#!/bin/bash
# ============================================
# Daily Health Report (Jam 08:00 WIB)
# Laporan rutin harian kesehatan server
# ============================================

TELEGRAM_BOT_TOKEN="TOKEN_BOT_LU"
TELEGRAM_CHAT_ID="CHAT_ID_LU"

# Kumpulkan data
UPTIME=$(uptime -p)
DISK=$(df -h / | tail -1 | awk '{print $3 "/" $2 " (" $5 ")"}')
RAM_USED=$(free -h | grep Mem | awk '{print $3}')
RAM_TOTAL=$(free -h | grep Mem | awk '{print $2}')
CPU_LOAD=$(cat /proc/loadavg | awk '{print $1 ", " $2 ", " $3}')
CONTAINERS_RUNNING=$(docker ps --format "{{.Names}}: {{.Status}}" 2>/dev/null)
CONTAINER_COUNT=$(docker ps -q | wc -l)
BACKUP_LAST=$(ls -t /opt/backups/daily/*.gz 2>/dev/null | head -1 | xargs -I{} stat -c '%y' {} 2>/dev/null | cut -d'.' -f1)
BANNED_IPS=$(sudo fail2ban-client status sshd 2>/dev/null | grep "Currently banned" | awk '{print $NF}')

MESSAGE="📊 <b>VPS Daily Report</b>
━━━━━━━━━━━━━━━━━━━
📅 $(date '+%A, %d %B %Y')
⏱ Uptime: ${UPTIME}

💾 <b>Resources:</b>
• Disk: ${DISK}
• RAM: ${RAM_USED} / ${RAM_TOTAL}
• CPU Load: ${CPU_LOAD}

🐳 <b>Docker (${CONTAINER_COUNT} containers):</b>
$(echo "$CONTAINERS_RUNNING" | while read line; do echo "• ${line}"; done)

📦 <b>Backup Terakhir:</b>
• ${BACKUP_LAST:-Belum ada backup}

🛡 <b>Keamanan:</b>
• Fail2ban banned IPs: ${BANNED_IPS:-0}

✅ Semua sistem berjalan normal."

curl -s -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
    -d "chat_id=${TELEGRAM_CHAT_ID}" \
    -d "text=${MESSAGE}" \
    -d "parse_mode=HTML" > /dev/null 2>&1
```

**Simpan** dan buat executable:

```bash
chmod +x /opt/monitoring/scripts/daily-report.sh
```

> [!WARNING]
> **GANTI** `TOKEN_BOT_LU` dan `CHAT_ID_LU` dengan token & Chat ID Telegram lu!

---

## Step 7: Buat Command Shortcut untuk Quick Status

Supaya lu bisa cek status server kapan saja dengan cepat tanpa harus ketik command panjang, kita bikin alias/shortcut command.

```bash
nano ~/.bash_aliases
```

**Paste isi berikut:**

```bash
# ============================================
# VPS Management Shortcuts
# ============================================

# Quick status semua container
alias dps='docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"'

# Quick server health
alias health='echo "=== DISK ===" && df -h / | tail -1 && echo "" && echo "=== RAM ===" && free -h | grep Mem && echo "" && echo "=== CPU ===" && cat /proc/loadavg && echo "" && echo "=== CONTAINERS ===" && docker ps --format "table {{.Names}}\t{{.Status}}" && echo "" && echo "=== FAIL2BAN ===" && sudo fail2ban-client status sshd 2>/dev/null | tail -3'

# Quick log Laravel (Dancell)
alias dlog='docker exec dancell-app tail -f storage/logs/laravel.log'

# Quick log container
alias clog='docker compose logs -f'

# Restart Dancell app
alias drestart='docker restart dancell-app && echo "✅ dancell-app restarted!"'

# Jalankan backup manual
alias backup-now='bash /opt/backups/scripts/master-backup.sh'

# Jalankan monitoring manual
alias monitor-now='bash /opt/monitoring/scripts/master-monitor.sh'

# Kirim daily report manual
alias report-now='bash /opt/monitoring/scripts/daily-report.sh'
```

**Simpan** (`Ctrl + O`, Enter, `Ctrl + X`).

**Aktifkan alias:**

```bash
source ~/.bash_aliases
```

**Sekarang lu bisa ketik command singkat ini kapan saja:**

| Command | Fungsi |
|---|---|
| `dps` | Lihat status semua container Docker |
| `health` | Cek disk, RAM, CPU, containers, fail2ban sekaligus |
| `dlog` | Lihat log Laravel realtime |
| `drestart` | Restart container Dancell |
| `backup-now` | Jalankan backup manual sekarang |
| `monitor-now` | Jalankan monitoring manual sekarang |
| `report-now` | Kirim daily report ke Telegram sekarang |

---

## Step 8: Test Semua Alert

### A. Test Alert Container Down

Matikan sementara container Dancell lalu jalankan monitoring:

```bash
docker stop dancell-app
bash /opt/monitoring/scripts/master-monitor.sh
```

> **Cek HP lu** — Harus ada notifikasi Telegram:
> ```
> 🚨 VPS ALERT — 04 Aug 2026 00:40 WIB
> ━━━━━━━━━━━━━━━━━━━
> ⚠️ Container dancell-app sempat mati, berhasil di-restart otomatis ✅
> ```
> (Script otomatis me-restart container yang mati!)

**Verifikasi container hidup kembali:**

```bash
dps
```

### B. Test Daily Report

```bash
report-now
```

> **Cek HP lu** — Harus ada pesan laporan harian lengkap di Telegram! 📱

### C. Test Health Check (Tanpa Memicu Alert)

```bash
bash /opt/monitoring/scripts/check-server.sh
echo "Exit code: $?"
```

> Kalau exit code `0`, artinya server sehat. Kalau `1`, ada masalah yang terdeteksi.

---

## Step 9: Verifikasi & Final Check

**Jalankan perintah verifikasi menyeluruh:**

```bash
echo "=== Cron Jobs Aktif ==="
crontab -l | grep -v "^#" | grep -v "^$"

echo ""
echo "=== Script Monitoring ==="
ls -lh /opt/monitoring/scripts/

echo ""
echo "=== Script Backup ==="
ls -lh /opt/backups/scripts/

echo ""
echo "=== Docker Containers ==="
dps

echo ""
echo "=== Server Health ==="
health
```

---

## ✅ Checklist Akhir Tahap Kelima

| No | Item | Status |
|---|---|---|
| 1 | Folder `/opt/monitoring/` dengan subfolder terbuat | ☐ |
| 2 | Script `check-server.sh` dibuat & executable | ☐ |
| 3 | Script `check-containers.sh` dibuat & executable | ☐ |
| 4 | Script `check-uptime.sh` dibuat & executable (domain diganti) | ☐ |
| 5 | Script `check-ssl.sh` dibuat & executable (domain diganti) | ☐ |
| 6 | Script `master-monitor.sh` dibuat & token Telegram benar | ☐ |
| 7 | Script `daily-report.sh` dibuat & token Telegram benar | ☐ |
| 8 | Cron Job monitoring terdaftar (setiap 5 menit) | ☐ |
| 9 | Cron Job daily report terdaftar (jam 08:00) | ☐ |
| 10 | Bash aliases aktif (`dps`, `health`, dll) | ☐ |
| 11 | Test alert container down → Telegram terkirim ✅ | ☐ |
| 12 | Test daily report → Telegram terkirim ✅ | ☐ |

---

## Step 10: 🎉 Ringkasan Keseluruhan Setup VPS (Tahap 1 - 5)

Selamat brok! **SELURUH SETUP VPS LU SUDAH SELESAI 100%!** 🚀

Berikut ringkasan apa yang sudah terpasang dan berjalan di VPS lu:

```
┌─────────────────────────────────────────────────────────────────┐
│                    🖥️ VPS DANCELL — PRODUCTION READY            │
│                    2 vCPU / 4 GB RAM / 80 GB SSD               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  🛡️ TAHAP 1 — Security Hardening                               │
│  ├── SSH Key-only auth (password login disabled)                │
│  ├── UFW Firewall (port 22, 80, 81, 443 saja)                  │
│  ├── Fail2ban (auto-block brute force SSH)                      │
│  └── Docker Engine + Docker Compose                             │
│                                                                 │
│  🚀 TAHAP 2 — Application Deployment                           │
│  ├── Nginx Proxy Manager (reverse proxy + SSL otomatis)         │
│  ├── MySQL 8.0 (shared, isolated per-database)                  │
│  ├── Redis 7 (shared, cache & session)                          │
│  └── Dancell App (PHP 8.4 + Nginx + Vite, Dockerized)          │
│                                                                 │
│  🔐 TAHAP 3 — Vendor Isolation                                  │
│  ├── User Linux terpisah per vendor (tanpa sudo)                │
│  ├── SSH Key auth per vendor                                    │
│  ├── Folder permission isolation (chmod 750)                    │
│  ├── Database & user MySQL terpisah per vendor                  │
│  └── Template deployment Docker per vendor                      │
│                                                                 │
│  💾 TAHAP 4 — Automated Backup                                  │
│  ├── MySQL dump otomatis harian (terkompresi .gz)               │
│  ├── File project backup (storage, .env, config)                │
│  ├── Upload otomatis ke Google Drive (Rclone)                   │
│  ├── Rotasi backup (daily 7 hari, weekly 30 hari)               │
│  └── Notifikasi Telegram setiap backup selesai                  │
│                                                                 │
│  📡 TAHAP 5 — Monitoring & Alerting                             │
│  ├── Health check setiap 5 menit (disk, RAM, CPU)               │
│  ├── Docker container crash detection + auto-restart            │
│  ├── Website uptime & response time monitoring                  │
│  ├── SSL certificate expiry monitoring                          │
│  ├── Alert Telegram instan kalau ada masalah                    │
│  ├── Daily report jam 08:00 ke Telegram                         │
│  └── Quick command shortcuts (dps, health, dlog, dll)           │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  📊 Semua Cron Jobs Aktif:                                      │
│  • */5 * * * *  → Monitoring (setiap 5 menit)                   │
│  • 0 2 * * *    → Backup otomatis (jam 02:00)                   │
│  • 0 8 * * *    → Daily report (jam 08:00)                      │
└─────────────────────────────────────────────────────────────────┘
```

### 📱 Notifikasi Telegram yang Akan Lu Terima:

| Waktu | Notifikasi | Kondisi |
|---|---|---|
| **Setiap 5 menit** | 🚨 Alert darurat | Hanya kalau ada masalah |
| **Jam 02:00** | 💾 Backup report | Setiap hari setelah backup |
| **Jam 08:00** | 📊 Daily health report | Setiap pagi (laporan rutin) |

### 🛠️ Command Cheat Sheet:

| Command | Fungsi |
|---|---|
| `dps` | Status semua container |
| `health` | Cek kesehatan server lengkap |
| `dlog` | Log Laravel realtime |
| `drestart` | Restart app Dancell |
| `backup-now` | Backup manual sekarang |
| `monitor-now` | Cek monitoring manual |
| `report-now` | Kirim daily report sekarang |
