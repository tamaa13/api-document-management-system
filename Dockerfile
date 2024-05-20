# Gunakan image Node.js versi 20.10.0 sebagai base image
FROM node:20.10.0

# Buat direktori kerja di dalam container
WORKDIR /app

# Salin file package.json dan package-lock.json
COPY package*.json ./

# Salin berkas .env.sample dan ubah namanya menjadi .env
COPY .env.example .env

# Install dependensi menggunakan npm
RUN npm install

# Salin seluruh kode aplikasi
COPY . .

# Expose port yang digunakan oleh aplikasi Nest.js (misalnya, 3000)
EXPOSE 3000

# Perintah untuk menjalankan aplikasi saat container dimulai
CMD ["npm", "run", "start:dev"]
