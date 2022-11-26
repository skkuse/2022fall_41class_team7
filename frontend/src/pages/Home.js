import { ChakraProvider, Box, Text, Image, Button, Input, useDisclosure } from "@chakra-ui/react";
import { useState } from "react";
import "../styles/home.css";
import axios from "../utils/axios";
import logo from "../assets/images/logo.png";
import SelectLecture from "../components/modals/SelectLecture";

function Home() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [isFailed, setIsFailed] = useState(false);
  const [isFailed2, setIsFailed2] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const onChangeId = (event) => {
    setId(event.target.value);
  };
  const onChangePassword = (event) => {
    setPassword(event.target.value);
  };

  const login = () => {
    axios
      .post("login/", { student_id: id, password })
      .then((response) => {
        if (response.status === 200) {
          // console.log("성공");
          setIsFailed(false);
          setIsFailed2(false);
          onOpen();
        } else if (response.status === 404) {
          setIsFailed(true);
          setIsFailed2(true);
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
            {isFailed && password === "" ? (
              <Text className="msg" name="loginPwdMsg">
                비밀번호를 입력하세요.
              </Text>
            ) : null}
          </Box>
          <Box className="btn-pan">
            <Button className="btn_login" onClick={login}>
              로그인
            </Button>
            {isFailed2 ? (
              <Text className="msg" name="loginPwdMsg">
                아이디나 비밀번호가 올바르지 않습니다.
              </Text>
            ) : null}
          </Box>
        </Box>
        <SelectLecture isOpen={isOpen} onClose={onClose} />
      </Box>
    </ChakraProvider>
  );
}

export default Home;
