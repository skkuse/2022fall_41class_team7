import {
  ChakraProvider,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Select,
  Box,
  Image,
  Button,
  Input,
  Text,
  Avatar,
} from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import "../styles/style.css";
import { useState } from "react";
import logo from "../assets/images/service_logo.svg";
import setting from "../assets/images/setting.svg";

function Nav() {
  const lectureName = "소프트웨어공학";
  const userName = "홍길동";
  const [deadline, setDeadline] = useState("2일 13시간 30분 12초");
  const problemName = "week 1 : 피보나치 수";

  return (
    <ChakraProvider>
      <Box className="nav">
        <Box className="nav_left">
          <Box>
            <Image
              className="logo_img"
              src={logo}
              alt="service logo"
              boxSize="32px"
              borderRadius="6px"
            />
          </Box>
          <Box>
            <Breadcrumb
              className="breadcrumb"
              separator={<ChevronRightIcon color="white" display="flex" alignItems="center" />}
            >
              <BreadcrumbItem>
                <Text className="lecture_name">{lectureName}</Text>
              </BreadcrumbItem>
              <BreadcrumbLink href="#">
                <Select
                  className="lecture_select"
                  size="sm"
                  bg="gray.900"
                  borderColor="whiteAlpha.200"
                  color="white"
                >
                  <option value="option1">{problemName}</option>
                </Select>
              </BreadcrumbLink>
            </Breadcrumb>
          </Box>
        </Box>
        <Box className="nav_right">
          <Box className="profile">
            <Avatar name="Dan Abrahmov" src="https://bit.ly/dan-abramov" size="xs" />
            <Text className="profile_text">{userName}</Text>
          </Box>
          <Input
            className="deadline_input"
            border="1px"
            borderColor="whiteAlpha.200"
            color="white"
            width="160px"
            height="32px"
            fontSize="14px"
            padding="6px 12px"
            value={deadline}
            readOnly
          />
          <Button className="button_test_end" size="sm" backgroundColor="red.500" color="white">
            시험 종료
          </Button>
          <Box>
            <Image src={setting} alt="setting" />
          </Box>
        </Box>
      </Box>
    </ChakraProvider>
  );
}

export default Nav;
