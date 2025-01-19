const uploadImage = require('../lib/uploadImage');  // Import uploadImage
const fetch = require('node-fetch');  // Fetch for making API calls

let handler = async ({ m, bot, query, usedPrefix, command }) => {
  try {
    // Get mime type from the query (or the main message if no query)
    let mime = (query || m).mimetype || '';  
    console.log('Mime type:', mime);  // Log mime type to check if it's correct

    // Ensure mime type exists and it's an image
    if (!mime || !mime.startsWith('image/')) {
      throw new Error('Respond with a QR code image!');  // Error if it's not an image
    }

    // Download the image from the query or the main message
    let img = await (query || m).download?.();

    // If image was not downloaded, throw error
    if (!img) {
      throw new Error('Failed to download the image, please try again!');
    }

    // Upload image to telegra.ph and get the URL
    let url = await uploadImage(img);

    // Fetch result from QR code reading API
    let anu = await fetch(`https://api.lolhuman.xyz/api/read-qr?apikey=GataDios&img=${url}`);
    let json = await anu.json();  // Parse API response

    // If the API response is not successful, throw an error
    if (json.status !== 200) {
      throw new Error(`Error: ${json.message || 'Unable to read the QR code.'}`);
    }

    // Send back the decoded QR code result
    await bot.sendMessage(m.chat.id, `𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 © 𝙼𝙴𝙶𝙰-𝙰𝙸: ${json.result}`);
  } catch (error) {
    // Log the error to the console for debugging purposes
    console.error('Error in readqr handler:', error);

    // Send a detailed error message to the user
    if (error instanceof Error) {
      await bot.sendMessage(m.chat.id, `Error occurred: ${error.message}`);
    } else {
      await bot.sendMessage(m.chat.id, `Error occurred: ${error}`);
    }
  }
};


handler.command = ['readqr'];
handler.help = ['readqr'];
handler.tags = ['qr'];

module.exports = handler;
