const express = require("express");
const bodyParser = require("body-parser");
const { Configuration, OpenAIApi } = require("openai");
const TelegramBot = require("node-telegram-bot-api");

const app = express();
app.use(bodyParser.json());

// Claves desde variables de entorno
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

// Configuración OpenAI
const configuration = new Configuration({
  apiKey: OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Inicializar bot de Telegram
const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });

// Respuesta al recibir mensaje
bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const userMessage = msg.text;

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: userMessage }],
    });

    const reply = response.data.choices[0].message.content;
    bot.sendMessage(chatId, reply);
  } catch (error) {
    console.error("Error al responder:", error.message);
    bot.sendMessage(chatId, "Ocurrió un error al procesar tu mensaje.");
  }
});

// Puerto para mantener Railway despierto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
