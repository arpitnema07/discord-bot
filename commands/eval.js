export default {
  name: 'eval',
  description: 'Evaluates mathematical expressions',
  execute(message, args) {
    if (args.length === 0) {
      return message.reply('Please provide an expression to evaluate.');
    }

    const expression = args.join(' ');
    try {
      // Evaluate the expression securely
      const result = eval(`(function() { "use strict"; return (${expression}); })()`);
      message.reply(`The result of \`${expression}\` is \`${result}\``);
    } catch (error) {
      console.error('Error evaluating expression:', error);
      message.reply('There was an error evaluating the expression.');
    }
  },
};
