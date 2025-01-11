import pkg from 'api-qasim';
const { tiktokStalk } = pkg;

const handler = async (message, { bot, args, text, usedPrefix, command }) => {
    // Check if the username is provided in the command arguments
    if (!args[0]) {
        await bot.sendMessage(message.chat.id, `✳️ Please provide a TikTok username.\n\n📌 Example: ${usedPrefix + command} discoverpakistantv`);
        return;
    }

    try {
        await bot.sendMessage(message.chat.id, '⏳ Fetching TikTok user details...');

        // Fetching the TikTok user details from the API
        let res = await tiktokStalk(args[0]);

        // Extracting relevant data from the API response
        const { name, username, followers, following, description, profilePic } = res.obj;

        // Formatting the message with relevant information
        let te = `
┌──「 *STALKING TIKTOK* 
▢ *🔖Name:* ${name || 'No Username'}
▢ *🔖Username:* ${username || 'Unknown'}
▢ *👥Followers:* ${followers || 'N/A'}
▢ *🫂Following:* ${following || 'N/A'}
▢ *📌Bio:* ${description || 'No bio available'}
▢ *🔗Link:* https://www.tiktok.com/@${name.replace(/^@/, '') || 'NoUsername'}
└────────────`;

        // Handle profilePic: If it's missing, use a default fallback image
        const imageToSend = profilePic || 'https://upload.wikimedia.org/wikipedia/commons/8/85/TikTok_logo_2018.svg';
        
        // Send the formatted message and the profile picture (or default image)
        await bot.sendPhoto(message.chat.id, imageToSend, {
            caption: te
        });

        // React with a success emoji
        await bot.sendMessage(message.chat.id, '✅ Profile details fetched successfully!');
        
    } catch (error) {
        console.error("Error:", error);
        await bot.sendMessage(message.chat.id, `✳️ Error: ${error.message || error}`);
    }
};

// Define command metadata
handler.help = ['ttstalk', 'tiktokstalk'];
handler.tags = ['dl'];
handler.command = ['ttstalk', 'tiktokstalk'];

export default handler;
