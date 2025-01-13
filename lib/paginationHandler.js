const paginationHandler = async ({ bot, chatId, content, page, sendContent }) => {
  const itemsPerPage = 3;  // You can adjust this to show more/less items per page
  const startIndex = page * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, content.length);

  // Send the content for the current page
  for (let i = startIndex; i < endIndex; i++) {
    await sendContent(bot, chatId, content[i], i + 1);
  }

  // If there are more items, send the "Next" button
  if (endIndex < content.length) {
    await bot.sendMessage(chatId, "More content available!", {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Next', callback_data: `next_page_${page + 1}` }],
        ],
      },
    });
  } else {
    await bot.sendMessage(chatId, "No more content available.");
  }
};

module.exports = paginationHandler;
