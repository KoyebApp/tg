const Qasim = require('api-qasim');  // Import the entire package as 'pkg'
const fetch = require('node-fetch');  // Extract 'googleImage' function from the package

const handler = async ({ bot, m, db }) => {
  if (!text) {
    return bot.sendMessage(m.chat.id, "Please provide a search query for Google Image search.");
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
        imageBuffers.push(buffer);
      } else {
        console.log(`Failed to fetch image at index ${i}: ${imageUrl}`);
      }
    }

    // Send the first four images to the user in the Telegram chat
    for (let i = 0; i < imageBuffers.length; i++) {
      const imageBuffer = imageBuffers[i];
      await bot.sendPhoto(m.chat.id, imageBuffer, { caption: `Image ${i + 1} from the search query *${searchQuery}*` });
    }

    // Send a message indicating the process is complete
    await bot.sendMessage(m.chat.id, "✅ Image search complete!");

  } catch (error) {
    console.error('Error:', error);
    await bot.sendMessage(m.chat.id, "❌ An error occurred while fetching or downloading the images.");
  }
};

handler.help = ['gimage', 'googleimage'];
handler.tags = ['search'];
handler.command = ['gimage', 'googleimage'];

module.exports = handler;
