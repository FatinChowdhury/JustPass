import dotenv from "dotenv";
dotenv.config();

import { MongoClient } from "mongodb";

const MONGO_HOST = process.env.MONGO_HOST;
const MONGO_PORT = process.env.MONGO_PORT;
const MONGO_DB = process.env.MONGO_DB;
const MONGO_URL = `mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}`;

let CONN = null;
let CLIENT = null;

let mongo_conn = async () => {
    if (CONN) return CONN;

    try {
        const mongo = new MongoClient(MONGO_URL);
        await mongo.connect();
        CONN = mongo.db(MONGO_DB);
        console.log("Connected to MongoDB successfully");
        return CONN;
    }
    catch(err) {
        console.error("Unable to connect to MongoDB", err);
        process.exit(1);
    }
}

let close_connection = async() => {
    if (!CLIENT) return;
    await CLIENT.close();
    CLIENT = null; CONN = null;

    console.log("MongoDB connection closed");
}

export { mongo_conn, close_connection };