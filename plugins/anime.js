const axios = require('axios');

const handler = async ({ bot, m, db, command, query }) => {
  try {
    // Ask the user to provide a query (e.g., 'akira', 'anime', 'naruto', etc.)
    if (!query) {
      return await bot.sendMessage(m.chat.id, "❌ Please provide a query (e.g., 'akira', 'naruto', etc.).");
    }

    // Define the API mapping based on query
    const queryMap = {
      'akira': 'https://raw.githubusercontent.com/GlobalTechInfo/Anime-API/Guru/BOT-JSON/anime-akira.json',
      'naruto': 'https://raw.githubusercontent.com/GlobalTechInfo/Anime-API/Guru/BOT-JSON/anime-naruto.json',
      'nezuko': 'https://raw.githubusercontent.com/GlobalTechInfo/Anime-API/Guru/BOT-JSON/anime-nezuko.json',
      // Add more queries and their corresponding JSON API URLs here
    };

    // Check if the query exists in the mapping
    const apiUrl = queryMap[query.toLowerCase()];

    if (!apiUrl) {
      return await bot.sendMessage(m.chat.id, "❌ Sorry, no images found for this query. Please try a different one.");
    }

    // Fetch the data from the corresponding API
    const response = await axios.get(apiUrl);

    // Check if the response is valid
    if (!response.data || response.data.length === 0) {
      return await bot.sendMessage(m.chat.id, '❌ No images found for this query!');
    }

    // Pick a random image from the fetched list
    const randomImage = response.data[Math.floor(Math.random() * response.data.length)];

    // Send the image to the user with the query as the caption
    await bot.sendPhoto(m.chat.id, randomImage, {
      caption: `𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 © 𝙼𝙴𝙶𝙰-𝙰𝙸`,
    });

  } catch (error) {
    console.error('Error fetching image:', error);

    // Send a more specific error message
    if (error.response) {
      await bot.sendMessage(m.chat.id, `❌ Error: ${error.response.status} - ${error.response.statusText}`);
    } else {
      await bot.sendMessage(m.chat.id, '❌ ERROR: Unable to fetch image. Please try again later.');
    }
  }
};

module.exports = handler;
