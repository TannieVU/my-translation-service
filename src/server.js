require('dotenv').config();
const express = require('express');
const path = require('path');
const translationRoutes = require('./api/translationRoutes');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware để xử lý JSON body
app.use(express.json({ limit: '50mb' })); // Tăng giới hạn để nhận file lớn

// Phục vụ các file tĩnh từ thư mục 'public'
app.use(express.static(path.join(__dirname, '../../public')));

// Sử dụng các routes API
app.use('/api', translationRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
