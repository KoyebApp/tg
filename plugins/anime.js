const axios = require('axios');

const handler = async ({ bot, m, command }) => {
  try {

    // Fetch the anime images from the GitHub JSON file based on the command
    const response = await axios.get(
      `https://raw.githubusercontent.com/Guru322/api/Guru/BOT-JSON/anime-${command}.json`
    );

    // Check if the response is empty or invalid
    if (!response.data || response.data.length === 0) {
      return await bot.sendMessage(m.chat.id, '❌ No images found for this anime!');
    }

    // Pick a random image from the fetched list
    const randomImage = response.data[Math.floor(Math.random() * response.data.length)];

    // Send the image to the user with the command name as a caption
    await bot.sendPhoto(m.chat.id, randomImage, {
      caption: `_${command}_`, // Caption with the command name
    });

    // Optional: send a button to fetch more anime images (commented out for now)
    // await bot.sendMessage(m.chat.id, `_${command}_`.trim(), {
    //   reply_markup: {
    //     inline_keyboard: [
    //       [{ text: '🔄 NEXT 🔄', callback_data: `${usedPrefix + command}` }],
    //     ],
    //   },
    // });

  } catch (error) {
    console.error('Error fetching anime images:', error);

    // Send a more specific error message
    if (error.response) {
      await bot.sendMessage(m.chat.id, `❌ Error: ${error.response.status} - ${error.response.statusText}`);
    } else {
      await bot.sendMessage(m.chat.id, '❌ ERROR: Unable to fetch image. Please try again later.');
    }
  }
};

// List of available commands for different anime images
handler.command = [
  'akira', 'akiyama', 'anna', 'asuna', 'ayuzawa', 'boruto', 'chiho', 'chitoge', 'deidara', 'erza',
  'elaina', 'eba', 'emilia', 'hestia', 'hinata', 'inori', 'isuzu', 'itachi', 'itori', 'kaga', 'kagura',
  'kaori', 'keneki', 'kotori', 'kurumi', 'madara', 'mikasa', 'miku', 'minato', 'naruto', 'nezuko',
  'sagiri', 'sasuke', 'sakura',
];

module.exports = handler;
