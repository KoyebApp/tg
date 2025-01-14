let handler = async ({ m, bot, usedPrefix }) => {
  // VCard with contact information
  let vcard = `BEGIN:VCARD
VERSION:3.0
N:;Qasim;;;
FN:Qasim Ali
ORG:GlobalTechInfo
TITLE:Owner
item1.TEL;waid=923444844060:923444844060
item1.X-ABLabel:Owner
X-WA-BIZ-DESCRIPTION:Developer of the Bot
X-WA-BIZ-NAME:Qasim Ali
END:VCARD`;

  // Send contact information with correct phone number format
  await bot.sendContact(m.chat.id, [{
    phone_number: "+923444844060",
    first_name: "Qasim",
    last_name: "Ali",
    vcard: vcard
  }], {
    caption: `Creator: Qasim Ali\nFor support, contact me at +923444844060.\nUse ${usedPrefix}help for more commands.`,
    reply_to_message_id: m.message_id, // reply to the user's message
  });
};

module.exports = handler;
