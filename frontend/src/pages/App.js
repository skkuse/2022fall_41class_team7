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
import useMyToast from "../utils/toastUtil";

function App() {
  const { id } = useParams();
  const [problem, setProblem] = useState({});
  const [lecture, setLecture] = useState({});
  const [loading, setLoading] = useState(true);
  const { loggedUser, loggedIn } = useUserState();
  const [isOpenDiff, setIsOpenDiff] = useState(false);
  const [isTestEnded, setIsTestEnded] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(true);
  const [errorInfo, setErrorInfo] = useState(null);
  const [lastSubmissionId, setLastSubmissionId] = useState(0);
  const toast = useMyToast();

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

    if (deadline + 9 * 60 * 60 < Date.now() || isEnded) {
      setIsTestEnded(true);
      setIsOpenDiff(true);
    }
  };

  const getSubmitResult = async (submissionId) => {
    if (submissionId === 0) {
      toast({
        title: "제출한 코드가 없습니다",
        status: "error",
      });
    } else {
      const res = await axios.get(`submissions/${submissionId}`);
      if (res.data.state < 2) getSubmitResult(submissionId);
      else {
        setSubmitResult(res.data);
      } // staet가 analyzing일 때까지 기다리기?

      // state가 complete면 get으로 가져오기???
      // submissionId를 모를 때는?
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

  useEffect(() => {
    if (isTestEnded) {
      setIsOpenDiff(true);
    }
  }, [isTestEnded]);

  useEffect(() => {
    if (submitResult !== null && submitResult.state >= 2) {
      setSubmitLoading(false);
    }
  }, [submitResult]);

  const onChangeProblem = (problemId) => {
    getProblem(problemId);
  };

  const openDiff = () => {
    setIsOpenDiff(true);
  };

  const closeDiff = () => {
    setIsOpenDiff(false);
  };

  // const testEnd = () => {
  //   // 임시로 제출 버튼 누르면 diff 열기 & 제출 결과창 나오도록
  //   setIsTestEnded(true);
  //   setIsOpenDiff(true);
  // };

  return loading ? null : (
    <ChakraProvider>
      <Box className="bg">
        <Nav
          lectureName={lecture?.name}
          lectureId={lecture?.id}
          deadline={lecture?.deadline}
          userName={loggedIn ? userName : ""}
          problems={lecture?.problems}
          onChangeProblem={onChangeProblem}
          isTestEnded={isTestEnded}
          setIsTestEnded={setIsTestEnded}
          lastSubmissionId={lastSubmissionId}
          getSubmitResult={getSubmitResult}
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
            errorInfo={errorInfo}
          />
          <Divider orientation="vertical" borderColor="whiteAlpha.200" />
          {!isTestEnded || submitLoading ? (
            <Terminal
              submissionCapacity={lecture?.submission_capacity}
              submissionNum={problem?.submissions.length}
              problem={problem}
              testcases={problem?.testcases}
              openDiff={openDiff}
              setIsTestEnded={setIsTestEnded}
              getSubmitResult={getSubmitResult}
              setErrorInfo={setErrorInfo}
              setLastSubmissionId={setLastSubmissionId}
            />
          ) : (
            <SubmitResult submitResult={submitResult} />
          )}
        </Box>
      </Box>
    </ChakraProvider>
  );
}

export default App;
