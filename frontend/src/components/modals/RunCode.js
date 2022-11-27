import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  Input,
  FormControl,
  Button,
  useToast,
} from "@chakra-ui/react";

import axios from "../../utils/axios";

function RunCode({ isOpen, onClose }) {
  const initialRef = React.useRef(null);
  const toast = useToast();

  const [input, setInput] = useState("");
  const onChangeInput = (event) => {
    setInput(event.target.value);
  };

  const terminal = document.getElementById("terminal_body");
  const setTerminal = (msg, color) => {
    const dt = new Date();
    const hh = dt.getHours();
    const mm = dt.getMinutes();
    const ss = dt.getSeconds();
    const tm = `${hh < 10 ? `0${hh}` : hh}:${mm < 10 ? `0${mm}` : mm}:${ss < 10 ? `0${ss}` : ss}`;

    const color0 = color === undefined ? "" : ` style="color:${color}"`;
    terminal.innerHTML += `<p class="chakra-text css-1kuy7z7" ${color0}">${tm} &gt;&gt; ${msg}</p>`;
  };

  const getInput = () => input;

  const getCode = () => document.getElementById("hiddenCodeValue").value;

  const checkParam = () => {
    if (input === "") {
      toast({
        title: "파라미터를 입력하세요.",
        position: "bottom-right",
        isClosable: true,
        duration: 1000,
      });
      return false;
    }
    return true;
  };

  const onExecute = () => {
    axios.defaults.withCredentials = true;
    axios.defaults.xsrfCookieName = "csrftoken";
    axios.defaults.xsrfHeaderName = "X-CSRFToken";

    if (!checkParam()) return;

    setTerminal("실행 시작", "yellow");

    axios
      .post("execute/", { input: getInput(), code: getCode() })
      .then((response) => {
        if (response.status === 200) {
          if (response.data.result != null) {
            setTerminal("실행 성공", "yellow");
            setTerminal(response.data.result);
          } else if (response.data.error != null) {
            setTerminal("실행 실패", "yellow");
            setTerminal(response.data.error);
          }
        }
      })
      .catch((error) => setTerminal("API 호출 실패", "yellow"));

    onClose();
  };

  return (
    <Modal
      initialFocusRef={initialRef}
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      id="returnCode"
    >
      <ModalOverlay />
      <ModalContent className="returnCode_body">
        <ModalBody pb={6} className="returnCode_container">
          <FormControl>
            <Input placeholder="파라미터" onChange={onChangeInput} />
          </FormControl>
        </ModalBody>

        <ModalFooter className="returnCode_footer">
          <Button onClick={onClose}>취소</Button>
          <Button colorScheme="blue" mr={3} onClick={onExecute}>
            실행
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

RunCode.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.bool.isRequired,
};

export default RunCode;
