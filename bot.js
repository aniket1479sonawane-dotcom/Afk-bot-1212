const mineflayer = require('mineflayer');
const express = require('express');

// --- Web Server (Keeps hosting platform alive) ---
const app = express();
app.get('/', (req, res) => res.send('Bot is active.'));
app.listen(process.env.PORT || 3000);

// --- Bot Configuration ---
const config = {
    host: 'fun.kelmora.cloud',
    port: 25581,
    username: 'Obanai_Iguro1479',
    password: 'Aniket@1479',
    auth: 'offline'
};

function createBot() {
    console.log("Attempting to connect...");
    const bot = mineflayer.createBot(config);

    // Track state to prevent recursive reconnect loops
    let isSwitching = false;

    bot.on('message', (jsonMsg) => {
        const text = jsonMsg.toString();
        console.log("Server:", text);

        // Handle Login
        if (text.includes('login') || text.includes('password')) {
            setTimeout(() => {
                bot.chat(`/login ${config.password}`);
            }, 2000);
        }

        // Handle Server Switch
        if (text.includes('logged in') || text.includes('Welcome')) {
            if (!isSwitching) {
                isSwitching = true;
                console.log("Login successful. Switching to survival...");
                setTimeout(() => {
                    bot.chat('/server survival');
                }, 3000);
            }
        }
    });

    bot.on('spawn', () => {
        console.log('Bot spawned in the world.');
        // Anti-AFK: Jump every 5 minutes
        setInterval(() => {
            bot.setControlState('jump', true);
            setTimeout(() => bot.setControlState('jump', false), 500);
        }, 300000);
    });

    bot.on('end', (reason) => {
        console.log(`Disconnected: ${reason}. Reconnecting in 10 seconds...`);
        isSwitching = false; // Reset state
        setTimeout(createBot, 10000); // Increased wait time
    });

    bot.on('error', (err) => {
        console.log('Bot Error:', err.message);
    });
}

createBot();
