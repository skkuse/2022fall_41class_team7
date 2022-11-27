import React, { useState, useEffect } from "react";
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
import axios from "../../utils/axios";

function SelectLecture({ isOpen, onClose }) {
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);
  const [lecture, setLecture] = useState([]);
  const [lecID, setSelected] = useState("");

  const handleSelect = (e) => {
    setSelected(e.target.value);
  };

  useEffect(() => {
    const getLectures = async () => {
      try {
        const response = await axios.get("/lectures/");
        setLecture(response.data);
      } catch (e) {
        // console.log(e);
      }
    };
    getLectures();
  }, []);

  const enrollLecture = () => {
    axios
      .post(`/lectures/${lecID}/enroll/`)
      .then((response) => {
        if (response.status === 200) {
          // console.log("성공"); app 페이지로 연결
        }
      })
      .catch((error) => null);
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
      <ModalContent>
        <ModalBody pb={6}>
          <FormControl>
            <Select placeholder="강의 선택" onChange={handleSelect} value={lecID}>
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
            <Button colorScheme="blue" mr={3} onClick={enrollLecture}>
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
