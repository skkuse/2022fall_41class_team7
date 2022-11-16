import { ChakraProvider, Box, Text, Image, Button, Input } from "@chakra-ui/react";
import "../styles/home.css";
import logo from "../assets/images/logo.png";

function Home() {
  return (
    <ChakraProvider>
      <Box className="body">
        <Box className="middle">
          <Image className="icon" src={logo} />
          <Box className="title">프로그래머스쿠</Box>

          <Box className="login-pan">
            <Text>아이디</Text>
            <Input type="text" placeholder="입력" name="loginId" />
            <Text className="msg" name="loginIdMsg">
              아이디를 입력하세요.
            </Text>

            <Text>비밀번호</Text>
            <Input type="password" placeholder="입력" name="loginPwd" />
            <Text className="msg" name="loginPwdMsg">
              비밀번호를 입력하세요. or 비밀번호가 옳지 않습니다.
            </Text>
          </Box>

          <Box className="btn-pan">
            <Button className="btn_login">로그인</Button>
          </Box>
        </Box>
      </Box>
    </ChakraProvider>
  );
}
export default Home;
