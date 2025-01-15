const fetch = require('node-fetch');
const Qasim = require('api-qasim');

// The handler function that will process the Pinterest search command
const handler = async ({ bot, m, text, db, usedPrefix, command, query }) => {
  const chatId = m.chat.id;
  // Send "waiting" message to indicate the bot is processing
    
  if (!query) {
    return bot.sendMessage(chatId, "Please provide a search query.");
  }
  await bot.sendMessage(chatId, "⏳ Please wait, fetching the images...");
  

  try {
    // Call Pinterest API (or logic here) using the query
    const response = await Qasim.Pinterest2(query); // Assuming Pinterest2 is used

    // Access the result array from the response object
    const imageUrls = response.result || [];

    // Check if imageUrls is an array and has items
    if (imageUrls.length === 0) {
      return bot.sendMessage(chatId, "No images found for your query.");
    }

    // Send up to 3 images to the user
    for (let i = 0; i < imageUrls.length && i < 3; i++) {
      const imageUrl = imageUrls[i].images_url;

      // Ensure that the image URL is valid
      if (imageUrl && imageUrl.startsWith('http')) {
        await bot.sendPhoto(chatId, imageUrl, { caption: `Image ${i + 1} for query ${query}` });
      } else {
        console.warn(`Skipping invalid URL: ${imageUrl}`);
      }
    }

    await bot.sendMessage(chatId, "Image search complete!");

  } catch (error) {
    console.error('Error searching Pinterest images:', error);
    bot.sendMessage(chatId, "An error occurred while searching for images. Please try again later.");
  }
};

module.exports = handler;
