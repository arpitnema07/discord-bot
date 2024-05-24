import { EmbedBuilder } from "discord.js";
import {addScore} from "../utils/scoreModel.js";


export default {
  name: "rps",
  description: "Play Rock-Paper-Scissors with the bot",
  async execute(message) {
    const choices = ["rock", "paper", "scissors"];
    const emojis = {
      rock: "✊",
      paper: "🖐️",
      scissors: "✌️",
      stop: "❌",
    };

    let playing = true;
    let wins = 0;
    let losses = 0;
    let ties = 0;

    while (playing) {
      const embed = new EmbedBuilder()
        .setColor("#0099ff")
        .setTitle("Rock-Paper-Scissors")
        .setDescription(
          "React with your choice! To stop playing, react with ❌.",
        )
        .addFields(
          { name: "✊", value: "Rock", inline: true },
          { name: "🖐️", value: "Paper", inline: true },
          { name: "✌️", value: "Scissors", inline: true },
        )
        .setTimestamp();

      const gameMessage = await message.channel.send({ embeds: [embed] });

      // Add reaction emojis
      await gameMessage.react(emojis.rock);
      await gameMessage.react(emojis.paper);
      await gameMessage.react(emojis.scissors);
      await gameMessage.react(emojis.stop);

      const filter = (reaction, user) => {
        return (
          Object.values(emojis).includes(reaction.emoji.name) &&
          user.id === message.author.id
        );
      };

      const collector = gameMessage.createReactionCollector({
        filter,
        max: 1,
        time: 30000,
      });

      collector.on("collect", (reaction) => {
        const userChoice = Object.keys(emojis).find(
          (key) => emojis[key] === reaction.emoji.name,
        );

        if (userChoice === "stop") {
          playing = false;
          const stopEmbed = new EmbedBuilder()
            .setColor("#ff0000")
            .setTitle("Game Stopped")
            .setDescription(
              `Thanks for playing! Your final score is: Wins: ${wins}, Losses: ${losses}, Ties: ${ties}`,
            );
          message.channel.send({ embeds: [stopEmbed] });
          const totalScore = wins - losses; // Example scoring logic
          
          return addScore(message.author.id, 'Rock-Paper-Scissors', totalScore);
        }

        const botChoice = choices[Math.floor(Math.random() * choices.length)];

        let result;
        if (userChoice === botChoice) {
          result = "It's a tie!";
          ties++;
        } else if (
          (userChoice === "rock" && botChoice === "scissors") ||
          (userChoice === "paper" && botChoice === "rock") ||
          (userChoice === "scissors" && botChoice === "paper")
        ) {
          result = "You win!";
          wins++;
        } else {
          result = "You lose!";
          losses++;
        }
        const resultEmbed = new EmbedBuilder()
          .setColor("#00ff00")
          .setTitle("Rock-Paper-Scissors Result")
          .setDescription(
            `You chose ${userChoice} ${emojis[userChoice]}, I chose ${botChoice} ${emojis[botChoice]}.`,
          )
          .addFields(
            { name: "Result", value: result },
            { name: "Wins", value: `${wins}`, inline: true },
            { name: "Losses", value: `${losses}`, inline: true },
            { name: "Ties", value: `${ties}`, inline: true },
          )
          .setTimestamp();

        message.channel.send({ embeds: [resultEmbed] });
      });

      collector.on("end", (collected) => {
        if (collected.size === 0) {
          message.reply("Time's up! You didn't make a choice.");
          playing = false;
          const totalScore = wins - losses; // Example scoring logic
          addScore(message.author.id, 'Rock-Paper-Scissors', totalScore);
        }
      });

      // Wait for the collector to finish before continuing
      await new Promise((resolve) => collector.on("end", resolve));
    }
  },
};
