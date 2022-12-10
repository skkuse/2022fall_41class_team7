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
import useMyToast from "../../utils/toastUtil";

function SubmitAlert({ isOpen, onClose, getCode, submissionCount, capacity, submit }) {
  const initialRef = React.useRef(null);
  const toast = useMyToast();

  const dispatch = useUserDispatch();

  // const submitTest = async () => {
  //   axios
  //     .post(
  //       "/submissions/",
  //       { code: getCode() },
  //       {
  //         params: {
  //           problem_id: probelmId,
  //         },
  //       }
  //     )
  //     .then((response) => {
  //       toast({
  //         title: "제출 성공!",
  //         status: "success",
  //       });
  //     })
  //     .catch((err) => null);
  // };

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
          제출하시겠습니까?
        </AlertDialogHeader>
        <AlertDialogBody pb={6} color="white">
          제출 횟수 {submissionCount}/{capacity}
        </AlertDialogBody>

        <AlertDialogFooter>
          <Button onClick={onClose} marginRight="8px">
            취소
          </Button>
          <Button
            colorScheme="blue"
            ml={1}
            onClick={async (e) => {
              await submit(e);
              onClose();
            }}
          >
            제출
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

SubmitAlert.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  getCode: PropTypes.func.isRequired,
  submissionCount: PropTypes.number.isRequired,
  capacity: PropTypes.number.isRequired,
  submit: PropTypes.func.isRequired,
};

export default SubmitAlert;
