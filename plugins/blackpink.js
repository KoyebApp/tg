import fetch from 'node-fetch';

let bpink = [];

// Fetching the image URLs from the text file
fetch('https://raw.githubusercontent.com/arivpn/dbase/master/kpop/blekping.txt')
  .then(res => res.text())
  .then(txt => (bpink = txt.split('\n')));

let handler = async (m, { bot }) => {
  try {
    // Send "waiting" message to indicate the bot is processing
    await bot.sendMessage(m.chat.id, "⏳ Please wait, fetching the image...");

    // Select a random image from the list
    let img = bpink[Math.floor(Math.random() * bpink.length)];

    // If no image is selected, throw an error
    if (!img) throw new Error("No image found");

    // Fetch the image
    const response = await fetch(img);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Send the image with a custom message
    await bot.sendPhoto(m.chat.id, buffer, {
      caption: '*𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 © 𝚄𝙻𝚃𝚁𝙰-𝙼𝙳*',
    });

    // After processing, send the "done" message
    await bot.sendMessage(m.chat.id, "✅ Image sent successfully!");
  } catch (error) {
    console.error('Error fetching image:', error);
    await bot.sendMessage(m.chat.id, '❌ Something went wrong while fetching the image. Please try again later.');
  }
};

handler.help = ['blackpink'];
handler.tags = ['image'];
handler.limit = false;
handler.command = /^(bpink|bp|blackpink)$/i;

export default handler;
