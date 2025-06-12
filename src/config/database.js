const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = process.env.MONGODB_URI;

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
        // ---- THAY ĐỔI NẰM Ở ĐÂY ----
        console.error("--- DEBUG: FAILED TO CONNECT TO MONGODB ---");
        console.error(err); // In ra toàn bộ chi tiết lỗi
        // process.exit(1); // Tạm thời vô hiệu hóa dòng này để nó không tắt ngay
        // --------------------------
    }
}

function getDb() {
    return db;
}

module.exports = { connectToServer, getDb };
