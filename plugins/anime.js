const fetch = require('node-fetch');  // Use require instead of import

let handler = async ({ m, command, bot, usedPrefix, text }) => {
  try {
    // Use the text from the query (res is the query in your case)
    const query = text  // If text is provided, use it; otherwise, use the command name.

    // Fetch the JSON data for the query (anime images for the specific character)
    const res = await fetch(`https://raw.githubusercontent.com/Guru322/api/Guru/BOT-JSON/anime-${query}.json`);
    const data = await res.json();

    // Select a random image from the fetched data
    const randomImage = data[Math.floor(Math.random() * data.length)];

    // Send the image using the bot, adding a caption with the query
    await bot.sendPhoto(m.chat.id, randomImage, { caption: `_${query}_` });

    // Optional: Send a button for "Next" to fetch another image (if applicable)
    // bot.sendMessage(m.chat.id, `_${query}_`.trim(), {
    //   reply_markup: {
    //     inline_keyboard: [
    //       [{ text: "🔄 NEXT 🔄", callback_data: `${usedPrefix + query}` }]
    //     ]
    //   }
    // });

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
