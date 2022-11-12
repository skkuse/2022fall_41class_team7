import { ChakraProvider, Box, Text, Image, Button, Input, SelectField } from "@chakra-ui/react";
import { useState } from "react";
import "../styles/home.css";
import axios from "axios";
import logo from "../assets/images/logo.png";

function Home() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [isFailed, setIsFailed] = useState(false);

  const onChangeId = (event) => {
    setId(event.target.value);
  };
  const onChangePassword = (event) => {
    setPassword(event.target.value);
  };

  const login = () => {
    axios.defaults.withCredentials = true;
    axios.defaults.xsrfCookieName = "csrftoken";
    axios.defaults.xsrfHeaderName = "X-CSRFToken";

    axios
      .post(
        "/api/login/",
        { student_id: id, password },
        { headers: { "Content-Type": "application/json" } }
      )
      .then((response) => {
        if (response.status === 200) {
          console.log("성공");
          setIsFailed(false);
        }
      })
      .catch((error) => setIsFailed(true));
  };

  return (
    <ChakraProvider>
      <Box className="body">
        <Box className="middle">
          <Image className="icon" src={logo} />
          <Box className="title">프로그래머스쿠</Box>
          <Box className="login-pan">
            <Text>아이디</Text>
            <Input type="text" placeholder="입력" name="loginId" value={id} onChange={onChangeId} />
            {isFailed && id === "" ? (
              <Text className="msg" name="loginIdMsg">
                아이디를 입력하세요.
              </Text>
            ) : null}

            <Text>비밀번호</Text>
            <Input
              type="password"
              placeholder="입력"
              name="loginPwd"
              value={password}
              onChange={onChangePassword}
            />
            {isFailed ? (
              <Text className="msg" name="loginPwdMsg">
                비밀번호를 입력하세요. or 비밀번호가 옳지 않습니다.
              </Text>
            ) : null}
          </Box>
          <Box className="btn-pan">
            <Button className="btn_login" onClick={login}>
              로그인
            </Button>
          </Box>
        </Box>
      </Box>
    </ChakraProvider>
  );
}

export default Home;
