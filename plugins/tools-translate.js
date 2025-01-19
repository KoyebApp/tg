const { translate } = require('@vitalets/google-translate-api');  // Import translate
const defaultLang = 'en';
const tld = 'cn';  // You can modify this if needed

let handler = async ({ bot, m, args, usedPrefix, command }) => {
  // Error message if no language or text is provided
  let err = `
📌 *Example:*

*${usedPrefix + command}* <id> [text]
*${usedPrefix + command}* en Hello World

≡ *List of supported languages:* 

https://cloud.google.com/translate/docs/languages
`.trim();

  let lang = args[0];  // Get the language code
  let text = args.slice(1).join(' ');  // Join the remaining arguments as the text to translate

  // If no language code provided, default to 'en' and take the whole input as text
  if ((args[0] || '').length !== 2) {
    lang = defaultLang;
    text = args.join(' ');
  }

  // If no text, try to get the quoted text from the message
  if (!text && m.quoted && m.quoted.text) text = m.quoted.text;

  try {
    // Call the Google Translate API
    let result = await translate(text, { to: lang, autoCorrect: true }).catch(_ => null);

    if (result) {
      // Send the translated text as the response
      await bot.sendMessage(m.chat.id, result.text);
    } else {
      throw err;  // If translation fails, throw the error message
    }
  } catch (e) {
    // Send the error message if something goes wrong
    console.error('Translation Error:', e);
    await bot.sendMessage(m.chat.id, err);
  }
};

// Help and command configuration
handler.help = ['translate <lang> <text>'];
handler.tags = ['tools'];
handler.command = ['translate', 'tl', 'trad', 'tr'];

module.exports = handler;
