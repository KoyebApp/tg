const path = require('path');  // Importing path module to handle file paths

let handler = async ({ m, command, bot, usedPrefix, text }) => {
  try {
    // Extract the query from the command, removing the prefix
    const query = command.replace(usedPrefix, '').trim(); // Remove prefix and extra spaces

    // Ensure the query is valid
    if (!query) {
      return await bot.sendMessage(m.chat.id, `✳️ Please provide a valid menu. Example: ${usedPrefix}mainmenu`);
    }

    // Log the query to debug
    console.log('Selected menu:', query);

    // Image file path (relative to your project)
    const imagePath = path.join(__dirname, '../assets/A.jpg');

    // Switch-case structure to handle different menu commands
    switch (query.toLowerCase()) {
      case 'mainmenu':
        await bot.sendPhoto(m.chat.id, imagePath, { caption: `
          🏠 Main Menu:
          ▢ 1. Anime Menu
          ▢ 2. Bot Commands
          ▢ 3. Info Menu
          ▢ 4. Settings
          ▢ 5. Help` });
        break;

      case 'animemenu':
        await bot.sendPhoto(m.chat.id, imagePath, { caption: `
          🍿 Anime Menu:
          ▢ 1. Naruto
          ▢ 2. One Piece
          ▢ 3. Attack on Titan
          ▢ 4. Dragon Ball
          ▢ 5. My Hero Academia` });
        break;

      case 'botmenu':
        await bot.sendPhoto(m.chat.id, imagePath, { caption: `
          🤖 Bot Menu:
          ▢ 1. Bot Info
          ▢ 2. Command List
          ▢ 3. Bot Status
          ▢ 4. Settings` });
        break;

      case 'infomenu':
        await bot.sendPhoto(m.chat.id, imagePath, { caption: `
          ℹ️ Info Menu:
          ▢ 1. About the Bot
          ▢ 2. Creator Info
          ▢ 3. Version Info` });
        break;

      case 'settings':
        await bot.sendPhoto(m.chat.id, imagePath, { caption: `
          ⚙️ Settings:
          ▢ 1. Change Language
          ▢ 2. Set Time Zone
          ▢ 3. Notifications` });
        break;

      case 'help':
        await bot.sendPhoto(m.chat.id, imagePath, { caption: `
          🆘 Help:
          ▢ 1. Main Menu
          ▢ 2. Anime Menu
          ▢ 3. Bot Menu
          ▢ 4. Info Menu
          ▢ 5. Settings` });
        break;

      default:
        await bot.sendMessage(m.chat.id, `❌ Unknown menu. Please use a valid menu command.`);
    }

  } catch (error) {
    console.error('Error processing the menu request:', error.message);
    await bot.sendMessage(m.chat.id, '❌ Something went wrong. Please try again later.');
  }
};

// Define commands that trigger this plugin
handler.command = [
  'mainmenu', 'animemenu', 'botmenu', 'infomenu', 'settings', 'help'
];

handler.help = [
  'mainmenu', 'animemenu', 'botmenu', 'infomenu', 'settings', 'help'
];

handler.tags = ['menu'];  // Assign the plugin a tag for categorization

module.exports = handler;
