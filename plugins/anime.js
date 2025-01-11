const axios = require('axios');

const handler = async (message, { bot, command, args, usedPrefix }) => {
  try {
    // Fetch the anime images from the GitHub JSON file based on the command
    const res = (
      await axios.get(`https://raw.githubusercontent.com/Guru322/api/Guru/BOT-JSON/anime-${command}.json`)
    ).data;

    // Pick a random image from the fetched list
    const randomImage = res[Math.floor(res.length * Math.random())];

    // Send the image to the user
    await bot.sendPhoto(message.chat.id, randomImage, {
      caption: `_${command}_`, // Caption with the command name
    });

    // Optional: send a button to fetch more anime images (commented out for now)
    // await bot.sendMessage(message.chat.id, `_${command}_`.trim(), {
    //   reply_markup: {
    //     inline_keyboard: [
    //       [{ text: '🔄 NEXT 🔄', callback_data: `${usedPrefix + command}` }],
    //     ],
    //   },
    // });
  } catch (error) {
    console.error('Error fetching anime images:', error);
    await bot.sendMessage(message.chat.id, '*ERROR: Unable to fetch image*');
  }
};

// List of available commands for different anime images
handler.command = handler.help = [
  'akira', 'akiyama', 'anna', 'asuna', 'ayuzawa', 'boruto', 'chiho', 'chitoge', 'deidara', 'erza', 
  'elaina', 'eba', 'emilia', 'hestia', 'hinata', 'inori', 'isuzu', 'itachi', 'itori', 'kaga', 'kagura', 
  'kaori', 'keneki', 'kotori', 'kurumi', 'madara', 'mikasa', 'miku', 'minato', 'naruto', 'nezuko', 
  'sagiri', 'sasuke', 'sakura',
];

handler.tags = ['anime'];

module.exports = handler;
