const { Telegraf } = require("telegraf");
const axios = require("axios"); // Thêm axios để gửi dữ liệu
require("dotenv").config();

const bot = new Telegraf(process.env.BOT_TOKEN);

// Thay URL webhook bằng đường dẫn Ngrok của bạn
const N8N_WEBHOOK_URL = "https://52ca-171-243-49-192.ngrok-free.app";

bot.start((ctx) => {
    ctx.reply("Chào mừng bạn đến với bot!");
});

// Xử lý tin nhắn từ Telegram
bot.on("message", async (ctx) => {
    const message = {
        user_id: ctx.from.id,
        username: ctx.from.username,
        text: ctx.message.text,
    };

    // Gửi dữ liệu đến n8n thông qua webhook
    try {
        await axios.post(N8N_WEBHOOK_URL, message);
        console.log("Đã gửi dữ liệu đến n8n:", message);
    } catch (error) {
        console.error("Lỗi khi gửi dữ liệu đến n8n:", error.message);
    }

    ctx.reply("Tin nhắn của bạn đã được gửi đến n8n!");
});

// Chạy bot
bot.launch();
console.log("🤖 Bot Telegram đang chạy...");
