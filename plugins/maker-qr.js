const { toDataURL } = require('qrcode');
const chatId = m.chat.id

let handler = async ({ m, text, bot }) => {
  if (!text) throw `*Give a text to convert*`
  bot.sendPhoto(
    chatId,
    await toDataURL(text.slice(0, 2048), { scale: 8 }),
    'qrcode.png',
    'Here u go',
    m
  )
}
handler.help = ['', 'code'].map(v => 'qr' + v + ' <text>')
handler.tags = ['tools']
handler.command = /^qr(code)?$/i
module.exports = handler
