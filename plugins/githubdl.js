const handler = async ({ bot, m, text, db, usedPrefix, command, query }) => {
  const chatId = m.chat.id;

  // Ensure that the query is provided
  if (!query) {
    await bot.sendMessage(m.chat.id, 'Username and Repository name are missing. Example: GlobalTechInfo MEGA-AI');
    return;
  }

  // Split the query into username and repository
  const args = query.split(' ');

  // Check if both username and repository are provided
  if (args.length < 2) {
    await bot.sendMessage(m.chat.id, 'Both Username and Repository name are required. Example: GlobalTechInfo MEGA-AI');
    return;
  }

  const username = args[0];
  const repository = args[1];

  // Construct the GitHub URL for the repository zip file
  const url = `https://github.com/${username}/${repository}/archive/refs/heads/main.zip`;

  // Inform the user that the zip file is being processed
  await bot.sendMessage(m.chat.id, '⏳ Waiting for the repository to be compressed into a zip file...');

  try {
    // Send the zip file to the user
    await bot.sendDocument(m.chat.id, url, { caption: `${repository}.zip` });
  } catch (e) {
    // Handle any potential errors during the file send operation
    console.error(e);
    await bot.sendMessage(m.chat.id, '❌ Failed to fetch the repository. Please make sure the repository exists and try again.');
  }
};

// Export the handler
module.exports = handler;
