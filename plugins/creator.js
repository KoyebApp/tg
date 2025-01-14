let handler = async (message, { bot, usedPrefix, isOwner }) => {
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

  // Send contact information
  await bot.sendContact(message.chat.id, [{ phone_number: "923444844060", vcard: vcard }], {
    caption: 'Creator: Qasim Ali',
    reply_to_message_id: message.message_id,
  });
};

module.exports = handler;
