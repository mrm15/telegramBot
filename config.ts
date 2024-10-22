import dotenv from 'dotenv';

dotenv.config();

export const config = {
    token: process.env.BOT_TOKEN as string,
    webhookUrl: process.env.WEBHOOK_URL as string,
    port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
};


