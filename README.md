# 🔬 Laboratorium Rasio (Math Ratios APOS Educational Web App)

Aplikasi web pembelajaran matematika interaktif materi **Rasio (Perbandingan)** yang ramah anak, dirancang dengan pendekatan **Teori APOS** (*Action, Process, Object, Schema*) menggunakan **Next.js 14 (App Router)**, **Tailwind CSS**, **Lucide React**, dan **Prisma ORM (PostgreSQL)**.

---

## 🚀 Fitur Utama

1. **Kid-Friendly Modern UI/UX**
   - Palet warna ceria, rounded card bervariasi, lencana lencana gamifikasi, dan maskot petualangan ramah anak.
   - Sidebar navigasi responsif (Mobile Drawer & Desktop Sticky Sidebar).
2. **5 Menu Utama Sesuai Kerangka APOS**:
   - **Dashboard**: Pusat misi belajar, ringkasan skor bintang, progres tahapan, dan wawasan konsep rasio harian.
   - **Aksi (Action)**: Eksplorasi langsung memanipulasi benda konkret (apel, jeruk, kelereng).
   - **Proses (Process)**: Menemukan pola berulang dalam tabel rasio proporsional tanpa harus menghitung satu per satu.
   - **Objek (Object)**: Memperlakukan rasio sebagai satu kesatuan entitas matematika (kesetaraan rasio, pecahan senilai).
   - **Skema (Schema)**: Sintesis komprehensif untuk memecahkan masalah kontekstual dunia nyata (skala peta harta karun).
   - **LKPD Digital (Refleksi)**: Formulir refleksi mandiri siswa (`understoodText` & `confusedText`).

---

## 🗄️ Skema Database (Prisma + PostgreSQL)

Model tersimpan di [`prisma/schema.prisma`](file:///Users/user/Ayu%20Belajar%20Biki%20Web/prisma/schema.prisma):

- **`Student`**: Menyimpan identitas siswa (`id`, `name`, `class`, relasi ke progres & refleksi).
- **`AposProgress`**: Menyimpan status kemajuan siswa per tahap (`id`, `studentId`, `stage` [AKSI, PROSES, OBJEK, SKEMA], `isCompleted`, `score`, `createdAt`).
- **`Reflection` (LKPD Digital)**: Lembar kerja digital siswa (`id`, `studentId`, `understoodText`, `confusedText`, `createdAt`).

---

## 🛠️ Panduan Memulai Cepat

### 1. Menyiapkan Database PostgreSQL
Buka file [`.env`](file:///Users/user/Ayu%20Belajar%20Biki%20Web/.env) dan sesuaikan kredensial PostgreSQL Anda:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/laboratorium_rasio?schema=public"
```

### 2. Jalankan Migrasi Prisma & Generate Client
```bash
npx prisma migrate dev --name init
npx prisma db seed
```

### 3. Jalankan Development Server
```bash
npm run dev
```
Buka browser di `http://localhost:3000`.

