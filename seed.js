import { MongoClient } from "mongodb";
import fs from "fs";

const uri =
  "mongodb+srv://arpit-file:OsYYopSW2xwx3Rqf@cluster0.jp1cm5x.mongodb.net/arpit-files?retryWrites=true&w=majority";
const client = new MongoClient(uri);

const jsonData = JSON.parse(fs.readFileSync("question.json", "utf8"));

/** Seeded Data info
 * 0   -  175 : HTML CSS and Python
 * 176 -  300 : Java and C++
 * 301 -  400 : JavaScript, React, Node, npm
 * 401 -  460 : Machine Learning and AI
 * 461 -  500 : DBMS
 */

async function seed() {
  await client.connect();
  let db = client.db("tech_trivia");

  const collection = db.collection("mcq");

  // Insert new data
  await collection.insertMany(jsonData).then(console.log);
  return;
}

seed();
