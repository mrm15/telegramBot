import express from 'express';
import bodyParser from 'body-parser';
import TelegramBot from 'node-telegram-bot-api';
import { config } from './config';

// Initialize the bot
let bot:any;
try {
    bot = new TelegramBot(config.token);
} catch (error) {
    console.error("Failed to initialize Telegram bot:", error);
}

// Create an Express app
const app = express();

// Use bodyParser to parse JSON from Telegram webhook
app.use(bodyParser.json());

// Define webhook endpoint for Telegram
app.post(`/bot${config.token}`, (req, res) => {
    bot?.processUpdate(req.body);  // Pass the request body to Telegram Bot API
    res.sendStatus(200); // Respond with status 200 (OK)
});

// Health check endpoint
app.get('/', (req, res) => {
    res.send('Bot is running!');
});

// Handle '/start' command
bot?.onText(/\/start/, (msg:any) => {
    const chatId = msg.chat.id;
    const userName = msg.from?.first_name || 'User';
    void bot.sendMessage(chatId, `Hello, ${userName}! Welcome to the bot.`);
});

// Handle '/help' command
bot?.onText(/\/help/, (msg:any) => {
    const chatId = msg.chat.id;
    void bot.sendMessage(chatId, 'This is the help section. How can I assist you?');
});

// Start Express server and set webhook
const port = config.port;
app.listen(config.port, async () => {
    console.log(`Server is running on port ${config.port}`);

    try {
        // Set the webhook for Telegram bot
        const webHookUrl = `${config.webhookUrl}/bot${config.token}`;
        await bot?.setWebHook(webHookUrl);
        console.log('Webhook has been set successfully');
        console.log(webHookUrl);
    } catch (error) {
        console.error('Error setting webhook: ', error);
    }
});
