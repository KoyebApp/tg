const Qasim = require('api-qasim');

const handler = async ({ bot, m, text, db, usedPrefix, command, query }) => {
    const chatId = m.chat.id;

    if (!query) {
        return bot.sendMessage(chatId, `✳️ Please provide an npm package name.\n\n📌 Example: ${usedPrefix + command} api-qasim`);
    }

    try {
        await bot.sendMessage(chatId, '⏳ Fetching npm package details...');
        
        // Fetching npm package details from API
        let res = await Qasim.npmStalk(query);

        // Extract relevant data from the API response
        const { name, author, description, repository, homepage, 'dist-tags': distTags, versions } = res.result;

        // Counting the number of versions
        const versionCount = Object.keys(versions).length;

        // Formatting the message with relevant information
        let message = `
┌──「 STALKING NPM 
▢ 🔖Name: ${name} 
▢ 🔖Creator: ${author?.name || 'Unknown'}
▢ 👥Total Versions: ${versionCount}
▢ 📌Description: ${description}
▢ 🧩Repository: ${repository?.url || 'No repository available'}
▢ 🌍Homepage: ${homepage || 'No homepage available'}
▢ 🏷️Dist Tags: Latest Version: ${distTags.latest}
▢ 🔗Link: [NPM Package](https://npmjs.com/package/${name})
└────────────`;

        // Send the text message to the chat
        await bot.sendMessage(chatId, message);

    } catch (error) {
        console.error("Error:", error);
        await bot.sendMessage(chatId, `✳️ An error occurred while processing the request: ${error.message || error}`);
    }
};

handler.command = ['npm', 'npmstalk', 'npm-package'];  // Command list
handler.help = ['npm', 'npmstalk', 'npm-package'];
handler.tags = ['main'];

module.exports = handler;
