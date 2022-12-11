import {
  Box,
  Button,
  CircularProgress,
  CircularProgressLabel,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import PropTypes from "prop-types";
import { useState } from "react";
import RunCode from "./modals/RunCode";
import axios from "../utils/axios";
import useMyToast from "../utils/toastUtil";
import SubmitAlert from "./modals/SubmitAlert";

const progress = {
  width: "32px",
  height: "32px",
};

function Terminal({
  submissionCapacity,
  submissionNum,
  problem,
  testcases,
  setIsTestEnded,
  setErrorInfo,
  submitLoading,
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const alert = useDisclosure();
  const getCode = () => document.getElementById("hiddenCodeValue").value;
  const toast = useMyToast();
  const [curSubmissionNum, SetCurSubmissionNum] = useState(submissionNum);

  const dt = new Date();
  const hh = dt.getHours();
  const mm = dt.getMinutes();
  const ss = dt.getSeconds();
  const tm = `${hh < 10 ? `0${hh}` : hh}:${mm < 10 ? `0${mm}` : mm}:${ss < 10 ? `0${ss}` : ss}`;

  const terminal = document.getElementById("terminal_body");
  const setTerminal = (msg, color) => {
    const cdt = new Date();
    const chh = dt.getHours();
    const cmm = dt.getMinutes();
    const css = dt.getSeconds();
    const ctm = `${chh < 10 ? `0${chh}` : chh}:${cmm < 10 ? `0${cmm}` : cmm}:${
      css < 10 ? `0${css}` : css
    }`;

    if (msg === "") {
      terminal.innerHTML += "<br/>";
      return;
    }
    const color0 = color === undefined ? "" : ` style="color:${color}"`;
    terminal.innerHTML += `<p class="chakra-text css-1kuy7z7" ${color0}">${ctm} &gt;&gt; ${msg}</p>`;

    terminal.scrollTop = terminal.scrollHeight;
  };

  async function getGrade2(testcasesID) {
    return axios
      .post(
        "grade/",
        { code: getCode() },
        {
          params: {
            problem_id: problem.id,
            testcase: testcasesID,
          },
        }
      )
      .catch((error) => {
        toast({
          title: "채점 실패",
          isClosable: true,
        });
        setTerminal("");
        setTerminal("채점 실패", "white");
      });
  }

  const getTotalGrade = async () => {
    const result = [];
    for (let i = 1; i <= testcases.length; i += 1) {
      result.push(getGrade2(i));
    }

    const result2 = await Promise.all(result).catch((e) => {
      toast({
        title: "채점 실패",
        status: "error",
      });
      setTerminal("");
      setTerminal("채점 실패", "white");
    });

    let score = 0;
    for (let i = 0; i < testcases.length; i += 1) {
      if (result2[i].data.is_passed === true) {
        score += 1;
      }
    }
    setTerminal("");
    setTerminal(`총점: ${(score * 100) / testcases.length}점`, "white");
    for (let i = 0; i < testcases.length; i += 1) {
      if (result2[i].data.is_passed === true) {
        if (!testcases[i].is_hidden) {
          setTerminal(`테스트케이스-${i + 1}: 통과`, "white");
        } else {
          setTerminal(`히든 테스트케이스-${i + 1}: 통과`, "white");
        }
      } else if (result2[i].data.is_passed === false) {
        if (!testcases[i].is_hidden) {
          setTerminal(`테스트케이스-${i + 1}: 실패`, "red");
          setTerminal(`Input: ${result2[i].data.input}`, "red");
          setTerminal(`Output: ${result2[i].data.output}`, "red");
          setTerminal(`YourOutput: ${result2[i].data.result}`, "red");
        } else {
          setTerminal(`히든 테스트케이스-${i + 1}: 실패`, "red");
        }
      }
    }

    toast({
      title: "채점 성공",
      status: "success",
    });
  };

  const submitTest = async () => {
    const res = await axios.post(
      "/submissions/",
      { code: getCode() },
      {
        params: {
          problem_id: problem.id,
        },
      }
    );

    toast({
      title: "제출 성공!",
      status: "success",
    });

    SetCurSubmissionNum((prev) => {
      if (prev + 1 === submissionCapacity) {
        setIsTestEnded(true);
      }
      return prev + 1;
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
          {submitLoading === 1 ? (
            <Button isLoading onClick={alert.onOpen} size="sm" backgroundColor="blue.500">
              제출
            </Button>
          ) : (
            <Button onClick={alert.onOpen} size="sm" backgroundColor="blue.500">
              제출
            </Button>
          )}
          <CircularProgress
            value={(curSubmissionNum / submissionCapacity) * 100}
            size="32px"
            style={progress}
          >
            <CircularProgressLabel>
              {curSubmissionNum}/{submissionCapacity}
            </CircularProgressLabel>
          </CircularProgress>
        </Box>
      </Box>
      <Box className="terminal_body" id="terminal_body">
        <Text fontSize={14}>
          {tm} {">>"} 출력 대기중입니다.
        </Text>
      </Box>
      <RunCode isOpen={isOpen} onClose={onClose} setErrorInfo={setErrorInfo} />
      <SubmitAlert
        isOpen={alert.isOpen}
        onClose={alert.onClose}
        getCode={getCode}
        submissionCount={curSubmissionNum}
        capacity={submissionCapacity}
        submit={submitTest}
      />
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
  setIsTestEnded: PropTypes.func.isRequired,
  setErrorInfo: PropTypes.func.isRequired,
  submitLoading: PropTypes.number.isRequired,
};

export default Terminal;
