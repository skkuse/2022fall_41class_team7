import { useToast as useChakraToast } from "@chakra-ui/react";

const useToast = () => useChakraToast({ position: "bottom-right", isClosable: true, duration: 2000 });

export default useToast;
