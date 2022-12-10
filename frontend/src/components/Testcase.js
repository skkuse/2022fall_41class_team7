import PropTypes from "prop-types";
import { ChakraProvider, Box, Button, Text, useToast } from "@chakra-ui/react";
import { useState, useEffect, useRef } from "react";
import axios from "../utils/axios";
import PassTag from "./PassTag";
import FailTag from "./FailTag";
import useMyToast from "../utils/toastUtil";

function Testcase({ problemID, number, title, input, output }) {
  const [result, setResult] = useState(null);
  const [myoutput, setMyoutput] = useState(0);
  const [testcase, setTestcase] = useState(null);
  const toast = useMyToast();

  const getCode = () => document.getElementById("hiddenCodeValue").value;

  const validate = async () => {
    try {
      const res = await axios.post(
        "grade/",
        { code: getCode() },
        {
          params: {
            problem_id: problemID,
            testcase: number,
          },
        }
      );

      setTestcase(res.data);

      if (res.data.is_passed) {
        toast({
          title: "테스트케이스가 통과했습니다.",
          status: "success",
        });
      } else {
        toast({
          title: "테스트케이스가 실패했습니다.",
          status: "error",
        });
      }
    } catch (err) {
      if (err.response.status === 400) {
        toast({
          title: "코드를 입력해주세요.",
          status: "error",
        });
      }
    }
  };

  const checkValidate = () => {
    setMyoutput(testcase?.result);
    if (testcase?.is_passed === true) {
      setResult(true);
    } else {
      setResult(false);
    }
  };

  useEffect(() => {
    if (testcase !== null) {
      checkValidate();
    }
  }, [testcase]);

  useEffect(() => {
    setResult(null);
  }, [problemID]);

  return (
    <ChakraProvider>
      <Box className="testcase_content">
        <Box className="testcase_content_head">
          <Text className="testcase_title_text">{title}</Text>
          {result === true ? <PassTag /> : null}
          {result === false ? <FailTag /> : null}
          <Button
            className="button_validation"
            size="xs"
            backgroundColor="yellow.500"
            onClick={validate}
          >
            검증
          </Button>
        </Box>
        <Box className="testcase_content_body">
          <Box className="testcase_input">
            <Text className="testcase_body_text">입력: </Text>
            <Box className="num_box">{input}</Box>
          </Box>
          <Box className="testcase_output">
            <Text className="testcase_body_text">출력: </Text>
            <Box className="num_box">{output}</Box>
          </Box>
          {result === false ? (
            <Box className="testcase_my_output">
              <Text className="testcase_body_text">내 출력: </Text>
              <Box className="num_box">{myoutput}</Box>
            </Box>
          ) : null}
        </Box>
      </Box>
    </ChakraProvider>
  );
}

Testcase.propTypes = {
  problemID: PropTypes.number.isRequired,
  number: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  input: PropTypes.string.isRequired,
  output: PropTypes.string.isRequired,
};

export default Testcase;
