import { cpus as _cpus, totalmem, freemem } from 'os';
import util from 'util';
import { performance } from 'perf_hooks';

let handler = async (message, { bot, isAdmin }) => {
  let _muptime;
  if (process.send) {
    process.send('uptime');
    _muptime = await new Promise(resolve => {
      process.once('message', resolve);
      setTimeout(resolve, 1000);
    }) * 1000;
  }

  let muptime = clockString(_muptime);

  const chats = Object.entries(bot.chats).filter(([id, data]) => id && data.isChats);
  const groupsIn = chats.filter(([id]) => id.endsWith('@g.us'));
  const used = process.memoryUsage();
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
      irq: 0
    }
  });

  let old = performance.now();

  // React with the clock emoji to show that the uptime calculation has started
  await bot.sendMessage(message.chat.id, {
    text: '⏱️ Uptime calculation started...',
    reply_markup: { inline_keyboard: [[]] }
  });

  let neww = performance.now();
  let speed = neww - old;

  let text = `${muptime}`;
  await bot.sendMessage(message.chat.id, {
    text: `*💘 BOT UPTIME 💘*\n\n${text}`,
    parse_mode: 'Markdown',
    reply_markup: { inline_keyboard: [[]] },
    reply_to_message_id: message.message_id
  });
};

handler.help = ['uptime', 'runtime'];
handler.tags = ['info'];
handler.command = /^(uptime|runtime)$/i;

export default handler;

function clockString(ms) {
  let d = isNaN(ms) ? '--' : Math.floor(ms / 86400000);
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000) % 24;
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60;
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60;

  return `*｢💘 BOT UPTIME 💘｣*\n\n ${d} *Days ☀️*\n ${h} *Hours 🕐*\n ${m} *Minutes ⏰*\n ${s} *Seconds ⏱️*`;
}
