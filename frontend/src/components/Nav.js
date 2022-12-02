import {
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
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import "../styles/style.css";
import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import logo from "../assets/images/service_logo.svg";
import setting from "../assets/images/setting.svg";
import Logout from "./modals/Logout";
import EndTest from "./modals/EndTest";
import axios from "../utils/axios";

function Nav({
  lectureName,
  lectureId,
  deadline,
  userName,
  problems,
  onChangeProblem,
  isTestEnded,
  setIsTestEnded,
}) {
  const [selected, setSelected] = useState(1);
  const interval = useRef(null);
  const [remainText, setRemainText] = useState("");
  const {
    isOpen: isOpenLogoutModal,
    onOpen: onOpenLogoutModal,
    onClose: onCloseLogoutModal,
  } = useDisclosure();
  const {
    isOpen: isOpenEndTestModal,
    onOpen: onOpenEndTestModal,
    onClose: onCloseEndTestModal,
  } = useDisclosure();
  const toast = useToast({ position: "bottom-right", isClosable: true, duration: 1000 });

  const onChangeProblemNav = (event) => {
    setSelected(event.target.value);
    onChangeProblem(event.target.value);
  };

  function UnixTimestamp() {
    if (!isTestEnded) {
      const currentTime = Math.floor(new Date().getTime() / 1000);
      const remainTime = deadline ? deadline - currentTime : 0;
      const date = new Date(remainTime * 1000);
      const day = Math.floor(remainTime / 60 / 60 / 24);
      const hour = date.getHours();
      const minute = date.getMinutes();
      const second = date.getSeconds();
      setRemainText(`${day}일 ${hour}시간 ${minute}분 ${second}초`);
    }
  }

  const endTest = async () => {
    try {
      await axios.post(`lectures/${lectureId}/end/`);
      // 종료 처리
      setIsTestEnded(true);
    } catch (e) {
      console.log(e);
      toast({
        title: "종료에 실패했습니다.",
        status: "error",
      });
    }
  };

  useEffect(() => {
    interval.current = setInterval(() => {
      UnixTimestamp();
    }, 1000);

    if (isTestEnded) {
      setRemainText("시험 종료");
    }

    return () => clearInterval(interval.current);
  }, []);

  useEffect(
    () => {
      if (isTestEnded) {
        setRemainText("시험 종료");
      }
    },
    [isTestEnded]
  );

  return (
    <Box className="nav">
      <Box className="nav_left">
        <Box>
          <Image
            className="logo_img"
            src={logo}
            alt="service logo"
            boxSize="32px"
            borderRadius="6px"
            onClick={onOpenLogoutModal}
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
                onChange={onChangeProblemNav}
                value={selected}
              >
                {problems?.map((p) => (
                  <option key={p.id} value={p.id} className="lecture_option">
                    {p.name}
                  </option>
                ))}
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
        {!isTestEnded && (
        <Input
          className="deadline_input"
          border="1px"
          borderColor="whiteAlpha.200"
          color="white"
          width="176px"
          height="32px"
          fontSize="14px"
          padding="6px 12px"
          textAlign="center"
          value={remainText}
          readOnly
        />
        )}
        <Button
          className="button_test_end"
          size="sm"
          backgroundColor="red.500"
          color="white"
          onClick={onOpenEndTestModal}
        >
          시험 종료
        </Button>
        <Box>
          <Image src={setting} alt="setting" />
        </Box>
      </Box>
      <EndTest isOpen={isOpenEndTestModal} onClose={onCloseEndTestModal} />
      <Logout isOpen={isOpenLogoutModal} onClose={onCloseLogoutModal} />
    </Box>
  );
}

Nav.propTypes = {
  lectureName: PropTypes.string.isRequired,
  lectureId: PropTypes.number.isRequired,
  deadline: PropTypes.number.isRequired,
  userName: PropTypes.string.isRequired,
  problems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  onChangeProblem: PropTypes.func.isRequired,
  isTestEnded: PropTypes.bool.isRequired,
  setIsTestEnded: PropTypes.func.isRequired,
};

export default Nav;
