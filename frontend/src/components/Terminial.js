import { Box, Button, CircularProgress, CircularProgressLabel, Text, useDisclosure } from "@chakra-ui/react";
import RunCode from "./modals/RunCode";

const progress = {
  width: "32px",
  height: "32px",
};

function Terminal() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box className="terminal_container">
      <Box className="terminal_header">
        <Box className="terminal_btn_container">
          <Button
            size="sm"
            backgroundColor="gray.500"
            onClick={() => {
              onOpen();
            }}
          >
            실행
          </Button>
          <Button size="sm" backgroundColor="gray.500">
            채점
          </Button>
          <Button size="sm" backgroundColor="blue.500">
            제출
          </Button>
          <CircularProgress value={33} size="32px" style={progress}>
            <CircularProgressLabel>1/3</CircularProgressLabel>
          </CircularProgress>
        </Box>
      </Box>
      <Box className="terminal_body">
        <Text fontSize={14}>22:24:08 {">>"} 프로세스가 시작되었습니다.</Text>
        <Text fontSize={14}>22:24:09 {">>"} 처리중...</Text>
      </Box>
      <RunCode
        isOpen={isOpen}
        onClose={onClose}
      />
    </Box>
  );
}

export default Terminal;
