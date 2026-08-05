# Jojoba Dashboard — Frontend

React 19 + Vite 8 + Tailwind 4 + Recharts.

## Menjalankan

```bash
cp .env.example .env
npm install
npm run dev
```

Backend FastAPI harus hidup di `http://localhost:8001`. Vite mem-proxy
`/api` ke sana, jadi tidak ada masalah CORS saat pengembangan.

## Struktur

```
src/config/views.js      katalog halaman — cermin dari view_registry.py
src/lib/api.js           klien fetch + pembuka envelope SuccessResponse
src/lib/rows.js          normalisasi bentuk respons + deteksi kolom
src/hooks/               useApiQuery, useDateRange (rentang tanggal di URL)
src/components/ui/       Button, Card, Badge, StatCard, DataTable, ...
src/components/charts/   ChartCard generik + ForecastChart
src/components/chat/     ChatDock advisor, diagnostik, kartu navigasi
src/pages/DataView.jsx   satu halaman generik untuk semua view berbasis config
```

## Dua bahasa

Seluruh label antarmuka melewati `src/i18n/translations.js`. Pemilih
bahasa ada di topbar dan berlaku untuk seluruh aplikasi termasuk
advisor — pilihannya tersimpan di localStorage.

Menambah teks baru:

1. Tambahkan kunci di blok `id` dan `en` pada `translations.js`
2. Pakai `const { t } = useLanguage()` lalu `t("kunci.anda")`
3. Untuk teks bernilai sisip: `t("table.showing", { shown: 50, total: 120 })`

Nilai yang berasal dari database (segmen, status booking, bucket risiko)
sengaja TIDAK diterjemahkan agar tetap cocok saat dibandingkan dengan
data mentah.

## Menambah halaman baru

Tambahkan satu entri di `src/config/views.js`, satu kunci
`view.<view_id>` di kedua bahasa pada `translations.js`, lalu entri
dengan `view_id` yang sama di `src/services/agents/view_registry.py`
pada backend. Rute, menu sidebar, dan navigasi lewat chat mengikuti
otomatis.
