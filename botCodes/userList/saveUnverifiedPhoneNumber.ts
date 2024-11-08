import fs from 'fs';
import { getUnverifiedPhoneNumbers, updateCache } from './cache';

const unverifiedPhoneNumbersPath = './unverifiedPhoneNumbers.json';

export const saveUnverifiedPhoneNumber = (phoneNumber: string) => {
    let unverifiedNumbers: string[] = getUnverifiedPhoneNumbers(); // Get the latest list

    // Add new phone number if it’s not already saved
    if (!unverifiedNumbers.includes(phoneNumber)) {
        unverifiedNumbers.push(phoneNumber);
        fs.writeFileSync(unverifiedPhoneNumbersPath, JSON.stringify(unverifiedNumbers, null, 2));

        // Update cache
        updateCache(unverifiedNumbers);
    }
};
