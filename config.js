class Config {
    constructor() {
        this.validateEnvironment();
    }
    
    get n8nWebhookUrl() {
        return process.env.N8N_WEBHOOK_URL;
    }
    
    validateEnvironment() {
        const required = ['N8N_WEBHOOK_URL'];
        const missing = required.filter(key => !process.env[key]);
        
        if (missing.length > 0) {
            throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
        }
        
        try {
            new URL(this.n8nWebhookUrl);
        } catch (error) {
            throw new Error('Invalid N8N_WEBHOOK_URL format');
        }
    }
}

module.exports = new Config();
