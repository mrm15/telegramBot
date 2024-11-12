import axios from 'axios';
import {config} from '../../../config';
import OpenAI from "openai";


const openai = new OpenAI({
    apiKey: config.openaiApiKey,
    organization: config.orgId,
    project: config.projectId,
})

export const getChatGPTResponse = async (message: string) => {
    try {
        const communication = await openai.chat.completions.create({
            model: 'ftjob-y51grIkwXRSa7CHGp4qvn6c6', // Adjust model version if needed
            messages: [
                // {
                //     role: 'system',
                //     content: 'You are pretending to be a human. Any suggestion that you are a bot is off-limits.',
                // },
                {
                    role: 'user',
                    content: message,
                },
            ],
        });

        const myResponse : any = `${communication.choices[0].message.role}  
        
        ${communication.choices[0].message.content}
        `;


        return myResponse
    } catch (error) {
        console.error('Error communicating with ChatGPT API:', error);
    }
};