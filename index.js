import { Client, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
import express from "express";

dotenv.config();

// Initialize Discord Bot
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Define the add function
const add = (num1, num2) => {
  return num1 + num2;
};

// Set up the message listener
client.on("messageCreate", (message) => {
  if (message.author.bot) return;
  let s = message.content;
  if (s.startsWith("!sum")) {
    let st = s.split(" ");
    let num1 = Number(st[1]);
    let num2 = Number(st[2]);
    let res = add(num1, num2);
    message.reply("Sum is " + res);
  }
});

// Login to Discord
client.login(process.env.DISCORD_SECRET);

// Initialize Express Server
const app = express();
const PORT = process.env.PORT || 3000;

// Define a simple route
app.get("/", (req, res) => {
  res.send("Bot is running!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
