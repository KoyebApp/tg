const uploadImage = require('../lib/uploadImage');  // Import uploadImage
const fetch = require('node-fetch');  // Fetch for making API calls

let handler = async ({ m, bot, text, usedPrefix, command }) => {
  try {
    let q = m.quoted ? m.quoted : m;  // Get quoted message if any, or the current message
    let mime = (q.msg || q).mimetype || '';  // Get mime type of the message media

    // Ensure mime type exists and it's an image
    if (!mime || !mime.startsWith('image/')) {
      throw 'Respond to a QR code image!';  // If no mime type or it's not an image, throw error
    }

    let img = await q.download?.();  // Download the image file

    if (!img) {
      throw 'Failed to download the image, please try again!';  // Ensure image was downloaded
    }

    let url = await uploadImage(img);  // Upload the image to get its URL

    // Fetch the result from the QR code reading API
    let anu = await fetch(`https://api.lolhuman.xyz/api/read-qr?apikey=GataDios&img=${url}`);
    let json = await anu.json();  // Parse the response

    if (json.status !== 200) {
      throw `Error: ${json.message || 'Unable to read the QR code.'}`;  // Handle API errors
    }

    // Send the decoded QR code data back to the user
    await bot.sendMessage(m.chat.id, `Here you go: ${json.result}`);
  } catch (error) {
    console.error('Error in readqr handler:', error);  // Log the error for debugging
    await bot.sendMessage(m.chat.id, `Error occurred: ${error.message || error}`);
  }
};

handler.command = ['readqr'];  // Command to trigger the QR code reading
handler.help = ['readqr'];
handler.tags = ['qr'];

module.exports = handler;  // Export the handler to be used by the bot
