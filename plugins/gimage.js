const Qasim = require('api-qasim');  // Import the entire package as 'pkg'
const fetch = require('node-fetch');  // Use 'node-fetch' for HTTP requests
const { InputFile } = require('node-telegram-bot-api');  // Import InputFile to handle sending files

const handler = async ({ bot, m, text, db, usedPrefix }) => {
  // Check if the user has provided a search query
  if (!text) {
    // If no query is provided, ask the user for a query
    return bot.sendMessage(m.chat.id, "Please provide a search query for Google Image search. For example: /gimage <query>");
  }

  try {
    // Add "wait" reaction to indicate the request is processing
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

    // Initialize an array to hold the image buffers
    const imageBuffers = [];

    // Download the first four images
    for (let i = 0; i < imageUrls.length; i++) {
      const imageUrl = imageUrls[i];
      const response = await fetch(imageUrl);

      // Ensure the image was fetched successfully
      if (response.ok) {
        const buffer = await response.buffer();  // Get image data as buffer
        imageBuffers.push({ buffer, url: imageUrl });
      } else {
        console.log(`Failed to fetch image at index ${i}: ${imageUrl}`);
      }
    }

    // Send the first four images to the user in the Telegram chat
    for (let i = 0; i < imageBuffers.length; i++) {
      const { buffer, url } = imageBuffers[i];

      // Extract file extension to determine the content type
      const fileExtension = url.split('.').pop();  // 'jpg', 'png', etc.

      // Define filename based on the image index
      const filename = `image_${i + 1}.${fileExtension}`;

      // Create an InputFile for sending the image with proper filename
      const inputFile = new InputFile(buffer, filename);

      // Send the image with the correct filename and content type inferred from the extension
      await bot.sendPhoto(m.chat.id, inputFile, { 
        caption: `Image ${i + 1} from the search query *${searchQuery}*`
      });
    }

    // Send a message indicating the process is complete
    await bot.sendMessage(m.chat.id, "✅ Image search complete!");

  } catch (error) {
    console.error('Error:', error);
    await bot.sendMessage(m.chat.id, "❌ An error occurred while fetching or downloading the images.");
  }
};

// Command configuration
handler.command = ['gimage', 'googleimage'];
handler.help = ['gimage', 'googleimage'];
handler.tags = ['search'];

module.exports = handler;
