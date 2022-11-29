import "../styles/base.css";
import "../styles/hover.css";
import { ChakraProvider, Box, Divider, Button, Flex } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "../utils/axios";
import Nav from "../components/Nav";
import Problem from "../components/Problem";
import CodeEditor from "../components/CodeEditor";
import Terminal from "../components/Terminial";
import { useUserState } from "../utils/contextProvider";

function App() {
  // const { selectedLecture } = useParams(); // 이부분 링크주소에서 변수값 가져와야함
  const { id } = useParams();
  const [problem, setProblem] = useState({});
  const [lecture, setLecture] = useState({});
  const [loading, setLoading] = useState(true);
  const { loggedUser, loggedIn } = useUserState();

  const userName = loggedUser.name; // 로그인 유저 이름 가져와야함

  const getProblem = async (problemId) => {
    const response = await axios.get(`problems/${problemId}/`, {});
    setProblem(response.data);
    setLoading(false);
  };

  const getLecture = async () => {
    const response = await axios.get(`lectures/${id}/`, {});
    setLecture(response.data);
    // getProblem(response.data.problems[0].id);
  };

  useEffect(() => {
    getLecture();
  }, []);

  useEffect(() => {
    if (Object.keys(lecture).length !== 0) {
      getProblem(lecture.problems[0].id);
    }
  }, [lecture]);

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
            problem={problem}
            setProblem={setProblem}
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
