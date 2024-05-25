import { getDb } from "./db.js";

export async function addScore(userId, game, newScore) {
    const db = getDb();
    const collection = db.collection("user_scores");

    // Find the user's existing score for the game
    const existingScore = await collection.findOne({
        user_id: userId,
        game: game,
    });

    if (existingScore) {
        // Update the score only if the new score is higher
        if (newScore > existingScore.score) {
            await collection.updateOne(
                { user_id: userId, game: game },
                { $set: { score: newScore, timestamp: new Date() } },
            );
        }
    } else {
        // Insert the new score if it doesn't exist
        await collection.insertOne({
            user_id: userId,
            game: game,
            score: newScore,
            timestamp: new Date(),
        });
    }
}

export async function getUserScores(userId) {
    const db = getDb();
    return await db
        .collection("user_scores")
        .find({ user_id: userId })
        .sort({ timestamp: -1 })
        .toArray();
}

export async function getTopScores(game, limit = 10) {
    let g = "";
    if (game === "quiz") g = "Trivia-Quiz";
    else if (game === "math-quiz") g = "Math-Quiz";
    else if (game === "rps") g = "Rock-Paper-Scissors";
    else if (game === "tq") g = "Tech-Quiz";
    const db = getDb();
    return await db
        .collection("user_scores")
        .find({ game: g })
        .sort({ score: -1 })
        .limit(limit)
        .toArray();
}
