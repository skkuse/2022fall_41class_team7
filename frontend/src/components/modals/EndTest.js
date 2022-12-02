import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link, useParams } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
  useToast,
} from "@chakra-ui/react";
import axios from "../../utils/axios";

function EndTest({ isOpen, onClose }) {
  const initialRef = React.useRef(null);
  const { id } = useParams();
  const toast = useToast();

  const submitTest = () => {
    axios
      .post(`/lectures/${id}/end/`, {})
      .then((response) => {
        if (response.status === 200) {
          console.log(response);
        } else {
          toast({
            title: "제출 실패",
            position: "bottom-right",
            isClosable: true,
            status: "error",
            duration: 3000,
          });
        }
      })
      .catch((error) => null);
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
          시험을 종료하겠습니까?
        </AlertDialogHeader>
        <AlertDialogBody pb={6} color="white">
          시험을 종료하고 제출 결과를 분석하여 보여줍니다.
        </AlertDialogBody>

        <AlertDialogFooter>
          <Button onClick={onClose} marginRight="8px">
            취소
          </Button>
          <Button as={Link} to="/" colorScheme="blue" ml={1} onClick={submitTest}>
            시험종료
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

EndTest.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default EndTest;
