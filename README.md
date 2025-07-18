# WhatsApp Bridge

A Node.js bridge that connects WhatsApp Web to n8n workflows via webhooks. This service receives WhatsApp messages and forwards them to your n8n webhook for automated processing.

## Features

- **WhatsApp Integration**: Uses WhatsApp Web.js to connect to WhatsApp
- **n8n Webhook Support**: Forwards messages to n8n workflows
- **QR Code Authentication**: Simple setup via QR code scanning
- **Auto-Reply**: Supports sending replies back to WhatsApp from n8n
- **Error Handling**: Robust error handling with user-friendly fallbacks

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- WhatsApp account
- n8n instance with webhook configured

## Installation

1. **Clone or download this project**

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create environment configuration**
   
   Create a `.env` file in the project root:

   ```env
   N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/whatsapp
   ```

## Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `N8N_WEBHOOK_URL` | Yes | Your n8n webhook URL for receiving WhatsApp messages |

### n8n Webhook Setup

Your n8n webhook should expect this payload structure:

```json
{
  "from": "string",
  "body": "string", 
  "timestamp": "number",
  "type": "string",
  "id": "string"
}
```

To send replies back to WhatsApp, your n8n workflow should return:

```json
{
  "reply": "Your response message"
}
```

## Usage

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

### First-Time Setup

1. Run the application
2. Scan the QR code displayed in the terminal with your WhatsApp mobile app
3. Wait for the "WhatsApp Web.js is ready!" message
4. Start sending messages to your WhatsApp number

## Project Structure

```text
├── config.js           # Configuration management
├── whatsapp-bridge.js   # Main application file
├── package.json         # Project dependencies
└── .env                 # Environment variables (create this)
```

## How It Works

1. **Authentication**: The bridge connects to WhatsApp Web using QR code authentication
2. **Message Reception**: Incoming WhatsApp messages are captured
3. **Webhook Forward**: Messages are sent to your configured n8n webhook
4. **Response Handling**: If n8n returns a reply, it's sent back to WhatsApp
5. **Error Management**: Failed requests show user-friendly error messages

## Troubleshooting

### Common Issues

- **"N8N_WEBHOOK_URL environment variable is required"**
  - Ensure your `.env` file exists and contains the webhook URL

- **"Invalid N8N_WEBHOOK_URL format"**
  - Verify your webhook URL is properly formatted (starts with http/https)

- **QR Code not appearing**
  - Check your terminal supports QR code display
  - Ensure no firewall is blocking the connection

- **Authentication failed**
  - Try deleting the `.wwebjs_auth` folder and re-scanning the QR code

### Logs

The application provides detailed console logging:

- 🔗 QR code and connection status
- ✅ Successful operations
- 📨 Incoming messages
- 📤 Webhook forwards
- ❌ Error conditions

## Security Notes

- Keep your `.env` file secure and never commit it to version control
- Use HTTPS for your n8n webhook URL
- Consider implementing authentication on your n8n webhook endpoint

## License

This project is provided as-is for educational and development purposes.
