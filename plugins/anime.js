const fetch = require('node-fetch');  // Use require instead of import

let handler = async ({ m, command, bot, usedPrefix, text }) => {
  try {
    // Strip the prefix from the command to get the query
    const query = command.replace(usedPrefix, '').trim();  // Remove prefix and extra spaces

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

    // Optional: Send a button for "Next" to fetch another image (if applicable)
    bot.sendMessage(m.chat.id, `_${query}_`, {
      reply_markup: {
        inline_keyboard: [
          [{ text: "🔄 NEXT 🔄", callback_data: `next-${query}` }]
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

// Handle the callback for the "Next" button
handler.action = async (callbackQuery, bot) => {
  const { data } = callbackQuery;
  const query = data.split('-')[1]; // Extract the query part after "next-"

  // Fetch the new random image
  try {
    const res = await fetch(`https://raw.githubusercontent.com/Guru322/api/Guru/BOT-JSON/anime-${query}.json`);
    const data = await res.json();

    const randomImage = data[Math.floor(Math.random() * data.length)];

    // Edit the message with a new image
    await bot.editMessageMedia({
      media: randomImage,
      type: 'photo'
    }, {
      chat_id: callbackQuery.message.chat.id,
      message_id: callbackQuery.message.message_id,
      caption: `_${query}_`
    });

    // Update the "Next" button for the next image
    bot.editMessageReplyMarkup({
      inline_keyboard: [
        [{ text: "🔄 NEXT 🔄", callback_data: `next-${query}` }]
      ]
    }, {
      chat_id: callbackQuery.message.chat.id,
      message_id: callbackQuery.message.message_id
    });

  } catch (error) {
    console.error('Error fetching new anime image:', error.message);
    await bot.sendMessage(callbackQuery.message.chat.id, '❌ Something went wrong while fetching the new image. Please try again later.');
  }
};

module.exports = handler;
