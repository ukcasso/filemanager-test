import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [selectedFiles, setSelectedFiles] = useState(undefined);
  const [fileInfos, setFileInfos] = useState([]);

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

  useEffect(() => {
    axios.get("http://localhost:3030/files").then((response) => {
      setFileInfos(response.data);
    });
  }, []);

  return (
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
  );
}

export default App;
