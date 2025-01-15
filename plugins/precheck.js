let handler = async ({ preCheckoutQuery, bot }) => {
  try {
    const chatId = preCheckoutQuery.chat.id;

    // Verify the order and proceed with checkout
    const isOrderValid = true; // Add your order validation logic here

    if (isOrderValid) {
      await bot.answerPreCheckoutQuery(preCheckoutQuery.id, true);
    } else {
      await bot.answerPreCheckoutQuery(preCheckoutQuery.id, false, { error_message: "Invalid order" });
    }

  } catch (error) {
    console.error('Error occurred during pre-checkout query handling:', error);
  }
};

handler.command = [];  // Not a command but an event handler
handler.help = [];     // No help for event handlers
handler.tags = ['payment'];  // Payment event

module.exports = handler;
