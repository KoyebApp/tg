import { translate } from '@vitalets/google-translate-api';

const defaultLang = 'en';
const tld = 'cn';

const handler = async (message, { bot, args, usedPrefix, command }) => {
  let err = `
📌 *Example:*

*${usedPrefix + command}* <id> [text]
*${usedPrefix + command}* en Hello World

≡ *List of supported languages:* 

https://cloud.google.com/translate/docs/languages
  `.trim();

  let lang = args[0];
  let text = args.slice(1).join(' ');

  // If language is not provided or invalid, use the default language
  if ((args[0] || '').length !== 2) {
    lang = defaultLang;
    text = args.join(' ');
  }

  // If no text is provided, try to get text from quoted message
  if (!text && message.reply_to_message && message.reply_to_message.text) {
    text = message.reply_to_message.text;
  }

  try {
    let result = await translate(text, { to: lang, autoCorrect: true }).catch(_ => null);
    if (result && result.text) {
      await bot.sendMessage(message.chat.id, result.text);
    } else {
      throw new Error("Translation failed.");
    }
  } catch (e) {
    await bot.sendMessage(message.chat.id, err);
  }
};

handler.help = ['translate <lang> <text>'];
handler.tags = ['tools'];
handler.command = ['translate', 'tl', 'trad', 'tr'];

export default handler;
