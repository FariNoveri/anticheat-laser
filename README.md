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

- `src/firebase/config.js`, `src/components/Config.js`, and `api/payment.js` are in `.gitignore` to prevent secret leaks
- API proxy endpoints (`fb-proxy`, `payment`) block non-Roblox HttpService requests and redirect unauthorized users to a fullscreen YouTube troll page
- reCAPTCHA v3 is active on the login page

## What's New in Version 5.2
- **Cutecore Aesthetic Theme:** Added a fully themed, animated pink cutecore landing page with snow parallax effects.
- **Dynamic Kick Messages:** Removed hardcoded global kick fallbacks. Kick messages are now completely driven by the Web Panel configuration.
- **API Troll Protection:** Any attempt to bypass the API via browser or dummy requests will trigger a fullscreen Rickroll embed.
- **Updated Pricing:** Trial plan adjusted to 200 Robux and feature cards updated to hide detection secrets.

## License

This project is licensed under the MIT License. See `LICENSE` for details.
