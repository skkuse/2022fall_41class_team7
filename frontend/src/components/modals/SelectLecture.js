import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  Select,
  FormControl,
  Button,
} from "@chakra-ui/react";
import App from "../../pages/App";

function SelectLecture({ isOpen, onClose }) {
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
            <Select placeholder="강의 선택">
              <option value="option1">Option 1</option>
              <option value="option2">Option 2</option>
              <option value="option3">Option 3</option>
            </Select>
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button onClick={onClose}>취소</Button>
          {/* link param 임의로 지정해놨으니 강의 선택하면 해당 id 전달하기 */}
          <Link to="test/1">
            <Button colorScheme="blue" mr={3}>
              시험 응시하기
            </Button>
          </Link>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

SelectLecture.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.bool.isRequired,
};

export default SelectLecture;
