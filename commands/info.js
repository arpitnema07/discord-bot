import { EmbedBuilder  } from 'discord.js';

export default {
  name: 'info',
  description: 'Shows all available commands with their descriptions',
  execute(message, args, commands) {
    const commandInfo = commands.map(command => `**${command.name}:** ${command.description}`).join('\n');

    const embed = new EmbedBuilder ()
      .setColor('#0099ff')
      .setTitle('Available Commands')
      .setDescription(commandInfo)
      .setTimestamp();

    message.channel.send({ embeds: [embed] });
  },
};
