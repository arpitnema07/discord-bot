import { Client, GatewayIntentBits, Collection } from "discord.js";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import { initializeDatabase } from "./utils/db.js";

dotenv.config();
await initializeDatabase();
// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Discord client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
  ],
});

// Command collection
client.commands = new Collection();
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  import(filePath)
    .then((command) => {
      client.commands.set(command.default.name, command.default);
    })
    .catch((err) => console.error(`Failed to load command ${file}: ${err}`));
}

// Command handler
client.on("messageCreate", (message) => {
  const msg = message.content.toLowerCase();
  if (message.author.bot) return;

  if (msg.startsWith("bye")) {
    message.reply("Goodbye! Have a great day!");
    return;
  }
  if (msg.startsWith("khatam-karo")) {
    async function clear() {
      message.delete();
      message.channel.bulkDelete(100);
    }
    clear();
    return;
  }
  const prefix = "!"; // Command prefix
  if (!msg.startsWith(prefix)) return;

  const args = msg.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  if (!client.commands.has(commandName)) return;

  const command = client.commands.get(commandName);

  try {
    command.execute(message, args, client.commands); // Pass client.commands to the execute function
  } catch (error) {
    console.error(error);
    message.reply("There was an error executing that command.");
  }
});

// Login to Discord
client.login(process.env.DISCORD_SECRET);

// Express server to keep the bot running
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Bot is running!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
