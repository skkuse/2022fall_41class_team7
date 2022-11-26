import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  Button,
  Text,
} from "@chakra-ui/react";
import axios from "axios";

function Logout({ isOpen, onClose }) {
  axios.defaults.withCredentials = true;
  axios.defaults.xsrfCookieName = "csrftoken";
  axios.defaults.xsrfHeaderName = "X-CSRFToken";

  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);
  const [isFailed, setIsFailed] = useState(false);

  const logout = () => {
    axios
      .get(
        "/api/logout/",
        { headers: { "Content-Type": "application/json", authentification: "X-CSRFToken" } }
      )
      .then((response) => {
        if (response.status === 200) {
          setIsFailed(false);
        }
      })
      .catch((error) => setIsFailed(true));
  };

  return (
    <Modal
      initialFocusRef={initialRef}
      // finalFocusRef={finalRef}
      isOpen={isOpen}
      onClose={onClose}
      isCentered
    >
      <ModalOverlay />
      <ModalContent backgroundColor="#1A202C" width="370px" height="170px">
        <ModalBody pb={6} color="white" textAlign="center">
          <Text fontSize="20px" marginTop="10px">홈페이지로 이동하겠습니까?</Text>
          <Text fontSize="16px" marginTop="5px">계정은 로그아웃됩니다</Text>
        </ModalBody>

        <ModalFooter>
          <Button onClick={onClose} marginRight="10px">취소</Button>
          <Link to="/">
            <Button colorScheme="blue" mr={3} onClick={logout}>
              로그아웃
            </Button>
          </Link>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

Logout.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.bool.isRequired,
};

export default Logout;
