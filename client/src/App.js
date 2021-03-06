import React, { useState, useEffect } from "react";
import { FileData } from "./data/filedata";
import axios from "axios";
import "./App.css";

function App() {
  const [selectedFiles, setSelectedFiles] = useState(undefined);
  const [fileInfos, setFileInfos] = useState([]);

  const [textFile, setTextFile] = useState("");
  const [textFileUrl, setTextFileUrl] = useState("");
  const [fileTitle, setFileTitle] = useState("");

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

  const loadFile = (url, title) => {
    setIsOpenTextArea(true);
    setFileTitle(title);
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
    <div className="wallpaper">
      <div className="wrapper">
        <div>
          <h3>?????? ?????????</h3>
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
            <button type="submit">??????</button>
          </form>
        </div>
        <div className="fileListTable">
          <h3>
            ?????? ?????????<small>*?????? ?????? ????????? ?????? ?????? ??? ?????? ??????</small>
          </h3>
          <ul type="square">
            {FileData.map((item, index) => (
              <>
                <li
                  className="fileList"
                  key={index}
                  onClick={() => {
                    loadFile(item.url, item.title);
                  }}
                >
                  {item.url}
                </li>
                <div>
                  <button className="functionBtn" src={item.url}>
                    ????????????
                  </button>
                  <button className="functionBtn">??????</button>
                </div>
              </>
            ))}
          </ul>
        </div>
        {isOpenTextArea ? (
          <div className="fileContents">
            <h3>{fileTitle}</h3>
            <textarea
              value={textFile}
              onChange={(e) => setTextFile(e.target.value)}
            ></textarea>
            <button onClick={saveFile}>??????</button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default App;
