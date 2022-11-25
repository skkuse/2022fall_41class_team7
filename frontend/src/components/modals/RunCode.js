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
} from "@chakra-ui/react";

function RunCode({ isOpen, onClose }) {
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);

  return (
    <Modal
      initialFocusRef={initialRef}
      // finalFocusRef={finalRef}
      isOpen={isOpen}
      onClose={onClose}
      isCentered
    >
      <ModalOverlay />
      <ModalContent>
        <ModalBody pb={6}>
          <FormControl>
            <Input placeholder="입력" />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button onClick={onClose}>취소</Button>
          <Button colorScheme="blue" mr={3}>
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
