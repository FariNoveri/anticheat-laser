# AntiCheat Laser

React/Vite admin panel for LASER Anti-Cheat — powered by Firebase & Vercel.

## Overview

- `src/` — Vite React admin interface untuk manage banned animations, body items, dan game settings
- `api/fb-proxy.js` — Vercel API route yang forward request ke Firebase menggunakan secret dari environment variables
- Akses API diproteksi: hanya request dari Roblox (`HttpService`) yang diizinkan

## Setup

1. Deploy project ini ke Vercel
2. Set Vercel environment variable:
   - `FIREBASE_SECRET` — Firebase Database secret
3. Update URL proxy di `Connection.lua` Roblox sesuai domain Vercel kamu

## Security

- `src/firebase/config.js` dan `src/components/Config.js` di-gitignore (berisi API keys)
- API proxy memblokir semua akses non-Roblox dengan halaman 403
- reCAPTCHA v3 terpasang di login page

## License

This project is licensed under the MIT License. See `LICENSE` for details.
