import TelegramBot from 'node-telegram-bot-api';
import {allowedPhoneNumbers} from './userList/userList';
import {saveUnverifiedPhoneNumber} from "./userList/saveUnverifiedPhoneNumber";
import {getUnverifiedPhoneNumbers} from "./userList/getUnverifiedPhoneNumbers";
import { getChatGPTResponse } from './services/chatgptService/chatgptService';



// Initialize unverified phone numbers array by reading from file if it exists

// Function to send the "Share Phone Number" button
export const requestPhoneNumber = (bot: TelegramBot, msg: TelegramBot.Message) => {
    const chatId = msg.chat.id;

    const options = {
        reply_markup: {
            keyboard: [
                [{
                    text: " ارسال شماره تلفن 📞",
                    request_contact: true
                }],
            ],
            resize_keyboard: true,
            one_time_keyboard: true,
        },
    };
    const name = msg.chat?.first_name
    const lastName = msg?.chat?.last_name
    const nameShow = (name && lastName) ? ( name + " " + lastName) : "کاربر "

    const message = ` 
     ${nameShow}
       عزیز،
       برای استفاده از ربات لطفا روی دکمه ی زیر کلیک کنید و روی گزینه ی  share Contact  بزنید.`
    void bot.sendMessage(chatId, message, options);
};

// Function to handle contact (phone number) shared by the user
const pendingResponses: { [chatId: number]: boolean } = {};
// Function to handle contact (phone number) shared by the user
export const handleContactShare = (bot: TelegramBot, msg: TelegramBot.Message) => {
    const chatId = msg.chat.id;
    const userPhoneNumber = msg.contact?.phone_number;

    if (userPhoneNumber && allowedPhoneNumbers.includes(userPhoneNumber)) {
        void bot.sendMessage(chatId, "به ربات هوشمند نمارنگ خوش آمدید.");

        // Set up for receiving next user message for ChatGPT
        pendingResponses[chatId] = true;  // Mark this user as expecting a message
        void bot.sendMessage(chatId, "اکنون می‌توانید پیام خود را ارسال کنید تا به ChatGPT ارسال شود.");
    } else {
        void bot.sendMessage(chatId, `
        برای استفاده از این ربات باید کاربر تایید شده ی نمارنگ باشید. 🙏
        پس از تایید مجددا 
        /start 
        بزنید.
        `);

        // Save unverified number in memory and file if it’s new
        const unverifiedPhoneNumbers = getUnverifiedPhoneNumbers();
        if (userPhoneNumber && !unverifiedPhoneNumbers.includes(userPhoneNumber)) {
            unverifiedPhoneNumbers.push(userPhoneNumber);
            console.log("Unverified phone numbers:", unverifiedPhoneNumbers);
            // Save to file
            saveUnverifiedPhoneNumber(userPhoneNumber);
        }
    }
};

// Function to show additional options (e.g., Glasses)
export const showAdditionalOptions = (bot: TelegramBot, chatId: number) => {
    const options = {
        reply_markup: {
            inline_keyboard: [
                [{text: "Glasses", callback_data: 'glasses'}],
                [{text: "Sunglasses", callback_data: 'sunglasses'}],
                [{text: "Contact Lenses", callback_data: 'contact_lenses'}],
            ],
        },
    };

    bot.sendMessage(chatId, "Choose an option:", options);
};

// Function to handle button clicks for the additional options
export const handleAdditionalOptions = (bot: TelegramBot, callbackQuery: TelegramBot.CallbackQuery) => {
    const chatId = callbackQuery.message?.chat.id;

    if (!chatId) return;

    switch (callbackQuery.data) {
        case 'glasses':
            bot.sendMessage(chatId, "You selected Glasses!");
            break;
        case 'sunglasses':
            bot.sendMessage(chatId, "You selected Sunglasses!");
            break;
        case 'contact_lenses':
            bot.sendMessage(chatId, "You selected Contact Lenses!");
            break;
        default:
            bot.sendMessage(chatId, "Unknown option selected.");
    }

    bot.answerCallbackQuery(callbackQuery.id);
};

export const handleUserMessage = async (bot: TelegramBot, msg: TelegramBot.Message) => {
    const chatId = msg.chat.id;

    // Check if user is marked as expecting a message
    if (pendingResponses[chatId]) {
        // Clear pending response state
        pendingResponses[chatId] = false;

        // Send message to ChatGPT and wait for the response
        const response = await getChatGPTResponse(msg.text || '');

        // Send ChatGPT's response back to the user
        void bot.sendMessage(chatId, response);
    }
};
