import express from 'express';
import bodyParser from 'body-parser';
import TelegramBot from 'node-telegram-bot-api';
import { config } from './config';
import { requestPhoneNumber, handleContactShare, handleAdditionalOptions } from './botCodes/botHandlers';

// Initialize the bot
let bot: TelegramBot | undefined;
try {
    bot = new TelegramBot(config.token);
} catch (error) {
    console.error("Failed to initialize Telegram bot:", error);
}

// Create an Express app
const app = express();
app.use(bodyParser.json());

// Define webhook endpoint for Telegram
app.post(`/bot${config.token}`, (req, res) => {
    bot?.processUpdate(req.body);
    res.sendStatus(200);
});

// Health check endpoint
app.get('/', (req, res) => {
    res.send('Bot is running!!!  that is great!');
});

// Handle '/start' command to request phone number
bot?.onText(/\/start/, (msg) => requestPhoneNumber(bot as TelegramBot, msg));

// Handle contact share for phone number verification
bot?.on('contact', (msg) => handleContactShare(bot as TelegramBot, msg));

// Handle callback queries for additional options
bot?.on('callback_query', (callbackQuery) => handleAdditionalOptions(bot as TelegramBot, callbackQuery));

// Start Express server and set webhook
app.listen(config.port, async () => {
    console.log(`Server is running on port ${config.port}`);

    try {
        const webHookUrl = `${config.webhookUrl}/bot${config.token}`;
        await bot?.setWebHook(webHookUrl);
        console.log('Webhook has been set successfully');
        console.log(webHookUrl);
    } catch (error) {
        console.error('Error setting webhook: ', error);
    }

});
