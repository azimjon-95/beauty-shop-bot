# 💄 Lady Shop WebApp — Frontend

Telegram WebApp — React + Vite. Lady Shop parfyumeriya do'koni bot boshqaruv paneli.

## Texnologiyalar
- **React 18** + **Vite 5**
- **Telegram WebApp JS SDK**
- CSS variables + custom tema (dark rose)
- Google Fonts: Playfair Display + DM Sans

## O'rnatish va ishga tushirish

```bash
npm install
npm run dev      # Development (proxy → localhost:3000)
npm run build    # Production build → dist/
```

## Backend bilan integratsiya

`vite.config.js` da proxy sozlangan:
```js
proxy: { '/api': 'http://localhost:3000', '/images': 'http://localhost:3000' }
```

Build qilingan `dist/` papkasini backend `lady-shop-bot/` papkasining yoniga qo'ying.

## Sahifalar

| Sahifa | Fayl | Vazifasi |
|--------|------|----------|
| 🏠 Bosh | `Home.jsx` | Statistika dashboard |
| 📅 Postlar | `Posts.jsx` | Post qo'shish/o'chirish |
| 💬 Javob | `Reply.jsx` | Kalit so'z qoidalari |
| 👥 Guruhlar | `Groups.jsx` | Guruh boshqaruvi |
| 🖼️ Rasmlar | `Images.jsx` | Rasm yuklash/o'chirish |

## Papka tuzilmasi

```
src/
  App.jsx          ← Asosiy komponent + navigatsiya
  main.jsx         ← Kirish nuqtasi
  api.js           ← Backend API chaqiruvlari
  theme.js         ← Rang palitasi
  index.css        ← Global stillar
  components/
    Card.jsx
    Btn.jsx
    Toggle.jsx
    Icon.jsx       ← SVG ikonalar
    Toast.jsx
    index.js       ← Barrel export
  pages/
    Home.jsx
    Posts.jsx
    Reply.jsx
    Groups.jsx
    Images.jsx
```
