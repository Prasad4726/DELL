import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

if (!accountSid || !authToken) {
    console.error('❌ Twilio credentials not found in environment variables');
    console.error('Please set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN');
}

const client = twilio(accountSid, authToken);

export default client;
