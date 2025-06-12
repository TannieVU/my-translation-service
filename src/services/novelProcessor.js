const { getDb } = require('../config/database');
const { analyzeCharactersWithAI } = require('./aiServices');

async function processNovel(title, originalText) {
    try {
        const db = getDb();
        const novelsCollection = db.collection('novels');

        // Bước 1: Lưu thông tin truyện với trạng thái ban đầu là 'received'
        const novelDocument = {
            title: title,
            originalText: originalText, // Lưu ý: Trong thực tế có thể cần lưu file lớn ở nơi khác
            status: 'received',
            createdAt: new Date(),
        };
        const insertResult = await novelsCollection.insertOne(novelDocument);
        const novelId = insertResult.insertedId;

        console.log(`Novel "${title}" saved with ID: ${novelId}.`);

        // Bước 2: Cập nhật trạng thái thành 'processing' ngay lập tức
        await novelsCollection.updateOne(
            { _id: novelId },
            { $set: { status: 'processing', updatedAt: new Date() } }
        );

        console.log(`Job for novel ID ${novelId} status updated to 'processing'. Starting background process.`);

        // Chạy quy trình trong nền (chúng ta sẽ làm sau)
        processNovelAsync(novelId, originalText);

        // Trả về novelId để client có thể theo dõi
        return { success: true, novelId: novelId };

    } catch (error) {
        console.error("Failed to start processing:", error);
        return { success: false, error: error.message };
    }
}

async function processNovelAsync(novelId, originalText) {
    console.log(`Background processing started for Novel ID: ${novelId}`);
    // Trong tương lai, các bước phân tích sẽ nằm ở đây.
    // Ví dụ:
    // const characterData = await analyzeCharactersWithAI(originalText);
    // await db.collection('novels').updateOne({ _id: novelId }, { $set: { characterData } });

    console.log(`Job for ${novelId} finished.`);
}

module.exports = { processNovel };
