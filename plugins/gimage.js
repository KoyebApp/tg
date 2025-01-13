const fetch = require('node-fetch');
const Qasim = require('api-qasim');

const handler = async ({ bot, m, text, db, usedPrefix, query }) => {
  const chatId = m.chat.id;

  // Ensure the query is provided
  const query = text.split(' ').slice(1).join(' ');
  if (!query) {
    return bot.sendMessage(chatId, "Please provide a search query.");
  }

  try {
    // Call the API and get the image URLs
    const response = await Qasim.googleImage(query);
    console.log(response);  // Log the response for debugging

    const imageUrls = response.imageUrls;

    // Check if we received any images
    if (!Array.isArray(imageUrls) || imageUrls.length === 0) {
      return bot.sendMessage(chatId, "No images found for your query.");
    }

    // Send the images
    for (let i = 0; i < imageUrls.length && i < 3; i++) {
      const imageUrl = imageUrls[i];
      if (imageUrl && imageUrl.startsWith('http')) {
        await bot.sendPhoto(chatId, imageUrl, { caption: `Image ${i + 1} for query *${query}*` });
      } else {
        console.warn(`Skipping invalid URL: ${imageUrl}`);
      }
    }

    await bot.sendMessage(chatId, "Image search complete!");
  } catch (error) {
    console.error('Error searching images:', error);
    bot.sendMessage(chatId, "An error occurred while searching for images. Please try again later.");
  }
};

module.exports = handler;
