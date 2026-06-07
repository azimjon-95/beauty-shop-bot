# 💕 Beauty Shop Bot

Lady Shop parfyumeriya do'koni uchun Telegram bot — userbot + WebApp boshqaruvi.

## Tuzilma

```
├── src/              ← Backend (Node.js)
│   ├── index.js      ← Kirish nuqtasi
│   ├── setup.js      ← Birinchi sozlash
│   ├── session.js    ← Telegram userbot
│   ├── scheduler.js  ← Avtomatik postlar
│   ├── autoReply.js  ← Avtomatik javob
│   ├── bot.js        ← Telegram bot (WebApp tugma)
│   └── api.js        ← Express REST API
├── webapp/           ← Frontend (React + Vite)
│   └── src/pages/    ← Home, Posts, Reply, Groups, Images
├── config/           ← JSON sozlamalar
└── content/images/   ← Yuklangan rasmlar
```

## Ishga tushirish

```bash
# Backend
npm install
npm run setup     # Birinchi sozlash
npm start

# Frontend
cd webapp
npm install
npm run build
```

## Bot komandalar
- `/start` — WebApp tugmasini ochish
- `/status` — Bot holati
- `/panel` — Inline panel tugmasi
