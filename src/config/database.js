const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI; // Đọc địa chỉ CSDL từ Config Vars của Heroku
const client = new MongoClient(uri);

let db;

async function connectToServer() {
    try {
        await client.connect();
        db = client.db('translation_db'); // Bạn có thể đặt tên CSDL ở đây
        console.log("Successfully connected to MongoDB Atlas.");
    } catch (err) {
        console.error("Failed to connect to MongoDB", err);
        process.exit(1);
    }
}

function getDb() {
    return db;
}

module.exports = { connectToServer, getDb };
