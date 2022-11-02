import "../styles/style.css";
import { ChakraProvider, Box, Divider } from "@chakra-ui/react";
import Nav from "../components/Nav";
import Problem from "../components/Problem";
import CodeEditor from "../components/CodeEditor";

function App() {
  return (
    <ChakraProvider>
      <Box className="bg">
        <Nav />
        <Divider borderColor="whiteAlpha.200" />
        <Problem />
        <Box className="divider_container">
          <Divider
            orientation="vertical"
            borderColor="whiteAlpha.200"
            position="absolute"
            left="611px"
          />
        </Box>
        <Box className="divider_container">
          <Divider
            orientation="vertical"
            left="1370px"
            position="absolute"
            borderColor="whiteAlpha.200"
          />
        </Box>
      </Box>
      <CodeEditor />
    </ChakraProvider>
  );
}

export default App;
