const { Telegraf } = require("telegraf");
const axios = require("axios");
const express = require("express");
require("dotenv").config();

const bot = new Telegraf(process.env.BOT_TOKEN);
const PORT = process.env.PORT || 3000;
const SERVER_URL = process.env.SERVER_URL || "https://tele-bot.onrender.com"; // 🔥 Public URL trên Render
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || "https://your-n8n-service.onrender.com/webhook/telegram-webhook";

const app = express();
app.use(express.json());

// 1️⃣ **API nhận tin nhắn từ Telegram & gửi đến n8n**
app.post("/webhook/telegram-bot", async (req, res) => {
    const message = req.body.message;
    if (!message) return res.status(400).json({ error: "No message received" });

    console.log("📩 Tin nhắn từ Telegram:", message);

    // Gửi tin nhắn đến n8n
    try {
        await axios.post(N8N_WEBHOOK_URL, message);
        console.log("✅ Đã gửi tin nhắn đến n8n:", N8N_WEBHOOK_URL);
        res.sendStatus(200);
    } catch (error) {
        console.error("❌ Lỗi gửi đến n8n:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to send message to n8n" });
    }
});

// 2️⃣ **Khởi động Server trước khi cập nhật Webhook**
app.listen(PORT, async () => {
    console.log(`🌍 Server đang chạy tại: ${SERVER_URL}`);

    try {
        await bot.telegram.setWebhook(`${SERVER_URL}/webhook/telegram-bot`);
        console.log("✅ Webhook đã cập nhật:", `${SERVER_URL}/webhook/telegram-bot`);
    } catch (err) {
        console.error("❌ Lỗi cập nhật Webhook:", err);
    }
});

// 3️⃣ **Khởi động Bot Telegram**
bot.start((ctx) => ctx.reply("🚀 Bot Telegram đã sẵn sàng!"));
bot.launch();
console.log("🤖 Bot Telegram đang chạy...");
