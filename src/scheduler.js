const cron = require('node-cron');
const fs   = require('fs');
const path = require('path');
const { getClient } = require('./session');

const CONFIG = path.resolve(__dirname, '../config/schedule.json');
const IMAGES = path.resolve(__dirname, '../content/images');
const jobs   = {};

function load() {
  return JSON.parse(fs.readFileSync(CONFIG, 'utf-8')).posts || [];
}

async function send(post) {
  const client = await getClient();
  for (const group of post.groups) {
    try {
      if (post.type === 'text') {
        await client.sendMessage(group, { message: post.text });
      } else if (post.type === 'image') {
        await client.sendFile(group, { file: path.join(IMAGES, post.images[0]) });
      } else if (post.type === 'image+text') {
        await client.sendFile(group, { file: path.join(IMAGES, post.images[0]), caption: post.text });
      } else if (post.type === 'album') {
        await client.sendFile(group, {
          file: post.images.map(i => path.join(IMAGES, i)),
          caption: post.text,
        });
      }
      console.log(`📤 Post → ${group} [${post.id}]`);
    } catch (err) {
      console.error(`❌ Post xatolik (${group}): ${err.message}`);
    }
  }
}

function startScheduler() {
  Object.values(jobs).forEach(j => j.stop());
  Object.keys(jobs).forEach(k => delete jobs[k]);

  const posts = load();
  posts.forEach(post => {
    const [h, m] = post.time.split(':');
    jobs[post.id] = cron.schedule(`${m} ${h} * * *`, () => send(post));
  });
  console.log(`📅 ${posts.length} ta post jadvalga qo'shildi`);
}

module.exports = { startScheduler, send };
