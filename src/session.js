const { TelegramClient } = require('telegram');
const { StringSession }  = require('telegram/sessions');
require('dotenv').config();

let client = null;

async function getClient() {
  if (client?.connected) return client;
  client = new TelegramClient(
    new StringSession(process.env.SESSION || ''),
    Number(process.env.API_ID),
    process.env.API_HASH,
    { connectionRetries: 5, autoReconnect: true }
  );
  await client.connect();
  console.log('✅ Userbot ulandi');
  return client;
}

module.exports = { getClient };
