import { ChakraProvider, Box, Text } from "@chakra-ui/react";
import { useState } from "react";
import Testcase from "./Testcase";

function Problem() {
  const [explanation, setExplanation] = useState(
    "피보나치 수는 0과 1로 시작한다. 0번째 피보나치 수는 0이고, 1번째 피보나치 수는 1이다. 그 다음 2번째 부터는 바로 앞 두 피보나치 수의 합이 된다.\n\n이를 식으로 써보면 Fn = Fn-1 + Fn-2 (n ≥ 2)가 된다.\n\nn=17일때 까지 피보나치 수를 써보면 다음과 같다.\n\n0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597\n\nn이 주어졌을 때, n번째 피보나치 수를 구하는 프로그램을 작성하시오."
  );
  const [reference, setReference] = useState(
    "첫째 줄에 n이 주어진다. n은 45보다 작거나 같은 자연수이다."
  );

  const getTestcases = () => {
    // setTestcases() json에서 가져오는거 필요
  };

  return (
    <ChakraProvider>
      <Box className="problem_section">
        <Box className="probelm_container">
          <Box className="explanation_container">
            <Text className="explanation_head_text">문제설명</Text>
            <Text className="explanation_body_text">{explanation}</Text>
          </Box>
          <Box className="reference_container">
            <Text className="explanation_head_text">참조 / 제약 사항</Text>
            <Text className="explanation_body_text">{reference}</Text>
          </Box>
          <Box className="testcase_section">
            <Box className="explanation_head_text">테스트케이스</Box>
            <Box className="testcase_container">
              {/* 테스트케이스 개수만큼 Testcase 컴포넌트 필요 <- map 사용? */}
              <Testcase title="테스트케이스 1" input={4} output={3} />
              <Testcase title="테스트케이스 2" input={5} output={5} />
            </Box>
          </Box>
        </Box>
      </Box>
    </ChakraProvider>
  );
}
export default Problem;
