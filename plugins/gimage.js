const Qasim = require('api-qasim');  // Import the entire package as 'pkg'
const fetch = require('node-fetch');  // Extract 'googleImage' function from the package

const handler = async ({ bot, m, text, db, usedPrefix }) => {
  if (!text) {
    return bot.sendMessage(m.chat.id, "Please provide a search query for Google Image search.");
  }

  try {
    // Send a message indicating that the bot is processing the request
    await bot.sendMessage(m.chat.id, "⏳ Searching for images...");

    // Extract search query from the text
    const searchQuery = text.trim();

    // Fetch image URLs from the Google Image search API
    let googleImageResponse = await Qasim.googleImage(searchQuery);

    // Log the response for debugging
    console.log('Google Image Search Results:', googleImageResponse);

    // Check if the API returned valid image URLs
    if (!googleImageResponse || !googleImageResponse.imageUrls || googleImageResponse.imageUrls.length === 0) {
      return bot.sendMessage(m.chat.id, "No images found for the search query.");
    }

    // Limit to the first four image URLs
    const imageUrls = googleImageResponse.imageUrls.slice(0, 4);

    // Send the user an option to view the images
    await bot.sendMessage(m.chat.id, `I found some images for "${searchQuery}". Do you want to see them?`, {
      reply_markup: {
        inline_keyboard: [
          [
            { text: 'Show Images', callback_data: `show_images:${searchQuery}:${imageUrls.join(',')}` }
          ]
        ]
      }
    });

  } catch (error) {
    console.error('Error:', error);
    await bot.sendMessage(m.chat.id, "❌ An error occurred while fetching or processing the images.");
  }
};

// Callback handler for when the user clicks the "Show Images" button
const callbackHandler = async (callbackQuery, bot) => {
  const chatId = callbackQuery.message.chat.id;
  const data = callbackQuery.data.split(':');
  const action = data[0];

  if (action === 'show_images') {
    const searchQuery = data[1];
    const imageUrls = data.slice(2);

    try {
      // Send the images to the user
      for (let i = 0; i < imageUrls.length; i++) {
        const imageUrl = imageUrls[i];
        const response = await fetch(imageUrl);

        if (response.ok) {
          const buffer = await response.buffer();  // Get image data as buffer
          await bot.sendPhoto(chatId, buffer, { caption: `Image ${i + 1} from search query *${searchQuery}*` });
        } else {
          console.log(`Failed to fetch image at index ${i}: ${imageUrl}`);
        }
      }

      // Send completion message
      await bot.sendMessage(chatId, "✅ Image search complete!");

    } catch (error) {
      console.error('Error fetching or sending images:', error);
      await bot.sendMessage(chatId, "❌ An error occurred while processing your request.");
    }
  }
};

// Event listener for callback queries (show images button)
module.exports = (bot) => {
  bot.on('callback_query', callbackQuery => callbackHandler(callbackQuery, bot));
};

// List of available commands for the plugin
handler.help = ['gimage', 'googleimage'];
handler.tags = ['search'];
handler.command = ['gimage', 'googleimage'];

module.exports.handler = handler;
