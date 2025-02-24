const fetch = require('node-fetch');

let bpink = [];

// Fetching the image URLs from the text file
fetch('https://raw.githubusercontent.com/arivpn/dbase/master/kpop/blekping.txt')
  .then(res => res.text())
  .then(txt => { bpink = txt.split('\n'); });

const handler = async ({ bot, m, text, db, usedPrefix, command }) => {
  try {
    const chatId = m.chat.id;

    // Send "waiting" message to indicate the bot is processing
    await bot.sendMessage(chatId, "⏳ Please wait, fetching the images...");

    // Select three random images from the list
    const randomImages = [];
    while (randomImages.length < 3) {
      const img = bpink[Math.floor(Math.random() * bpink.length)];
      if (!randomImages.includes(img)) { // Prevent duplicates
        randomImages.push(img);
      }
    }

    // Fetch and send the images
    for (const img of randomImages) {
      const response = await fetch(img);
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Send each image with a custom message
      await bot.sendPhoto(chatId, buffer, {
        caption: '*𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 © 𝙼𝙴𝙶𝙰-𝙰𝙸*',
      });
    }
  } catch (error) {
    console.error('Error fetching images:', error);
    await bot.sendMessage(m.chat.id, '❌ Something went wrong while fetching the images. Please try again later.');
  }
};

handler.command = ['bp', 'blackpink'];  // Command list
handler.help = ['bp', 'blackpink'];
handler.tags = ['image'];

module.exports = handler;
