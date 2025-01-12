const Qasim = require('api-qasim');

const handler = async ({ bot, m, query, db, usedPrefix, command }) => {
  if (!query) {
    await bot.sendMessage(m.chat.id, '✳️ Enter what you want to search for on Wikipedia');
    return;
  }

  try {
    // Fetch Wikipedia data using Qasim API
    const res = await Qasim.wikipedia(query);

    // Log the response for debugging purposes
    console.log('API Response:', res);

    // Check if the response is valid
    if (!res || !res.extract) {
      await bot.sendMessage(m.chat.id, '⚠️ No results found for the search term.');
      return;
    }

    // Send the Wikipedia data to the user
    await bot.sendMessage(m.chat.id, `▢ *Wikipedia*\n\n‣ Searched: ${res.title}\n\n${res.extract}`);
    
    // Optional: Save the query to the database
  } catch (e) {
    console.error('Error:', e);
    await bot.sendMessage(m.chat.id, '⚠️ Error while fetching data from Wikipedia');
  }
};

module.exports = handler;
