import { EmbedBuilder } from "discord.js";
import fetch from "node-fetch";
import he from "he";

import { addScore } from "../utils/scoreModel.js";

export default {
  name: "tech-quiz",
  description: "Play a Technical Trivia quiz game with the bot",
  async execute(message) {
    const getTriviaQuestion = async () => {
      const response = await fetch(
        "https://tech-trivia.onrender.com/quiz/random",
      );
      const question = await response.json();

      return {
        question: question.title,
        correctAnswer: question.correct,
        answers: question.options,
      };
    };

    let playing = true;
    let score = 0;
    let wrongAnswers = 0;
    const startEmbed = new EmbedBuilder()
      .setColor("#0099ff")
      .setTitle("Technical Quiz")
      .setDescription(
        'React with the emoji corresponding to your answer choice to answer the quiz questions. Type "stop" to end the game.',
      )
      .setTimestamp();

    await message.channel.send({ embeds: [startEmbed] });

    while (playing) {
      const trivia = await getTriviaQuestion();
      const questionEmbed = new EmbedBuilder()
        .setColor("#0099ff")
        .setTitle("Technical Trivia Question")
        .setDescription(trivia.question)
        .addFields(
          trivia.answers.map((answer, index) => ({
            name: `${index + 1}`,
            value: answer,
          })),
        )
        .setTimestamp();

      const questionMessage = await message.channel.send({
        embeds: [questionEmbed],
      });

      // Add reaction emojis
      for (let i = 0; i < trivia.answers.length; i++) {
        await questionMessage.react(getEmoji(i + 1));
      }

      await questionMessage.react("❌");

      const filter = (reaction, user) =>
        user.id === message.author.id &&
        (getEmojiIndex(reaction.emoji.name) !== -1 ||
          reaction.emoji.name === "❌");
      const collected = await questionMessage.awaitReactions({
        filter,
        max: 1,
        time: 30000,
      });

      if (!collected.size) {
        message.channel.send("Time's up! You didn't provide an answer.");
        playing = false;
        addScore(message.author.id, "Tech-Quiz", score);
        break;
      }

      const reaction = collected.first();
      if (reaction.emoji.name === "❌") {
        playing = false;
        message.channel.send(`Game stopped. Your final score is ${score}.`);
        addScore(message.author.id, "Tech-Quiz", score);
        break;
      }

      const choiceIndex = getEmojiIndex(reaction.emoji.name);
      const answer = trivia.answers[choiceIndex];

      if (answer.toLowerCase() === trivia.correctAnswer.toLowerCase()) {
        score++;
        const correctEmbed = new EmbedBuilder()
          .setColor("#00ff00")
          .setTitle("Correct!")
          .setDescription(
            `That's right! The correct answer is ${trivia.correctAnswer}.`,
          )
          .addFields({ name: "Score", value: `${score}`, inline: true })
          .setTimestamp();
        await message.channel.send({ embeds: [correctEmbed] });
      } else {
        wrongAnswers++;
        const wrongEmbed = new EmbedBuilder()
          .setColor("#ff0000")
          .setTitle("Wrong!")
          .setDescription(
            `Sorry, the correct answer was ${trivia.correctAnswer}.`,
          )
          .addFields({ name: "Score", value: `${score}`, inline: true })
          .setTimestamp();
        await message.channel.send({ embeds: [wrongEmbed] });
        if (wrongAnswers === 3) {
          playing = false;
          message.channel.send(
            `Game Ended you gave 3 wrong answers. Your final score is ${score}.`,
          );
          addScore(message.author.id, "Tech-Quiz", score);
          break;
        }
      }
    }
  },
};

function getEmoji(index) {
  return ["1️⃣", "2️⃣", "3️⃣", "4️⃣"][index - 1];
}

function getEmojiIndex(emoji) {
  return ["1️⃣", "2️⃣", "3️⃣", "4️⃣"].indexOf(emoji);
}
