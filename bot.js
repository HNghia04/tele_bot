const { Telegraf } = require("telegraf");
const axios = require("axios");
const express = require("express");
const { exec } = require("child_process");
require("dotenv").config();

const bot = new Telegraf(process.env.BOT_TOKEN);
const PORT = process.env.PORT || 3000;
let webhookUrl = process.env.WEBHOOK_URL || ""; // Sẽ cập nhật sau khi khởi động Ngrok

const app = express();
app.use(express.json());

// 1️⃣ **API nhận tin nhắn từ Telegram & gửi đến n8n**
app.post("/webhook/telegram-bot", async (req, res) => {
    const message = req.body.message;
    if (message) {
        console.log("📩 Tin nhắn từ Telegram:", message);

        // Gửi dữ liệu đến n8n
        try {
            await axios.post(process.env.N8N_WEBHOOK_URL, message);
            console.log("✅ Đã gửi đến n8n");
        } catch (error) {
            console.error("❌ Lỗi gửi đến n8n:", error.message);
        }
    }
    res.sendStatus(200);
});

// 2️⃣ **Khởi động Ngrok để tạo Webhook động**
function startNgrok() {
    exec(`ngrok http ${PORT} --log=stdout`, (error, stdout, stderr) => {
        if (error) {
            console.error("❌ Lỗi khi chạy Ngrok:", error);
            return;
        }
        if (stderr) {
            console.error("⚠ Cảnh báo từ Ngrok:", stderr);
        }

        // Lấy URL Ngrok từ output
        const urlMatch = stdout.match(/(https:\/\/[a-zA-Z0-9.-]+.ngrok-free.app)/);
        if (urlMatch) {
            webhookUrl = `${urlMatch[1]}/webhook/telegram-bot`;
            console.log("🚀 Ngrok URL:", webhookUrl);

            // Cập nhật Webhook cho Telegram bot
            bot.telegram.setWebhook(webhookUrl)
                .then(() => console.log("✅ Webhook đã cập nhật:", webhookUrl))
                .catch((err) => console.error("❌ Lỗi cập nhật Webhook:", err));
        }
    });
}

// 3️⃣ **Chạy bot Telegram**
bot.start((ctx) => ctx.reply("🚀 Bot Telegram đã sẵn sàng!"));
bot.launch();
console.log("🤖 Bot Telegram đang chạy...");

// 4️⃣ **Chạy Express Server & Ngrok**
app.listen(PORT, () => {
    console.log(`🌍 Server chạy tại http://localhost:${process.env.PORT}`);
    startNgrok(); // Gọi hàm khởi động Ngrok sau khi server chạy
});
