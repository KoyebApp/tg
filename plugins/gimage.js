// gimage.js (plugin file)

const fetch = require('node-fetch');
const Qasim = require('api-qasim');

// The handler function that will process the command
const handler = async ({ bot, m, text, db, usedPrefix }, searchQuery) => {
  const chatId = m.chat.id;

  if (!searchQuery) {
    return bot.sendMessage(chatId, "Please provide a search query after the command.");
  }

  // Fetch image URLs from the respective image search API (example for gimage)
  const googleImageResponse = await Qasim.googleImage(searchQuery);

  if (!googleImageResponse || !googleImageResponse.imageUrls || googleImageResponse.imageUrls.length === 0) {
    return bot.sendMessage(chatId, "No images found.");
  }

  const imageUrls = googleImageResponse.imageUrls.slice(0, 4);

  // Send images to user
  for (let i = 0; i < imageUrls.length; i++) {
    await bot.sendPhoto(chatId, imageUrls[i], { caption: `Image ${i + 1} for query *${searchQuery}*` });
  }

  await bot.sendMessage(chatId, "Image search complete!");
};

module.exports = handler;
