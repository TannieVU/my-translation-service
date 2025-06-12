// Import thư viện của OpenAI
const { OpenAI } = require('openai');

// Khởi tạo client cho OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// --- HÀM GỌI GEMINI (giữ nguyên) ---
async function callGeminiAPI(prompt) {
    const API_KEY = process.env.GEMINI_API_KEY;
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`;

    // Trả về dữ liệu giả lập để kiểm tra
    return { "simulatedResponse": `GEMINI Response for prompt: ${prompt.substring(0, 50)}...` };
}

async function analyzeCharactersWithAI(text) {
    const prompt = `Analyze the following text and identify all characters...: ${text.substring(0, 1000)}`;
    // Hiện tại đang gọi Gemini, sau này có thể thay đổi
    return callGeminiAPI(prompt);
}

// --- HÀM MỚI ĐỂ GỌI OPENAI ---
async function callOpenAI_GPT4o(prompt) {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o", // Sử dụng mô hình gpt-4o
            messages: [{ role: "user", content: prompt }],
        });
        return response.choices[0].message.content;
    } catch (error) {
        console.error("Error calling OpenAI API:", error);
        throw new Error("Failed to call OpenAI API");
    }
}


// Xuất các hàm để nơi khác có thể dùng
module.exports = { 
    analyzeCharactersWithAI, 
    callGeminiAPI,
    callOpenAI_GPT4o // Thêm hàm mới vào
};
