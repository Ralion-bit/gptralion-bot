const express = require("express");
const bodyParser = require("body-parser");
const { Configuration, OpenAIApi } = require("openai");
const TelegramBot = require("node-telegram-bot-api");

const app = express();
app.use(bodyParser.json());

const OPENAI_API_KEY = "TU_OPENAI_KEY";
const TELEGRAM_TOKEN = "TU_TELEGRAM_BOT_TOKEN";

const configuration = new Configuration({
  apiKey: OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Usamos polling para que Railway mantenga vivo el bot
const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const userText = msg.text;

  try {
    const response = await openai.createChatCompletion({
      model: "gpt‑3.5‑turbo",
      messages: [
        {
          role: "system",
          content:
            "Eres un general imperial llamado GPTRalion. Hablas con arrogancia, superioridad y sabiduría. Jamás dudas, das órdenes, y eres implacable con los débiles.",
        },
        { role: "user", content: userText },
      ],
    });

    const reply = response.data.choices[0].message.content;
    await bot.sendMessage(chatId, reply);
  } catch (error) {
    console.error("Error al responder:", error.message);
    await bot.sendMessage(chatId, "Hubo un error al procesar tu mensaje.");
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Imperio activo en puerto ${port}`);
});
