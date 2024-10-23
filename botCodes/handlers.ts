import { bot } from './bot'; // Import bot instance
import { mainMenuButtons, priceList1Buttons, priceList2Buttons } from './menus';

// Function to handle callback queries
export const handleCallbackQuery = (callbackQuery: any) => {
    const chatId = callbackQuery.message?.chat.id!;
    const messageId = callbackQuery.message?.message_id!;
    const data = callbackQuery.data;

    switch (data) {
        case 'pricelist_1':
            bot.editMessageText('Please choose from the price list 1:', {
                chat_id: chatId,
                message_id: messageId,
                reply_markup: {
                    inline_keyboard: priceList1Buttons,
                },
            });
            break;

        case 'pricelist_2':
            bot.editMessageText('Please choose from the price list 2:', {
                chat_id: chatId,
                message_id: messageId,
                reply_markup: {
                    inline_keyboard: priceList2Buttons,
                },
            });
            break;

        case 'price_1_1':
            bot.editMessageText('The price for Type 1 is $100.', {
                chat_id: chatId,
                message_id: messageId,
                reply_markup: {
                    inline_keyboard: priceList1Buttons,
                },
            });
            break;

        case 'price_1_2':
            bot.editMessageText('The price for Type 2 is $200.', {
                chat_id: chatId,
                message_id: messageId,
                reply_markup: {
                    inline_keyboard: priceList1Buttons,
                },
            });
            break;

        case 'price_2_1':
            bot.editMessageText('The price for Subject 2.1 is $150.', {
                chat_id: chatId,
                message_id: messageId,
                reply_markup: {
                    inline_keyboard: priceList2Buttons,
                },
            });
            break;

        case 'price_2_2':
            bot.editMessageText('The price for Subject 2.2 is $250.', {
                chat_id: chatId,
                message_id: messageId,
                reply_markup: {
                    inline_keyboard: priceList2Buttons,
                },
            });
            break;

        case 'back_to_main':
            bot.editMessageText('You are back to the main menu. Please select an option:', {
                chat_id: chatId,
                message_id: messageId,
                reply_markup: {
                    inline_keyboard: mainMenuButtons,
                },
            });
            break;

        default:
            bot.answerCallbackQuery(callbackQuery.id, { text: 'Unknown command!' });
    }
};
