import express from 'express';
import bodyParser from 'body-parser';
import TelegramBot from 'node-telegram-bot-api';
import { config } from './config';

// Initialize the bot
const bot = new TelegramBot(config.token);

// Create an Express app
const app = express();

// Use bodyParser to parse JSON from Telegram webhook
app.use(bodyParser.json());

// Define webhook endpoint for Telegram
app.post(`/bot${config.token}`, (req, res) => {
    bot.processUpdate(req.body);  // Pass the request body to Telegram Bot API
    res.sendStatus(200); // Respond with status 200 (OK)
});

// Handle '/start' command
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const userName = msg.from?.first_name || 'User';
    void bot.sendMessage(chatId, `Hello, ${userName}! Welcome to the bot.`);
});

// Handle '/help' command
bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    void bot.sendMessage(chatId, 'This is the help section. How can I assist you?');
});

// Start Express server
const port = config.port;
// Start Express server and set webhook
app.listen(config.port, async () => {
    console.log(`Server is running on port ${config.port}`);

    try {
        // Set the webhook for Telegram bot
        const webHookUrl = `${config.webhookUrl}/bot${config.token}`
        await bot.setWebHook(webHookUrl);
        console.log('Webhook has been set successfully');
        console.log(webHookUrl)
    } catch (error) {
        console.error('Error setting webhook: ', error);
    }
});

