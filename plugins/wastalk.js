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
    const data = await response.json();

    // Log the API response to the console for debugging
    console.log("API Response:", data);

    // Check if the response is successful
    if (data.status === 200 && data.success) {
      const result = data.result;

      // Format the information to send to the user
      const message = `
        *WhatsApp Channel Information:*
        - *Name*: ${result.name}
        - *Description*: ${result.description}
        - *Link*: [Click here](https://wa.me/${result.phone})
        - *Phone*: ${result.phone}
        - *Total Members*: ${result.members}
        - *Profile Image*: [View Image](${result.profile_picture})
      `;

      // Send the information to the user
      await bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
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
