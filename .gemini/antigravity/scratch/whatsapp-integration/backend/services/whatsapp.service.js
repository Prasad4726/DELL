import twilioClient from '../config/twilio.js';
import Form from '../models/Form.js';

const TWILIO_WHATSAPP_NUMBER = process.env.TWILIO_WHATSAPP_NUMBER;

/**
 * Send a text message via WhatsApp
 */
export const sendTextMessage = async (to, body) => {
    try {
        const message = await twilioClient.messages.create({
            body,
            from: TWILIO_WHATSAPP_NUMBER,
            to: `whatsapp:${to}`,
        });

        return {
            success: true,
            messageSid: message.sid,
            status: message.status,
        };
    } catch (error) {
        console.error('Error sending WhatsApp message:', error);
        throw new Error(`Failed to send message: ${error.message}`);
    }
};

/**
 * Send a media message (image, document, etc.)
 */
export const sendMediaMessage = async (to, mediaUrl, caption = '') => {
    try {
        const message = await twilioClient.messages.create({
            body: caption,
            from: TWILIO_WHATSAPP_NUMBER,
            to: `whatsapp:${to}`,
            mediaUrl: [mediaUrl],
        });

        return {
            success: true,
            messageSid: message.sid,
            status: message.status,
        };
    } catch (error) {
        console.error('Error sending media message:', error);
        throw new Error(`Failed to send media: ${error.message}`);
    }
};

/**
 * Format and send a form as a WhatsApp message
 */
export const sendFormMessage = async (to, formId) => {
    try {
        const form = await Form.findById(formId);

        if (!form) {
            throw new Error('Form not found');
        }

        if (!form.isActive) {
            throw new Error('Form is not active');
        }

        // Format form as WhatsApp message
        let formMessage = `📋 *${form.name}*\n`;
        if (form.description) {
            formMessage += `${form.description}\n`;
        }
        formMessage += `\nPlease reply with the following information:\n\n`;

        form.fields.forEach((field, index) => {
            const required = field.required ? '(Required)' : '(Optional)';
            formMessage += `${index + 1}. ${field.label} ${required}\n`;

            if (field.type === 'select' || field.type === 'radio') {
                formMessage += `   Options: ${field.options.join(', ')}\n`;
            }

            if (field.placeholder) {
                formMessage += `   Example: ${field.placeholder}\n`;
            }
            formMessage += '\n';
        });

        formMessage += `\n💡 Reply with your answers numbered (e.g., 1. John Doe, 2. john@example.com)`;

        const message = await twilioClient.messages.create({
            body: formMessage,
            from: TWILIO_WHATSAPP_NUMBER,
            to: `whatsapp:${to}`,
        });

        // Increment submission count
        form.submissionCount += 1;
        await form.save();

        return {
            success: true,
            messageSid: message.sid,
            status: message.status,
            formName: form.name,
        };
    } catch (error) {
        console.error('Error sending form message:', error);
        throw new Error(`Failed to send form: ${error.message}`);
    }
};

/**
 * Parse incoming WhatsApp message from Twilio webhook
 */
export const parseIncomingMessage = (twilioPayload) => {
    const {
        From,
        To,
        Body,
        MessageSid,
        NumMedia,
        MediaUrl0,
        MediaContentType0,
    } = twilioPayload;

    // Extract phone number (remove 'whatsapp:' prefix)
    const fromPhone = From.replace('whatsapp:', '');
    const toPhone = To.replace('whatsapp:', '');

    const messageData = {
        from: fromPhone,
        to: toPhone,
        body: Body || '',
        twilioSid: MessageSid,
        direction: 'inbound',
        messageType: 'text',
        mediaUrl: null,
    };

    // Check if message has media
    if (parseInt(NumMedia) > 0) {
        messageData.mediaUrl = MediaUrl0;

        // Determine message type based on content type
        if (MediaContentType0.startsWith('image/')) {
            messageData.messageType = 'image';
        } else if (MediaContentType0.startsWith('audio/')) {
            messageData.messageType = 'audio';
        } else if (MediaContentType0.startsWith('video/')) {
            messageData.messageType = 'video';
        } else {
            messageData.messageType = 'document';
        }
    }

    // Try to parse form response (numbered format)
    if (Body && /^\d+\./.test(Body)) {
        messageData.formData = parseFormResponse(Body);
        if (messageData.formData) {
            messageData.messageType = 'form';
        }
    }

    return messageData;
};

/**
 * Parse form response from customer message
 */
const parseFormResponse = (body) => {
    try {
        const responses = {};
        const lines = body.split('\n').filter(line => line.trim());

        lines.forEach(line => {
            const match = line.match(/^(\d+)\.\s*(.+)$/);
            if (match) {
                const questionNumber = match[1];
                const answer = match[2].trim();
                responses[`field_${questionNumber}`] = answer;
            }
        });

        return Object.keys(responses).length > 0 ? responses : null;
    } catch (error) {
        console.error('Error parsing form response:', error);
        return null;
    }
};

export default {
    sendTextMessage,
    sendMediaMessage,
    sendFormMessage,
    parseIncomingMessage,
};
