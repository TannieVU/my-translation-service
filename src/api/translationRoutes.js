const express = require('express');
const router = express.Router();
const { processNovel } = require('../services/novelProcessor');

// Route: POST /api/start-translation
router.post('/start-translation', async (req, res) => {
    try {
        const { title, originalText } = req.body;
        if (!originalText) {
            return res.status(400).json({ error: 'Missing originalText' });
        }

        // Gọi hàm xử lý chính
        const result = await processNovel(title, originalText);

        if (result.success) {
            res.status(200).json({ jobId: result.jobId, novelId: result.novelId });
        } else {
            res.status(500).json({ error: result.error });
        }
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ error: 'An internal server error occurred.' });
    }
});

module.exports = router;
