const Qasim = require('api-qasim');

const handler = async ({ bot, m, text, db, usedPrefix, command, query }) => {
    const chatId = m.chat.id;

    if (!query) {
        return bot.sendMessage(chatId, "Please provide a search query.");
    }

    try {
        // Send "waiting" message to indicate the bot is processing
        await bot.sendMessage(chatId, "⏳ Please wait, fetching details...");
        
        // Call the Instagram profile stalking API with the username
        let res = await Qasim.igStalk(query);

        if (!res.username) {
            return await bot.sendMessage(chatId, "Sorry, we couldn't find that Instagram profile.");
        }

        let message = `
┌──「 STALKING INSTAGRAM
▢ 🔖Name: ${res.name || 'Unknown'} 
▢ 🔖Username: ${res.username}
▢ 👥Followers: ${res.followers || 'N/A'}
▢ 🫂Following: ${res.following || 'N/A'}
▢ 📌Bio: ${res.description || 'No bio available'}
▢ 🏝️Posts: ${res.posts || 'N/A'}
▢ 🔗Link: [Instagram Profile](https://instagram.com/${res.username.replace(/^@/, '')})
└────────────`;

        // Send the profile details as a message
        await bot.sendMessage(chatId, message);
    } catch (error) {
        console.error("Error:", error);
        await bot.sendMessage(chatId, `✳️ An error occurred while processing the request. Please try again later.`);
    }
};

handler.command = ['igstalk', 'instastalk', 'instagrams'];  // Command list
handler.help = ['igstalk', 'instastalk', 'instagrams'];
handler.tags = ['main'];
module.exports = handler;
