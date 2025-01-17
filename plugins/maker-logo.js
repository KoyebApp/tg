const fetch = require('node-fetch');  // Use require instead of import

let handler = async ({ m, bot, usedPrefix, command, text }) => {
   // This error message will show if no text after the command is provided.
   let tee = `✳️ Provide Some Text With Command 📌 Example: ${usedPrefix + command} MEGA AI`;  

   // Strip the prefix and the command from the full message
   let textAfterCommand = text.replace(new RegExp(`^${usedPrefix}${command}`, 'i'), '').trim();

   // Ensure that there is text after the command (if not, show an error message)
   if (!textAfterCommand) throw tee;

   let apiUrl;

   switch (command) {
      case 'papercut':
      case 'logomaker':
      case 'cartoon':
      case 'writetext':
      case 'glossy':
      case 'bpstyle':
      case 'pixelglitch':
      case 'advancedglow':
      case 'lighteffect':
      case 'texteffect':
      case 'galaxy':
      case 'beach':
      case 'clouds':
         // Here we pass only the text after the command to the API
         apiUrl = `https://api.giftedtech.web.id/api/ephoto360/${command}?apikey=gifted-md&text=${encodeURIComponent(textAfterCommand)}`;
         break;

      default:
         throw 'Command not recognized.';
   }

   try {
      // Fetch the image URL from the API
      const response = await fetch(apiUrl);
      
      // Ensure the response is valid JSON
      const data = await response.json();

      if (data.success && data.result && data.result.image_url) {
         // Send the image to the user
         bot.sendDocument(m.chat.id, data.result.image_url, 'logo.png', `𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 © 𝙼𝙴𝙶𝙰-𝙰𝙸`, m);
      } else {
         throw 'Failed to generate the image. Please try again later.';
      }
   } catch (error) {
      console.error('Error fetching image:', error);
      bot.sendMessage(m.chat.id, '❌ An error occurred while fetching the image. Please try again later.');
   }
}

// List of commands (for which this plugin should work)
handler.command = [
   'papercut', 'logomaker', 'bpstyle', 'writetext', 'glossy', 'cartoon', 'pixelglitch', 'advancedglow', 
   'lighteffect', 'texteffect', 'galaxy', 'beach', 'clouds'
]; 

handler.help = [
   'papercut', 'logomaker', 'bpstyle', 'writetext', 'glossy', 'cartoon', 'pixelglitch', 'advancedglow', 
   'lighteffect', 'texteffect', 'galaxy', 'beach', 'clouds'
];

handler.tags = ['maker'];

module.exports = handler;
