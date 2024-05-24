import { EmbedBuilder } from "discord.js";
import { getTopScores } from "../utils/scoreModel.js";
import { initializeDatabase } from "../utils/db.js";

await initializeDatabase(); // Ensure database is initialized

export default {
    name: "top",
    description: "Get the top scores for a game",
    args: true,
    usage: "<game>",
    async execute(message, args) {
        const game = args[0];
        if (!game) {
            return message.reply(
                "Specify a game to get the top scores for Eg: !top rps.",
            );
        }
        const topScores = await getTopScores(game);

        if (topScores.length === 0) {
            return message.channel.send(
                `No scores found for the game ${game}.`,
            );
        }

        const embed = new EmbedBuilder()
            .setColor("#0099ff")
            .setTitle(`Top Scores for ${game}`)
            .setTimestamp();

        topScores.forEach((score, index) => {
            embed.addFields({
                name: `#${index + 1}`,
                value: `<@${score.user_id}>: ${score.score}`,
                inline: true,
            });
        });

        message.channel.send({ embeds: [embed] });
    },
};
