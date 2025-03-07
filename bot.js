const { Telegraf } = require("telegraf");
const axios = require("axios");
const express = require("express"); // ✅ Thêm Express
require("dotenv").config();

const bot = new Telegraf(process.env.BOT_TOKEN);

// ✅ Thay URL webhook bằng đường dẫn Ngrok của bạn
const N8N_WEBHOOK_URL = "https://c2b8-171-243-49-192.ngrok-free.app";

// ✅ Khởi tạo Web Server để tránh lỗi "Port scan timeout"
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.send("Bot Telegram đang chạy...");
});

// ✅ Lắng nghe cổng để Render không bị lỗi
app.listen(PORT, () => {
    console.log(`🌍 Server đang chạy trên cổng ${PORT}`);
});

bot.start((ctx) => {
    ctx.reply("Chào mừng bạn đến với bot!");
});

// ✅ Xử lý tin nhắn từ Telegram & gửi đến n8n
bot.on("message", async (ctx) => {
    const message = {
        user_id: ctx.from.id,
        username: ctx.from.username,
        text: ctx.message.text,
    };

    try {
        await axios.post(N8N_WEBHOOK_URL, message);
        console.log("✅ Đã gửi dữ liệu đến n8n:", message);
    } catch (error) {
        console.error("❌ Lỗi khi gửi dữ liệu đến n8n:", error.message);
    }

    ctx.reply("Tin nhắn của bạn đã được gửi đến n8n!");
});

// ✅ Chạy bot
bot.launch();
console.log("🤖 Bot Telegram đang chạy...");
