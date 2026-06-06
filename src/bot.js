const { Telegraf, Markup } = require('telegraf');
require('dotenv').config();

const bot   = new Telegraf(process.env.BOT_TOKEN);
const ADMIN = (process.env.ADMIN_USERNAME || '').toLowerCase();
const URL   = process.env.WEBAPP_URL || 'http://localhost:3000';

const isAdmin = ctx => ctx.from?.username?.toLowerCase() === ADMIN;

bot.start(ctx => {
  if (!isAdmin(ctx)) return ctx.reply('⛔ Ruxsat yo\'q');
  ctx.reply(
    '💕 *Lady Shop Bot*\n\nQuyidagi tugmani bosib boshqaruv paneliga kiring:',
    {
      parse_mode: 'Markdown',
      ...Markup.keyboard([[Markup.button.webApp('🎛 Boshqaruv Paneli', URL)]]).resize(),
    }
  );
});

bot.command('panel', ctx => {
  if (!isAdmin(ctx)) return;
  ctx.reply('🎛 Panel:', Markup.inlineKeyboard([[Markup.button.webApp('💄 Ochish', URL)]]));
});

bot.command('status', ctx => {
  if (!isAdmin(ctx)) return;
  const fs = require('fs'), p = require('path');
  const cfg = p.resolve(__dirname, '../config');
  const groups  = JSON.parse(fs.readFileSync(cfg+'/groups.json',     'utf-8'));
  const sched   = JSON.parse(fs.readFileSync(cfg+'/schedule.json',   'utf-8'));
  const reply   = JSON.parse(fs.readFileSync(cfg+'/auto-reply.json', 'utf-8'));
  ctx.reply(
    `📊 *Bot holati*\n\n` +
    `👥 Guruhlar: ${groups.length}\n` +
    `📅 Postlar: ${sched.posts.length}\n` +
    `💬 Javob qoidalari: ${reply.rules.length}\n` +
    `🔄 Auto-javob: ${reply.enabled ? '✅ Yoqiq' : '❌ O\'chiq'}\n` +
    `⏱ Kutish: ${reply.wait_minutes} daqiqa`,
    { parse_mode: 'Markdown' }
  );
});

function startBot() {
  bot.launch().catch(e => console.error('Bot xatolik:', e.message));
  process.once('SIGINT',  () => bot.stop());
  process.once('SIGTERM', () => bot.stop());
  console.log('🤖 Bot ishga tushdi');
}

module.exports = { startBot };
