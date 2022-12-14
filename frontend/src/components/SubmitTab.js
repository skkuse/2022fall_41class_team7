import "../styles/submit.css";
import {
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Center,
  Text,
  Circle,
} from "@chakra-ui/react";
import PropTypes from "prop-types";

function SubmitTab({ submitResult, getLines }) {
  const { testcases } = submitResult.problem;
  const results = submitResult.result;
  const { efficiency } = submitResult.analysis;
  const { readability } = submitResult.analysis;
  const readabilityNames = ["mypy", "pylint", "eradicate", "radon", "pycodestyle"];
  const answerCode = submitResult.problem.answer_code;
  const { code } = submitResult;

  return (
    <Tabs isFitted variant="enclosed" height="100%">
      <TabList mb="1em">
        <Tab fontSize="14px">기능 점수 확인</Tab>
        <Tab fontSize="14px">효율 점수 확인</Tab>
        <Tab fontSize="14px">가독성 점수 확인</Tab>
      </TabList>
      <TabPanels className="tab_panels">
        <TabPanel>
          <Center display="flex" flexDir="column">
            {testcases.map((tc, index) => (
              <Box className="tab_element">
                <Box className="tab_element_header">
                  <Box display="flex" alignItems="center" gap="8px">
                    <Circle size="10px" bg="blue.300" /> 테스트케이스 - {index + 1}
                  </Box>
                  <Box marginLeft="auto">
                    {results[index].is_passed ? <Text>통과</Text> : <Text>실패</Text>}
                  </Box>
                </Box>
                {results[index].is_passed ? null : (
                  <Box className="tab_element_body">
                    <Text>Input: {results[index].input}</Text>
                    <Text>Output: {results[index].output}</Text>
                    <Text>Your Output: {results[index].user_output}</Text>
                  </Box>
                )}
              </Box>
            ))}
          </Center>
        </TabPanel>
        <TabPanel>
          <Center display="flex" flexDir="column">
            <Box className="tab_element">
              <Box className="tab_element_header">
                <Box display="flex" alignItems="center" gap="8px">
                  <Circle size="10px" bg="blue.300" /> Line of Codes
                </Box>
                <Box marginLeft="auto">{efficiency.loc}점</Box>
              </Box>
              <Box className="tab_element_body">
                <Text>Line of Correct Code: {getLines(answerCode)} lines</Text>
                <Text>Line of Your Code: {getLines(code)} lines</Text>
              </Box>
            </Box>
            <Box className="tab_element">
              <Box className="tab_element_header">
                <Box display="flex" alignItems="center" gap="8px">
                  <Circle size="10px" bg="blue.300" /> Halstead
                </Box>
                <Box marginLeft="auto">{efficiency.halstead}점</Box>
              </Box>
            </Box>
            <Box className="tab_element">
              <Box className="tab_element_header">
                <Box display="flex" alignItems="center" gap="8px">
                  <Circle size="10px" bg="blue.300" /> Data Flow Complexity
                </Box>
                <Box marginLeft="auto">{efficiency.data_flow}점</Box>
              </Box>
            </Box>
            <Box className="tab_element">
              <Box className="tab_element_header">
                <Box display="flex" alignItems="center" gap="8px">
                  <Circle size="10px" bg="blue.300" /> Control Flow Complexity
                </Box>
                <Box marginLeft="auto">{efficiency.control_flow}점</Box>
              </Box>
            </Box>
          </Center>
        </TabPanel>
        <TabPanel>
          <Center display="flex" flexDir="column">
            {readabilityNames.map((name) => (
              <Box className="tab_element">
                <Box className="tab_element_header">
                  <Box display="flex" alignItems="center" gap="8px">
                    <Circle size="10px" bg="blue.300" /> {name}
                  </Box>
                  <Box marginLeft="auto">{readability[name].score}점</Box>
                </Box>
                <Box className="tab_element_body">
                  <Text whiteSpace="pre-wrap">{readability[name].error}</Text>
                </Box>
              </Box>
            ))}
          </Center>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}

SubmitTab.propTypes = {
  submitResult: PropTypes.shape({
    id: PropTypes.number.isRequired,
    created_at: PropTypes.number.isRequired,
    problem: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      explanation: PropTypes.string.isRequired,
      reference: PropTypes.string.isRequired,
      testcases: PropTypes.arrayOf(
        PropTypes.shape({
          input: PropTypes.string,
          output: PropTypes.string,
          is_hidden: PropTypes.bool.isRequired,
        })
      ).isRequired,
      skeleton_code: PropTypes.string.isRequired,
      answer_code: PropTypes.string.isRequired,
      related_content: PropTypes.string.isRequired,
      lecture: PropTypes.number.isRequired,
    }).isRequired,
    code: PropTypes.string.isRequired,
    state: PropTypes.number.isRequired,
    result: PropTypes.arrayOf(
      PropTypes.shape({
        input: PropTypes.string,
        output: PropTypes.string,
        user_output: PropTypes.string,
        is_passed: PropTypes.bool.isRequired,
      })
    ).isRequired,
    analysis: PropTypes.shape({
      plagiarism: PropTypes.number.isRequired,
      efficiency: PropTypes.shape({
        loc: PropTypes.number.isRequired,
        halstead: PropTypes.number.isRequired,
        data_flow: PropTypes.number.isRequired,
        control_flow: PropTypes.number.isRequired,
      }).isRequired,
      readability: PropTypes.shape({
        mypy: PropTypes.shape({
          score: PropTypes.number.isRequired,
          error: PropTypes.string.isRequired,
        }).isRequired,
        pylint: PropTypes.shape({
          score: PropTypes.number.isRequired,
          error: PropTypes.string.isRequired,
        }).isRequired,
        eradicate: PropTypes.shape({
          score: PropTypes.number.isRequired,
          error: PropTypes.string.isRequired,
        }).isRequired,
        radon: PropTypes.shape({
          score: PropTypes.number.isRequired,
          error: PropTypes.string.isRequired,
        }).isRequired,
        pycodestyle: PropTypes.shape({
          score: PropTypes.number.isRequired,
          error: PropTypes.string.isRequired,
        }).isRequired,
      }).isRequired,
      explanation: PropTypes.bool.isRequired,
    }).isRequired,
    user: PropTypes.number.isRequired,
  }).isRequired,
  getLines: PropTypes.func.isRequired,
};

export default SubmitTab;
