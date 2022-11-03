import "../styles/editor.css";
import React, { useState, useRef } from "react";
import { IconButton, Button, Select, CircularProgress, CircularProgressLabel, Box, Divider } from "@chakra-ui/react";
import { SearchIcon, DownloadIcon, CopyIcon, RepeatClockIcon } from "@chakra-ui/icons";
import Editor from "@monaco-editor/react";

const progress = {
  width: "32px",
  height: "32px"
};

function CodeEditor() {
  const editorRef = useRef(null);
  const [skeleton, setSkeleton] = useState("hello");

  const inputFile = () => {
    document.getElementById("hiddenFileInput").click();
  };

  const resetValue = () => {
    // console.log("reset");
  };

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
  };

  const copyValue = () => {
    navigator.clipboard.writeText(editorRef.current?.getValue());
    // 클립보드 복사 후 toast 출력
    // console.log(editorRef.current?.getValue());
  };

  return (
    <Box className="container">
      <Box className="header">
        <Box className="header-item">
          <IconButton
            size="32px"
            background="#718096"
            className="iconBtn"
            aria-label="Search"
            icon={<SearchIcon />}
            onClick={inputFile}
          />
          <input type="file" id="hiddenFileInput" accept=".py" style={{ display: "none" }} />
          <IconButton
            size="32px"
            background="#718096"
            className="iconBtn"
            aria-label="Reset"
            onClick={resetValue}
            icon={<RepeatClockIcon />}
          />
          <IconButton
            size="32px"
            background="#718096"
            className="iconBtn"
            aria-label="Copy"
            onClick={copyValue}
            icon={<CopyIcon />}
          />
          <IconButton
            size="32px"
            background="#718096"
            className="iconBtn"
            aria-label="Download"
            icon={<DownloadIcon />}
          />
        </Box>
        <Box className="header-item">
          <Select
            className="select"
            placeholder="Select option"
            size="sm"
            width="250px"
          >
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
            <option value="option3">Option 3</option>
          </Select>
          <Button
            className="saveBtn"
            size="sm"
            width="50px"
            backgroundColor="#38A169"
          >저장
          </Button>
          <CircularProgress value={33} size="32px" style={progress}>
            <CircularProgressLabel>1/3</CircularProgressLabel>
          </CircularProgress>
        </Box>
      </Box>
      <Divider borderColor="whiteAlpha.200" />
      <Editor
        height="calc(100% - 61px)"
        defaultLanguage="python"
        defaultValue={skeleton}
        theme="vs-dark"
        onMount={handleEditorDidMount}
      />
    </Box>
  );
}
export default CodeEditor;