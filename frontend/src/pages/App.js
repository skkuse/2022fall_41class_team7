import "../styles/base.css";
import "../styles/hover.css";
import { ChakraProvider, Box, Divider, Button, Flex } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import axios from "axios";
import Nav from "../components/Nav";
import Problem from "../components/Problem";
import CodeEditor from "../components/CodeEditor";
import testProblems from "../dummyFiles/DummyProblems.json";
import testClasses from "../dummyFiles/DummyClasses.json";
import Terminal from "../components/Terminial";

function App() {
  const problems = testProblems.map((p) => p);
  const classes = testClasses.map((c) => c);

  const [selectedClass, setSelectedClass] = useState(1);
  const [selectedProblem, setSelectedProblem] = useState(1);

  const userName = "홍길동";

  /* 나중에 API와 연결
  const [classes2, setClasses2] = useState([]);
  const [curClass, setCurClass] = useState({});
  const [curProblem, setCurProblem] = useState(null);

  const getClasses = () => {
    axios
      .get("/api/classes/", {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => setClasses2(res.data));
  };

  const getClass = () => {
    axios
      .get("/api/classes/1/", {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => setCurClass(res.data));
  };

  const getProblem = () => {
    axios
      .get("/api/problems/1/", {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        setCurProblem(res.data);
        console.log(curProblem);
      });
  };

    useEffect(() => {
    getClasses();
    getProblem();
  }, []);
  */

  const onChangeProblem = (value) => {
    setSelectedProblem(value);
  };

  return (
    <ChakraProvider>
      <Box className="bg">
        <Nav
          className={classes[selectedClass - 1].name}
          deadline={classes[selectedClass - 1].deadline}
          userName={userName}
          problems={problems}
          onChangeProblem={onChangeProblem}
        />
        <Divider borderColor="whiteAlpha.200" />
        <Box className="body_container">
          <Problem
            explanation={problems[selectedProblem - 1].explanation}
            reference={problems[selectedProblem - 1].reference}
            testcases={problems[selectedProblem - 1].testcases}
          />
          <Divider orientation="vertical" borderColor="whiteAlpha.200" />
          <CodeEditor />
          <Divider orientation="vertical" borderColor="whiteAlpha.200" />
          <Terminal />
        </Box>
      </Box>
    </ChakraProvider>
  );
}

export default App;
