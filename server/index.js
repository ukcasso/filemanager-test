const path = require("path");
const express = require("express");
const app = express();
const multer = require("multer");
const port = 3030;
const fs = require("fs");
const cors = require("cors");
app.use(cors());
app.use(express.static(__dirname));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // 파일 폴더 만들어주는 문자열 조합
    const tempfilePath = file.originalname;
    const cutIndex = tempfilePath.lastIndexOf("/");
    const filePath = tempfilePath.substring(0, cutIndex);
    console.log(tempfilePath, filePath);
    fs.mkdirSync(path.join(__dirname, `/uploads/${filePath}`), {
      recursive: true,
    });

    // 파일 넣기
    cb(null, path.join(__dirname, `/uploads`));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const uploadFile = multer({
  preservePath: true,
  storage: storage,
  limits: { fileSize: 1000000 },
}).single("file");

app.post("/upload", uploadFile, function (req, res, next) {
  console.log();
  console.log(req.file.filename);
  res.send({
    fileName: req.file.filename,
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
