import PropTypes from "prop-types";
import { ChakraProvider, Box, Button, Text } from "@chakra-ui/react";
import { useState } from "react";
import PassTag from "./PassTag";
import FailTag from "./FailTag";

function Testcase({ title, input, output }) {
  const [result, setResult] = useState(null);
  const [myoutput, setMyoutput] = useState(0);
  const validate = () => {
    setResult(!result);
  };

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
  title: PropTypes.string.isRequired,
  input: PropTypes.string.isRequired,
  output: PropTypes.string.isRequired,
};

export default Testcase;
