const fetch = require('node-fetch');  // Use require instead of import

let handler = async ({ m, command, bot, usedPrefix, text, prefixes }) => {
  try {
    // Strip the prefix from the command (works with multiple prefixes)
    let query = '';
    for (let prefix of prefixes) {
      if (command.startsWith(prefix)) {
        query = command.replace(prefix, '').trim();
        break;  // Stop once the correct prefix is found
      }
    }

    // Ensure the query is not empty, and throw an error if it is
    if (!query) {
      throw new Error('Please provide a valid query after the command.');
    }

    // Log the query to debug
    console.log('Fetching data for query:', query);

    // Fetch the JSON data for the query (anime images for the specific character)
    const res = await fetch(`https://raw.githubusercontent.com/Guru322/api/Guru/BOT-JSON/anime-${query}.json`);
    
    // Check if the response is valid JSON
    const data = await res.json();

    // Select a random image from the fetched data
    const randomImage = data[Math.floor(Math.random() * data.length)];

    // Send the image using the bot, adding a caption with the query
    await bot.sendPhoto(m.chat.id, randomImage, { caption: `_${query}_` });

    // Send the inline "Next" button for fetching more images
    bot.sendMessage(m.chat.id, `_${query}_`, {
      reply_markup: {
        inline_keyboard: [
          [{ text: "🔄 NEXT 🔄", callback_data: `next_${query}` }]  // Include "next_" in callback data to handle next action
        ]
      }
    });

  } catch (error) {
    console.error('Error fetching anime image:', error.message);  // Improved error logging

    // Send a friendly message to the user when an error occurs
    await bot.sendMessage(m.chat.id, '❌ Something went wrong while fetching the image. Please try again later.');
  }
};

// List of commands (anime character names)
handler.command = [
  'akira', 'akiyama', 'anna', 'asuna', 'ayuzawa', 'boruto', 'chiho', 'chitoge', 'deidara',
  'erza', 'elaina', 'eba', 'emilia', 'hestia', 'hinata', 'inori', 'isuzu', 'itachi', 'itori',
  'kaga', 'kagura', 'kaori', 'keneki', 'kotori', 'kurumi', 'madara', 'mikasa', 'miku', 'minato',
  'naruto', 'nezuko', 'sagiri', 'sasuke', 'sakura'
];

handler.help = [
  'akira', 'akiyama', 'anna', 'asuna', 'ayuzawa', 'boruto', 'chiho', 'chitoge', 'deidara',
  'erza', 'elaina', 'eba', 'emilia', 'hestia', 'hinata', 'inori', 'isuzu', 'itachi', 'itori',
  'kaga', 'kagura', 'kaori', 'keneki', 'kotori', 'kurumi', 'madara', 'mikasa', 'miku', 'minato',
  'naruto', 'nezuko', 'sagiri', 'sasuke', 'sakura'
];

handler.tags = ['anime'];  // Define the command tag as anime

// Handle the callback for the "Next" button (restarts the fetching process)
handler.action = async (callbackQuery, bot, prefixes) => {
  const { data } = callbackQuery;  // This will now be the query (no "next_" prefix)
  let query = data.replace('next_', '');  // Strip "next_" prefix to get the actual character name

  // Ensure that the query is valid
  if (!query || !handler.command.includes(query)) {
    await bot.sendMessage(callbackQuery.message.chat.id, '❌ Command not found.');
    return;
  }

  // Fetch the new random image and restart the process as if the user typed the command again
  try {
    // Fetch the JSON data for the query (anime images for the specific character)
    const res = await fetch(`https://raw.githubusercontent.com/Guru322/api/Guru/BOT-JSON/anime-${query}.json`);
    const data = await res.json();

    // Select a random image from the fetched data
    const randomImage = data[Math.floor(Math.random() * data.length)];

    // Send the image using the bot, adding a caption with the query
    await bot.sendPhoto(callbackQuery.message.chat.id, randomImage, { caption: `_${query}_` });

    // Send the inline "Next" button for fetching more images
    bot.sendMessage(callbackQuery.message.chat.id, `_${query}_`, {
      reply_markup: {
        inline_keyboard: [
          [{ text: "🔄 NEXT 🔄", callback_data: `next_${query}` }]  // Include "next_" in callback data to handle next action
        ]
      }
    });

  } catch (error) {
    console.error('Error fetching new anime image:', error.message);
    await bot.sendMessage(callbackQuery.message.chat.id, '❌ Something went wrong while fetching the new image. Please try again later.');
  }
};

module.exports = handler;
