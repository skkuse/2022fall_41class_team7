import { IconButton, Button, Select, CircularProgress, CircularProgressLabel, StylesProvider } from "@chakra-ui/react";
import { SearchIcon, ArrowDownIcon } from "@chakra-ui/icons";
import Editor, { DiffEditor, useMonaco, loader } from "@monaco-editor/react";

const containerStyle = {
  width: "758px",
  height: "calc(100% - 60px)",
  background: "#1A202C"
};
const navStyle = {
  display: "flex",
  justifyContent: "space-between",
  height: "60px",
  padding: "0 20px",
  background: "green"
};
const navLeft = {
  height: "inherit",
  display: "flex",
  flexDirection: "row",
  gap: "10px",
  alignItems: "center",
};
const navRight = {
  height: "inherit",
  width: "fit-content",
  display: "flex",
  flexDirection: "row",
  gap: "10px",
  alignItems: "center",
};
const IconBtn = {
  width: "32px",
  height: "32px",
  borderRadius: "6px",
  color: "#718096",
};
const select = {
  width: "250px",
  height: "32px",
  borderRadius: "6px",
};
const HUGbtn = {
  width: "50px",
  height: "32px",
  border: "none",
  borderRadius: "6px",
  padding: "10px 12px",
  background: "#38A169",
  color: "white",
};

function CodeEditor() {
  return (
    <div className="container" style={containerStyle}>
      <div className="nav" style={navStyle}>
        <div className="nav-left" style={navLeft}>
          <IconButton aria-label="Search database" icon={<SearchIcon />} style={IconBtn} />
          <IconButton aria-label="Search" icon={<SearchIcon />} style={IconBtn} />
          <IconButton aria-label="Search database" icon={<SearchIcon />} style={IconBtn} />
          <IconButton aria-label="Search database" icon={<ArrowDownIcon />} style={IconBtn} />
        </div>
        <div className="nav-right" style={navRight}>
          <Select placeholder="Select option" style={select}>
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
            <option value="option3">Option 3</option>
          </Select>
          <Button style={HUGbtn}>저장</Button>
          <CircularProgress value={40} size="32px">
            <CircularProgressLabel>1</CircularProgressLabel>
          </CircularProgress>
        </div>
      </div>
      <Editor
        height="calc( 100% - 60px )"
        defaultLanguage="python"
        defaultValue="// skeleton code"
      />
    </div>
  );
}
export default CodeEditor;