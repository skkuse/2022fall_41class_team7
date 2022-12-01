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
import DummySubmissions from "../dummyFiles/DummySubmissions.json";

function SubmitTab() {
  const { testcases } = DummySubmissions.problem;
  const results = DummySubmissions.result;
  const { efficiency } = DummySubmissions.analysis;
  const { readability } = DummySubmissions.analysis;
  const readabilityNames = ["mypy", "pylint", "eradicate", "radon", "pycodestyle"];

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
                <Text>Line of Correct Code: 5 lines</Text>
                <Text>Line of Your Code: 5 lines</Text>
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
                  <Box marginLeft="auto">{readability[name][0]}점</Box>
                </Box>
                <Box className="tab_element_body">
                  <Text whiteSpace="pre-wrap">{readability[name][1]}</Text>
                </Box>
              </Box>
            ))}
          </Center>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}

export default SubmitTab;
