import axios from 'axios';
import * as cheerio from 'cheerio';

const handler = async (message, { bot, text }) => {
  if (!text) throw '✳️ Enter what you want to search for on Wikipedia';

  try {
    // Send a GET request to Wikipedia
    const link = await axios.get(`https://en.wikipedia.org/wiki/${text}`);
    const $ = cheerio.load(link.data);

    // Extract the title and a brief paragraph
    let wik = $('#firstHeading').text().trim();
    let result = $('#mw-content-text > div.mw-parser-output').find('p').text().trim();

    // Send the response with the Wikipedia data
    await bot.sendMessage(message.chat.id, `▢ *Wikipedia*\n\n‣ Buscado: ${wik}\n\n${result}`);
  } catch (e) {
    await bot.sendMessage(message.chat.id, '⚠️ No results found');
  }
};

handler.help = ['wikipedia'];
handler.tags = ['tools'];
handler.command = ['wiki', 'wikipedia'];

export default handler;
