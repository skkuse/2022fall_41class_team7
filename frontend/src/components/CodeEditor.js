import React, { useState } from "react";
import { IconButton, Button, Select, CircularProgress, CircularProgressLabel, StylesProvider } from "@chakra-ui/react";
import { SearchIcon, DownloadIcon, CopyIcon, RepeatClockIcon } from "@chakra-ui/icons";
import Editor from "@monaco-editor/react";
import "../styles/style.css";

const label = {
  color: "white",
};

const progress = {
  width: "32px",
  height: "32px"
};

function CodeEditor() {
  const [skeleton, setSkeleton] = useState("hello");

  const inputFile = () => {
    document.getElementById("hiddenFileInput").click();
  };

  return (
    <div className="container">
      <div className="header">
        <div className="header-item">
          <IconButton className="iconBtn" aria-label="Search database" icon={<SearchIcon />} onClick={inputFile} />
          <input type="file" id="hiddenFileInput" accept=".py" style={{ display: "none" }} />
          <IconButton className="iconBtn" aria-label="Search" icon={<RepeatClockIcon />} />
          <IconButton className="iconBtn" aria-label="Reset Code" icon={<CopyIcon />} />
          <IconButton className="iconBtn" aria-label="Search database" icon={<DownloadIcon />} />
        </div>
        <div className="header-item">
          <Select className="select" placeholder="Select option">
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
            <option value="option3">Option 3</option>
          </Select>
          <Button className="saveBtn">저장</Button>
          <CircularProgress value={33} size="32px" style={progress}>
            <CircularProgressLabel style={label}>1/3</CircularProgressLabel>
          </CircularProgress>
        </div>
      </div>
      <Editor
        height="90vh"
        defaultLanguage="python"
        defaultValue={skeleton}
        theme="vs-dark"
      />
    </div>
  );
}
export default CodeEditor;