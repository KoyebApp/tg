import fetch from 'node-fetch';

const regex = /(?:https|git)(?::\/\/|@)github\.com[\/:]([^\/:]+)\/(.+)/i;

let handler = async (m, { bot, args, usedPrefix, command }) => {
  if (!args[0]) {
    await bot.sendMessage(m.chat.id, `⚠️ Where is the GitHub link?\n\n📌 Example: ${usedPrefix + command} https://github.com/GlobalTechInfo/MEGA-AI`);
    return;
  }
  
  if (!regex.test(args[0])) {
    await bot.sendMessage(m.chat.id, '⚠️ Link incorrect.');
    return;
  }

  let [_, user, repo] = args[0].match(regex) || [];
  repo = repo.replace(/.git$/, '');
  let url = `https://api.github.com/repos/${user}/${repo}/zipball`;
  
  try {
    const response = await fetch(url, { method: 'HEAD' });
    let filename = response.headers.get('content-disposition')
      .match(/attachment; filename=(.*)/)[1];

    await bot.sendMessage(m.chat.id, '✳️ *Wait, sending repository...*');

    // Send the repository file to the chat
    await bot.sendDocument(m.chat.id, url, { caption: filename });

  } catch (error) {
    console.error('Error fetching GitHub repository:', error);
    await bot.sendMessage(m.chat.id, '❌ An error occurred while fetching the repository. Please try again later.');
  }
};

handler.help = ['gitclone <url>'];
handler.tags = ['downloader'];
handler.command = ['gitclone'];

export default handler;
