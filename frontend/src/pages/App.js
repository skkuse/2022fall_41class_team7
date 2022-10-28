import {
  ChakraProvider,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Select,
  Box,
  Image,
  Divider,
  Button,
  CircularProgress,
  CircularProgressLabel,
  IconButton,
  Flex,
} from "@chakra-ui/react";
import { ChevronRightIcon, SearchIcon } from "@chakra-ui/icons";
import logo from "../assets/images/service_logo.svg";

function App() {
  return (
    <ChakraProvider>
      <Box backgroundColor="gray.800" w="1920px" h="1080px">
        <Box w="1920px" h="60px" display="flex" alignItems="center" p={4}>
          <Box>
            <Image src={logo} alt="service logo" boxSize="32px" borderRadius="6px" />
          </Box>
          <Box>
            <Breadcrumb
              display="flex"
              alignItems="center"
              gap="4px"
              separator={<ChevronRightIcon color="white" />}
              padding="10px 16px"
            >
              <BreadcrumbItem>
                <BreadcrumbLink href="#" color="white" fontSize="14px">
                  소프트웨어공학
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbLink href="#" color="white">
                <Select size="sm" bg="gray.900" borderColor="whiteAlpha.200" color="white">
                  <option value="option1">week 1 : 피보나치 수</option>
                </Select>
              </BreadcrumbLink>
            </Breadcrumb>
          </Box>
        </Box>
        <Divider borderColor="whiteAlpha.200" />
        <Divider
          orientation="vertical"
          borderColor="whiteAlpha.200"
          left="611px"
          top="61px"
          position="absolute"
          height="1019px"
        />
        <Box width="758px" height="1019px" left="612px" top="61px" position="absolute">
          <Box height="60px" display="flex" alignItems="center">
            <Flex alignItems="center" gap="10px" height="32px" left="19px" position="absolute">
              {/* <IconButton
                size="sm"
                backgroundColor="gray.500"
                icon={<SearchIcon color="white" />}
              />
              <IconButton
                size="sm"
                backgroundColor="gray.500"
                icon={<SearchIcon color="white" />}
              />
              <IconButton
                size="sm"
                backgroundColor="gray.500"
                icon={<SearchIcon color="white" />}
              />
              <IconButton
                size="sm"
                backgroundColor="gray.500"
                icon={<SearchIcon color="white" />}
              /> */}
            </Flex>

            <Box
              height="32px"
              display="flex"
              justifyContent="flex-end"
              gap="10px"
              alignItems="center"
              top="14px"
              position="absolute"
              flexDirection="row"
              right="20px"
            >
              <Select
                bg="gray.900"
                borderColor="whiteAlpha.200"
                color="white"
                width="250px"
                height="32px"
              >
                <option value="option1">1. 2022-10-06 22:22:07.362</option>
              </Select>
              <Button
                color="white"
                backgroundColor="green.500"
                width="50px"
                height="32px"
                fontSize="14px"
              >
                저장
              </Button>
              <CircularProgress value={33} size="32px" color="green.500">
                <CircularProgressLabel color="white">1/3</CircularProgressLabel>
              </CircularProgress>
            </Box>
          </Box>
          <Divider borderColor="whiteAlpha.200" />
        </Box>
        <Divider
          position="absolute"
          top="61px"
          orientation="vertical"
          left="1370px"
          borderColor="whiteAlpha.200"
          height="1019px"
        />
      </Box>
    </ChakraProvider>
  );
}

export default App;
