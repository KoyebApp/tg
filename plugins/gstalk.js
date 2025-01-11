const Qasim = require('api-qasim');

let handler = async (m, { bot, args, text, usedPrefix, command }) => {
    if (!args[0]) {
        await bot.sendMessage(m.chat.id, `✳️ Please provide a GitHub username.\n\n📌 Example: ${usedPrefix + command} GlobalTechInfo`);
        return;
    }

    try {
        await bot.sendMessage(m.chat.id, '⏳ Stalking GitHub profile...');

        // Fetching GitHub details for the user
        let res = await Qasim.githubStalk(args[0]);

        // Extracting relevant data from the API response
        const {
            username,
            nickname,
            bio,
            profile_pic,
            url,
            company,
            location,
            blog,
            followers,
            following,
            public_repo,
            public_gists,
            created_at,
            updated_at
        } = res.results;

        // Formatting the message with relevant information
        let message = `
┌──「 *STALKING GITHUB PROFILE*
▢ *🔖Name:* ${nickname || 'Unknown'}
▢ *🔖Username:* ${username}
▢ *👥Followers:* ${followers || 'N/A'}
▢ *🫂Following:* ${following || 'N/A'}
▢ *📌Bio:* ${bio || 'No bio available'}
▢ *🏝️Public Repos:* ${public_repo || 'N/A'}
▢ *📚Public Gists:* ${public_gists || 'N/A'}
▢ *🧳Location:* ${location || 'Unknown'}
▢ *🏢Company:* ${company || 'No company info'}
▢ *🔗Link:* ${url || 'No URL available'}
└────────────`;

        // Send the message with the profile image
        const imageToSend = profile_pic || 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png';
        
        // Send message with the profile picture and information
        await bot.sendPhoto(m.chat.id, imageToSend, { caption: message });
    } catch (error) {
        console.error('Error:', error);
        await bot.sendMessage(m.chat.id, `✳️ An error occurred: ${error.message || error}`);
    }
}

handler.help = ['gstalk', 'githubstalk'];
handler.tags = ['search'];
handler.command = ['gstalk', 'githubstalk'];

module.exports = handler;
