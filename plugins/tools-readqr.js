const uploadImage = require('../lib/uploadImage');  // Import uploadImage
const fetch = require('node-fetch');  // Fetch for making API calls

let handler = async ({ m, bot, query, usedPrefix, command }) => {
  try {
    // Log message details to see what is being received
    console.log("Received message:", m);
    console.log("Received query:", query);

    // Get mime type from the query (or the main message if no query)
    let mime = (query || m).mimetype || '';  
    console.log('Mime type:', mime);  // Log mime type to check if it's correct

    // Ensure mime type exists and it's an image
    if (!mime || !mime.startsWith('image/')) {
      throw '*Respond with a QR code image!*';  // Error if it's not an image
    }

    // Download the image from the query or the main message
    let img = await (query || m).download?.();  
    console.log('Image download success:', !!img);  // Log if image was downloaded

    // If image was not downloaded, throw error
    if (!img) {
      throw '*Failed to download the image, please try again!*';
    }

    // Upload image to telegra.ph and get the URL
    let url = await uploadImage(img);  
    console.log('Uploaded image URL:', url);  // Log the uploaded image URL

    // Fetch result from QR code reading API
    let anu = await fetch(`https://api.lolhuman.xyz/api/read-qr?apikey=GataDios&img=${url}`);
    let json = await anu.json();  // Parse API response

    // If the API response is not successful, throw an error
    if (json.status !== 200) {
      throw `Error: ${json.message || 'Unable to read the QR code.'}`;
    }

    // Send back the decoded QR code result
    await bot.sendMessage(m.chat.id, `*Here you go:* ${json.result}`);
  } catch (error) {
    // Log the error and send a message to the user
    console.error('Error in readqr handler:', error);
    await bot.sendMessage(m.chat.id, `*Error occurred:* ${error.message || error}`);
  }
};

// Command configuration
handler.command = ['readqr'];  // Command to trigger the QR code reading
handler.help = ['readqr'];
handler.tags = ['qr'];

module.exports = handler;  // Export the handler for use by the bot
