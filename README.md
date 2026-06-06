# 💕 Lady Shop Bot — Backend

Telegram userbot + bot + Express REST API server.

## Texnologiyalar
- **Node.js** + **Express** — API server
- **gramjs (telegram)** — Userbot (post yuborish, javob berish)
- **Telegraf** — Bot (WebApp tugmasi)
- **node-cron** — Vaqt jadvali

## Tezkor ishga tushirish

```bash
# 1. O'rnatish
npm install

# 2. Birinchi sozlash (bir marta)
npm run setup

# 3. Ishga tushirish
npm start

# 4. VPS da doimiy (PM2)
pm2 start src/index.js --name lady-shop-bot
pm2 save && pm2 startup
```

## Muhit o'zgaruvchilari

`.env.example` faylini `.env` ga nusxalab to'ldiring:

| Kalit | Izoh |
|-------|------|
| `API_ID` | https://my.telegram.org |
| `API_HASH` | https://my.telegram.org |
| `SESSION` | `npm run setup` yaratadi |
| `BOT_TOKEN` | @BotFather → /newbot |
| `ADMIN_USERNAME` | Sizning Telegram username |
| `WEBAPP_URL` | Frontend URL |
| `PORT` | Server porti (default: 3000) |

## API Endpointlar

| Method | URL | Izoh |
|--------|-----|------|
| GET | `/api/stats` | Statistika |
| GET/POST/DELETE | `/api/groups` | Guruhlar |
| GET/POST/DELETE | `/api/schedule` | Post jadvali |
| GET/POST | `/api/reply` | Javob sozlamalari |
| POST | `/api/reply/toggle` | Yoqish/o'chirish |
| GET/POST/DELETE | `/api/images` | Rasmlar |

## Papka tuzilmasi

```
src/
  index.js      ← Kirish nuqtasi
  setup.js      ← Birinchi sozlash
  session.js    ← Telegram userbot ulanish
  scheduler.js  ← Vaqt bo'yicha post
  autoReply.js  ← Avtomatik javob
  bot.js        ← Telegram bot (WebApp tugma)
  api.js        ← Express REST API
config/
  groups.json
  schedule.json
  auto-reply.json
content/images/ ← Yuklangan rasmlar
```
