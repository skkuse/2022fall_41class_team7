import { ChakraProvider, Tag } from "@chakra-ui/react";

function FailTag() {
  return (
    <ChakraProvider>
      <Tag
        className="test_result_tag_fail"
        backgroundColor="red.500"
        color="white"
        size="sm"
        fontFamily="Inter"
      >
        FAIL
      </Tag>
    </ChakraProvider>
  );
}

export default FailTag;
