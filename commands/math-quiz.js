import { EmbedBuilder } from "discord.js";

import {addScore} from "../utils/scoreModel.js";

class MathQuiz {
  getQuiz() {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const operator = ["+", "-", "*", "/"][Math.floor(Math.random() * 4)];
    let question;
    let correctAnswer;

    switch (operator) {
      case "+":
        question = `${num1} + ${num2}`;
        correctAnswer = num1 + num2;
        break;
      case "-":
        question = `${num1} - ${num2}`;
        correctAnswer = num1 - num2;
        break;
      case "*":
        question = `${num1} * ${num2}`;
        correctAnswer = num1 * num2;
        break;
      case "/":
        question = `${num1 * num2} / ${num2}`;
        correctAnswer = num1;
        break;
      default:
        throw new Error("Invalid operator");
    }

    // Generate incorrect answers
    const incorrectAnswers = [];
    while (incorrectAnswers.length < 3) {
      const incorrectAnswer =
        correctAnswer + Math.floor(Math.random() * 10) - 5;
      if (
        incorrectAnswer !== correctAnswer &&
        !incorrectAnswers.includes(incorrectAnswer)
      ) {
        incorrectAnswers.push(incorrectAnswer);
      }
    }
    return { question, correctAnswer, incorrectAnswers };
  }
}

const letters = ["a", "b", "c", "d"];

export default {
  name: "math-quiz",
  description: "Play a Math quiz game with the bot",
  async execute(message) {
    const getTriviaQuestion = async () => {
      const mathQuiz = new MathQuiz();
      const { question, correctAnswer, incorrectAnswers } = mathQuiz.getQuiz();

      return {
        question: question,
        correctAnswer: correctAnswer,
        answers: [...incorrectAnswers, correctAnswer].sort(
          () => Math.random() - 0.5,
        ),
      };
    };

    let playing = true;
    let score = 0;

    const startEmbed = new EmbedBuilder()
      .setColor("#0099ff")
      .setTitle("Math Quiz Game")
      .setDescription(
        'React with the emoji corresponding to your answer choice to answer the math questions. Type "stop" to end the game.',
      )
      .setTimestamp();

    await message.channel.send({ embeds: [startEmbed] });

    while (playing) {
      const trivia = await getTriviaQuestion();
      const questionEmbed = new EmbedBuilder()
        .setColor("#0099ff")
        .setTitle("Math Question")
        .setDescription(trivia.question)
        .addFields(
          trivia.answers.map((answer, index) => ({
              name: `${letters[index]}`,
              value: answer + "",
              
          }))
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
        time: 5000,
      });

      if (!collected.size) {
        message.channel.send("Time's up! You didn't provide an answer.");
        playing = false;
        addScore(message.author.id, 'Math-Quiz', score);
        break;
      }

      const reaction = collected.first();
      if (reaction.emoji.name === "❌") {
        playing = false;
        message.channel.send(`Game stopped. Your final score is ${score}.`);
        addScore(message.author.id, 'Trivia-Quiz', score);
        break;
      }

      const choiceIndex = getEmojiIndex(reaction.emoji.name);
      const answer = trivia.answers[choiceIndex];

      if (answer === trivia.correctAnswer) {
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
        const wrongEmbed = new EmbedBuilder()
          .setColor("#ff0000")
          .setTitle("Wrong!")
          .setDescription(
            `Sorry, the correct answer was ${trivia.correctAnswer}.`,
          )
          .addFields({ name: "Score", value: `${score}`, inline: true })
          .setTimestamp();
        await message.channel.send({ embeds: [wrongEmbed] });
      }
    }
  },
};

function getEmoji(index) {
  return ["🇦", "🇧", "🇨", "🇩"][index - 1];
}

function getEmojiIndex(letter) {
  return ["🇦", "🇧", "🇨", "🇩"].indexOf(letter);
}
