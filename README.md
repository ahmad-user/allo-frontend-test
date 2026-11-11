# SpaceX Rocket Fleet — Allo Bank Frontend Take-Home Test

A modern, responsive web application built with **Vue 3**, **TypeScript**, and **Vuetify 3** to explore launch vehicles powered by SpaceX and the **Launch Library 2 API** (The Space Devs).

This project fulfills all requirements for the Allo Bank Frontend Technical Assignment, including catalog browsing, dynamic filtering & search, local rocket creation, detailed vehicle views, resilient image fallback, and comprehensive UI state management (Loading, Error/Retry, Empty, and Success).

---

## 🚀 Fitur Utama

- **Katalog Armada Roket SpaceX**: Menampilkan seluruh data kendaraan peluncur SpaceX dari Launch Library 2 API (`mode=detailed&limit=20`), mencakup gambar, nama lengkap roket, dan deskripsi.
- **Search & Filter Real-Time**:
  - Pencarian teks instan berdasarkan nama roket maupun kata kunci dalam deskripsi.
  - Dropdown filter dinamis berdasarkan negara manufaktur (misal: USA).
  - Tombol **Clear Filters** untuk mereset kondisi pencarian dan filter dengan cepat.
- **Add Rocket Secara Lokal**:
  - Modal form untuk menambahkan roket kustom ke state reaktif sesi aplikasi tanpa memodifikasi API backend read-only.
  - Roket lokal langsung muncul di bagian teratas daftar dan dapat dibuka halaman detailnya.
  - Badge khusus membedakan roket lokal (*Local Rocket*) dengan roket resmi (*SpaceX API*).
- **Validasi Form yang Ketat & Andal**:
  - Nama roket wajib diisi (minimal 2 karakter, maksimal 100 karakter, tidak menerima spasi kosong saja).
  - Format Image URL divalidasi harus berawalan `http://` atau `https://`.
  - Format Cost per Launch divalidasi hanya menerima angka positif atau format mata uang valid (misal `$90,000,000` atau `90000000`).
  - Kode negara divalidasi berupa 2–4 huruf alfabet (misal `USA`, `IDN`).
  - Format tanggal First Flight tervalidasi.
- **Halaman Detail Roket (`/rockets/:id`)**:
  - Menampilkan media gambar banner resolusi tinggi, nama roket, status asal data, serta kartu metrik informatif (*Cost per Launch*, *Country*, dan *First Flight Date*).
  - Deskripsi lengkap kendaraan peluncur.
  - Penanganan pembersihan data lama secara instan ketika ID roket berubah atau request gagal, mencegah *stale data* atau *ghost UI*.
- **Penanganan Gambar Tangguh (Resilient Image Handling)**:
  - Fallback otomatis ke custom SVG placeholder jika URL gambar tidak tersedia atau gagal dimuat (*broken image link*).
  - Status error gambar di-reset secara reaktif setiap kali URL gambar atau ID roket diperbarui.
- **Robust Missing Data Handling**:
  - Tetap berjalan mulus dan rapi tanpa error runtime ketika atribut roket (seperti image, cost, launch date, atau country) bernilai null atau kosong dari response API.
- **State UI Lengkap**:
  - **Loading State**: Circular progress indicator dan skeleton card loaders yang responsif.
  - **Error State & Retry**: Pesan kesalahan informatif dengan tombol **Retry Request** untuk memicu pengambilan data ulang dari API.
  - **Empty State**: Tampilan kosong ramah pengguna dengan tombol **Reset Filters** ketika tidak ada roket yang cocok dengan kriteria pencarian.
  - **Success State**: Grid responsif kartu roket dengan efek hover interaktif.

---

## 🛠️ Teknologi yang Digunakan

