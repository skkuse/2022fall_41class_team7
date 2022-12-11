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
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import Graph from "./Graph";
import SubmitTab from "./SubmitTab";

function Submit({ submitResult, getLines, setAnsewerCode }) {
  const { plagiarism } = submitResult.analysis;
  const { explanation } = submitResult.analysis;
  const results = submitResult.result;
  const { efficiency } = submitResult.analysis;
  const { readability } = submitResult.analysis;
  const relatedContent = submitResult.problem.related_content;
  const readabilityNames = ["mypy", "pylint", "eradicate", "radon", "pycodestyle"];
  const efficiencyNames = ["loc", "halstead", "data_flow", "control_flow"];
  const [score, setScore] = useState(0);
  const [effiScore, setEffiScore] = useState(0);
  const [readScore, setReadScore] = useState(0);

  const getEfficiencyScore = () => {
    let Escore = 0;
    for (let i = 0; i < 4; i += 1) {
      Escore += efficiency[efficiencyNames[i]];
    }

    setEffiScore(Escore);
  };

  const getReadabilityScore = () => {
    let Rscore = 0;
    for (let i = 0; i < 5; i += 1) {
      Rscore += readability[readabilityNames[i]][0];
    }
    setReadScore(Rscore);
  };

  const getScore = () => {
    let Tscore = 0;
    for (let i = 0; i < results.length; i += 1) {
      if (results[i].is_passed) {
        Tscore += 1;
      }
    }

    setScore((Tscore * 100) / results.length);
  };

  useEffect(() => {
    getEfficiencyScore();
    getReadabilityScore();
    getScore();
    setAnsewerCode(submitResult.problem.answer_code);
  }, [results]);

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
              <Graph efficiencyScore={effiScore} readabilityScore={readScore} score={score} />
            </Box>
            <Box height="60%" width="100%">
              <SubmitTab submitResult={submitResult} getLines={getLines} />
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

Submit.propTypes = {
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
        mypy: PropTypes.arrayOf(PropTypes.string).isRequired,
        pylint: PropTypes.arrayOf(PropTypes.string).isRequired,
        eradicate: PropTypes.arrayOf(PropTypes.string).isRequired,
        radon: PropTypes.arrayOf(PropTypes.string).isRequired,
        pycodestyle: PropTypes.arrayOf(PropTypes.string).isRequired,
      }).isRequired,
      explanation: PropTypes.bool.isRequired,
    }).isRequired,
    user: PropTypes.number.isRequired,
  }).isRequired,
  getLines: PropTypes.func.isRequired,
  setAnsewerCode: PropTypes.func.isRequired,
};

export default Submit;
