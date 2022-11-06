import "../styles/base.css";
import { ChakraProvider, Box, Divider } from "@chakra-ui/react";
import { useState, useEffect } from "react";
// import axios from "axios";
import Nav from "../components/Nav";
import Problem from "../components/Problem";
import CodeEditor from "../components/CodeEditor";
import testProblems from "../dummyFiles/test_problems.json";
import testClasses from "../dummyFiles/test_classes.json";

function App() {
  const problems = testProblems.map((p) => p);
  const classes = testClasses.map((c) => c);
  const [selectedLecture, setSelectedLecture] = useState(1);
  const [selectedProblem, setSelectedProblem] = useState(1);
  const userName = "홍길동";

  // const getProblems = async () => {
  //   try {
  //     const response = await axios.get("http://127.0.0.1:8000/api/problems/1");
  //     console.log(response.data);
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  // getProblems();
  const onChangeProblem = (value) => {
    setSelectedProblem(value);
  };

  return (
    <ChakraProvider>
      <Box className="bg">
        <Nav
          className={classes[selectedLecture - 1].name}
          deadline={classes[selectedLecture - 1].deadline}
          userName={userName}
          problems={problems}
          onChangeProblem={onChangeProblem}
        />
        <Divider borderColor="whiteAlpha.200" />
        <Problem
          explanation={problems[selectedProblem - 1].explanation}
          reference={problems[selectedProblem - 1].reference}
          testcases={problems[selectedProblem - 1].testcases}
        />
        <Box className="divider_container">
          <Divider
            orientation="vertical"
            borderColor="whiteAlpha.200"
            position="absolute"
            left="611px"
          />
        </Box>
        <CodeEditor />
        <Box className="divider_container">
          <Divider
            orientation="vertical"
            left="1370px"
            position="absolute"
            borderColor="whiteAlpha.200"
          />
        </Box>
      </Box>
    </ChakraProvider>
  );
}

export default App;
