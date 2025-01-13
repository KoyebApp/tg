const fetch = require('node-fetch');
const Qasim = require('api-qasim');

// The handler function that will process the command
const handler = async ({ bot, m, text, db, usedPrefix, query }) => {
  const chatId = m.chat.id;

  if (!query) {
    return bot.sendMessage(chatId, "Please provide a search query.");
  }

  try {
    // Call your image search API or logic here using the query
    const response = await Qasim.googleImage(query);

    // Access the imageUrls array from the response object
    const imageUrls = response.imageUrls;

    // Check if imageUrls is an array and has items
    if (!Array.isArray(imageUrls) || imageUrls.length === 0) {
      return bot.sendMessage(chatId, "No images found for your query.");
    }

    // Send the images to the user
    for (let i = 0; i < imageUrls.length && i < 3; i++) {  // Limit to 4 images
      const imageUrl = imageUrls[i];
      
      // You might want to add a check here to see if the URL is valid
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
