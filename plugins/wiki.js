const Qasim = require('api-qasim');

const handler = async ({ bot, m, query, db, usedPrefix, command }) => {
  if (!query) {
    await bot.sendMessage(m.chat.id, '✳️ Enter what you want to search for on Wikipedia');
    return;
  }

  try {
    // Fetch Wikipedia data using Qasim API
    const res = await Qasim.wikisearch(query);

    // Log the response for debugging purposes
    console.log('API Response:', res);

    // Check if the response contains data
    if (!res || res.length === 0 || !res[0].wiki) {
      await bot.sendMessage(m.chat.id, '⚠️ No results found for the search term.');
      return;
    }

    // Extract the data from the response
    const wikiContent = res[0].wiki;
    const wikiThumbnail = res[0].thumb;

    // Format the message with the extracted data
    const messageText = `▢ *Wikipedia*\n\n‣ Searched: ${query}\n\n${wikiContent}`;

    // Send the Wikipedia data to the user
    await bot.sendPhoto(m.chat.id, wikiThumbnail, { caption: messageText });

    // Optional: Save the query to the database
    if (db) {
      await db.saveSearch(query, m.chat.id); // Assuming a method `saveSearch` exists in your db
    }
  } catch (e) {
    console.error('Error:', e);
    await bot.sendMessage(m.chat.id, '⚠️ Error while fetching data from Wikipedia');
  }
};

module.exports = handler;
