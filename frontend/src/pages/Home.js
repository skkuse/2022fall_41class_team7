import {
  ChakraProvider,
  Box,
  Text,
  Image,
  Button,
  Input,
  useDisclosure,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
} from "@chakra-ui/react";
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
        }
      })
      .catch((error) => {
        // console.log("실패");
        setIsFailed(true);
        setIsFailed2(true);
      });
  };

  const isErrorId = id === "" && isFailed;
  const isErrorPassword = password === "" && isFailed;

  function validateName(value) {
    let error;
    if (!value) {
      error = "Name is required";
    } else if (value.toLowerCase() !== "naruto") {
      error = "Jeez! You're not a fan 😱";
    }
    return error;
  }

  return (
    <ChakraProvider>
      <Box className="body">
        <Box className="middle">
          <Image className="icon" src={logo} />
          <Box className="title">프로그래머스쿠</Box>
          <Box className="login-pan">
            <FormControl height="100px" isInvalid={isErrorId}>
              <FormLabel>아이디</FormLabel>
              <Input
                type="text"
                placeholder="입력"
                name="loginId"
                value={id}
                onChange={onChangeId}
              />
              {isErrorId ? (
                <FormErrorMessage>아이디를 입력하세요.</FormErrorMessage>
              ) : (
                <FormHelperText />
              )}
            </FormControl>
            <FormControl height="100px" isInvalid={isErrorPassword}>
              <FormLabel>비밀번호</FormLabel>
              <Input
                type="password"
                placeholder="입력"
                name="loginPwd"
                value={password}
                onChange={onChangePassword}
              />
              {isErrorPassword ? (
                <FormErrorMessage>비밀번호를 입력하세요.</FormErrorMessage>
              ) : (
                <FormHelperText />
              )}
            </FormControl>
          </Box>
          <Box className="btn-pan">
            <Button className="btn_login" onClick={login} type="submit">
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
