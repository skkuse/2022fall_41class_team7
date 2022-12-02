import "../styles/base.css";
import "../styles/hover.css";
import { ChakraProvider, Box, Divider } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "../utils/axios";
import Nav from "../components/Nav";
import Problem from "../components/Problem";
import CodeEditor from "../components/CodeEditor";
import Terminal from "../components/Terminial";
import { useUserState } from "../utils/contextProvider";
import SubmitResult from "../components/SubmitResult";
import { epochToDate } from "../utils/dateUtil";

function App() {
  const { id } = useParams();
  const [problem, setProblem] = useState({});
  const [lecture, setLecture] = useState({});
  const [loading, setLoading] = useState(true);
  const { loggedUser, loggedIn } = useUserState();
  const [isOpenDiff, setIsOpenDiff] = useState(false);
  const [isTestEnded, setIsTestEnded] = useState(false);

  const userName = loggedUser.name;

  const getProblem = async (problemId) => {
    const response = await axios.get(`problems/${problemId}/`, {});
    setProblem(response.data);
    setLoading(false);
  };

  const getLecture = async () => {
    const response = await axios.get(`lectures/${id}/`, {});
    setLecture(response.data);
    const isEnded = response.data.enrollment.is_ended;
    const deadline = epochToDate(response.data.deadline);

    if (deadline < Date.now() || isEnded) {
      setIsTestEnded(true);
      setIsOpenDiff(true);
    }
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

  const openDiff = () => {
    setIsOpenDiff(true);
  };

  const closeDiff = () => {
    setIsOpenDiff(false);
  };

  const testEnd = () => {
    // 임시로 제출 버튼 누르면 diff 열기 & 제출 결과창 나오도록
    setIsTestEnded(true);
    setIsOpenDiff(true);
  };

  return loading ? null : (
    <ChakraProvider>
      <Box className="bg">
        <Nav
          lectureName={lecture?.name}
          deadline={lecture?.deadline}
          userName={loggedIn ? userName : ""}
          problems={lecture?.problems}
          onChangeProblem={onChangeProblem}
        />
        <Divider borderColor="whiteAlpha.200" />
        <Box className="body_container">
          <Problem
            problem={problem}
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
            closeDiff={closeDiff}
            isOpenDiff={isOpenDiff}
          />
          <Divider orientation="vertical" borderColor="whiteAlpha.200" />
          {!isTestEnded ? (
            <Terminal
              submissionCapacity={lecture?.submission_capacity}
              submissionNum={problem?.submissions.length}
              problem={problem}
              testcases={problem?.testcases}
              openDiff={openDiff}
              testEnd={testEnd}
            />
          ) : (
            <SubmitResult />
          )}
        </Box>
      </Box>
    </ChakraProvider>
  );
}

export default App;
