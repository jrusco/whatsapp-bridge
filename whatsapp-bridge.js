require('dotenv').config();

const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const axios = require('axios');

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;

if (!N8N_WEBHOOK_URL) {
    console.error('❌ N8N_WEBHOOK_URL environment variable is required');
    process.exit(1);
}

// Validate URL format
try {
    new URL(N8N_WEBHOOK_URL);
} catch (error) {
    console.error('❌ Invalid N8N_WEBHOOK_URL format');
    process.exit(1);
}

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

client.on('qr', (qr) => {
    console.log('🔗 Scan this QR code with your WhatsApp:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('✅ WhatsApp Web.js is ready!');
    console.log('🔗 Connected to n8n webhook:', N8N_WEBHOOK_URL);
});

client.on('message', async (message) => {
    try {
        const webhookPayload = {
            from: message.from,
            body: message.body,
            timestamp: message.timestamp,
            type: message.type,
            id: message.id._serialized
        };

        console.log('📨 Received message:', message.body);
        console.log('📤 Forwarding to n8n...');

        const response = await axios.post(N8N_WEBHOOK_URL, webhookPayload, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log('✅ Forwarded to n8n successfully');

        // Handle n8n response and send back to WhatsApp
        if (response.data && response.data.reply) {
            await message.reply(response.data.reply);
            console.log('📱 Sent reply to WhatsApp');
        }

    } catch (error) {
        console.error('❌ Error handling message:', error.message);
        await message.reply('Sorry, I encountered an error processing your message. Please try again.');
    }
});

// Error handling
client.on('auth_failure', () => {
    console.error('❌ Authentication failed');
});

client.on('disconnected', (reason) => {
    console.log('📴 WhatsApp disconnected:', reason);
});

console.log('🚀 Starting WhatsApp Web.js bridge...');
client.initialize();

