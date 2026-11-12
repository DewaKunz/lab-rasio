# 🎨 Design System: Laboratorium Rasio
*Generated based on UI/UX Pro Max Design Intelligence Architecture*
*Product Profile: Kids Educational Web App (EdTech, Ages 10–12, Math Gamification)*

---

## 1. Visual Style & Philosophy
* **Core Style:** Playful Gamified Flat 3D & Bouncy Claymorphism
* **Tone:** Cheerful, highly encouraging, intuitive, high-contrast, tactile
* **Target Audience:** Elementary school students (grades 4–6, ages 10–12) & Teachers
* **Design Motto:** *"Zero Cognitive Friction, Maximum Delight"* (Kurangi teks rumit, maksimalkan interaksi visual dan afordansi fisik).

---

## 2. Color Palette & Semantics
| Role | Color Name | HEX / Tailwind | Purpose |
| :--- | :--- | :--- | :--- |
| **Canvas / Background** | Sky Blue 100 | `#E0F2FE` (`bg-[#E0F2FE]`) | Menghilangkan nuansa kaku abu-abu enterprise; menciptakan dunia bermain langit ceria |
| **Primary Interactive** | Sunny Yellow / Amber | `#FBBF24` / `#F59E0B` (`bg-amber-400`, `border-amber-600`) | Tombol aksi utama (CTA), tombol "Mulai Bermain", tombol "Gandakan" |
| **Success / Reward** | Grass Green | `#10B981` / `#059669` (`bg-emerald-500`, `border-emerald-700`) | Indikator sukses, pasangan cocok, tombol lanjut ke level berikutnya |
| **Red Ratio Entity** | Crimson Red / Berry | `#F43F5E` / `#E11D48` (`bg-rose-500`, `border-rose-700`) | Keping Merah, Wadah Aksi, indikator perbandingan merah |
| **Blue Ratio Entity** | Ocean Blue | `#0284C7` / `#0369A1` (`bg-sky-500`, `border-sky-700`) | Keping Biru, botol air kafe, indikator perbandingan biru |
| **Schema / Mastery** | Electric Purple | `#8B5CF6` / `#7C3AED` (`bg-purple-500`, `border-purple-700`) | Tahap Skema, Tantangan Koki, dashboard guru, lencana prestasi |
| **Text Primary** | Deep Slate | `#0F172A` (`text-slate-900`) | Teks utama kontras tinggi (WCAG AAA compliant di atas background terang) |

---

## 3. Typography Rules
* **Primary Typeface:** `Nunito` (Google Fonts, rounded terminals, friendly geometric curves)
* **Hierarchy:**
  * **H1 / Level Banner:** `text-3xl sm:text-4xl md:text-5xl font-black`
  * **H2 / Sub-Header:** `text-xl sm:text-2xl font-black`
  * **Card & Button Label:** `text-base sm:text-xl font-black`
  * **Body / Instructions:** `text-sm sm:text-base font-bold text-slate-700`
  * **Microcopy / Helper:** `text-xs font-extrabold text-slate-500`

---

## 4. Touch Targets & Affordances (Ergonomics)
* **3D Buttons (`.btn-game`):**
  * Minimum height: `min-h-14` (56px) hingga `min-h-16` (64px)
  * Border radius: `rounded-full`
  * Tactile 3D Depth: `border-b-4` atau `border-b-6`
  * Press Feedback: `active:translate-y-1 active:border-b-0`
* **Draggable Chips Affordance:**
  * Ukuran keping: `w-16 h-16` (64x64px, jauh di atas standar minimum 44px)
  * Pulse hint: `.animate-touch-ready` + ring menyala agar anak tahu objek dapat disentuh
  * Dropzone: Garis putus-putus tebal (`border-4 border-dashed`) yang menyala saat *hover/drag-over*.

---

## 5. Cognitive Load & Progressive Disclosure
* **Chunking:** Informasi disajikan dalam satu blok aksi tunggal per sesi.
* **Mascot Speech Bubble (`Robi 🤖`):**
  * Menggantikan paragraf instruksi panjang dengan pesan ramah bertahap di bagian atas layar.
* **Step-by-Step Reveal (Tabel & LKPD):**
  * Data tabel tidak dimunculkan sekaligus; baris baru hanya terungkap setelah anak menyelesaikan aksi pemicunya (*trigger action*).
  * Lembar LKPD hanya dibuka setelah teka-teki rasio koki berhasil diselesaikan.

---

## 6. Feedback & Celebration Architecture
* **Audio Feedback (Web Audio API):**
  * `playPop()`: Setiap kali keping disentuh atau dipindahkan.
  * `playZap()`: Efek mesin kloning menggandakan rasio.
  * `playPour()`: Efek gelembung cairan dituangkan ke teko.
  * `playSuccess()`: Fanfare kemenangan 4 tangga nada gembira.
  * `playRetry()`: Nada lembut yang memotivasi (tanpa suara kegagalan yang keras).
* **Visual Celebrations:**
  * Partikel konfeti (`canvas-confetti`)
  * Emoji raksasa animasi membal: `🎉 ⭐ 🥳`
  * Lencana bintang emas terisi otomatis.

---

## 7. Secret Access Architecture (Teacher Mode)
* **Trigger:** 5x klik cepat pada logo tabung reaksi 🧪 *"Lab Rasio!"*.
* **Behavior:** Mencegah anak terdistraksi dengan menu administratif, namun memberikan akses instan bagi pengajar untuk melihat analisis ketercapaian dan jawaban LKPD.

