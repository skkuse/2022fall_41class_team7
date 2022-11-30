import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  Select,
  FormControl,
  Button,
  ModalHeader,
} from "@chakra-ui/react";
import axios from "../../utils/axios";

function SelectLecture({ isOpen, onClose }) {
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);
  const [lecture, setLecture] = useState([]);
  const [lecID, setSelected] = useState("");
  const navigate = useNavigate();
  const [isSelected, setIsSelected] = useState(false);

  const handleSelect = (e) => {
    setSelected(e.target.value);
    setIsSelected(true);
  };

  useEffect(() => {
    if (isOpen) {
      const getLectures = async () => {
        try {
          const response = await axios.get("/lectures/");
          setLecture(response.data);
        } catch (e) {
          // console.log(e);
        }
      };
      getLectures();
    }
  }, [isOpen]);

  const getLectures = async () => {
    try {
      const response = await axios.get("/lectures/");
      setLecture(response.data);
    } catch (e) {
      // console.log(e);
    }
  };

  const enrollLecture = () => {
    axios
      .post(`/lectures/${lecID}/enroll/`)
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          navigate(`/test/${lecID}`);
          // console.log(response.status);
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
        <ModalHeader>강의 선택</ModalHeader>
        <ModalBody pb={6}>
          <FormControl>
            <Select onChange={handleSelect} value={lecID}>
              <option value="" disabled defaultValue>
                강의 선택
              </option>
              {lecture?.map((lec) => (
                <option key={lec.id} value={lec.id}>
                  {lec.name}
                </option>
              ))}
            </Select>
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button onClick={onClose} mr={3}>
            취소
          </Button>
          {/* link param 임의로 지정해놨으니 강의 선택하면 해당 id 전달하기 */}
          {/* <Link to="test/1"> */}
          <Button colorScheme="blue" mr={3} onClick={enrollLecture} isDisabled={!isSelected}>
            시험 응시하기
          </Button>
          {/* </Link> */}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

SelectLecture.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default SelectLecture;
