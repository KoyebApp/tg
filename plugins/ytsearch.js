import axios from 'axios';

const handler = async (message, { bot, args, text, usedPrefix, command }) => {
  // Check if search query is provided
  if (!text) {
    await bot.sendMessage(message.chat.id, '✳️ What do you want me to search for on YouTube?');
    return;
  }

  await bot.sendMessage(message.chat.id, '⏳ Searching...');

  try {
    const query = encodeURIComponent(text);
    const response = await axios.get(`https://weeb-api.vercel.app/ytsearch?query=${query}`);
    const results = response.data;

    if (results.length === 0) {
      await bot.sendMessage(message.chat.id, 'No results found for the given query.');
      return;
    }

    // Get at least 10 results, but if there are fewer, use all of them
    const resultsToSend = results.slice(0, 10);

    let messageText = 'Here are the top results:\n\n';
    resultsToSend.forEach((result, index) => {
      messageText += `
乂 ${index + 1}. ${result.title}
乂 *Link* : ${result.url}
乂 *Duration* : ${result.timestamp}
乂 *Published* : ${result.ago}
乂 *Views:* ${result.views}

      `;
    });

    // Send the message along with the thumbnail of the first result
    const thumbnail = resultsToSend[0].thumbnail;

    await bot.sendPhoto(message.chat.id, thumbnail, { caption: messageText });

    // React with a done emoji
    await bot.sendMessage(message.chat.id, '✅ Search completed successfully!');

  } catch (error) {
    console.error('Error:', error);
    await bot.sendMessage(message.chat.id, '⚠️ An error occurred while searching for YouTube videos. Please try again later.');
  }
};

// Define command metadata
handler.help = ['ytsearch'];
handler.tags = ['downloader'];
handler.command = ['ytsearch', 'yts'];

export default handler;
