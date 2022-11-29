import {
  Box,
  Button,
  CircularProgress,
  CircularProgressLabel,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import PropTypes from "prop-types";
import RunCode from "./modals/RunCode";
import axios from "../utils/axios";

const progress = {
  width: "32px",
  height: "32px",
};

function Terminal({ submissionCapacity, submissionNum, problem, testcases }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const getCode = () => document.getElementById("hiddenCodeValue").value;
  const toast = useToast();

  async function getGrade2(testcasesID) {
    return axios.post(
      "grade/",
      { code: getCode() },
      {
        params: {
          problem_id: problem.id,
          testcase: testcasesID,
        },
      }
    );
  }

  const getTotalGrade = async () => {
    const result = [];
    for (let i = 1; i <= testcases.length; i += 1) {
      result.push(getGrade2(i));
    }
    const result2 = await Promise.all(result);

    let score = 0;
    for (let i = 0; i < testcases.length; i += 1) {
      if (result2[i].data.is_passed === true) {
        score += 1;
      }
    }

    toast({
      title: `맞은 갯수 : ${score} 개 / 총 문제수 : ${testcases.length} 개 = > ${
        (score * 100) / testcases.length
      }점`,
      isClosable: true,
      duration: 3000,
    });
  };

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
          <Button onClick={getTotalGrade} size="sm" backgroundColor="gray.500">
            채점
          </Button>
          <Button size="sm" backgroundColor="blue.500">
            제출
          </Button>
          <CircularProgress
            value={(submissionNum / submissionCapacity) * 100}
            size="32px"
            style={progress}
          >
            <CircularProgressLabel>
              {submissionNum}/{submissionCapacity}
            </CircularProgressLabel>
          </CircularProgress>
        </Box>
      </Box>
      <Box className="terminal_body" id="terminal_body">
        <Text fontSize={14}>22:24:08 {">>"} 프로세스가 시작되었습니다.</Text>
        <Text fontSize={14}>22:24:09 {">>"} 처리중...</Text>
      </Box>
      <RunCode isOpen={isOpen} onClose={onClose} />
    </Box>
  );
}

Terminal.propTypes = {
  submissionCapacity: PropTypes.number.isRequired,
  submissionNum: PropTypes.number.isRequired,
  problem: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }).isRequired,
  testcases: PropTypes.arrayOf(
    PropTypes.shape({
      input: PropTypes.string,
      output: PropTypes.string,
      is_hidden: PropTypes.bool.isRequired,
    })
  ).isRequired,
};

export default Terminal;
