---
name: ui-ux-pro-max
description: Comprehensive UI/UX design intelligence skill based on nextlevelbuilder/ui-ux-pro-max-skill. Use when designing, building, or refactoring user interfaces, creating design systems, selecting color palettes and font pairings, and optimizing touch targets, cognitive load, and delightful micro-interactions.
---

# UI/UX Pro Max Skill (Design Intelligence Engine)

Skill ini diadopsi dari arsitektur **`nextlevelbuilder/ui-ux-pro-max-skill`** untuk memberikan kecerdasan desain profesional sebelum dan saat menulis kode antarmuka (frontend).

---

## 🎯 1. Prinsip Utama: "Design System First"
Sebelum membuat atau mengubah komponen frontend:
1. **Identifikasi Profil Produk & Audiens:**
   - Siapa penggunanya? (Anak-anak, remaja, profesional B2B, publik umum)
   - Apa konteks penggunaannya? (Gamified EdTech, High-productivity SaaS, E-commerce, FinTech)
2. **Pilih Gaya Desain (Design Style):**
   - *Gamified / Bouncy 3D:* Sangat cocok untuk anak-anak dan pembelajaran interaktif (kontras tinggi, tombol tebal membal, ilustrasi cerah).
   - *Bento Grid:* Sangat cocok untuk ringkasan metrik, fitur produk, dan dashboard analitik.
   - *Glassmorphism / Frosted Glass:* Bagus untuk overlay, HUD, dan kartu melayang modern.
   - *Clean Minimalist:* Sangat cocok untuk fokus membaca, produktivitas, dan formulir data.
3. **Tetapkan Design Tokens:**
   - Simpan aturan token di `design-system/<project>/MASTER.md`.

---

## 🎨 2. Standar Palet Warna & Kontras
- **60-30-10 Rule:**
  - 60% Warna dominan latar belakang (misal: Sky Blue ceria `#E0F2FE` atau Light Canvas).
  - 30% Warna sekunder penopang kartu/wadah konten (putih, cream, kartu bervolume).
  - 10% Warna aksen kontras tinggi untuk tombol aksi utama (*Call to Action*).
- **Aksesibilitas Kontras (WCAG AA/AAA):**
  - Teks di atas tombol atau latar belakang terang wajib memiliki rasio kontras minimal 4.5:1 (untuk teks normal) atau 3:1 (untuk teks tebal besar).
  - Jangan gunakan teks abu-abu pudar di atas background abu-abu terang.

---

## 🔤 3. Pasangan Fon (*Font Pairings*)
- **EdTech / Kids:** `Nunito` atau `Quicksand` (rounded terminals, ramah, non-intimidating).
- **Modern Tech / SaaS:** `Plus Jakarta Sans` / `Inter` + `Geist Mono`.
- **Editorial / Premium:** `Playfair Display` + `Source Sans Pro`.
- **Ukuran Hierarki Jelas:**
  - Perbedaan skala teks minimal 1.25x antar tingkatan (Heading 1 > Heading 2 > Subheading > Body > Caption).

---

## 📱 4. Ergonomi & Target Sentuh (*Touch Affordances*)
- **Ukuran Target Sentuh Minimum:**
  - Dewasa: minimal 44x44px (Tailwind: `h-11 w-11` atau `min-h-12`).
  - Anak-anak (Ages 6-12): minimal 56px hingga 64px (`min-h-14` s.d. `min-h-16`, `px-8`).
- **Efek Taktil 3D (Bouncy Buttons):**
  - Gunakan `border-b-4` atau `border-b-6` dengan warna border lebih gelap dari warna latar tombol.
  - Tambahkan efek tekan `active:translate-y-1 active:border-b-0` agar terasa membal seperti tombol fisik.
- **Afodansi Objek Seret (Drag-and-Drop):**
  - Objek yang dapat diseret wajib memiliki isyarat visual (*visual affordance*) seperti animasi getar halus (`animate-pulse` atau `.animate-touch-ready`), border cincin bersinar, atau ikon pegangan (*drag handle*).
  - Dropzone wajib memiliki batas putus-putus tebal (`border-4 border-dashed`) yang bereaksi saat kursor/elemen melintas di atasnya.

---

## 🧠 5. Manajemen Beban Kognitif (*Cognitive Load Management*)
- **Progressive Disclosure:** Tampilkan informasi hanya saat dibutuhkan. Jangan banjiri layar dengan tabel atau opsi rumit di awal.
- **Mascot / Conversational Guidance:** Untuk aplikasi edukasi dan publik, gunakan maskot ramah dengan balon ucapan (*speech bubble*) untuk memberikan satu instruksi spesifik dalam satu waktu.
- **Konfirmasi & Kejelasan State:** Setiap interaksi pengguna wajib memiliki 4 status:
  1. *Idle / Default*
  2. *Hover / Focus*
  3. *Active / Pressed*
  4. *Success / Error Feedback*

---

## ✨ 6. Selebrasi Visual & Umpan Balik Positif
- Berikan umpan balik instan saat pengguna berhasil menyelesaikan langkah (letupan konfeti `canvas-confetti`, efek suara gembira, animasi emoji besar `🎉 ⭐ 🥳`).
- Pesan kesalahan harus bersifat membimbing (*constructive guidance*), bukan menyalahkan atau menghukum pengguna.

