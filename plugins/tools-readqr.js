const uploadImage = require('../lib/uploadImage');  // Import uploadImage
const fetch = require('node-fetch');  // Fetch for making API calls

let handler = async ({ m, bot, query, usedPrefix, command }) => {
  try {
    // Check if the image is in the query, either from the main message or as a reply
    let mime = (query || m).mimetype || '';  // Get mime type from the message or query
    console.log('Mime type:', mime);  // Log mime type to check if we get the correct value
    
    // Ensure the mime type exists and is an image
    if (!mime || !mime.startsWith('image/')) {
      throw '*Respond with a QR code image!*';  // Error if it's not an image
    }

    // Case: Download the image from the query message or main message
    let img = await (query || m).download?.();  // Download the image from the query or main message
    console.log('Image download success:', !!img);  // Log download success/failure

    if (!img) {
      throw '*Failed to download the image, please try again!*';  // If no image was downloaded, show error
    }

    // Case: Upload the image to telegra.ph and get the URL
    let url = await uploadImage(img);  // Upload image to get the URL
    console.log('Uploaded image URL:', url);  // Log the uploaded image URL

    // Case: Fetch the result from the QR code reading API
    let anu = await fetch(`https://api.lolhuman.xyz/api/read-qr?apikey=GataDios&img=${url}`);
    let json = await anu.json();  // Parse the API response

    // Case: If API does not return success status, throw error
    if (json.status !== 200) {
      throw `Error: ${json.message || 'Unable to read the QR code.'}`;  // Handle API errors
    }

    // Case: Successfully decoded QR code, send the result
    await bot.sendMessage(m.chat.id, `*Here you go:* ${json.result}`);
  } catch (error) {
    console.error('Error in readqr handler:', error);  // Log any errors encountered during the process
    await bot.sendMessage(m.chat.id, `*Error occurred:* ${error.message || error}`);  // Send error message to user
  }
};

// Command configuration
handler.command = ['readqr'];
handler.help = ['readqr'];
handler.tags = ['qr'];

module.exports = handler;
