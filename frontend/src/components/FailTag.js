import { ChakraProvider, Tag } from "@chakra-ui/react";

function FailTag() {
  return (
    <Tag
      className="test_result_tag_fail"
      backgroundColor="red.500"
      color="white"
      size="sm"
      fontFamily="Inter"
    >
      FAIL
    </Tag>
  );
}

export default FailTag;
