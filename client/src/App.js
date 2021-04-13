import React, { useState, useEffect } from "react";
import { FileData } from "./data/filedata";
import axios from "axios";

function App() {
  const [selectedFiles, setSelectedFiles] = useState(undefined);
  const [fileInfos, setFileInfos] = useState([]);

  const [textFile, setTextFile] = useState("");
  const [textFileUrl, setTextFileUrl] = useState("");

  const [isOpenTextArea, setIsOpenTextArea] = useState(false);

  const selectFiles = (e) => {
    setSelectedFiles(e.target.files);
  };

  const upload = (file) => {
    let formData = new FormData();
    formData.append("file", file);
    return axios.post("http://localhost:3030/upload", formData);
  };

  const realUpload = (file) => {
    return upload(file)
      .then(() => {
        console.log(file.name);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const uploadFiles = (e) => {
    e.preventDefault();
    const files = Array.from(selectedFiles);
    files.map((file) => realUpload(file));
    console.log("files", files);
    files.map((item, index) => console.log(item.name, item.webkitRelativePath));
  };

  const loadFile = (url) => {
    setIsOpenTextArea(true);
    setTextFileUrl(url);
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", `http://localhost:3030/${url}`, false);
    xmlhttp.send();
    const value = xmlhttp.responseText;
    setTextFile(value);
  };

  const saveFile = () => {
    const newText = {
      text: textFile,
      url: textFileUrl,
    };

    console.log("newText", newText);
    axios
      .post("http://localhost:3030/updatefile", newText)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));

    setIsOpenTextArea(false);
  };

  useEffect(() => {
    axios
      .get("http://localhost:3030/filelist")
      .then((res) => {
        setFileInfos(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <div>
        <form onSubmit={uploadFiles}>
          <input
            type="file"
            name="file"
            multiple
            files
            webkitdirectory="true"
            onChange={selectFiles}
            required
          />
          <button type="submit">전송</button>
        </form>
      </div>
      <div className="fileList">
        {FileData.map((item, index) => (
          <ul type="square" key={index}>
            <li
              onClick={() => {
                loadFile(item.url);
              }}
            >
              {item.url}
            </li>
          </ul>
        ))}
      </div>
      {isOpenTextArea ? (
        <div className="fileContents">
          <textarea
            value={textFile}
            onChange={(e) => setTextFile(e.target.value)}
          ></textarea>
          <button onClick={saveFile}>저장</button>
        </div>
      ) : null}
    </>
  );
}

export default App;
