const path = require('path');  // Importing path module to handle file paths

let handler = async ({ m, command, bot, usedPrefix, text }) => {
  try {
    // Extract the query from the command, removing the prefix
    const query = command.replace(usedPrefix, '').trim(); // Remove prefix and extra spaces

    // Ensure the query is valid
    if (!query) {
      return await bot.sendMessage(m.chat.id, `✳️ Please provide a valid menu. Example: ${usedPrefix}mainmenu`);
    }
    // Image file path (relative to your project)
    const imagePath = path.join(__dirname, '../assets/B.jpg');

    // Switch-case structure to handle different menu commands
    switch (query.toLowerCase()) {
        case 'mainmenu':
        case 'allmenu':
        await bot.sendPhoto(m.chat.id, imagePath, { caption: `
          🏠 Main Menu:
          ▢ 1. downloadmenu
          ▢ 2. textpromenu
          ▢ 3. animenu
          ▢ 3. botmenu
          ▢ 4. infomenu
          ▢ 5. quotesmenu
          ▢ 6. toolsmenu
          ▢ 7. imagesmenu
          ▢ 0. mainmenu` });
        break;

      case 'animemenu':
        await bot.sendPhoto(m.chat.id, imagePath, { caption: `
          🍿 Anime Menu:
          ▢ 1. akira
          ▢ 2. akiyama
          ▢ 3. anna
          ▢ 4. asuna
          ▢ 5. ayuzawa
          ▢ 6. boruto
          ▢ 7. chiho
          ▢ 8. chitoge
          ▢ 9. deidara
          ▢ 1. erza
          ▢ 2. elaina
          ▢ 3. eba
          ▢ 4. emilia
          ▢ 5. hestia
          ▢ 6. hinata
          ▢ 7. inori
          ▢ 8. isuzu
          ▢ 9. itachi
          ▢ 1. itori
          ▢ 2. kaga
          ▢ 3. kotori
          ▢ 4. mikasa
          ▢ 5. miku
          ▢ 6. naruto
          ▢ 7. nezuko
          ▢ 8. sagiri
          ▢ 9. sasuke
          ▢ 1. sakura
          ▢ 0. help` });
        break;

        case 'botmenu':
        await bot.sendPhoto(m.chat.id, imagePath, { caption: `
          🤖 Bot Menu:
          ▢ 1. info
          ▢ 2. alive
          ▢ 3. echo
          ▢ 4. menu
          ▢ 5. update
          ▢ 0. shutdown` });
        break;

        case 'infomenu':
        case 'botinfo':
        await bot.sendPhoto(m.chat.id, imagePath, { caption: `
          ℹ️ Info Menu:
          ▢ 1. gstalk
          ▢ 2. igstalk
          ▢ 3. npmstalk
          ▢ 4. getid
          ▢ 5. weather
          ▢ 6. wikipedia
          ▢ 7. wastalk
          ▢ 0. mainmenu` });
        break;

      case 'settings':
        await bot.sendPhoto(m.chat.id, imagePath, { caption: `
          ⚙️ Settings:
          ▢ 0. Change Language
          ▢ 0. Set Time Zone
          ▢ 0. Notifications` });
        break;

        case 'help':
        case 'mainhelp':
        await bot.sendPhoto(m.chat.id, imagePath, { caption: `
          🆘 Main Help:
          ▢ 1. downloadmenu
          ▢ 2. textpromenu
          ▢ 3. animenu
          ▢ 3. botmenu
          ▢ 4. infomenu
          ▢ 5. quotesmenu
          ▢ 6. toolsmenu
          ▢ 7. imagesmenu
          ▢ 0. mainmenu` });
        break;
        case 'quotesmenu':
        case 'quotemenu':
        await bot.sendPhoto(m.chat.id, imagePath, { caption: `
          💡 Quotes Menu:
          ▢ 1. funfacts
          ▢ 2. techtips
          ▢ 3. programmingtips
          ▢ 4. motivational
          ▢ 5. lifehacks
          ▢ 6. islamicquotes
          ▢ 7. quotes
          ▢ 0. help` });
        break;
        case 'toolsmenu':
        case 'toolmenu':
        await bot.sendPhoto(m.chat.id, imagePath, { caption: `
          🛠️ Tools Menu:
          ▢ 1. echo
          ▢ 2. qrcode
          ▢ 3. getid
          ▢ 4. shutdown
          ▢ 5. translate
          ▢ 6. trends
          ▢ 7. ytsearch
          ▢ 0. help` });
        break;
        case 'imagesmenu':
        case 'imagemenu':
        await bot.sendPhoto(m.chat.id, imagePath, { caption: `
          🃏 Images Menu:
          ▢ 1. gimage
          ▢ 2. pinterest
          ▢ 3. blackpink
          ▢ 4. cyberspace
          ▢ 5. technology
          ▢ 6. islamic
          ▢ 7. gamewallp
          ▢ 8. mountain
          ▢ 9. programming
          ▢ 0. help` });
        break;
       case 'downloadmenu':
        case 'dlmenu':
        await bot.sendPhoto(m.chat.id, imagePath, { caption: `
          📥 Downloads:
          ▢ 1. gimage
          ▢ 2. gitclone
          ▢ 3. gitdl
          ▢ 4. mediafire
          ▢ 5. mega
          ▢ 6. twitter
          ▢ 7. audio
          ▢ 8. video
          ▢ 9. fbdl
          ▢ 0. help` });
        break;

        case 'textpromenu':
        case 'logomenu':
        case 'makermenu':
        await bot.sendPhoto(m.chat.id, imagePath, { caption: `
          📥 TextPro Menu:
          ▢ 1. papercut
          ▢ 2. logomaker
          ▢ 3. bpstyle
          ▢ 4. writetext
          ▢ 5. glossy
          ▢ 6. cartoon
          ▢ 7. pixelglitch
          ▢ 8. advancedglow
          ▢ 9. lighteffect
          ▢ 1. texteffect
          ▢ 2. galaxy
          ▢ 3. beach
          ▢ 4. clouds
          ▢ 0. help` });
        break;
        

      default:
        await bot.sendMessage(m.chat.id, `❌ Unknown menu. Please use a valid menu command.`);
    }

  } catch (error) {
    console.error('Error processing the menu request:', error.message);
    await bot.sendMessage(m.chat.id, '❌ Something went wrong. Please try again later.');
  }
};

handler.command = ['allmenu', 'mainmenu', 'animemenu', 'botmenu', 'infomenu', 'botinfo', 'help', 'mainhelp', 'quotesmenu', 'quotemenu', 'imagemenu', 'imagesmenu', 'toolmenu', 'toolsmenu', 'dlmenu', 'downloadmenu', 'textpromenu', 'logomenu', 'makermenu']


handler.help = ['allmenu', 'mainmenu', 'animemenu', 'botmenu', 'infomenu', 'botinfo', 'help', 'mainhelp', 'quotesmenu', 'quotemenu', 'imagemenu', 'imagesmenu', 'toolmenu', 'toolsmenu', 'dlmenu', 'downloadmenu', 'textpromenu', 'logomenu', 'makermenu']
handler.tags = ['menu'];  // Assign the plugin a tag for categorization

module.exports = handler;
