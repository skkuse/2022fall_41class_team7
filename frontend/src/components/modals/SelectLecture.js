import React, { useState, useEffect } from "react";
import axios from "axios";
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
  const [lecture, setLecture] = useState([]);

  useEffect(() => {
    const getLectures = async () => {
      try {
        const response = await axios.get("/api/lectures/", {
          headers: {
            "Content-Type": "application/json",
          },
        });
        setLecture(response.data);
      } catch (e) {
        // console.log(e);
      }
    };
    getLectures();
  }, []);

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
              {lecture?.map((lec) => (
                <option key={lec.id} value={lec.id}>
                  {lec.name}
                </option>
              ))}
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
