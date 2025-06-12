require('dotenv').config();
const express = require('express');
const path = require('path');
const translationRoutes = require('./api/translationRoutes');
const { connectToServer } = require('./config/database'); // <-- THÊM DÒNG NÀY

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname, '../public')));
app.use('/api', translationRoutes);

// Kết nối đến CSDL trước, sau đó mới khởi động server
connectToServer().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});
