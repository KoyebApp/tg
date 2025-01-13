const axios = require('axios');
const path = require('path');  // Import path module for file handling
const fs = require('fs');  // Import fs module to check file existence

// Handler function
const handler = async ({ bot, m, text, db }) => {
  try {
    // Check if bot is available
    if (!bot) {
      throw new Error('Bot instance is not available');
    }

    // Fetch random quote from a GitHub raw URL
    const quoteResponse = await axios.get('https://raw.githubusercontent.com/GlobalTechInfo/Islamic-Database/main/Quotes.txt');
    const quotes = quoteResponse.data.split('\n');
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

    // Prepare the bot menu message
    let menuText = `
    *Bot Menu*:

    📖 *Random Quote*: 
    "${randomQuote}"

    🔧 *Commands*:
    - /start: Start the bot
    - /help: List available commands
    - /info: Information about the bot
    - /update: Update the bot
    - /ping: Check bot status

    *Icons and Quotes are refreshed with each new menu request!*

    Enjoy your time with the bot! 😊`;

    // Check if the photo exists
    const photoPath = path.join(__dirname, '../assets/A.jpg');  // Ensure the correct path
    if (!fs.existsSync(photoPath)) {
      console.error('Photo file not found at path:', photoPath);
      return;
    }

    // Prepare the inline keyboard buttons
    const inlineKeyboard = {
      inline_keyboard: [
        [{ text: 'Refresh Menu', callback_data: 'refresh_menu' }],
      ],
    };

    // Send the menu along with the photo (image as caption) and inline buttons
    await bot.sendPhoto(m.chat.id, photoPath, {
      caption: menuText,  // Full menu as caption
      reply_markup: inlineKeyboard,  // Inline keyboard buttons
    });

    console.log('Menu sent with photo and buttons!');
  } catch (error) {
    console.error('Error in menu plugin:', error);
    // Send a message in case of error but prevent the app from crashing
    if (bot) {
      await bot.sendMessage(m.chat.id, 'An error occurred while generating the bot menu. Please try again later.');
    }
  }
};

module.exports = handler;
