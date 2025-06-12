// Import thư viện của OpenAI
const { OpenAI } = require('openai');

// Khởi tạo client cho OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function callGeminiAPI(prompt) {
    const API_KEY = process.env.GEMINI_API_KEY;
    if (!API_KEY) {
        throw new Error("GEMINI_API_KEY is not set.");
    }
    // ---- SỬ DỤNG MODEL PRO THEO YÊU CẦU CỦA BẠN ----
    const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${API_KEY}`;

    console.log("Making real API call to Gemini with model gemini-1.5-pro...");

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            })
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`API call failed with status ${response.status}: ${errorBody}`);
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw error;
    }
}

async function analyzeCharactersWithAI(text) {
    const prompt = `Analyze the following text and identify all characters, their relationships, and key attributes. Return the result as a valid JSON object only, with no other text before or after it. JSON structure should be: { "characters": [ { "name": "Character Name", "description": "Short description", "relationships": [...] } ] }. Text to analyze: ${text.substring(0, 5000)}`;
    const jsonString = await callGeminiAPI(prompt);

    try {
        const cleanedJsonString = jsonString.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanedJsonString);
    } catch (e) {
        console.error("Failed to parse JSON response from AI:", jsonString);
        return { error: "AI did not return valid JSON.", rawResponse: jsonString };
    }
}

// Hàm gọi OpenAI giữ nguyên để dùng sau
async function callOpenAI_GPT4o(prompt) {
    // ...
}

module.exports = { 
    analyzeCharactersWithAI, 
    callGeminiAPI,
    callOpenAI_GPT4o
};
