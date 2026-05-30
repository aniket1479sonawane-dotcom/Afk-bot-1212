const mineflayer = require('mineflayer');
const express = require('express');

// --- Web Server (for Render) ---
const app = express();
app.get('/', (req, res) => res.send('Bot is active.'));
app.listen(process.env.PORT || 3000);

// --- Bot Configuration ---
const config = {
    host: 'fun.kelmora.cloud',
    username: 'Obanai_Iguro1479',
    password: 'Aniket@1479', // Only needed if the server asks for /login
    auth: 'offline' 
};

function createBot() {
    const bot = mineflayer.createBot(config);

    bot.on('spawn', () => {
        console.log('Bot spawned. Waiting for login prompt...');
        
        // 1. Wait a few seconds for the server to load, then login
        setTimeout(() => {
            bot.chat(`/login ${config.password}`);
            console.log('Login command sent.');
            
            // 2. Wait a bit more, then switch to survival
            setTimeout(() => {
                bot.chat('/server survival');
                console.log('Server switch command sent.');
            }, 3000); 
        }, 2000);
    });

    bot.on('message', (jsonMsg) => {
        // Optional: Debugging - see what the server is saying
        console.log(jsonMsg.toString());
    });

    // Auto-reconnect
    bot.on('end', () => {
        console.log('Disconnected. Reconnecting...');
        setTimeout(createBot, 5000);
    });

    bot.on('error', (err) => console.log('Error:', err));
}

createBot();
