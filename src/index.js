require('dotenv').config();
const { startAPI }       = require('./api');
const { startBot }       = require('./bot');
const { startScheduler } = require('./scheduler');
const { startAutoReply } = require('./autoReply');

(async () => {
  console.log('\n💕 Lady Shop Smart Bot — ishga tushmoqda...\n');
  startAPI();
  startBot();
  startScheduler();
  await startAutoReply();
  console.log('\n✅ Hammasi tayyor! Bot ishlayapti 24/7\n');
})();
