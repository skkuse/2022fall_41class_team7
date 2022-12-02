import "../styles/diffeditor.css";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { Box, Button } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon } from "@chakra-ui/icons";
import EditorDiff from "./CodeEditorDiff";

function CodeDiffWindow({ original, modified, closeDiff }) {
  const [isSmall, setIsSmall] = useState(true);
  const widthChange = () => {
    setIsSmall(!isSmall);
  };

  return isSmall ? (
    <Box className="diff_all_container">
      <Box className="diff_small_container_left" />
      <Box className="diff_small_container">
        <Box className="diff_header">
          수정 방안
          <Button className="diff_close_button" backgroundColor="gray.900" onClick={closeDiff}>
            <CloseIcon boxSize="10px" />
          </Button>
        </Box>
        <Box className="diff_body">
          <Button
            backgroundColor="gray.900"
            height="100%"
            borderRadius="0"
            onClick={widthChange}
            className="diffButton"
          >
            <ChevronLeftIcon boxSize="15px" />
          </Button>
          <EditorDiff original={original} modified={modified} />
        </Box>
      </Box>
      <Box className="diff_small_container_right" />
    </Box>
  ) : (
    <Box className="diff_all_container">
      <Box className="diff_large_container">
        <Box className="diff_header">
          수정 방안
          <Button className="diff_close_button" backgroundColor="gray.900" onClick={closeDiff}>
            <CloseIcon boxSize="10px" />
          </Button>
        </Box>
        <Box className="diff_body">
          <Button
            background="gray.900"
            height="100%"
            borderRadius="0"
            onClick={widthChange}
            className="diffButton"
          >
            <ChevronRightIcon boxSize="15px" />
          </Button>
          <EditorDiff original={original} modified={modified} />
        </Box>
      </Box>
      <Box className="diff_small_container_right" />
    </Box>
  );
}

CodeDiffWindow.propTypes = {
  original: PropTypes.string.isRequired,
  modified: PropTypes.string.isRequired,
  closeDiff: PropTypes.func.isRequired,
};

export default CodeDiffWindow;
