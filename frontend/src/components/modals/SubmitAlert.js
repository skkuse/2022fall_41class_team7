import React from "react";
import PropTypes from "prop-types";
import {
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
} from "@chakra-ui/react";

function SubmitAlert({ isOpen, onClose, submissionCount, capacity, submit }) {
  const initialRef = React.useRef(null);

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
            onClick={async () => {
              await submit();
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
  submissionCount: PropTypes.number.isRequired,
  capacity: PropTypes.number.isRequired,
  submit: PropTypes.func.isRequired,
};

export default SubmitAlert;
