import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
} from "@chakra-ui/react";
import axios from "../../utils/axios";
import { useUserDispatch } from "../../utils/contextProvider";

function Logout({ isOpen, onClose }) {
  const initialRef = React.useRef(null);

  const dispatch = useUserDispatch();

  const logout = async () => {
    const res = await axios.get("logout/", {});

    if (res.status === 200) {
      dispatch({
        type: "LOGOUT",
        user: {},
        loggedIn: false,
      });
    }
  };

  return (
    <AlertDialog
      size="md"
      initialFocusRef={initialRef}
      isOpen={isOpen}
      onClose={onClose}
      isCentered
    >
      <AlertDialogOverlay />
      <AlertDialogContent backgroundColor="#1A202C">
        <AlertDialogHeader fontSize="lg" fontWeight="bold" color="white">
          홈페이지로 이동하겠습니까?
        </AlertDialogHeader>
        <AlertDialogBody pb={6} color="white">
          계정은 로그아웃되며 저장되지 않은 내용은 소실됩니다.
        </AlertDialogBody>

        <AlertDialogFooter>
          <Button onClick={onClose} marginRight="8px">
            취소
          </Button>
          <Button as={Link} to="/" colorScheme="blue" ml={1} onClick={logout}>
            로그아웃
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

Logout.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Logout;
