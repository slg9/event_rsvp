import axios from 'axios';

// Constants
const BASE_URL = 'https://api.brevo.com/v3';
const SEND_SMS_ENDPOINT = '/transactionalSMS/sms';

// Response Type
interface Response {
    reference: string;
    messageId: number;
    smsCount: number;
    usedCredits: number;
    remainingCredits: number;
}

// InputSMS Type
export interface InputSMS {
    recipient: string;
    content: string;
    sender?: string;
    type?: string;
    unicodeEnabled?: boolean;
}

// Send function to handle the API call
export async function sendSMS(input: InputSMS): Promise<Response> {
   
    const apikey = process.env.SENDINBLUE_KEY;
    
    const url = `${BASE_URL}${SEND_SMS_ENDPOINT}`;
    
    // Default values for sender and type
    const smsData = {
        ...input,
        sender: input.sender || 'EVENTZ',
        type: 'transactional',
        unicodeEnabled: input.unicodeEnabled || false,
    };

    try {
        const response = await axios.post<Response>(url, smsData, {
            headers: {
                'Content-Type': 'application/json',
                'api-key': apikey,
            },
        });

        return response.data; 
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error message:', error.message);
            if (error.response) {
                console.error('Error response data:', error.response.data);
                throw new Error(error.response.data);
            }
        }
        throw error;
    }
}


