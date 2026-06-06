const express = require('express');
const cors    = require('cors');
const multer  = require('multer');
const fs      = require('fs');
const path    = require('path');

const app    = express();
const CONFIG = path.resolve(__dirname, '../config');
const IMAGES = path.resolve(__dirname, '../content/images');

app.use(cors());
app.use(express.json());
app.use('/images', express.static(IMAGES));
app.use(express.static(path.resolve(__dirname, '../../lady-shop-webapp/dist')));

const upload = multer({
  storage: multer.diskStorage({
    destination: IMAGES,
    filename: (req, file, cb) => cb(null, Date.now() + '_' + file.originalname),
  }),
});

// ── Helpers ─────────────────────────────────────────────────────────────────
const read  = f  => JSON.parse(fs.readFileSync(path.join(CONFIG, f), 'utf-8'));
const write = (f, d) => fs.writeFileSync(path.join(CONFIG, f), JSON.stringify(d, null, 2));
const ok    = (res, d = {}) => res.json({ ok: true, ...d });
const err   = (res, m) => res.status(400).json({ ok: false, message: m });

// ── Stats ────────────────────────────────────────────────────────────────────
app.get('/api/stats', (req, res) => {
  const g = read('groups.json');
  const s = read('schedule.json');
  const r = read('auto-reply.json');
  const imgs = fs.readdirSync(IMAGES).filter(f => /\.(jpg|jpeg|png|gif|webp)$/i.test(f));
  res.json({ groups: g.length, posts: s.posts.length, rules: r.rules.length, images: imgs.length, autoReplyEnabled: r.enabled, waitMinutes: r.wait_minutes });
});

// ── Groups ───────────────────────────────────────────────────────────────────
app.get   ('/api/groups',     (req, res) => res.json(read('groups.json')));
app.post  ('/api/groups',     (req, res) => {
  const { name, username } = req.body;
  if (!name || !username) return err(res, 'Nom va username kerak');
  const groups = read('groups.json');
  const item = { id: Date.now().toString(), name, username: username.startsWith('@') ? username : '@' + username };
  groups.push(item);
  write('groups.json', groups);
  ok(res, { message: '✅ Guruh qo\'shildi', group: item });
});
app.delete('/api/groups/:id', (req, res) => {
  const groups = read('groups.json').filter(g => g.id !== req.params.id);
  write('groups.json', groups);
  ok(res, { message: '✅ O\'chirildi' });
});

// ── Schedule ─────────────────────────────────────────────────────────────────
app.get   ('/api/schedule',     (req, res) => res.json(read('schedule.json')));
app.post  ('/api/schedule',     (req, res) => {
  const { id, time, groups, type, images, text } = req.body;
  if (!id || !time || !groups?.length) return err(res, 'ID, vaqt va guruh kerak');
  const data = read('schedule.json');
  const post = { id, time, groups, type: type || 'text', images: images || [], text: text || '' };
  data.posts.push(post);
  write('schedule.json', data);
  ok(res, { message: '✅ Post saqlandi', post });
});
app.delete('/api/schedule/:id', (req, res) => {
  const data = read('schedule.json');
  data.posts = data.posts.filter(p => p.id !== req.params.id);
  write('schedule.json', data);
  ok(res, { message: '✅ O\'chirildi' });
});

// ── Auto Reply ────────────────────────────────────────────────────────────────
app.get ('/api/reply',          (req, res) => res.json(read('auto-reply.json')));
app.post('/api/reply/toggle',   (req, res) => {
  const d = read('auto-reply.json');
  d.enabled = !d.enabled;
  write('auto-reply.json', d);
  ok(res, { message: `Auto-javob ${d.enabled ? 'yoqildi ✅' : 'o\'chirildi ❌'}`, enabled: d.enabled });
});
app.post('/api/reply/wait',     (req, res) => {
  const d = read('auto-reply.json');
  d.wait_minutes = Number(req.body.wait_minutes) || 3;
  write('auto-reply.json', d);
  ok(res, { message: `✅ Kutish: ${d.wait_minutes} daqiqa` });
});
app.post('/api/reply/rules',    (req, res) => {
  const { keywords, reply } = req.body;
  if (!keywords?.length || !reply) return err(res, 'Kalit so\'z va javob kerak');
  const d = read('auto-reply.json');
  const rule = { id: Date.now().toString(), keywords, reply };
  d.rules.push(rule);
  write('auto-reply.json', d);
  ok(res, { message: '✅ Qoida qo\'shildi', rule });
});
app.delete('/api/reply/rules/:id', (req, res) => {
  const d = read('auto-reply.json');
  d.rules = d.rules.filter(r => r.id !== req.params.id);
  write('auto-reply.json', d);
  ok(res, { message: '✅ O\'chirildi' });
});

// ── Images ────────────────────────────────────────────────────────────────────
app.get   ('/api/images',       (req, res) => {
  const files = fs.readdirSync(IMAGES).filter(f => /\.(jpg|jpeg|png|gif|webp)$/i.test(f));
  res.json(files.map(f => ({ name: f, url: `/images/${f}` })));
});
app.post  ('/api/images', upload.array('files', 10), (req, res) => {
  ok(res, { message: `✅ ${req.files.length} ta rasm yuklandi`, files: req.files.map(f => ({ name: f.filename, url: `/images/${f.filename}` })) });
});
app.delete('/api/images/:name', (req, res) => {
  const fp = path.join(IMAGES, req.params.name);
  if (fs.existsSync(fp)) fs.unlinkSync(fp);
  ok(res, { message: '✅ O\'chirildi' });
});

// ── SPA fallback ──────────────────────────────────────────────────────────────
app.get('*', (req, res) => {
  const index = path.resolve(__dirname, '../../lady-shop-webapp/dist/index.html');
  if (fs.existsSync(index)) return res.sendFile(index);
  res.status(404).send('WebApp topilmadi. lady-shop-webapp/dist papkasini build qiling.');
});

function startAPI() {
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`🌐 API: http://localhost:${port}`));
}

module.exports = { startAPI };
