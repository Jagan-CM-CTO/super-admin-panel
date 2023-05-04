import { isAuthenticated } from "@/helper/auth";
import {
  Icon,
  Heading,
  Avatar,
  Box,
  Center,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  useToast,
  PopoverCloseButton,
  PopoverAnchor,
  ButtonGroup,
  Image,
  Flex,
  Text,
  Stack,
  Button,
  useColorModeValue,
  Table,
  Thead,
  Divider,
  Tbody,
  Tfoot,
  Badge,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  StackDivider,
} from "@chakra-ui/react";
import axios from "axios";
import { GiTwoCoins } from "react-icons/gi";
import { BiUserCircle, BiUserPin } from "react-icons/bi";
import { GiCutDiamond } from "react-icons/gi";
import Router from "next/router";
import { useEffect, useState } from "react";

const ViewUsersUnderAgent = ({ agentId }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const date = new Date();
  // const [currentScreen, setCurrentScreen] = useState("active-hosts")
  const [hosts, setHosts] = useState([]);
  const [hostMargin, setHostMargin] = useState(0);
  const [agentMargin, setAgentMargin] = useState(0);
  const [dollarRate, setDollarRate] = useState(1);
  const [diamonds, setDiamonds] = useState(0);

  const getData = () => {
    let auth = isAuthenticated();
    let jwt = auth.data?.jwt;

    try {
      axios
        .post(
          "https://cloudmagician.co.in/api/hosts-for-admin",
          {
            agentId: agentId,
          },
          {
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          }
        )
        .then((res) => {
          if (res.data.length != 0) {
            setHosts(res.data[0].hosts);
            setDiamonds(res.data.diamonds);
            axios
              .get("https://cloudmagician.co.in/api/dollar-value", {
                headers: {
                  Authorization: `Bearer ${jwt}`,
                },
              })
              .then((res) => {
                setDollarRate(res.data.data.attributes.diamonds);
              });
            axios
              .get("https://cloudmagician.co.in/api/agent-host-salary-ratio", {
                headers: {
                  Authorization: `Bearer ${jwt}`,
                },
              })
              .then((res) => {
                setAgentMargin(res.data.data.attributes.agent_margin);
                setHostMargin(res.data.data.attributes.host_salary);
              });
          }
        });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getData();
    // console.log(hosts);
    // console.log(hostMargin);
    // console.log(agentMargin);
    // console.log(dollarRate);
    // console.log(diamonds);
  }, []);

  return (
    <>
      <Button
        onClick={onOpen}
        w={"full"}
        mt={8}
        bg={useColorModeValue("#151f21", "gray.900")}
        color={"white"}
        rounded={"md"}
        _hover={{
          transform: "translateY(-2px)",
          boxShadow: "lg",
        }}
      >
        Host Data
      </Button>

      <Modal
        isOpen={isOpen}
        size="full"
        onClose={onClose}
        bgGradient="linear(to-b, #01DAB3, #490871)"
      >
        <ModalOverlay />
        <ModalContent p="5" bgGradient="linear(to-b, #01DAB3, #490871)">
          <ModalHeader>Host Data</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Card>
              {/* <CardHeader>
                <Heading size="md">Products by this seller</Heading>
              </CardHeader> */}

              <CardBody
                // bg={"transparent"}
                bgGradient="linear(to-b, #01DAB3, #490871)"
                // rounded={"xl"}
                // overflow={"hidden"}
              >
                <TableContainer rounded={10} shadow={30} mt={5}>
                  <Table variant="simple">
                    <Thead color="white">
                      <Tr color="white">
                        <Th color="white">Sl. No</Th>
                        <Th color="white">
                          Username <br />
                          User ID <br />
                          Diamonds
                        </Th>
                        <Th color="white">Mic Time</Th>
                        <Th color="white">Available Diamond</Th>
                        <Th color="white">Host Salary</Th>
                        <Th color="white">Agent Salary</Th>
                        <Th color="white">Total Salary</Th>
                      </Tr>
                    </Thead>
                    <Tbody color="white">
                      {hosts &&
                        hosts.map((host, i) => {
                          return (
                            <Tr key={i}>
                              <Td>{i + 1}</Td>
                              <Td>
                                <Text>
                                  {`${host.first_name} ${host.last_name}` ||
                                    "No name"}
                                </Text>
                                <Text>User ID: {host.id}</Text>
                                <Text display={"flex"}>
                                  <Icon
                                    mr="2"
                                    mt="0.5"
                                    fontSize="16"
                                    _groupHover={{
                                      color: "white",
                                    }}
                                    as={GiCutDiamond}
                                  />
                                  <span>{host.received_coins || 0}</span>
                                </Text>
                              </Td>
                              <Td></Td>
                              <Td>{host.received_coins}</Td>
                              <Td>
                                {(
                                  ((host.received_coins / dollarRate) *
                                    hostMargin) /
                                  100
                                ).toFixed(3)}
                              </Td>
                              <Td>
                                {(
                                  ((host.received_coins / dollarRate) *
                                    agentMargin) /
                                  100
                                ).toFixed(3)}
                              </Td>
                              <Td>
                                {(
                                  ((host.received_coins / dollarRate) *
                                    hostMargin) /
                                    100 +
                                  ((host.received_coins / dollarRate) *
                                    agentMargin) /
                                    100
                                ).toFixed(3)}
                              </Td>
                            </Tr>
                          );
                        })}
                    </Tbody>
                  </Table>
                </TableContainer>
              </CardBody>
            </Card>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" bg="brand.400" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
const RemoveAgentButton = ({ id }) => {
  const { isOpen, onToggle, onClose } = useDisclosure();
  const toast = useToast();
  // const router = Router();

  let auth = isAuthenticated();
  let jwt = auth.data?.jwt;
  console.log(id);
  const handleDelete = async () => {
    let res = await axios.delete(
      `https://cloudmagician.co.in/api/host-agent-accounts/${id}`,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${jwt}`,
        },
      }
    );

    if (res.error) {
      toast({
        title: "Error",
        description: "Agent deletion failed",
        status: "danger",
        duration: 2000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Success",
        description: "Agent deleted successfully",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      onClose();
      Router.reload();
    }
    return res;
  };

  return (
    <Popover>
      <PopoverTrigger>
        <Button
          w={"full"}
          bg={useColorModeValue("red.400", "gray.900")}
          color={"white"}
          rounded={"md"}
          _hover={{
            transform: "translateY(-2px)",
            boxShadow: "lg",
          }}
        >
          Remove Agent
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader>Confirmation!</PopoverHeader>
        <PopoverBody>Are you sure you want remove this agent?</PopoverBody>
        <PopoverFooter display="flex" justifyContent="flex-end">
          <ButtonGroup size="sm">
            <Button colorScheme="red" onClick={handleDelete}>
              Confirm
            </Button>
          </ButtonGroup>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  );
};

const HostAgentCard = ({ agentName, data }) => {
  return (
    <Flex
      // maxW={"lg"}
      w={"60vw"}
      bg={useColorModeValue("white", "gray.800")}
      p={5}
      boxShadow={"2xl"}
      rounded={"md"}
      justifyContent="space-between"
      alignItems={"center"}
    >
      <Flex gap={5} alignItems={"center"}>
        <Avatar
          size={"xl"}
          src={""}
          alt={"Author"}
          shadow={"xl"}
          css={{
            border: "2px solid white",
          }}
        />

        <Stack
          // direction={"col"}
          justify={"space-around"}
          spacing={6}
          minWidth={"200"}
        >
          <Text fontSize={"xl"} textALign={"center"}>
            <span>
              <Icon
                mr="1"
                fontSize="30"
                color={"brand.400"}
                as={BiUserCircle}
              />
            </span>
            {agentName ? agentName : "Name Undefined"}
          </Text>
          <Text color={"gray.500"}>
            <span>
              <Icon mr="1" fontSize="30" color={"brand.400"} as={BiUserPin} />
            </span>
            USER ID: {data ? data.attributes.agent_user.data.id : "null"}
          </Text>
        </Stack>
      </Flex>

      <Stack
        // direction={"row"}
        justify={"space-around"}
        spacing={6}
        // minWidth={"full"}
      >
        <ViewUsersUnderAgent agentId={data.attributes.agent_user.data.id} />
        <RemoveAgentButton id={data.id} />
      </Stack>
    </Flex>
  );
};

export default HostAgentCard;
