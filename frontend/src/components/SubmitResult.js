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
  const relatedContent = DummySubmissions.problem.related_content;

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
              <Graph />
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
