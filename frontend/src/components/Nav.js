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
} from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import "../styles/style.css";
import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import logo from "../assets/images/service_logo.svg";
import setting from "../assets/images/setting.svg";
import Logout from "./modals/Logout";
import axios from "../utils/axios";
import useMyToast from "../utils/toastUtil";

function Nav({
  lectureName,
  lectureId,
  deadline,
  userName,
  problems,
  onChangeProblem,
  isTestEnded,
  setIsTestEnded,
  getLastSumbitResult,
}) {
  const [selected, setSelected] = useState(1);
  const interval = useRef(null);
  const [remainText, setRemainText] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useMyToast();

  const onChangeProblemNav = (event) => {
    setSelected(event.target.value);
    onChangeProblem(event.target.value);
  };

  function UnixTimestamp() {
    if (!isTestEnded) {
      const currentTime = Math.floor(new Date().getTime() / 1000);
      // deadline이랑 설정한 시간이랑 9시간이 차이나서...
      let remainTime = deadline ? deadline - currentTime + 9 * 60 * 60 : 0;
      if (remainTime > 0) {
        const day = Math.floor(remainTime / 60 / 60 / 24);
        remainTime -= day * 60 * 60 * 24;
        const hour = Math.floor(remainTime / 60 / 60);
        remainTime -= hour * 60 * 60;
        const minute = Math.floor(remainTime / 60);
        remainTime -= minute * 60;
        const second = remainTime;

        setRemainText(`${day}일 ${hour}시간 ${minute}분 ${second}초`);
      } else {
        clearInterval(interval.current);
        setRemainText("시험 종료");
        getLastSumbitResult(); // 마지막에 제출한걸로 결과 보여줌
        setIsTestEnded(true);
      }
    }
  }

  const endTest = async () => {
    try {
      await axios.post(`lectures/${lectureId}/end/`);
      // 종료 처리
      getLastSumbitResult(); // 마지막에 제출한걸로 결과 보여줌
      setIsTestEnded(true);
    } catch (e) {
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

  useEffect(() => {
    if (isTestEnded) {
      setRemainText("시험 종료");
    }
  }, [isTestEnded]);

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
            onClick={onOpen}
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
          onClick={endTest}
          disabled={isTestEnded}
        >
          시험 종료
        </Button>
        <Box>
          <Image src={setting} alt="setting" />
        </Box>
      </Box>
      <Logout isOpen={isOpen} onClose={onClose} />
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
  getLastSumbitResult: PropTypes.func.isRequired,
};

export default Nav;
