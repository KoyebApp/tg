const fetch = require('node-fetch');
const Qasim = require('api-qasim');

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

    // Pagination state - store the current image index
    let page = 0;  // Keep track of the current page

    // Function to send images with next button
    const sendImages = async () => {
      const startIndex = page * 3;  // Show 3 images per page
      const endIndex = Math.min(startIndex + 3, imageUrls.length);  // Limit to 3 images

      // Send images for the current page
      for (let i = startIndex; i < endIndex; i++) {
        const imageUrl = imageUrls[i];
        
        // Check if the URL is valid
        if (imageUrl && imageUrl.startsWith('http')) {
          await bot.sendPhoto(chatId, imageUrl, { caption: `Image ${i + 1} for query *${query}*` });
        } else {
          console.warn(`Skipping invalid URL: ${imageUrl}`);
        }
      }

      // If there are more images, show the "Next" button
      if (endIndex < imageUrls.length) {
        await bot.sendMessage(chatId, "More images available!", {
          reply_markup: {
            inline_keyboard: [
              [{ text: 'Next', callback_data: `next_image_${page + 1}` }],
            ],
          },
        });
      } else {
        await bot.sendMessage(chatId, "No more images to show.");
      }
    };

    // Call sendImages to send the first set of images
    await sendImages();

    // Handle the callback query for the "Next" button
    bot.on('callback_query', async (callbackQuery) => {
      const { data, message } = callbackQuery;
      
      if (data.startsWith('next_image_')) {
        const nextPage = parseInt(data.split('_')[2]);

        // Ensure the page number is valid
        if (nextPage >= 0 && nextPage * 3 < imageUrls.length) {
          page = nextPage;
          await sendImages();  // Send the next set of images

          // Answer the callback query to let Telegram know we handled it
          await bot.answerCallbackQuery(callbackQuery.id, { text: 'Loading next images...' });
        } else {
          await bot.answerCallbackQuery(callbackQuery.id, { text: 'No more images.' });
        }
      }
    });

  } catch (error) {
    console.error('Error searching images:', error);
    bot.sendMessage(chatId, "An error occurred while searching for images. Please try again later.");
  }
};

module.exports = handler;
