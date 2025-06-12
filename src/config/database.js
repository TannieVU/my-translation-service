const { MongoClient, ServerApiVersion } = require('mongodb'); // <-- THAY ĐỔI Ở ĐÂY

const uri = process.env.MONGODB_URI;

// Thêm các tùy chọn kết nối theo chuẩn mới của MongoDB Atlas
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let db;

async function connectToServer() {
    try {
        await client.connect();
        db = client.db('translation_db'); 
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
