import "../styles/hover.css";
import "../styles/submit.css";
import {
  Box,
  Divider,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  calc,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { ResponsivePie } from "@nivo/pie";
import MyResponsivePie from "./PieGraph";

function Submit() {
  return (
    <Box className="submit_container">
      <Accordion className="submit_accordion">
        <AccordionItem>
          <h2>
            <AccordionButton height="60px">
              <Box flex="1" textAlign="left">
                제출 결과
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
            그래프
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
            코드 설명 내용
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
            관련 자료 내용
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Box>
  );
}

export default Submit;
