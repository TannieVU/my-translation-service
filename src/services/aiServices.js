// Import thư viện của OpenAI (giữ lại để có thể dùng trong tương lai)
const { OpenAI } = require('openai');

// Khởi tạo client cho OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Hàm gọi đến Gemini API để xử lý prompt.
 * @param {string} prompt - Nội dung prompt cần gửi đến AI.
 * @returns {Promise<string>} - Văn bản trả về từ AI.
 */
async function callGeminiAPI(prompt) {
    const API_KEY = process.env.GEMINI_API_KEY;
    if (!API_KEY) {
        throw new Error("GEMINI_API_KEY is not set.");
    }
    const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${API_KEY}`;

    console.log("Making API call to Gemini with model gemini-1.5-pro...");

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
        if (data.candidates && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0].text) {
            return data.candidates[0].content.parts[0].text;
        } else {
            throw new Error("Invalid response structure from Gemini API.");
        }

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw error;
    }
}

/**
 * Phân tích văn bản để trích xuất thông tin nhân vật và mối quan hệ.
 * @param {string} text - Đoạn văn bản cần phân tích.
 * @returns {Promise<object>} - Một đối tượng JSON chứa thông tin đã phân tích.
 */
async function analyzeCharactersWithAI(text) {
    const prompt = `
    **Bối cảnh:** Kết quả phân tích này sẽ được một AI khác sử dụng để quyết định cách dịch đại từ xưng hô trong tiếng Việt một cách tự nhiên và chính xác. Các yếu tố then chốt để chọn đại từ trong tiếng Việt bao gồm: **địa vị** (gia đình, xã hội), **tuổi tác tương đối**, **giới tính**, **thái độ**, và **văn phong** của nhân vật.

    **Yêu cầu:**

    1.  Phân tích kỹ đoạn văn bản được cung cấp.
    2.  Xác định tất cả các nhân vật và các mối quan hệ phức tạp giữa họ, tập trung vào các yếu tố ảnh hưởng đến xưng hô.
    3.  Trả về kết quả dưới dạng một đối tượng JSON **DUY NHẤT, hợp lệ**. Không thêm bất kỳ văn bản giải thích nào trước hoặc sau khối JSON.
    4.  **TOÀN BỘ** giá trị (values) trong JSON phải bằng **TIẾNG VIỆT**.
    5.  Đối với tên nhân vật, hãy chuyển tự sang **HÁN-VIỆT** và giữ lại tên gốc.

    **Cấu trúc JSON bắt buộc:**

    \`\`\`json
    {
      "characters": [
        {
          "name_vietnamese": "Tên Hán-Việt của nhân vật",
          "name_original": "Tên gốc",
          "gender": "Giới tính bằng tiếng Việt (Nam, Nữ, hoặc Không xác định)",
          "social_status": "Mô tả ngắn gọn địa vị xã hội, gia tộc, hoặc vai vế (ví dụ: Hoàng đế, Nô tì, Trưởng môn, Sư huynh)",
          "speech_style": "Mô tả phong cách ăn nói của nhân vật (ví dụ: Lễ phép, Thô lỗ, Trịnh trọng, Suồng sã, Ít nói)",
          "relationships": [
            {
              "with_character": "Tên Hán-Việt của nhân vật có quan hệ",
              "relation_type": "Bản chất mối quan hệ (ví dụ: Mẹ-con, Sư-đồ, Kẻ thù, Phu thê, Chủ-tớ)",
              "hierarchy": "Vai vế so với người kia (Bề trên, Bề dưới, Ngang hàng)",
              "attitude": "Thái độ chung đối với người kia (ví dụ: Kính trọng, Yêu thương, Căm ghét, Coi thường, Sợ hãi)"
            }
          ]
        }
      ]
    }
    \`\`\`

    **Văn bản cần phân tích:**
    ---
    ${text} 
    ---
    `; // ---->>> LỖI ĐÃ ĐƯỢC SỬA: Gỡ bỏ .substring(0, 8000)

    const jsonString = await callGeminiAPI(prompt);

    try {
        const cleanedJsonString = jsonString.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanedJsonString);
    } catch (e) {
        console.error("Failed to parse JSON response from AI:", jsonString);
        return { error: "AI did not return valid JSON.", rawResponse: jsonString };
    }
}

// Hàm gọi OpenAI giữ nguyên để dùng sau (nếu cần)
async function callOpenAI_GPT4o(prompt) {
    // ...
}

module.exports = { 
    analyzeCharactersWithAI, 
    callGeminiAPI,
    callOpenAI_GPT4o
};

