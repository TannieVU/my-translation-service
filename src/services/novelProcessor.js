const { getDb } = require('../config/database');
const { analyzeCharactersWithAI } = require('./aiServices'); // Chúng ta sẽ dùng hàm này

async function processNovel(title, originalText) {
    try {
        const db = getDb();
        const novelsCollection = db.collection('novels');

        const novelDocument = {
            title: title,
            originalText: originalText,
            status: 'received',
            createdAt: new Date(),
        };
        const insertResult = await novelsCollection.insertOne(novelDocument);
        const novelId = insertResult.insertedId;

        console.log(`Novel "${title}" saved with ID: ${novelId}.`);

        // Chạy quy trình trong nền VỚI ID THẬT
        processNovelAsync(novelId, originalText);

        return { success: true, novelId: novelId };

    } catch (error) {
        console.error("Failed to start processing:", error);
        return { success: false, error: error.message };
    }
}

// --- BÂY GIỜ CHÚNG TA VIẾT LOGIC THẬT SỰ CHO HÀM NÀY ---
async function processNovelAsync(novelId, originalText) {
    console.log(`Background processing started for Novel ID: ${novelId}`);
    const db = getDb();
    const novelsCollection = db.collection('novels');

    try {
        // Bước 1: Cập nhật trạng thái
        await novelsCollection.updateOne(
            { _id: novelId }, 
            { $set: { status: 'analyzing_characters', updatedAt: new Date() } }
        );

        // Bước 2: Gọi AI để phân tích nhân vật
        console.log(`Calling AI to analyze characters for novel ${novelId}...`);
        const characterData = await analyzeCharactersWithAI(originalText);
        console.log(`AI analysis complete for novel ${novelId}.`);

        // Bước 3: Lưu kết quả phân tích và cập nhật trạng thái
        await novelsCollection.updateOne(
            { _id: novelId },
            { $set: { 
                status: 'analysis_complete', 
                characterAnalysis: characterData, // <-- Lưu kết quả từ AI
                updatedAt: new Date() 
            }}
        );

        // ... các bước xử lý khác sẽ được thêm vào đây trong tương lai ...

        console.log(`Job for ${novelId} finished.`);

    } catch (error) {
        console.error(`Error during async processing for novel ${novelId}:`, error);
        // Nếu có lỗi, cập nhật trạng thái là 'failed'
        await novelsCollection.updateOne(
            { _id: novelId },
            { $set: { status: 'failed', error: error.message, updatedAt: new Date() } }
        );
    }
}

module.exports = { processNovel };
