import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

let db;

export async function initializeDatabase() {
    if (!db) {
        await client.connect();
        db = client.db('discord_games');
        await db.collection('user_scores').createIndex({ user_id: 1, game: 1 });
    }
    return db;
}

export function getDb() {
    if (!db) {
        throw new Error('Database not initialized. Call initializeDatabase first.');
    }
    return db;
}
