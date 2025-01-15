let handler = async ({ shippingQuery, bot }) => {
  try {
    const chatId = shippingQuery.chat.id;

    const shippingOptions = [{
      id: 'standard',
      title: 'Standard Shipping',
      prices: [{ label: 'Shipping Fee', amount: 500 }] // In cents
    }];

    // Answer the shipping query
    await bot.answerShippingQuery(shippingQuery.id, true, {
      shipping_options: shippingOptions
    });
  } catch (error) {
    console.error('Error occurred during shipping query handling:', error);
  }
};

handler.command = [];  // Not a command but an event handler
handler.help = [];     // No help for event handlers
handler.tags = ['payment'];  // Payment event

module.exports = handler;
