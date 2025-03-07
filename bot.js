require("dotenv").config();
const { Telegraf } = require("telegraf");

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => ctx.reply("Chào bạn! Tôi là bot của bạn 🤖"));
bot.help((ctx) => ctx.reply("Gửi lệnh /start để bắt đầu!"));

bot.on("text", (ctx) => {
  ctx.reply(`Bạn vừa gửi tin nhắn: "${ctx.message.text}"`);
});

bot.launch();
console.log("✅ Bot đã chạy...");

// Dừng bot an toàn khi app tắt
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
