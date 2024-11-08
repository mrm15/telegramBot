import fs from 'fs';
import TelegramBot from 'node-telegram-bot-api';
import {allowedPhoneNumbers} from './userList/userList';
import {saveUnverifiedPhoneNumber} from "./userList/saveUnverifiedPhoneNumber";
import {getUnverifiedPhoneNumbers} from "./userList/getUnverifiedPhoneNumbers";


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

    void bot.sendMessage(chatId, "برای استفاده از ربات لطفا روی دکمه ی زیر کلیک کنید و روی گزینه ی  share Contact  بزنید.", options);
};

// Function to handle contact (phone number) shared by the user
export const handleContactShare = (bot: TelegramBot, msg: TelegramBot.Message) => {
    const chatId = msg.chat.id;
    const userPhoneNumber = msg.contact?.phone_number;

    if (userPhoneNumber && allowedPhoneNumbers.includes(userPhoneNumber)) {
        void bot.sendMessage(chatId, "Welcome! Your number is verified.");
        showAdditionalOptions(bot, chatId);  // Show additional options if verified
    } else {
        void bot.sendMessage(chatId, "Sorry, your phone number is not on the allowed list.");


        // Save unverified number in memory and file if it’s new
        const unverifiedPhoneNumbers = getUnverifiedPhoneNumbers()
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
