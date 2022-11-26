import "../styles/base.css";
import "../styles/hover.css";
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
  const [loading, setLoading] = useState(true);

  const userName = "홍길동"; // 로그인 정보 필요

  const getProblem = async (problemId) => {
    const response = await axios.get(`/api/problems/${problemId}/`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    setProblem(response.data);
    setLoading(false);
  };

  const getLecture = async () => {
    const response = await axios.get(`/api/lectures/${selectedLecture}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    setLecture(response.data);
    getProblem(response.data.problems[0].id);
  };

  // 임시 로그인 함수
  const login = () => {
    axios.defaults.withCredentials = true;
    axios.defaults.xsrfCookieName = "csrftoken";
    axios.defaults.xsrfHeaderName = "X-CSRFToken";

    axios.post(
      "/api/login/",
      { student_id: 2019315516, password: "rladidtjs" },
      { headers: { "Content-Type": "application/json" } }
    );
  };

  useEffect(() => {
    login();
    getLecture();
  }, []);

  const onChangeProblem = (problemId) => {
    getProblem(problemId);
  };

  return loading ? null : (
    <ChakraProvider>
      <Box className="bg">
        <Nav
          lectureName={lecture?.name}
          deadline={lecture?.deadline}
          userName={userName}
          problems={lecture?.problems}
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
          <CodeEditor
            storageCapacity={lecture?.storage_capacity}
            storages={problem?.storages}
            skeletonCode={problem?.skeleton_code}
          />
          <Divider orientation="vertical" borderColor="whiteAlpha.200" />
          <Terminal
            submissionCapacity={lecture?.submission_capacity}
            submissionNum={problem?.submissions.length}
          />
        </Box>
      </Box>
    </ChakraProvider>
  );
}

export default App;
