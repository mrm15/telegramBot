import { InlineKeyboardButton } from 'node-telegram-bot-api';

// Helper to create inline buttons
export const createInlineButtons = (buttons: { text: string, callback_data: string }[]): InlineKeyboardButton[] =>
    buttons.map(button => ({
        text: button.text,
        callback_data: button.callback_data,
    }));

// Create back button
export const createBackButton = (): InlineKeyboardButton[] => [{ text: '🔙 Back', callback_data: 'back_to_main' }];

// Main Menu Buttons
export const mainMenuButtons: InlineKeyboardButton[][] = [
    createInlineButtons([
        { text: '1. Get Pricelist', callback_data: 'pricelist_1' },
        { text: '2. Get Pricelist', callback_data: 'pricelist_2' },
    ]),
];

// Submenu for Pricelist 1
export const priceList1Buttons: InlineKeyboardButton[][] = [
    createInlineButtons([
        { text: '1.1 - Type1 Price', callback_data: 'price_1_1' },
        { text: '1.2 - Type2 Price', callback_data: 'price_1_2' },
    ]),
    createBackButton(),
];

// Submenu for Pricelist 2
export const priceList2Buttons: InlineKeyboardButton[][] = [
    createInlineButtons([
        { text: '2.1 - Type2.1 Subject', callback_data: 'price_2_1' },
        { text: '2.2 - Type2.2 Subject', callback_data: 'price_2_2' },
    ]),
    createBackButton(),
];
