import "../styles/base.css";
import { ChakraProvider, Box, Divider, Button } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import axios from "axios";
import Nav from "../components/Nav";
import Problem from "../components/Problem";
import CodeEditor from "../components/CodeEditor";
import testProblems from "../dummyFiles/DummyProblems.json";
import testClasses from "../dummyFiles/DummyClasses.json";

function App() {
  const problems = testProblems.map((p) => p);
  const classes = testClasses.map((c) => c);
  const [selectedLecture, setSelectedLecture] = useState(1);
  const [selectedProblem, setSelectedProblem] = useState(1);
  const userName = "홍길동";

  const getClasses = () => {
    axios.get("/api/classes/", {
      headers: {
        "Content-Type": "application/json",
      },
    });
    // .then((res) => console.log(res.data));
  };

  const login = () => {
    axios.defaults.withCredentials = true;
    axios.defaults.xsrfCookieName = "csrftoken";
    axios.defaults.xsrfHeaderName = "X-CSRFToken";

    axios.post(
      "/api/login/",
      { student_id: "2019315516", password: "fpdlwl*0829" },
      { headers: { "Content-Type": "application/json" } }
    );
    // .then((res) => console.log(res.data));
  };

  const onChangeProblem = (value) => {
    setSelectedProblem(value);
  };

  useEffect(() => {
    login();
    getClasses();
  }, []);

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
