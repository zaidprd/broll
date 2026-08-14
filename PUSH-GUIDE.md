# Cara Push ke GitHub

Karena push butuh autentikasi, Anda perlu eksekusi 2 command di bawah ini
**sekali** dengan kredensial Anda sendiri.

## Setup (5 menit)

### 1. Generate Personal Access Token (PAT)

1. Buka https://github.com/settings/tokens
2. Klik **"Generate new token"** → **"Generate new token (classic)"**
3. Isi:
   - **Note**: `broll-studio-push`
   - **Expiration**: 90 days (atau pilih)
   - **Scopes**: centang `repo` (full)
4. Klik **Generate token**
5. **COPY token** (hanya muncul 1x — simpan di tempat aman)

### 2. Push dari terminal

```bash
cd E:\latihan\broll

# Set username (ganti dengan username GitHub Anda)
git config user.name "zaidprd"

# Set email
git config user.email "zaid@example.com"

# Rename branch ke main
git branch -M main

# Add remote
git remote add origin https://github.com/zaidprd/broll.git

# Push (akan minta username + token)
git push -u origin main
```

Saat diminta:
- **Username**: `zaidprd`
- **Password**: paste token (bukan password GitHub Anda)

Token akan disimpan di Windows Credential Manager — push berikutnya tidak perlu masukkan ulang.

## Setelah push berhasil

### Verify

Buka https://github.com/zaidprd/broll — file project harus muncul.

### Buat release

1. Di GitHub repo, klik **"Create a new release"**
2. Tag: `v1.0.0`
3. Title: `Broll Studio v1.0.0`
4. Klik **"Publish release"**

## Untuk orang yang clone

Mereka tinggal:

```bash
git clone https://github.com/zaidprd/broll.git
cd broll
setup.bat        # install deps
start.bat        # run UI
```

Akan terbuka otomatis di browser http://localhost:5173
