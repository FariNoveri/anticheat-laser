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

## What's New in Version 5.4
- **Payload Encryption:** Added Luraph-style custom payload encryption for ultimate API safety against spoofing.
- **Modularity:** Rewritten core engine into `Core` modules (`AvatarScanner`, `AnimScanner`, `Punish`) for an ultra-clean main script.
- **Adonis Integration:** Automatically syncs with Adonis Admin to push visual warning logs to in-game moderators.
- **Infinite Scrolling:** Added "Load More" infinite scrolling to the Web Panel for better performance with thousands of items.
- **In-Game Notifications:** Admins now receive real-time UI notifications inside the game.
- **Version Checker:** The script now checks for updates and warns users if they are on an outdated version.

*Note: For the full history of updates and to download the latest scripts, please check our [Releases Page](https://github.com/FariNoveri/anticheat-laser/releases).*

## License

This project is licensed under the MIT License. See `LICENSE` for details.
