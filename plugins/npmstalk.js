import pkg from 'api-qasim';
const { npmStalk } = pkg;

let handler = async (m, { bot, args, text, usedPrefix, command }) => {
    if (!args[0]) {
        await bot.sendMessage(m.chat.id, `✳️ Please provide an NPM package name.\n\n📌 Example: ${usedPrefix + command} api-qasim`);
        return;
    }

    try {
        await bot.sendMessage(m.chat.id, '⏳ Stalking NPM package...');

        // Fetching npm package details from the API
        let res = await npmStalk(args[0]);

        // Extract relevant data from the API response
        const { name, author, description, repository, homepage, 'dist-tags': distTags, versions } = res.result;

        // Counting the number of versions
        const versionCount = Object.keys(versions).length;

        // Formatting the message with relevant information
        let message = `
┌──「 *STALKING NPM PACKAGE* 
▢ *🔖Name:* ${name} 
▢ *🔖Creator:* ${author?.name || 'Unknown'}
▢ *👥Total Versions:* ${versionCount}
▢ *📌Description:* ${description}
▢ *🧩Repository:* ${repository?.url || 'No repository available'}
▢ *🌍Homepage:* ${homepage || 'No homepage available'}
▢ *🏷️Dist Tags:* Latest Version: ${distTags.latest}
▢ *🔗Link:* [NPM Package Link](https://npmjs.com/package/${name})
└────────────`;

        await bot.sendMessage(m.chat.id, message);
        await bot.sendMessage(m.chat.id, '✅ Package details fetched successfully!');

    } catch (error) {
        console.error("Error:", error);
        await bot.sendMessage(m.chat.id, `✳️ An error occurred while processing the request: ${error.message || error}`);
    }
};

handler.help = ['npm', 'npmstalk'];
handler.tags = ['search'];
handler.command = ['npm', 'npmstalk'];

export default handler;
