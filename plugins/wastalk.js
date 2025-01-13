const fetch = require('node-fetch');

const handler = async ({ bot, m, text, query }) => {
  const chatId = m.chat.id;

  if (!query) {
    await bot.sendMessage(chatId, 'Please provide a WhatsApp channel URL.');
    return;
  }

  // Prepare the API URL with the query (user-provided WhatsApp URL)
  const apiUrl = `https://api.giftedtech.web.id/api/stalk/wachannel?apikey=gifted-md&url=${encodeURIComponent(query)}`;

  console.log("API URL:", apiUrl); // Log the URL to ensure it is correct

  try {
    // Fetch data from the API
    const response = await fetch(apiUrl);
    
    // Log the response status code
    console.log("Response Status:", response.status);

    // Check if response status is OK (200-299)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    // Log the API response to the console for debugging
    console.log("API Response:", data);

    // Check if the response is successful
    if (data.status === 200 && data.success) {
      const result = data.result;

      // Format the information to send to the user as a caption
      const message = `
        *WhatsApp Channel Information:*
        - *Title*: ${result.title}
        - *Description*: ${result.description}
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
