import { Box, Text } from "@chakra-ui/react";
import PropTypes from "prop-types";
import Testcase from "./Testcase";

function Problem({ problem, explanation, reference, testcases }) {
  const testcasesNotHidden = testcases?.filter((tc) => tc.is_hidden === false);

  return (
    <Box className="problem_section">
      <Box className="probelm_container">
        <Box className="explanation_container">
          <Text className="explanation_head_text">문제설명</Text>
          <Text className="explanation_body_text">{explanation.replace(/\\n/g, "\n")}</Text>
        </Box>
        <Box className="reference_container">
          <Text className="explanation_head_text">참조 / 제약 사항</Text>
          <Text className="explanation_body_text">{reference}</Text>
        </Box>
        <Box className="testcase_section">
          <Box className="explanation_head_text">테스트케이스</Box>
          <Box className="testcase_container">
            {testcasesNotHidden?.map((tc, index) => (
              <Testcase
                problemID={problem.id}
                number={index + 1}
                title={`테스트케이스 ${index + 1}`}
                input={tc.input}
                output={tc.output}
              />
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

Problem.propTypes = {
  problem: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }).isRequired,
  explanation: PropTypes.string.isRequired,
  reference: PropTypes.string.isRequired,
  testcases: PropTypes.arrayOf(
    PropTypes.shape({
      input: PropTypes.string,
      output: PropTypes.string,
      is_hidden: PropTypes.bool.isRequired,
    })
  ).isRequired,
};

export default Problem;
