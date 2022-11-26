import "../styles/editor.css";
import PropTypes from "prop-types";
import React, { useState, useRef, useEffect } from "react";
import {
  IconButton,
  Button,
  Select,
  CircularProgress,
  CircularProgressLabel,
  Box,
  Divider,
  useToast,
} from "@chakra-ui/react";
import { SearchIcon, DownloadIcon, CopyIcon, RepeatClockIcon } from "@chakra-ui/icons";
import Editor from "@monaco-editor/react";

const progress = {
  width: "32px",
  height: "32px",
};

function CodeEditor({ storageCapacity, storages, skeletonCode }) {
  const editorRef = useRef(null);
  const toast = useToast();
  const [value, setValue] = useState(skeletonCode);

  const inputFile = () => {
    document.getElementById("hiddenFileInput").click();
  };
  const handleFileInput = (event) => {
    const file = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.onload = () => {
      const code = fileReader.result;
      editorRef.current.setValue(code);
    };
    fileReader.readAsText(file);
    toast({
      title: "코드를 불러왔습니다.",
      position: "bottom-right",
      isClosable: true,
      duration: 1000,
    });
  };

  const resetValue = () => {
    editorRef.current.setValue(value);
    toast({
      title: "코드가 초기화 되었습니다.",
      position: "bottom-right",
      isClosable: true,
      duration: 1000,
    });
  };

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
  };

  const copyValue = () => {
    navigator.clipboard.writeText(editorRef.current?.getValue());
    toast({
      title: "코드가 클립보드에 복사되었습니다.",
      position: "bottom-right",
      isClosable: true,
      duration: 1000,
    });
  };

  const saveValue = () => {
    toast({
      title: "코드를 저장했습니다.",
      position: "bottom-right",
      isClosable: true,
      duration: 1000,
    });
  };
  
  const onChangeEditor = () => {
    document.getElementById("hiddenCodeValue").value = editorRef.current?.getValue();
  };

  const getUpdatedTime = (updatedAt) => {
    const updatedime = new Date(updatedAt);
    const year = updatedime.getFullYear();
    const month = updatedime.getMonth() + 1;
    const date = updatedime.getDate();
    const hours = updatedime.getHours();
    const minutes = updatedime.getMinutes();
    const seconds = updatedime.getSeconds();
    const dateToString = `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;
    return dateToString;
  };

  const [selected, setSelected] = useState(1);
  const [storageNum, setStorageNum] = useState(0);

  const onChangeStorage = (event) => {
    setSelected(event.target.value);
  };

  const getStorageNum = () => {
    const nonEmptyStorage = storages?.filter((s) => s.id != null);
    setStorageNum(nonEmptyStorage.length);
  };

  useEffect(() => {
    getStorageNum();
  }, []);

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
          <input
            type="file"
            id="hiddenFileInput"
            accept=".py"
            onChange={handleFileInput}
            style={{ display: "none" }}
          />
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
            onClick={saveValue}
            icon={<DownloadIcon />}
          />
        </Box>
        <Box className="header-item">
          <Select
            className="select"
            size="sm"
            value={selected}
            color="white"
            onChange={onChangeStorage}
          >
            {storages?.map((s, index) => (
              <option value={s.id} key={s.id}>
                {`${index + 1}. `}
                {s.id ? `${getUpdatedTime(storages[index].updated_at)}` : ""}
              </option>
            ))}
          </Select>
          <Button className="saveBtn" size="sm" width="50px" backgroundColor="#38A169">
            저장
          </Button>
          <CircularProgress
            value={(storageNum / storageCapacity) * 100}
            size="32px"
            style={progress}
          >
            <CircularProgressLabel>
              {storageNum}/{storageCapacity}
            </CircularProgressLabel>
          </CircularProgress>
        </Box>
      </Box>
      <Divider borderColor="whiteAlpha.200" />
      <Editor
        height="calc(100% - 61px)"
        defaultLanguage="python"
        defaultValue={value}
        theme="vs-dark"
        onMount={handleEditorDidMount}
        onChange={onChangeEditor}
      />
      
      <input type="hidden" id="hiddenCodeValue" value={value} />

    </Box>
  );
}

CodeEditor.propTypes = {
  storageCapacity: PropTypes.number.isRequired,
  storages: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      updated_at: PropTypes.number,
    })
  ).isRequired,
  skeletonCode: PropTypes.string.isRequired,
};

export default CodeEditor;
