/**
 * BIRINCHI MARTA SOZLASH — node src/setup.js
 */
const readline = require('readline');
const fs = require('fs');
const { TelegramClient } = require('telegram');
const { StringSession } = require('telegram/sessions');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = q => new Promise(r => rl.question(q, r));

(async () => {
  console.log('\n' + '═'.repeat(48));
  console.log('  💕  LADY SHOP BOT — BIRINCHI SOZLASH');
  console.log('═'.repeat(48) + '\n');

  console.log('📌 API kalitlar: https://my.telegram.org → API development tools\n');

  const apiId   = await ask('1. API_ID      : ');
  const apiHash = await ask('2. API_HASH    : ');
  const phone   = await ask('3. Telefon (+998...): ');

  console.log('\n⏳ Telegram ga ulanilmoqda...\n');

  const client = new TelegramClient(
    new StringSession(''), Number(apiId), apiHash, { connectionRetries: 3 }
  );

  await client.start({
    phoneNumber: phone,
    phoneCode:  async () => await ask('4. SMS kod     : '),
    password:   async () => await ask('5. 2FA (bo\'lmasa ENTER): '),
    onError: e => console.error('❌', e.message),
  });

  const session = client.session.save();
  console.log('\n✅ Muvaffaqiyatli ulandi!\n');

  console.log('📌 Bot token: @BotFather → /newbot\n');
  const botToken  = await ask('6. BOT_TOKEN   : ');
  const adminUser = await ask('7. Sizning username (@siz): ');
  const webappUrl = await ask('8. WebApp URL (https://...): ');

  fs.writeFileSync('.env',
    `API_ID=${apiId}\nAPI_HASH=${apiHash}\nSESSION=${session}\n` +
    `BOT_TOKEN=${botToken}\nADMIN_USERNAME=${adminUser.replace('@','')}\n` +
    `WEBAPP_URL=${webappUrl}\nPORT=3000\n`
  );

  rl.close();
  console.log('\n' + '═'.repeat(48));
  console.log('  ✅  SOZLASH TUGADI!');
  console.log('═'.repeat(48));
  console.log('\nKeyingi qadam:\n  npm start\n');

  await client.disconnect();
  process.exit(0);
})().catch(e => { console.error('❌', e.message); process.exit(1); });
