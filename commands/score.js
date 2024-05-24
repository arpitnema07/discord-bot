import { EmbedBuilder } from 'discord.js';
import { getUserScores } from '../utils/scoreModel.js';
import { initializeDatabase } from '../utils/db.js';

await initializeDatabase(); // Ensure database is initialized

export default {
    name: 'score',
    description: 'Get your scores for all games',
    async execute(message) {
        const userId = message.author.id;
        const scores = await getUserScores(userId);

        if (scores.length === 0) {
            return message.channel.send("You have no scores recorded.");
        }

        const embed = new EmbedBuilder()
            .setColor("#0099ff")
            .setTitle(`${message.author.username}'s Scores`)
            .setTimestamp();

        scores.forEach(score => {
            embed.addFields(
                { name: score.game, value: `Score: ${score.score}`, inline: true }
            );
        });

        message.channel.send({ embeds: [embed] });
    }
};
