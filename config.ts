import dotenv from 'dotenv';

dotenv.config();

export const config = {
    token: process.env.BOT_TOKEN as string,
    webhookUrl: process.env.WEBHOOK_URL as string,
    port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
};

// Optional check for required environment variables
if (!config.token || !config.webhookUrl) {
    throw new Error("BOT_TOKEN and WEBHOOK_URL must be defined in the .env file");
}
