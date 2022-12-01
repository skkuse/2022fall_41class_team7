import { ChakraProvider, Tag } from "@chakra-ui/react";

function PassTag() {
  return (
    <Tag
      className="testcase_result_tag_pass"
      backgroundColor="green.500"
      color="white"
      size="sm"
      fontFamily="Inter"
    >
      PASS
    </Tag>
  );
}

export default PassTag;
