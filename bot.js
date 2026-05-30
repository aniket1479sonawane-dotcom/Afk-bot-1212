const mineflayer = require('mineflayer');
const express = require('express');

// --- 1. Web Server (Keeps Render from sleeping) ---
const app = express();
app.get('/', (req, res) => res.send('Bot is active.'));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Web server listening on port ${PORT}`));

// --- 2. Bot Configuration ---
const config = {
    host: 'YOUR_SERVER_IP', // <--- REPLACE THIS
    port: 25565,            // Usually 25565
    username: 'YOUR_BOT_NAME',
    password: 'YOUR_PASSWORD',
    auth: 'offline'         // Change to 'microsoft' if your server is Premium
};

function createBot() {
    const bot = mineflayer.createBot(config);

    // Logs server messages to your Render console
    bot.on('message', (jsonMsg) => {
        const text = jsonMsg.toString();
        console.log(text);

        // Auto-login trigger: Looks for common login prompts
        if (text.includes('login') || text.includes('password')) {
            setTimeout(() => {
                bot.chat(`/login ${config.password}`);
                console.log('Login command sent.');
                
                // Switch server after logging in
                setTimeout(() => {
                    bot.chat('/server survival');
                    console.log('Server switch command sent.');
                }, 3000);
            }, 1000);
        }
    });

    bot.on('spawn', () => {
        console.log('Bot spawned. Waiting for server interaction...');
        // Anti-AFK: Jump every 5 minutes
        setInterval(() => {
            bot.setControlState('jump', true);
            setTimeout(() => bot.setControlState('jump', false), 500);
        }, 300000);
    });

    bot.on('end', () => {
        console.log('Disconnected. Reconnecting in 5 seconds...');
        setTimeout(createBot, 5000);
    });

    bot.on('error', (err) => console.log('Bot Error:', err));
}

createBot();
