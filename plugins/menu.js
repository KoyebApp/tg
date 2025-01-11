// Inside your plugin file (e.g., menu.js)

const axios = require('axios');

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

    // Fetch random icon image from a GitHub raw URL
    const iconResponse = await axios.get('https://raw.githubusercontent.com/GlobalTechInfo/Islamic-Database/main/Islamic.json', { responseType: 'arraybuffer' });
    const iconBuffer = Buffer.from(iconResponse.data, 'binary');

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

    // Send the menu along with the random icon
    await bot.sendMessage(m.chat.id, menuText, {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Refresh Menu', callback_data: 'refresh_menu' }],
        ],
      },
    });

    await bot.sendPhoto(m.chat.id, iconBuffer, { caption: 'Here is your random bot icon!' });
  } catch (error) {
    console.error('Error in menu plugin:', error);
    // Send a message in case of error but prevent the app from crashing
    if (bot) {
      await bot.sendMessage(m.chat.id, 'An error occurred while generating the bot menu. Please try again later.');
    }
  }
};

handler.help = ['menu'];
handler.tags = ['main'];
handler.command = ['menu', 'botmenu', 'showmenu'];

module.exports = handler;
