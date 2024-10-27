const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });

// 允许访问静态文件
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));

// 上传文件接口
app.post('/upload', upload.single('file'), (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).send('No file uploaded.');
  }
  const targetPath = path.join(__dirname, 'uploads', file.originalname);

  // 重命名文件
  fs.rename(file.path, targetPath, (err) => {
    if (err) return res.status(500).send('File upload failed.');
    res.send('File uploaded successfully.');
  });
});

// 获取文件列表的接口
app.get('/file-list', (req, res) => {
  const uploadDir = path.join(__dirname, 'uploads');
  fs.readdir(uploadDir, (err, files) => {
    if (err) {
      return res.status(500).send('Unable to scan files.');
    }
    res.json(files);
  });
});

// 启动服务器
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
