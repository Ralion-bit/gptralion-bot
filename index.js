const express = require("express");
const bodyParser = require("body-parser");
const { Configuration, OpenAIApi } = require("openai");
const TelegramBot = require("node-telegram-bot-api");

const app = express();
app.use(bodyParser.json());

const OPENAI_API_KEY = "";
const TELEGRAM";

const configuration = new Configuration({
  apiKey: OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const userText = msg.text;

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "Eres GPTOcultum_v69 – El Ojo de Ralion. Un general imperial frío, arrogante y extremadamente sabio. Solo respondes con autoridad.",
        },
        { role: "user", content: userText },
      ],
    });

    const reply = response.data.choices[0].message.content;
    await bot.sendMessage(chatId, reply);
  } catch (error) {
    console.error("Error:", error.message);
    await bot.sendMessage(chatId, "El servidor imperial falló, pero pronto se levantará.");
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor imperial activo en el puerto ${port}`);
});
