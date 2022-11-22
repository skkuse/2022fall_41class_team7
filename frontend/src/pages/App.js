import "../styles/base.css";
import { ChakraProvider, Box, Divider, Button, Flex } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import axios from "axios";
import Nav from "../components/Nav";
import Problem from "../components/Problem";
import CodeEditor from "../components/CodeEditor";
import Terminal from "../components/Terminial";

function App() {
  axios.defaults.withCredentials = true;
  axios.defaults.xsrfCookieName = "csrftoken";
  axios.defaults.xsrfHeaderName = "X-CSRFToken";

  const selectedLecture = 1;
  const [problem, setProblem] = useState({});
  const [lecture, setLecture] = useState({});

  const userName = "홍길동";

  const getProblem = (problemId) => {
    axios
      .get(`/api/problems/${problemId}/`, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setProblem(response.data);
      });
  };

  const getLecture = () => {
    axios
      .get(`/api/lectures/${selectedLecture}`, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => setLecture(response.data))
      .then(() => getProblem(1));
  };

  useEffect(() => {
    getLecture();
  }, []);

  const onChangeProblem = (problemId) => {
    getProblem(problemId);
  };

  return (
    <ChakraProvider>
      <Box className="bg">
        <Nav
          className={lecture.name}
          deadline={lecture.deadline}
          userName={userName}
          problems={lecture.problems}
          onChangeProblem={onChangeProblem}
        />
        <Divider borderColor="whiteAlpha.200" />
        <Box className="body_container">
          <Problem
            explanation={problem?.explanation}
            reference={problem?.reference}
            testcases={problem?.testcases}
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
