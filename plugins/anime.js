const fetch = require('node-fetch'); // Import node-fetch for HTTP requests

let handler = async ({ m, command, bot, usedPrefix, text, action }) => {
  try {
    // Use the text from the query (query is the character name like 'anna')
    let query = text || command;

    // Function to fetch and send the image for the given query
    const fetchAndSendImage = async (query) => {
      const res = await fetch(`https://raw.githubusercontent.com/Guru322/api/Guru/BOT-JSON/anime-${query}.json`);
      const data = await res.json();
      const randomImage = data[Math.floor(Math.random() * data.length)];

      // Send the image with the caption, and include a "Next" button
      await bot.sendPhoto(m.chat.id, randomImage, {
        caption: `_${query}_`,
        reply_markup: {
          inline_keyboard: [
            [{ text: "🔄 NEXT 🔄", callback_data: `next-${query}` }] // Button for "Next"
          ]
        }
      });
    };

    // Handle "Next" button press (callback query)
    if (action && action.data && action.data.startsWith('next-')) {
      query = action.data.split('next-')[1]; // Extract query part (e.g., 'anna')
      if (query) {
        // Repeat the entire process as if the user typed the command again
        await fetchAndSendImage(query);
      }
    } else {
      // Initial command request, fetch and send image
      await fetchAndSendImage(query);
    }

  } catch (error) {
    console.error('Error fetching anime image:', error);
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

module.exports = handler;
