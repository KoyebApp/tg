const axios = require('axios');
const cheerio = require('cheerio');

const handler = async ({ bot, m, query, db, usedPrefix, command }) => {
  if (!query) {
    await bot.sendMessage(m.chat.id, '✳️ Enter what you want to search for on Wikipedia');
    return;
  }

  try {
    // Send a GET request to Wikipedia
    const link = await axios.get(`https://en.wikipedia.org/wiki/${query}`);
    const $ = cheerio.load(link.data);

    // Extract the title and a brief paragraph
    let wik = $('#firstHeading').text().trim();
    let result = $('#mw-content-text > div.mw-parser-output').find('p').text().trim();

    // Send the response with the Wikipedia data
    await bot.sendMessage(m.chat.id, `▢ *Wikipedia*\n\n‣ Searched: ${wik}\n\n${result}`);
    
    // Optional: Save the query to database (db logic)
    if (db) {
      await db.saveSearch(query, m.chat.id); // Assuming a method `saveSearch` exists in your db
    }
  } catch (e) {
    await bot.sendMessage(m.chat.id, '⚠️ No results found');
  }
};

module.exports = handler;
