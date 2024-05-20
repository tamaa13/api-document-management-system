# Panduan Penggunaan

Ini adalah panduan untuk menjalankan aplikasi menggunakan Docker.

## Langkah-langkah

### 1. Salin Berkas Environment

- Salin berkas `.env.example` ke dalam `.env` dengan menjalankan perintah berikut:

```bash
cp .env.example .env
```

### 2. Isi Nilai Environment
- Isi nilai-nilai environment yang dibutuhkan dalam berkas .env sesuai dengan value Anda.

### 3. Migrasi Basis Data
Jalankan perintah Prisma untuk melakukan migrasi basis data dengan menjalankan perintah berikut:

```bash
npx prisma migrate dev --name init
```

### 4. Build dan Jalankan Docker
- Build dan jalankan aplikasi menggunakan Docker dengan menjalankan perintah:

```bash
docker-compose up --build
```

### Setelah langkah-langkah di atas dijalankan, aplikasi akan berjalan di dalam Docker. Pastikan untuk memeriksa output log Docker untuk memastikan bahwa aplikasi berjalan tanpa masalah.