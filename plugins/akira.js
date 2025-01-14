const axios = require('axios');

const handler = async ({ bot, m, db, command, usedPrefix }) => {
  try {
    // Notify the user that the bot is fetching images
    await bot.sendMessage(m.chat.id, "⏳ Please wait, fetching the images...");

    // Fetch the anime images from the GitHub JSON file based on the command
    const response = await axios.get(
      `https://raw.githubusercontent.com/GlobalTechInfo/Anime-API/Guru/BOT-JSON/anime-akira.json`
    );

    // Check if the response is empty or invalid
    if (!response.data || response.data.length === 0) {
      return await bot.sendMessage(m.chat.id, '❌ No images found for this anime!');
    }

    // Pick a random image URL from the fetched JSON data
    const randomImage = response.data[Math.floor(Math.random() * response.data.length)];

    // Send the image to the user with the command name as a caption
    await bot.sendPhoto(m.chat.id, randomImage, {
      caption: `_${command}_`, // Caption with the command name
    });

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

module.exports = handler;
