const mineflayer = require('mineflayer');
const express = require('express');

// --- Web Server (Keeps Render awake) ---
const app = express();
app.get('/', (req, res) => res.send('Bot is active.'));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Web server listening on port ${PORT}`));

// --- Bot Configuration ---
const config = {
    host: 'fun.kelmora.cloud',
    port: 25581,
    username: 'Obanai_Iguro1479',
    password: 'Aniket@1479',
    auth: 'offline'
};

function createBot() {
    const bot = mineflayer.createBot(config);

    bot.on('message', (jsonMsg) => {
        const text = jsonMsg.toString();
        console.log(text);

        // Detect login prompt
        if (text.includes('login') || text.includes('password')) {
            setTimeout(() => {
                bot.chat(`/login ${config.password}`);
                console.log('Login command sent.');
                
                // Wait to ensure login is processed before switching server
                setTimeout(() => {
                    bot.chat('/server survival');
                    console.log('Server switch command sent.');
                }, 4000);
            }, 2000);
        }
    });

    bot.on('spawn', () => {
        console.log('Bot has spawned.');
        
        // Basic Anti-AFK: Jump every 5 minutes
        setInterval(() => {
            bot.setControlState('jump', true);
            setTimeout(() => bot.setControlState('jump', false), 500);
        }, 300000);
    });

    bot.on('end', (reason) => {
        console.log(`Disconnected: ${reason}. Reconnecting in 5 seconds...`);
        setTimeout(createBot, 5000);
    });

    bot.on('error', (err) => console.log('Bot Error:', err));
}

createBot();
