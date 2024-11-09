import dotenv from 'dotenv';

dotenv.config();

export const config = {
    // Bot configuration
    token: process.env.BOT_TOKEN as string,
    webhookUrl: process.env.WEBHOOK_URL as string,
    port: process.env.PORT ? parseInt(process.env.PORT) : 3000,

    // OpenAI configuration
    openaiApiKey: process.env.OPENAI_API_KEY as string,
    orgId: process.env.ORG_ID as string | undefined,       // Optional
    projectId: process.env.PROJECT_ID as string | undefined, // Optional
};

// Optional check for required environment variables
if (!config.token || !config.webhookUrl || !config.openaiApiKey) {
    throw new Error("BOT_TOKEN, WEBHOOK_URL, and OPENAI_API_KEY must be defined in the .env file");
}
