const { translate } = require('@vitalets/google-translate-api');  // Import translate
const defaultLang = 'en';  // Default language
const tld = 'cn';  // You can modify this if needed

let handler = async ({ bot, m, args, usedPrefix, command }) => {
  // Error message if no language or text is provided
  let err = `
📌 *Example:*

${usedPrefix + command} <id> [text]
${usedPrefix + command} en Hello World

≡ List of supported languages:

https://cloud.google.com/translate/docs/languages
`.trim();

  // Get language code and text from arguments
  let lang = args[0];  // First argument should be the language code
  let text = args.slice(1).join(' ');  // Join the remaining arguments as the text to translate

  // If no language code provided, default to 'en' and take the whole input as text
  if ((args[0] || '').length !== 2) {
    lang = defaultLang;
    text = args.join(' ');
  }

  // If no text, try to get the quoted text from the message
  if (!text && m.quoted && m.quoted.text) text = m.quoted.text;

  // Check if we have valid text and language
  if (!text || !lang) {
    await bot.sendMessage(m.chat.id, err);
    return;
  }

  // Retry mechanism to handle "Too Many Requests" error
  const retryTranslate = async (text, lang, retries = 3) => {
    try {
      // Call the Google Translate API
      let result = await translate(text, { to: lang, autoCorrect: true });

      if (result && result.text) {
        // Send the translated text as the response
        await bot.sendMessage(m.chat.id, result.text);
      } else {
        throw new Error('Translation failed. Please try again later.');
      }
    } catch (e) {
      console.error('Translation Error:', e);

      // Check if the error is related to rate limiting
      if (e.message.includes('Too Many Requests') && retries > 0) {
        // Retry after 5 seconds
        console.log('Rate limit reached. Retrying...');
        await new Promise(resolve => setTimeout(resolve, 5000));  // Wait for 5 seconds
        await retryTranslate(text, lang, retries - 1);  // Retry with a reduced number of retries
      } else {
        // If no retries left or a different error, send error message
        await bot.sendMessage(m.chat.id, err);
      }
    }
  };

  // Start the translation process with retries
  await retryTranslate(text, lang);
};

// Help and command configuration
handler.help = ['translate <lang> <text>'];
handler.tags = ['tools'];
handler.command = ['translate', 'tl', 'trad', 'tr'];

module.exports = handler;
