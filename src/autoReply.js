const fs = require('fs');
const path = require('path');
const { NewMessage } = require('telegram/events');
const { getClient }  = require('./session');

const REPLY_CFG  = path.resolve(__dirname, '../config/auto-reply.json');
const GROUPS_CFG = path.resolve(__dirname, '../config/groups.json');

const pending = {};

const loadCfg    = () => JSON.parse(fs.readFileSync(REPLY_CFG,  'utf-8'));
const loadGroups = () => JSON.parse(fs.readFileSync(GROUPS_CFG, 'utf-8')).map(g => g.username);

function match(text, rules) {
  const lower = text.toLowerCase();
  for (const r of rules)
    for (const kw of r.keywords)
      if (lower.includes(kw.toLowerCase())) return r.reply;
  return null;
}

async function startAutoReply() {
  const client = await getClient();

  // Incoming messages
  client.addEventHandler(async event => {
    const msg = event.message;
    if (!msg?.text || msg.out) return;

    const cfg = loadCfg();
    if (!cfg.enabled) return;

    const chat = await msg.getChat();
    const username = chat.username ? '@' + chat.username : null;
    if (!username || !loadGroups().includes(username)) return;

    const reply = match(msg.text, cfg.rules);
    if (!reply) return;

    const key  = `${chat.id}_${msg.id}`;
    const wait = (cfg.wait_minutes || 3) * 60_000;

    pending[key] = setTimeout(async () => {
      try {
        await client.sendMessage(chat, { message: reply, replyTo: msg.id });
        console.log(`💬 Auto javob → ${username}`);
      } catch (e) {
        console.error('Auto javob xatolik:', e.message);
      }
      delete pending[key];
    }, wait);
  }, new NewMessage({}));

  // Cancel if admin replies
  client.addEventHandler(async event => {
    const msg = event.message;
    if (!msg?.out || !msg.replyToMsgId) return;
    const chat = await msg.getChat();
    const key  = `${chat.id}_${msg.replyToMsgId}`;
    if (pending[key]) { clearTimeout(pending[key]); delete pending[key]; }
  }, new NewMessage({}));

  console.log('💬 Auto-javob yoqildi');
}

module.exports = { startAutoReply };
