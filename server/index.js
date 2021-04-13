const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const multer = require("multer");
const port = 3030;
const fs = require("fs");
const cors = require("cors");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static("uploads"));
app.use(express.static(__dirname));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // 파일 폴더 만들어주는 문자열 조합
    const tempfilePath = file.originalname;
    const cutIndex = tempfilePath.lastIndexOf("/");
    const filePath = tempfilePath.substring(0, cutIndex);
    // 폴더 생성
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
  // 파일 이름에 경로까지 가져오는 option 하지만 폴더 생성은 되지 않는다. 폴더가 있어야만 경로에 들어감. 그래서 fs로 폴더생성
  preservePath: true,
  storage: storage,
  limits: { fileSize: 1000000 },
}).single("file");

app.post("/upload", uploadFile, function (req, res, next) {
  res.send({
    fileName: req.file.filename,
  });
});

app.post("/updatefile", (req, res) => {
  console.log("req.body", req.body);
  const { text, url } = req.body;
  fs.writeFileSync(path.join(__dirname, `/uploads/${url}`), text);
});

app.get("/filelist", (req, res) => {});

app.get("/loadfile/:fileurl", (req, res) => {
  const { fileurl } = req.params;
  const file = __dirname + fileurl;
  res.send(file);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
