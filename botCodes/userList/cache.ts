import fs from 'fs';
import path from 'path';

const unverifiedPhoneNumbersPath = path.resolve(__dirname, './unverifiedPhoneNumbers.json');

// Cache and timestamp for unverified phone numbers
let cachedUnverifiedPhoneNumbers: string[] = [];
let lastLoadTime = 0;
const cacheExpiryTime = 5 * 60 * 1000; // 5 minutes

// Function to load unverified phone numbers with caching
export const getUnverifiedPhoneNumbers = () => {
    const now = Date.now();

    // Check if the cache is expired
    if (now - lastLoadTime > cacheExpiryTime || cachedUnverifiedPhoneNumbers.length === 0) {
        // Load from file
        if (fs.existsSync(unverifiedPhoneNumbersPath)) {
            const data = fs.readFileSync(unverifiedPhoneNumbersPath, 'utf8');
            cachedUnverifiedPhoneNumbers = JSON.parse(data);
            console.log("Loaded unverified phone numbers from file:", cachedUnverifiedPhoneNumbers);
        }
        lastLoadTime = now; // Update the load time
    }

    return cachedUnverifiedPhoneNumbers;
};

// Function to update the cache when a new phone number is saved
export const updateCache = (unverifiedNumbers: string[]) => {
    cachedUnverifiedPhoneNumbers = unverifiedNumbers;
    lastLoadTime = Date.now();
};
