const { getDb } = require('../config/database'); // <-- THÊM DÒNG NÀY
const { analyzeCharactersWithAI } = require('./aiServices');

async function processNovel(title, originalText) {
    try {
        const db = getDb(); // Lấy đối tượng CSDL đã được kết nối
        const novelsCollection = db.collection('novels');

        // Lưu thông tin truyện vào CSDL
        const novelDocument = {
            title: title,
            originalText: originalText,
            status: 'received',
            createdAt: new Date(),
        };
        const result = await novelsCollection.insertOne(novelDocument);
        const novelId = result.insertedId;

        console.log(`Job for novel "${title}" received. Novel ID: ${novelId}. Starting background process.`);

        // Chạy quy trình trong nền (chúng ta sẽ làm sau)
        // processNovelAsync(novelId, originalText);

        return { success: true, novelId: novelId };

    } catch (error) {
        console.error("Failed to start processing:", error);
        return { success: false, error: error.message };
    }
}

// ... hàm processNovelAsync giữ nguyên ...
async function processNovelAsync(novelId, originalText) {
    // ...
}

module.exports = { processNovel };
