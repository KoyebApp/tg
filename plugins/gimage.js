const fetch = require('node-fetch');
const Qasim = require('api-qasim');
const paginationHandler = require('../lib/paginationHandler');

// The handler function that will process the command
const handler = async ({ bot, m, text, db, usedPrefix, command, query }) => {
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

    // Function to send image content
    const sendImage = async (bot, chatId, imageUrl, index) => {
      await bot.sendPhoto(chatId, imageUrl, { caption: `Image ${index}` });
    };

    // Call the generic pagination handler to manage the "Next" button
    await paginationHandler({
      bot,
      chatId,
      content: imageUrls,
      page: 0,  // Initial page
      sendContent: sendImage,
    });

  } catch (error) {
    console.error('Error searching images:', error);
    bot.sendMessage(chatId, "An error occurred while searching for images. Please try again later.");
  }
};

module.exports = handler;
