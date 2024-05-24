export default {
  name: 'guess',
  description: 'Guess the number game',
  async execute(message, args) {
    if (args.length !== 2) {
      return message.reply('Please provide two numbers: the range for the game (e.g., !guess 1 100).');
    }

    const min = parseInt(args[0], 10);
    const max = parseInt(args[1], 10);
    if (isNaN(min) || isNaN(max) || min >= max) {
      return message.reply('Please provide a valid range with two numbers where the first is less than the second.');
    }

    const numberToGuess = Math.floor(Math.random() * (max - min + 1)) + min;
    let attempts = 0;

    message.reply(`I have selected a number between ${min} and ${max}. Start guessing!`);

    const filter = response => {
      return !isNaN(response.content) && response.author.id === message.author.id;
    };

    const collector = message.channel.createMessageCollector({ filter, time: 60000 }); // 1 minute to guess

    collector.on('collect', msg => {
      attempts++;
      const guess = parseInt(msg.content, 10);

      if (guess === numberToGuess) {
        msg.reply(`Congratulations! You guessed the number ${numberToGuess} in ${attempts} attempts.`);
        collector.stop('guessed');
      } else if (guess < numberToGuess) {
        msg.reply('Too low! Try again.');
      } else {
        msg.reply('Too high! Try again.');
      }
    });

    collector.on('end', (collected, reason) => {
      if (reason !== 'guessed') {
        message.reply(`Time's up! The number was ${numberToGuess}.`);
      }
    });
  },
};
