import {
  Box,
  Button,
  ChakraProvider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Image,
  Input,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import "../styles/home.css";
import axios from "../utils/axios";
import logo from "../assets/images/logo.png";
import SelectLecture from "../components/modals/SelectLecture";
import { useUserDispatch } from "../utils/contextProvider";
import useToast from "../utils/toast";

function Home() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginFailed, setIsLoginFailed] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const dispatch = useUserDispatch();

  const login = async () => {
    try {
      const res = await axios.post("login/", { student_id: id, password });

      if (res.status === 200) {
        setIsLoginFailed(false);
        onOpen();
        dispatch({
          type: "LOGIN",
          user: {
            name: res.data.name,
            id: res.data.student_id,
          },
          loggedIn: true,
        });
      }
    } catch (err) {
      setIsLoginFailed(true);
      toast({
        title: "아이디나 비밀번호가 올바르지 않습니다.",
        status: "error",
      });
    }
  };

  const isErrorId = id === "" && isLoginFailed;
  const isErrorPassword = password === "" && isLoginFailed;

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
                onChange={(e) => setId(e.target.value)}
              />
              {isErrorId && (
                <FormErrorMessage>아이디를 입력하세요.</FormErrorMessage>
              )}
            </FormControl>
            <FormControl height="100px" isInvalid={isErrorPassword}>
              <FormLabel>비밀번호</FormLabel>
              <Input
                type="password"
                placeholder="입력"
                name="loginPwd"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {isErrorPassword && (
                <FormErrorMessage>비밀번호를 입력하세요.</FormErrorMessage>
              )}
            </FormControl>
          </Box>
          <Box className="btn-pan">
            <Button colorScheme="blue" className="btn_login" onClick={login} type="submit">
              로그인
            </Button>
          </Box>
        </Box>
        <SelectLecture isOpen={isOpen} onClose={onClose} />
      </Box>
    </ChakraProvider>
  );
}

export default Home;
