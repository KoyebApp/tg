let statusMedia = null; // Variable to store the media that the owner wants to send as status
let statusTimer = null; // Timer for sending the status periodically

let handler = async ({ m, bot, query }) => {
  try {
    const chatId = m.chat.id;

    if (query === 'statussend' && m.chat.id.toString() === process.env.OWNER_ID) {
      // Prompt the owner to send the status content (text, photo, video, etc.)
      await bot.sendMessage(chatId, "Please send the media/text that you want to use as your status.");

      // Set the context that the owner has triggered statussend
      statusMedia = { type: 'status', chatId };
      console.log("Prompted owner to send status media.");
      return;
    }

    // If the owner is sending the status media (text, image, video)
    if (statusMedia && statusMedia.chatId === chatId) {
      // Handle text, photo, or video media
      if (m.text) {
        statusMedia.text = m.text; // Save text message as status
        await bot.sendMessage(chatId, "Text status set successfully.");
      } else if (m.photo) {
        statusMedia.photo = m.photo; // Save photo as status
        await bot.sendMessage(chatId, "Photo status set successfully.");
      } else if (m.video) {
        statusMedia.video = m.video; // Save video as status
        await bot.sendMessage(chatId, "Video status set successfully.");
      } else if (m.document) {
        statusMedia.document = m.document; // Save document as status
        await bot.sendMessage(chatId, "Document status set successfully.");
      }

      // After receiving the status media, ask if the owner wants to start periodic sending
      await bot.sendMessage(chatId, "Do you want to start sending this as your status? Reply with 'start' to begin.");
      statusMedia = null; // Clear the context after setting the media
    }

    // If owner wants to start the periodic status updates
    if (query === 'start' && m.chat.id.toString() === process.env.OWNER_ID) {
      if (!statusMedia || (!statusMedia.text && !statusMedia.photo && !statusMedia.video && !statusMedia.document)) {
        return await bot.sendMessage(chatId, "No status content set. Please send a text or media first.");
      }

      // Start the periodic status updates
      await bot.sendMessage(chatId, "Starting to send your status periodically.");

      statusTimer = setInterval(async () => {
        // Send the status (text, photo, video, etc.)
        if (statusMedia.text) {
          await bot.sendMessage(chatId, statusMedia.text);
        } else if (statusMedia.photo) {
          await bot.sendPhoto(chatId, statusMedia.photo);
        } else if (statusMedia.video) {
          await bot.sendVideo(chatId, statusMedia.video);
        } else if (statusMedia.document) {
          await bot.sendDocument(chatId, statusMedia.document);
        }
        console.log("Sent status update.");
      }, 1800000);  // Send every 30 minutes (1800000ms)
    }

    // If owner wants to stop sending the status
    if (query === 'stop' && m.chat.id.toString() === process.env.OWNER_ID) {
      if (statusTimer) {
        clearInterval(statusTimer);
        await bot.sendMessage(chatId, "Stopped sending status updates.");
        console.log("Stopped sending status updates.");
      } else {
        await bot.sendMessage(chatId, "Status updates are not running.");
      }
    }
  } catch (error) {
    console.error('Error in auto-status send plugin:', error);
  }
};

handler.command = ['statussend'];  // Commands to set status and manage periodic sending
handler.help = ['statussend', 'start', 'stop'];  // Help for the commands
handler.tags = ['owner'];  // Only the owner can use this command
module.exports = handler;
