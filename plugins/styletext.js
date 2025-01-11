import pkg from 'api-qasim';  // Import the `api-qasim` package
const { styletext } = pkg;  // Destructure `styletext` from `api-qasim`

const handler = async (message, { bot, text, command, args, usedPrefix }) => {
  if (!text) {
    await bot.sendMessage(message.chat.id, `✳️ Please provide some text. Example: *${usedPrefix + command} Hello*`);
    return;
  }

  try {
    // Apply the styletext function to the provided text
    const styledResult = await styletext(text);  // Assuming styletext is async

    // Ensure the result is an array
    if (Array.isArray(styledResult)) {
      let styledMessage = `Choose a styled version of the text by replying with the number:\n\n`;

      // Loop through the result and check its structure before accessing properties
      styledResult.forEach((item, index) => {
        // Ensure we have a valid `name` and `result` to display
        const styledText = item.result || item;  // Use 'result' for the transformed text
        const styleName = item.name || `Style ${index + 1}`;  // Fallback to default style name if not provided
        styledMessage += `*${index + 1}.* ${styledText}\n`;
      });

      // Send the list of styled versions to the user
      await bot.sendMessage(message.chat.id, styledMessage);

      // Store session data for later use
      bot.styletext = bot.styletext || {};  // Initialize session storage if not already initialized
      bot.styletext[message.from.id] = {
        result: styledResult,
        timeout: setTimeout(() => {
          bot.sendMessage(message.chat.id, '⏳ Your selection has expired.');
          delete bot.styletext[message.from.id];
        }, 150 * 1000), // Timeout after 2.5 minutes
      };
    } else {
      // If the result isn't an array, inform the user
      await bot.sendMessage(message.chat.id, `❌ No styled text found for the input provided.`);
    }
  } catch (error) {
    console.error('Error applying styletext:', error);
    await bot.sendMessage(message.chat.id, `❎ Error occurred while styling the text: ${error.message || error}`);
  }
};

handler.before = async (message, { bot }) => {
  // Ensure session storage is initialized before accessing
  bot.styletext = bot.styletext || {};

  // Ensure the user has received the options and replied with a number
  if (!bot.styletext[message.from.id]) return;

  const { result, timeout } = bot.styletext[message.from.id];

  // Validate the reply and the input number
  if (!message.reply_to_message || !message.text) return;

  const choice = message.text.trim();
  const inputNumber = Number(choice);

  // Validate the user's selection
  if (inputNumber >= 1 && inputNumber <= result.length) {
    const selectedStyledText = result[inputNumber - 1].result || result[inputNumber - 1];  // Access 'result' for the transformed text

    try {
      // Send the selected styled text to the user
      await bot.sendMessage(message.chat.id, selectedStyledText);
      clearTimeout(timeout); // Clear the timeout for the session

      // Clean up the session
      delete bot.styletext[message.from.id];
    } catch (error) {
      console.error("Error sending selected styled text:", error);
      await bot.sendMessage(message.chat.id, `❎ Failed to send the styled text: ${error.message || error}`);
    }
  } else {
    await bot.sendMessage(message.chat.id, `❎ Invalid selection. Please choose a number between 1 and ${result.length}.`);
  }
};

handler.help = ['styletext'];
handler.tags = ['utility'];
handler.command = /^(styletext)$/i;

export default handler;
