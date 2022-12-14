import "../styles/editor.css";
import PropTypes from "prop-types";
import React, { useRef, useState, useEffect } from "react";
import {
  Box,
  Button,
  CircularProgress,
  CircularProgressLabel,
  Divider,
  IconButton,
  Select,
} from "@chakra-ui/react";
import { CopyIcon, DownloadIcon, RepeatClockIcon, ArrowUpIcon } from "@chakra-ui/icons";
import FileSaver from "file-saver";
import Editor from "@monaco-editor/react";
import axios from "../utils/axios";
import CodeDiffWindow from "./CodeDiffWindow";
import { formatEpochTime } from "../utils/dateUtil";
import useToast from "../utils/toast";

const progress = {
  width: "32px",
  height: "32px",
};

function CodeEditor({
  storageCapacity,
  problem,
  setProblem,
  skeletonCode,
  closeDiff,
  isOpenDiff,
  errorInfo,
  submittedCode,
  answerCode,
}) {
  const fileInput = useRef();
  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const selectRef = useRef(null);
  const toast = useToast();
  const [storageNum, setStorageNum] = useState(-1);
  const [decorations, setDecorations] = useState([]);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
  };
  const inputFile = () => {
    fileInput.current.value = "";
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
      title: "파일로부터 코드를 불러옵니다.",
    });
  };

  const resetValue = () => {
    editorRef.current.setValue(skeletonCode);
    toast({
      title: "코드가 초기화 되었습니다.",
    });
  };

  const copyValue = () => {
    navigator.clipboard.writeText(editorRef.current.getValue());
    toast({
      title: "코드가 클립보드에 복사되었습니다.",
    });
  };

  const downloadValue = () => {
    const codeValue = editorRef.current.getValue();
    const blob = new Blob([codeValue], {
      type: "text/python",
    });
    FileSaver.saveAs(blob, `${problem.name}.py`);
    toast({
      title: `코드가 ${problem.name}.py로 다운로드되었습니다.`,
    });
  };

  const saveStorage = async () => {
    try {
      const res = await axios.post(
        "/storages/",
        { code: editorRef.current.getValue() },
        {
          params: {
            problem_id: problem.id,
            order: storageNum,
          },
        }
      );
      selectRef.current.children[+storageNum + 1].text = `${+storageNum + 1}. ${formatEpochTime(
        res.data.updated_at
      )}`;
      setProblem((prev) => {
        const s = [...prev.storages];
        s[storageNum] = { id: res.data.id, updated_at: res.data.updated_at };
        return { ...prev, storages: s };
      });

      toast({
        title: "코드를 저장했습니다.",
        status: "success",
      });
    } catch (e) {
      toast({
        title: "코드를 저장에 실패했습니다.",
        status: "error",
      });
    }
  };

  const onChangeStorage = async (event) => {
    setStorageNum(event.target.value);
    try {
      const res = await axios.get("/storages/", {
        params: { problem_id: problem.id, order: event.target.value },
      });
      editorRef.current.setValue(res.data.code);
    } catch (e) {
      editorRef.current.setValue("");
    }
  };

  const onChangeEditor = () => {
    document.getElementById("hiddenCodeValue").value = editorRef.current.getValue();
  };

  const showErrorLine = (errorinfo) => {
    if (errorInfo.error !== "") {
      const decoration = editorRef.current.deltaDecorations(decorations, [
        {
          range: new monacoRef.current.Range(errorinfo.error_line, 1, errorinfo.error_line, 1),
          options: {
            className: "errorLine",
            glyphMarginClassName: "errorMark",
            isWholeLine: true,
            glyphMarginHoverMessage: { value: errorinfo.error },
          },
        },
      ]);
      setDecorations([...decorations, decoration]);
    }
  };

  useEffect(() => {
    if (errorInfo !== null) {
      showErrorLine(errorInfo);
    }
  }, [errorInfo]);

  return (
    <Box className="container">
      <Box className="header">
        <Box className="header-item">
          <IconButton
            size="32px"
            background="#718096"
            className="iconBtn"
            aria-label="Search"
            icon={<ArrowUpIcon />}
            onClick={inputFile}
          />
          <input
            type="file"
            id="hiddenFileInput"
            accept=".py"
            ref={fileInput}
            onChange={handleFileInput}
            hidden
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
            onClick={downloadValue}
            icon={<DownloadIcon />}
          />
        </Box>
        <Box className="header-item">
          <Select
            className="select"
            size="sm"
            bg="gray.900"
            borderColor="whiteAlpha.200"
            onChange={onChangeStorage}
            ref={selectRef}
            defaultValue="DEFAULT"
          >
            <option value="DEFAULT" disabled hidden>
              저장소 선택
            </option>
            {problem.storages.map((s, index) => (
              <option value={index} key={s.id}>
                {index + 1}. {s.id && formatEpochTime(problem.storages[index].updated_at)}
              </option>
            ))}
          </Select>
          <Button
            onClick={saveStorage}
            className="saveBtn"
            size="sm"
            width="50px"
            backgroundColor="#38A169"
          >
            저장
          </Button>
          <CircularProgress
            value={(problem.storages.filter((s) => s.id).length / storageCapacity) * 100}
            size="32px"
            style={progress}
          >
            <CircularProgressLabel>
              {problem.storages.filter((s) => s.id).length}/{storageCapacity}
            </CircularProgressLabel>
          </CircularProgress>
        </Box>
      </Box>
      <Divider borderColor="whiteAlpha.200" />
      <Editor
        height="calc(100% - 61px)"
        defaultLanguage="python"
        value={skeletonCode}
        theme="my-theme"
        options={{
          fontFamily: "I",
          fontSize: 14,
          lineHeight: 18,
          minimap: {
            enabled: false,
          },
          glyphMargin: true,
        }}
        beforeMount={(monaco) => {
          monaco.editor.defineTheme("my-theme", {
            base: "vs-dark",
            inherit: true,
            rules: [],
            colors: { "editor.background": "#1A202C" },
          });
        }}
        onMount={handleEditorDidMount}
        onChange={onChangeEditor}
      />
      <input
        type="hidden"
        id="hiddenCodeValue"
        value={!editorRef.current ? skeletonCode : editorRef.current.getValue()}
      />
      {isOpenDiff ? (
        <CodeDiffWindow original={submittedCode} modified={answerCode} closeDiff={closeDiff} />
      ) : null}
    </Box>
  );
}

CodeEditor.propTypes = {
  storageCapacity: PropTypes.number.isRequired,
  problem: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    storages: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        updated_at: PropTypes.number,
      })
    ).isRequired,
  }).isRequired,
  setProblem: PropTypes.func.isRequired,
  skeletonCode: PropTypes.string.isRequired,
  closeDiff: PropTypes.func.isRequired,
  isOpenDiff: PropTypes.bool.isRequired,
  errorInfo: PropTypes.shape({
    error: PropTypes.string,
    error_line: PropTypes.number,
  }),
  submittedCode: PropTypes.string.isRequired,
  answerCode: PropTypes.string.isRequired,
};

CodeEditor.defaultProps = {
  errorInfo: PropTypes.shape({
    error: "",
    error_line: 0,
  }),
};

export default CodeEditor;
