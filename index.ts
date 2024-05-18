import { Client, GatewayIntentBits } from "discord.js";
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});
const add = (num1: number, num2: number) => {
  return num1 + num2;
};
client.on("messageCreate", (message) => {
  if (message.author.bot) return;
  let s: string = message.content;
  if (s.startsWith("!sum")) {
    let st: string[] = s.split(" ");

    let num1: number = Number(st[1]);
    let num2: number = Number(st[2]);
    let res = add(num1, num2);
    message.reply("Sum is " + res);
  }
});
client.login(process.env.DISCORD_SECRET);
console.log("Hello via Bun!");
