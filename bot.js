require('dotenv').config();
const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => ctx.reply('Xin chào! Tôi là bot Telegram chạy trên Node.js 🚀'));
bot.help((ctx) => ctx.reply('Bạn có thể sử dụng các lệnh /start, /help'));
bot.on('message', (ctx) => ctx.reply('Bạn vừa gửi một tin nhắn!'));

bot.launch();
console.log("Bot đã chạy...");

// Đảm bảo bot không bị dừng
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
