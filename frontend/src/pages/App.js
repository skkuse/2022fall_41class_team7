import "../styles/base.css";
import "../styles/hover.css";
import { Box, ChakraProvider, Divider } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../utils/axios";
import Nav from "../components/Nav";
import Problem from "../components/Problem";
import CodeEditor from "../components/CodeEditor";
import Terminal from "../components/Terminial";
import { useUserState } from "../utils/contextProvider";
import SubmitResult from "../components/SubmitResult";
import { epochToDate } from "../utils/dateUtil";
import useToast from "../utils/toast";

function App() {
  const [problem, setProblem] = useState({});
  const [lecture, setLecture] = useState({});
  const [loading, setLoading] = useState(true);
  const [isOpenDiff, setIsOpenDiff] = useState(false);
  const [isTestEnded, setIsTestEnded] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(0);
  const [errorInfo, setErrorInfo] = useState(null);
  const [answerCode, setAnsewerCode] = useState("");

  const { loggedUser, loggedIn } = useUserState();
  const { id } = useParams();
  const toast = useToast();
  const navigate = useNavigate();

  const getProblem = async (problemId) => {
    const response = await axios.get(`problems/${problemId}/`, {});
    setProblem(response.data);
    setLoading(false);
  };

  const getLecture = async () => {
    try {
      const { data } = await axios.get(`lectures/${id}/`, {});

      setLecture(data);
      const isEnded = data.enrollment.is_ended;
      const deadline = epochToDate(data.deadline);

      if (deadline < Date.now() || isEnded) {
        setIsTestEnded(true);
        setIsOpenDiff(true);
      }
    } catch (e) {
      if (e.response.status === 403) {
        alert("로그인 정보가 없습니다.");
        navigate("/");
      }
    }
  };

  const getSubmitResult = async (submissionId) => {
    setSubmitLoading(1); // 1: 로딩 중, 2: 로딩 끝남

    const res = await axios.get(`submissions/${submissionId}`);
    if (res.data.state < 3) {
      getSubmitResult(submissionId);
    } else {
      setSubmitResult(res.data);
    }
  };

  const getLastSumbitResult = async () => {
    const response = await axios.get(`problems/${problem.id}/`);
    const { submissions } = response.data;
    if (submissions.length === 0) {
      toast({
        title: "제출한 코드가 없습니다",
        status: "error",
      });
      return;
    }
    const lastSubmissionId = submissions[submissions.length - 1];
    getSubmitResult(lastSubmissionId);
  };

  const getLines = (code) => {
    let lines = 1;
    for (let i = 0; i < code.length; i += 1) {
      if (code[i] === "\n") {
        lines += 1;
      }
    }
    return lines;
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
    if (submitLoading === 2) {
      setIsOpenDiff(true);
    }
  }, [submitLoading]);

  useEffect(() => {
    // 처음 시작 시 시험 종료 상태면 제출 결과 바로 가져옴
    if (isTestEnded && Object.keys(problem).length !== 0) {
      getLastSumbitResult();
    }
  }, [isTestEnded, problem]);

  useEffect(() => {
    if (submitResult !== null && submitResult.state >= 3) {
      setSubmitLoading(2); // 1: 로딩 중, 2: 로딩 끝남
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

  const testEnd = () => {
    // 임시로 제출 버튼 누르면 diff 열기 & 제출 결과창 나오도록
    setIsTestEnded(true);
    setIsOpenDiff(true);
  };

  return (
    <ChakraProvider>
      {!loading && (
        <Box className="bg">
          <Nav
            lectureName={lecture?.name}
            lectureId={lecture?.id}
            deadline={lecture?.deadline}
            userName={loggedIn ? loggedUser.name : ""}
            problems={lecture?.problems}
            onChangeProblem={onChangeProblem}
            isTestEnded={isTestEnded}
            setIsTestEnded={setIsTestEnded}
            getLastSumbitResult={getLastSumbitResult}
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
              getLines={getLines}
              submittedCode={submitResult?.code}
              answerCode={answerCode}
            />
            <Divider orientation="vertical" borderColor="whiteAlpha.200" />
            {!isTestEnded || submitLoading < 2 ? (
              <Terminal
                submissionCapacity={lecture?.submission_capacity}
                submissionNum={problem?.submissions.length}
                problem={problem}
                testcases={problem?.testcases}
                openDiff={openDiff}
                setIsTestEnded={setIsTestEnded}
                getSubmitResult={getSubmitResult}
                setErrorInfo={setErrorInfo}
                submitLoading={submitLoading}
              />
            ) : (
              <SubmitResult
                submitResult={submitResult}
                getLines={getLines}
                setAnsewerCode={setAnsewerCode}
              />
            )}
          </Box>
        </Box>
      )}
    </ChakraProvider>
  );
}

export default App;
