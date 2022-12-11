import { useToast } from "@chakra-ui/react";

const myToast = () => useToast({ position: "bottom-right", isClosable: true, duration: 2000 });

export default myToast;
