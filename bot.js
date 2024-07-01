const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const app = express();
const port = process.env.PORT || 3000;

// Используем ваш API токен
const token = '7245711355:AAEIWNGl3RRFEAQXhUZ1aw53HbDWUR5s6dg';
const bot = new TelegramBot(token, {polling: true});

// Обработчик команды /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const welcomeMessage = `Hey @${msg.from.username}! Welcome to Omen!
Tap on the coin and see your balance rise.

Omen is a Decentralized Exchange on the Solana Blockchain. The biggest part of Omen Token TAP distribution will occur among the players here.

Got friends, relatives, co-workers?
Bring them all into the game.
More buddies, more coins.`;

  const options = {
    reply_markup: {
      inline_keyboard: [
        [{ text: "Play Now", url: "https://your-app.herokuapp.com" }],
        [{ text: "Join Community", url: "https://t.me/omen_game" }]
      ]
    }
  };

  bot.sendMessage(chatId, welcomeMessage, options);
});

// Создание простого сервера Express
app.get('/', (req, res) => {
  res.send('Your Clicker App');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
