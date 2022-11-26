import React from "react";
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
  useToast
} from "@chakra-ui/react";

import { useState } from "react";
import axios from "axios";

function RunCode({ isOpen, onClose }) {
  const initialRef = React.useRef(null);
  const toast = useToast();
  
  const [input, setInput] = useState("");
  const onChangeInput = (event) => {
      setInput(event.target.value);
  };

  const terminal = document.getElementById('terminal_body');
  const setTerminal = (msg, color) => {
      let dt = new Date();
      let hh = dt.getHours();
      let mm = dt.getMinutes();
      let ss = dt.getSeconds();
      let tm = (hh < 10 ? '0' + hh : hh) + ':' + (mm < 10 ? '0' + mm : mm) + ':' + (ss < 10 ? '0' + ss : ss);
      
      color = (color == undefined ? '' : ' style="color:' + color + '"');
      terminal.innerHTML += '<p class="chakra-text css-1kuy7z7" ' + color +'">' + tm + ' &gt;&gt; ' + msg + '</p>';
  }

  const getInput = () => {
    return input;
  };

  const getCode = () => {
    return document.getElementById("hiddenCodeValue").value;
  };

  const checkParam = () => {
    if (input === '') {
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

      if (!checkParam())
        return;

      setTerminal('실행 시작','yellow');

      axios
        .post(
          "/api/execute/",
          { input: getInput(), code: getCode() },
          { headers: { "Content-Type": "application/json" } }
        )
        .then((response) => {
          if (response.result != null) {
            setTerminal('실행 성공','yellow');
            setTerminal(response.result);

          } else if (response.error != null) {
            setTerminal('실행 실패','yellow');
            setTerminal(response.error);
          }
        })
        .catch((error) => setTerminal('API 호출 실패','yellow'));

      onClose();
  };
  
  return (
    <Modal
      initialFocusRef={initialRef}
      isOpen={isOpen}
      onClose={onClose}
      isCentered
    >
      <ModalOverlay />
      <ModalContent>
        <ModalBody pb={6}>
          <FormControl>
            <Input placeholder="파라미터" onChange={onChangeInput}   />
          </FormControl>
        </ModalBody>

        <ModalFooter>
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
