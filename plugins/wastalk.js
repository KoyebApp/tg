const fetch = require('node-fetch');

const handler = async ({ bot, m, text, query }) => {
  const chatId = m.chat.id;

  if (!query) {
    await bot.sendMessage(chatId, 'Please provide a WhatsApp channel URL.');
    return;
  }

  // Prepare the API URL with the query (user-provided WhatsApp URL)
  const apiUrl = `https://api.giftedtech.web.id/api/stalk/wachannel?apikey=gifted-md&url=${encodeURIComponent(query)}`;

  try {
    // Fetch data from the API
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    // Check if the response is successful
    if (data.status === 200 && data.success) {
      const result = data.result;

      // Adjust description length and add Read More link
      const maxDescriptionLength = 200;  // You can adjust this value as per your preference
      let description = result.description;

      if (description.length > maxDescriptionLength) {
        description = description.substring(0, maxDescriptionLength) + '... [Read More](' + query + ')';
      }

      // Format the message to send to the user
      const message = `
        *WhatsApp Channel Information:*
        - *Title*: ${result.title}
        - *Description*: ${description}
        - *Followers*: ${result.followers}
      `;

      // Send the profile image along with the caption
      await bot.sendPhoto(chatId, result.img, {
        caption: message,
        parse_mode: 'Markdown',
      });
    } else {
      await bot.sendMessage(chatId, 'Failed to retrieve information about the WhatsApp channel. Please make sure the URL is correct.');
    }
  } catch (error) {
    console.error("Error during API request:", error);
    await bot.sendMessage(chatId, 'An error occurred while processing your request. Please try again later.');
  }
};

// Export the handler
module.exports = handler;
