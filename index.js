import { Client, GatewayIntentBits } from "discord.js";

import dotenv from "dotenv";

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});
const add = (num1, num2) => {
  return num1 + num2;
};
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
client.login(process.env.DISCORD_SECRET);
