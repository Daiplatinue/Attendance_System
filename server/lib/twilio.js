import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

export const sendSMS = async (to, message) => {
  try {
    const response = await client.messages.create({
      body: message,
      from: twilioPhoneNumber,
      to: to
    });
    return response;
  } catch (error) {
    console.error('Twilio SMS Error:', error);
    throw error;
  }
};