| Kategori | Teknologi | Deskripsi |
| :--- | :--- | :--- |
| **Framework** | [Vue 3](https://vuejs.org/) | Composition API, `<script setup>`, reactive & computed primitives |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | Strict type-safety dan domain model interfaces |
| **UI Library** | [Vuetify 3](https://vuetifyjs.com/) | Material Design 3 components, grid system, and utility styling |
| **Routing** | [Vue Router 4](https://router.vuejs.org/) + `unplugin-vue-router` | File-based automatic routing untuk `/` dan `/rockets/:id` |
| **Icons** | [Material Design Icons](https://materialdesignicons.com/) | `@mdi/font` vector icon set |
| **Build Tool** | [Vite 5](https://vitejs.dev/) | Next-generation frontend tooling dan lightning-fast HMR |
| **Type Checking** | [vue-tsc](https://github.com/vuejs/language-tools) | TypeScript compiler check untuk Vue Single File Components |

---

## 📡 API yang Digunakan

Aplikasi mengonsumsi **Launch Library 2 API** dari **The Space Devs**:
- **Dokumentasi API**: [https://thespacedevs.com/llapi](https://thespacedevs.com/llapi)
- **API Version**: `2.2.0` (kompatibel dengan field standar `image_url` dan `manufacturer.country_code`).
- **Base Host**: `https://lldev.thespacedevs.com/2.2.0` (Development host dengan rate limit yang jauh lebih longgar daripada host produksi).

### Endpoints:
1. **Rocket List**:
   ```http
   GET https://lldev.thespacedevs.com/2.2.0/config/launcher/?manufacturer__name=SpaceX&mode=detailed&limit=20
   ```
   *Parameter `mode=detailed` diperlukan agar deskripsi dan metadata lengkap disertakan; `limit=20` mengambil seluruh armada roket SpaceX dalam satu request.*

2. **Single Rocket Detail**:
   ```http
   GET https://lldev.thespacedevs.com/2.2.0/config/launcher/:id/
   ```

### Pemetaan Field Data:
| Kebutuhan UI | Field Sumber API | Fallback jika Kosong |
| :--- | :--- | :--- |
| **Rocket Image** | `image_url` | SVG Placeholder kustom |
| **Rocket Name** | `full_name` \| `name` | `Rocket #${id}` |
| **Description** | `description` | `No description available.` |
| **Cost per Launch** | `launch_cost` | `Not available.` / USD formatted |
| **Country** | `manufacturer.country_code` | `Not available.` |
| **First Flight** | `maiden_flight` | `Date unknown` / `Not available.` |

---

## 📁 Struktur Direktori Proyek

```text
src/
├── assets/             # Logo dan asset statis
├── components/         # Komponen UI modular & reusable
│   ├── AddRocketDialog.vue   # Modal form tambah roket lokal dengan validasi
│   ├── EmptyState.vue        # State ketika hasil pencarian/filter kosong
│   ├── ErrorState.vue        # State error terpusat dengan tombol Retry
│   ├── LoadingState.vue      # State loading dengan skeleton loader
│   ├── RocketCard.vue        # Kartu informasi roket dengan error image watcher
│   ├── RocketFilter.vue      # Input pencarian & dropdown filter negara
│   └── RocketGrid.vue        # Grid layout responsif kartu-kartu roket
├── pages/              # Halaman berbasis Vue Router otomatis
│   ├── index.vue             # Halaman utama daftar roket SpaceX
│   └── rockets/[id].vue      # Halaman detail roket dinamis
├── plugins/            # Konfigurasi Vuetify & auto-import plugins
├── router/             # Konfigurasi Vue Router 4
├── services/           # HTTP API client untuk Launch Library 2
│   └── rocketApi.ts          # Layanan fetch getRockets & getRocketDetail
├── state/              # State management reaktif berbasis Composition API
│   └── rocketStore.ts        # Store pusat untuk list, detail cache, dan filter
├── styles/             # Pengaturan Sass / styling kustom
└── types/              # Type definitions & domain interfaces
    └── rocket.ts             # Interface ApiRocket, Rocket, dan NewRocketInput
```

---

## 💻 Panduan Instalasi dan Menjalankan Aplikasi

### 1. Prasyarat Sistem
- **Node.js**: Versi `18.x` atau lebih baru
- **npm**: Versi `9.x` atau lebih baru

### 2. Instalasi Dependensi
Clone repository dan jalankan instalasi package:
```bash
npm install
```

### 3. Menjalankan Server Pengembangan (Development)
Jalankan dev server dengan Hot Module Replacement (HMR):
```bash
npm run dev
```
Buka browser di alamat yang muncul di terminal (biasanya `http://localhost:3000` atau `http://localhost:5173`).

### 4. Menjalankan Pemeriksaan Type (Type-Check)
Memeriksa seluruh tipe TypeScript pada codebase dan Vue SFC:
```bash
npm run type-check
```

### 5. Membangun untuk Produksi (Production Build)
Menjalankan type checking dan bundling aset produksi teroptimasi:
```bash
npm run build
```
Hasil build akan tersimpan di direktori `dist/`.

### 6. Preview Hasil Build Produksi
Untuk menguji hasil build produksi secara lokal:
```bash
npm run preview
```

---

## 🧪 Catatan Pengujian & Kualitas Kode

- **Type Check**: Lulus tanpa error (`npm run type-check`).
- **Production Build**: Lulus kompilasi dan bundling tanpa warning/error (`npm run build`).
- **Edge Cases Checked**:
  - Penanganan roket dengan data deskripsi atau gambar null.
  - Penanganan kegagalan koneksi / rate limit HTTP error dengan tombol retry.
  - Transisi pergantian ID di halaman detail membersihkan data lama secara tepat.
  - Reset status image error saat URL berganti.
  - Validasi ketat form tambah roket terhadap input kosong dan format invalid.
