import dotenv from 'dotenv';

dotenv.config();

const MONGO_URL = process.env.MONGO_URL || ''; //`mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@cluster0.menvh.mongodb.net/db`;

export const config = {
    mongo: {
        url: MONGO_URL
    }
}