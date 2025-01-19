const { toFile } = require('qrcode');
const fs = require('fs');
const path = require('path');

let handler = async ({ m, bot, query, usedPrefix, command }) => {
  const chatId = m.chat.id;

  // Extract the query text (everything after the command)
  query = query.trim();

  // Check if the query is provided
  if (!query) {
    // If no query, ask the user to provide text for the QR code
    await bot.sendMessage(chatId, "Please provide the text to generate the QR code.");
    return; // Exit early if no query
  }

  try {
    // Define the absolute file path for the temporary QR code image
    const filePath = path.join(__dirname, 'qrcode.png'); // Set the path for the temporary file

    // Generate the QR code and save it to the file
    await toFile(filePath, query.slice(0, 2048));

    // Check if the file was generated successfully
    if (fs.existsSync(filePath)) {
      console.log(`QR code generated at: ${filePath}`);

      // Send the generated QR code image to the user
      await bot.sendPhoto(chatId, { path: filePath }, { caption: 'Here you go!' });

      // Clean up: delete the temporary file after sending it
      fs.unlinkSync(filePath); // Remove the temporary file after sending
    } else {
      throw new Error("QR code file not found after generation.");
    }
  } catch (err) {
    // Handle any errors in generating the QR code
    console.error(err);
    await bot.sendMessage(chatId, `Error generating QR code: ${err.message}`);
  }
};

handler.help = ['qr <text>', 'qr code <text>'];
handler.tags = ['tools'];

// Define the command to match (qr or qrcode)
handler.command = ['qrcode', 'qr'];

module.exports = handler;
