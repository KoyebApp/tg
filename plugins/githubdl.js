let handler = async (m, { bot, args }) => {
    // Check if the username (args[0]) is provided
    if (!args[0]) {
        await bot.sendMessage(m.chat.id, 'Username and Repository name is missing. Example: GlobalTechInfo MEGA-AI');
        return;
    }

    // Check if the repository (args[1]) is provided
    if (!args[1]) {
        await bot.sendMessage(m.chat.id, 'Repository name is missing. Example: ULTRA-MD');
        return;
    }

    // Construct the GitHub URL for the repository zip file
    let url = `https://github.com/${args[0]}/${args[1]}/archive/refs/heads/main.zip`;

    // Inform the user that the zip file is being processed
    await bot.sendMessage(m.chat.id, '⏳ Waiting for the repository to be compressed into a zip file...');

    try {
        // Send the file to the user
        await bot.sendDocument(m.chat.id, url, { caption: `${args[1]}.zip` });
    } catch (e) {
        // Handle any potential errors during the file send operation
        console.error(e);
        await bot.sendMessage(m.chat.id, '❌ Failed to fetch the repository. Please make sure the repository exists and try again.');
    }
};

// Metadata for the handler
handler.help = ['github', 'githubdl'];
handler.tags = ['github'];
handler.command = ['github', 'githubdl'];

// Export the handler
module.exports = handler;
