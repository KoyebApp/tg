const Qasim = require('api-qasim');
const fetch = require('node-fetch');

// Command handler for /gimage
const handler = async ({ bot, m, text, usedPrefix }) => {
  const chatId = m.chat.id;
  const searchQuery = text.slice(usedPrefix.length + 7).trim(); // Extract query after /gimage

  // If no query is provided, ask for it
  if (!searchQuery) {
    await bot.sendMessage(chatId, "Please provide a search query for Google Image search. For example: /gimage cats");
    return;
  }

  try {
    await bot.sendMessage(chatId, "⏳ Searching for images...");

    // Fetch image URLs from Google Image search API
    const googleImageResponse = await Qasim.googleImage(searchQuery);

    if (!googleImageResponse || !googleImageResponse.imageUrls || googleImageResponse.imageUrls.length === 0) {
      return bot.sendMessage(chatId, "No images found for the search query.");
    }

    // Limit to the first 4 image URLs
    const imageUrls = googleImageResponse.imageUrls.slice(0, 4);
    const imageBuffers = [];

    // Download the first four images
    for (let i = 0; i < imageUrls.length; i++) {
      const imageUrl = imageUrls[i];
      const response = await fetch(imageUrl);

      if (response.ok) {
        const buffer = await response.buffer();  // Get image data as buffer
        imageBuffers.push({ buffer, url: imageUrl });
      } else {
        console.log(`Failed to fetch image at index ${i}: ${imageUrl}`);
      }
    }

    // Send the images to the user
    for (let i = 0; i < imageBuffers.length; i++) {
      const { buffer, url } = imageBuffers[i];
      const fileExtension = url.split('.').pop();
      const filename = `image_${i + 1}.${fileExtension}`;

      // Send the image using the correct method
      await bot.sendPhoto(chatId, buffer, { caption: `Image ${i + 1} from the search query *${searchQuery}*` });
    }

    // Inform the user that the search is complete
    await bot.sendMessage(chatId, "✅ Image search complete!");

  } catch (error) {
    console.error('Error:', error);
    await bot.sendMessage(chatId, "❌ An error occurred while fetching or downloading the images.");
  }
};

// Set the command(s) for this handler
handler.command = 'gimage';

// Export the handler
module.exports = handler;
