import "../styles/hover.css";
import "../styles/submit.css";
import {
  Box,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";
import Graph from "./Graph";
import SubmitTab from "./SubmitTab";
import DummySubmissions from "../dummyFiles/DummySubmissions.json";

function Submit() {
  const { plagiarism } = DummySubmissions.analysis;
  const { explanation } = DummySubmissions.analysis;
  const results = DummySubmissions.result;
  const { efficiency } = DummySubmissions.analysis;
  const { readability } = DummySubmissions.analysis;
  const relatedContent = DummySubmissions.problem.related_content;
  const readabilityNames = ["mypy", "pylint", "eradicate", "radon", "pycodestyle"];
  const efficiencyNames = ["loc", "halstead", "data_flow", "control_flow"];

  const getEfficiencyScore = () => {
    let score = 0;
    for (let i = 0; i < 4; i += 1) {
      score += efficiency[efficiencyNames[i]];
    }
    return score;
  };

  const getReadabilityScore = () => {
    let score = 0;
    for (let i = 0; i < 5; i += 1) {
      score += readability[readabilityNames[i]][0];
    }
    return score;
  };

  const getScore = () => {
    let score = 0;
    for (let i = 0; i < results.length; i += 1) {
      if (results[i].is_passed) {
        score += 1;
      }
    }
    return (score * 100) / results.length;
  };

  return (
    <Box className="submit_container">
      <Accordion className="submit_accordion">
        <AccordionItem>
          <h2>
            <AccordionButton height="60px">
              <Box flex="1" textAlign="left">
                제출 결과
              </Box>
              <Box flex="1" textAlign="right" paddingRight="10px" color="red.400">
                표절율: {plagiarism}%
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel
            pb={4}
            backgroundColor="white"
            color="black"
            height="calc(100vh - 61px*4 - 3px)"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            <Box height="40%" width="100%">
              <Graph
                efficiencyScore={getEfficiencyScore()}
                readabilityScore={getReadabilityScore()}
                score={getScore()}
              />
            </Box>
            <Box height="60%" width="100%">
              <SubmitTab />
            </Box>
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <h2>
            <AccordionButton height="60px">
              <Box flex="1" textAlign="left">
                코드 설명
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel
            pb={4}
            backgroundColor="white"
            color="black"
            height="calc(100vh - 61px*4 - 3px)"
          >
            {explanation}
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <h2>
            <AccordionButton height="60px">
              <Box flex="1" textAlign="left">
                관련 자료
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel
            pb={4}
            backgroundColor="white"
            color="black"
            height="calc(100vh - 61px*4 - 3px)"
          >
            {relatedContent}
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Box>
  );
}

export default Submit;
