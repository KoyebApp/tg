const { cpus: _cpus, totalmem, freemem } = require('os');
const { performance } = require('perf_hooks');
const { sizeFormatter } = require('human-readable');

let format = sizeFormatter({
  std: 'JEDEC', // 'SI' (default) | 'IEC' | 'JEDEC'
  decimalPlaces: 2,
  keepTrailingZeroes: false,
  render: (literal, symbol) => `${literal} ${symbol}B`,
});

let handler = async (message, { bot, usedPrefix, command }) => {
  // Collecting chat information
  const chats = Object.entries(bot.chats).filter(([id, data]) => id && data.isChats);
  const groupsIn = chats.filter(([id]) => id.endsWith('@g.us'));
  
  // Memory Usage
  const used = process.memoryUsage();
  
  // CPU Usage
  const cpus = _cpus().map(cpu => {
    cpu.total = Object.keys(cpu.times).reduce((last, type) => last + cpu.times[type], 0);
    return cpu;
  });

  const cpu = cpus.reduce((last, cpu, _, { length }) => {
    last.total += cpu.total;
    last.speed += cpu.speed / length;
    last.times.user += cpu.times.user;
    last.times.nice += cpu.times.nice;
    last.times.sys += cpu.times.sys;
    last.times.idle += cpu.times.idle;
    last.times.irq += cpu.times.irq;
    return last;
  }, {
    speed: 0,
    total: 0,
    times: {
      user: 0,
      nice: 0,
      sys: 0,
      idle: 0,
      irq: 0,
    },
  });

  let old = performance.now();

  // Fetch user profile picture and information
  let who = message.quoted ? message.quoted.sender :
            message.mentionedJid && message.mentionedJid[0] ? message.mentionedJid[0] :
            message.fromMe ? bot.user.jid : message.sender;

  if (!(who in global.db.data.users)) throw `User not found in the database`;

  let pp = await bot.profilePictureUrl(who, 'image').catch(() => './assets/A.jpg');
  let user = global.db.data.users[who];

  // Bot Information Message
  let infobt = `
≡ *INFO BOT*

*STATE*
▢ *${groupsIn.length}* GROUP CHATS
▢ *${groupsIn.length}* United Groups
▢ *${groupsIn.length - groupsIn.length}* Abandoned Groups
▢ *${chats.length - groupsIn.length}* Private Chats
▢ *${chats.length}* Total Chats

*≡ OWNER*
▢ Instagram: 
  • https://instagram.com/global.techinfo
▢ GitHub: 
  • https://github.com/GlobalTechInfo
▢ YouTube: 
  • https://youtube.com/@GlobalTechInfo
▢ Credit: 
  • Mr Oreo

*≡ SERVER*
*🛑 RAM:* ${format(totalmem() - freemem())} / ${format(totalmem())}
*🔵 FreeRAM:* ${format(freemem())}

*≡ NodeJS Memory*
\`\`\`
${Object.keys(used).map((key, _, arr) => `${key.padEnd(Math.max(...arr.map(v => v.length)), ' ')}: ${format(used[key])}`).join('\n')}
\`\`\`
  `;

  // Send Bot Information and Profile Picture
  await bot.sendPhoto(message.chat.id, pp, {
    caption: infobt,
    reply_to_message_id: message.message_id,
    parse_mode: 'Markdown',
    mentions: [who],
  });

  // React with a check mark
  await bot.sendMessage(message.chat.id, { text: '✅' });
};

handler.help = ['info'];
handler.tags = ['main'];
handler.command = ['info', 'infobot', 'botinfo'];

module.exports = handler;
