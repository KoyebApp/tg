const fetch = require('node-fetch');  // Use require instead of import

let handler = async ({ m, bot, usedPrefix, command, text }) => {
   // This error message will show if no text after the command is provided.
   let tee = `✳️ Provide Some Text With Command 📌 Example: ${usedPrefix + command} MEGA AI`;  

   // Strip the prefix and the command from the full message
   let textAfterCommand = text.replace(new RegExp(`^${usedPrefix}${command}`, 'i'), '').trim();

   // Ensure that there is text after the command (if not, show an error message)
   if (!textAfterCommand) throw tee;

   let apiUrl;

   // Define the correct API URLs for each command
   switch (command) {
      case 'papercut':
         apiUrl = `https://api.giftedtech.web.id/api/ephoto360/papercut?apikey=gifted-md&text=${encodeURIComponent(textAfterCommand)}`;
         break;

      case 'logomaker':
         apiUrl = `https://api.giftedtech.web.id/api/ephoto360/logomaker?apikey=gifted-md&text=${encodeURIComponent(textAfterCommand)}`;
         break;

      case 'cartoon':
         apiUrl = `https://api.giftedtech.web.id/api/ephoto360/cartoonstyle?apikey=gifted-md&text=${encodeURIComponent(textAfterCommand)}`;
         break;

      case 'writetext':
         apiUrl = `https://api.giftedtech.web.id/api/ephoto360/writetext?apikey=gifted-md&text=${encodeURIComponent(textAfterCommand)}`;
         break;

      case 'glossy':
         apiUrl = `https://api.giftedtech.web.id/api/ephoto360/glossysilver?apikey=gifted-md&text=${encodeURIComponent(textAfterCommand)}`;
         break;

      case 'bpstyle':
         apiUrl = `https://api.giftedtech.web.id/api/ephoto360/blackpinkstyle?apikey=gifted-md&text=${encodeURIComponent(textAfterCommand)}`;
         break;

      case 'pixelglitch':
         apiUrl = `https://api.giftedtech.web.id/api/ephoto360/pixelglitch?apikey=gifted-md&text=${encodeURIComponent(textAfterCommand)}`;
         break;

      case 'advancedglow':
         apiUrl = `https://api.giftedtech.web.id/api/ephoto360/advancedglow?apikey=gifted-md&text=${encodeURIComponent(textAfterCommand)}`;
         break;

      case 'lighteffect':
         apiUrl = `https://api.giftedtech.web.id/api/ephoto360/lighteffect?apikey=gifted-md&text=${encodeURIComponent(textAfterCommand)}`;
         break;

      case 'texteffect':
         apiUrl = `https://api.giftedtech.web.id/api/ephoto360/texteffect?apikey=gifted-md&text=${encodeURIComponent(textAfterCommand)}`;
         break;

      case 'galaxy':
         apiUrl = `https://api.giftedtech.web.id/api/ephoto360/galaxy?apikey=gifted-md&text=${encodeURIComponent(textAfterCommand)}`;
         break;

      case 'beach':
         apiUrl = `https://api.giftedtech.web.id/api/ephoto360/summerbeach?apikey=gifted-md&text=${encodeURIComponent(textAfterCommand)}`;
         break;

      case 'clouds':
         apiUrl = `https://api.giftedtech.web.id/api/ephoto360/effectclouds?apikey=gifted-md&text=${encodeURIComponent(textAfterCommand)}`;
         break;

      default:
         throw 'Command not recognized.';
   }

   try {
      // Fetch the image URL from the API
      const response = await fetch(apiUrl);

      // Ensure the response is valid JSON
      const data = await response.json();

      // Check if the response is successful and the image URL exists
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
