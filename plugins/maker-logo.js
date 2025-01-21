const fetch = require('node-fetch');  // Use require instead of import
const { Readable } = require('stream');  // Required to convert the response body into buffer

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
      if (!response.ok) {
         throw new Error(`Failed to fetch from API: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();

      // Ensure the response contains an image URL
      if (data.success && data.result && data.result.image_url) {
         const imageUrl = data.result.image_url;

         // Fetch the image from the URL
         const imageResponse = await fetch(imageUrl);
         if (!imageResponse.ok) {
            throw new Error(`Failed to fetch image from URL: ${imageResponse.status} ${imageResponse.statusText}`);
         }

         // Convert the image to a buffer
         const imageBuffer = await imageResponse.buffer();

         // Send the image buffer as a photo to the user with a caption
         bot.sendPhoto(m.chat.id, imageBuffer, {
            caption: `𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 © 𝙼𝙴𝙶𝙰-𝙰𝙸`
         });
      } else {
         throw new Error('Failed to generate the image. The API response was incomplete or unsuccessful.');
      }
   } catch (error) {
      console.error('Error during image generation and fetching:', error.message);  // Log detailed error
      // Send a detailed error message to the user
      bot.sendMessage(m.chat.id, `❌ Error: ${error.message}. Please try again later.`);

      // Optionally, you can log the error stack if you need more debugging information
      console.error(error.stack);
   }
};

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
