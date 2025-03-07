const { Telegraf } = require("telegraf");
const axios = require("axios");
const express = require("express");
require("dotenv").config();

const bot = new Telegraf(process.env.BOT_TOKEN);
const PORT = process.env.PORT || 3000;

// 🔹 Thay thế Ngrok bằng URL của n8n trên Render
const WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || "https://your-n8n-service.onrender.com/webhook/telegram-webhook";

const app = express();
app.use(express.json());

// 1️⃣ **API nhận tin nhắn từ Telegram & gửi đến n8n**
app.post("/webhook/telegram-bot", async (req, res) => {
    const message = req.body.message;
    if (message) {
        console.log("📩 Tin nhắn từ Telegram:", message);

        // Gửi dữ liệu đến n8n
        try {
            await axios.post(WEBHOOK_URL, message);
            console.log("✅ Đã gửi đến n8n:", WEBHOOK_URL);
        } catch (error) {
            console.error("❌ Lỗi gửi đến n8n:", error.message);
        }
    }
    res.sendStatus(200);
});

// 2️⃣ **Cấu hình Webhook cho Telegram**
bot.telegram.setWebhook(`${WEBHOOK_URL}`)
    .then(() => console.log("✅ Webhook đã cập nhật:", WEBHOOK_URL))
    .catch((err) => console.error("❌ Lỗi cập nhật Webhook:", err));

bot.start((ctx) => ctx.reply("🚀 Bot Telegram đã sẵn sàng!"));
bot.launch();
console.log("🤖 Bot Telegram đang chạy...");

// 3️⃣ **Chạy Express Server**
app.listen(PORT, () => {
    console.log(`🌍 Server chạy tại http://localhost:${PORT}`);
});
