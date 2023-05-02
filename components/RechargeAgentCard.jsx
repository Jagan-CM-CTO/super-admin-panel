import { isAuthenticated } from "@/helper/auth";
import {
  Heading,
  Avatar,
  Popover,
  PopoverTrigger,
  PopoverContent,
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
  PopoverHeader,
  PopoverBody,
  HStack,
  PopoverFooter,
  PopoverArrow,
  Modal,
  ModalOverlay,
  ModalContent,
  CardBody,
  Card,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useToast,
  PopoverCloseButton,
  PopoverAnchor,
  ButtonGroup,
  Box,
  Center,
  Image,
  Input,
  Flex,
  Icon,
  Text,
  Stack,
  Button,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import Router, { useRouter } from "next/router";
import { useState } from "react";
import { GiTwoCoins } from "react-icons/gi";
import { BiUserCircle, BiUserPin } from "react-icons/bi";
import moment from "moment";

const RemoveAgentButton = ({ id }) => {
  const { isOpen, onToggle, onClose } = useDisclosure();
  const toast = useToast();
  // const router = Router();

  let auth = isAuthenticated();
  let jwt = auth.data?.jwt;
  // console.log(id);
  const handleDelete = async () => {
    let res = await axios.delete(
      `https://cloudmagician.co.in/api/recharge-agent-accounts/${id}`,
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
          mt={8}
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

const RechargeCoins = ({ agentId }) => {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [amount, setamount] = useState("");
  const toast = useToast();

  const auth = isAuthenticated();

  const jwt = auth.data?.jwt;
  const handleRecharge = async () => {
    // console.log(amount);
    let body = {
      // users: {
      //   receiverId: agentId,
      // },
      receivers: [agentId],
      gift: {
        coin_value: amount,
      },
    };
    // console.log(body);

    let res = await axios.post(
      `https://cloudmagician.co.in/api/send-coins/`,
      body,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );
    // console.log(res);
    if (!res.data) {
      // console.log("cURRRRR", res);
      toast({
        title: "error",
        description: `Recharge failed`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } else {
      toast({
        title: "Success",
        description: "Recharge successful",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      console.log(res);
      onClose();
      router.reload();
    }
    return res;
  };

  const handleChange = (e) => {
    setamount(e.target.value);
  };

  return (
    <>
      <Button onClick={onOpen} bg="brand.400" color="white" width="full">
        Recharge Coins
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Recharge Coins</ModalHeader>
          <ModalCloseButton />
          <ModalBody py={5}>
            <Flex>
              <Input
                placeholder="eg. 5000"
                type="number"
                mr={4}
                value={amount}
                min={1}
                onChange={handleChange}
              />
              <Button color="white" bg="brand.400" onClick={handleRecharge}>
                Recharge
              </Button>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

const ViewAgentTransactions = ({ agentId }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [coinRequests, setCoinRequests] = useState([]);

  const getData = () => {
    let auth = isAuthenticated();
    let jwt = auth.data?.jwt;

    try {
      axios
        .get(
          "https://cloudmagician.co.in/api/coin-requests?sort=createdAt:DESC&populate=*",
          {
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          }
        )
        .then((res) => {
          setCoinRequests(res.data.data);
        });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Button
        onClick={() => {
          onOpen();
          getData();
        }}
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
        View Agent Transactions
      </Button>

      <Modal
        isOpen={isOpen}
        size="full"
        onClose={onClose}
        bgGradient="linear(to-b, #01DAB3, #490871)"
      >
        <ModalOverlay />
        <ModalContent p="5" bgGradient="linear(to-b, #01DAB3, #490871)">
          <ModalHeader color="white">Coin Recharge Requests</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Card>
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
                        <Th color="white">Requested By</Th>
                        <Th color="white">Coin Value</Th>
                        <Th color="white">Request Status</Th>

                        <Th color="white">Requested On</Th>
                        <Th color="white">Updated On</Th>
                      </Tr>
                    </Thead>
                    <Tbody color="white">
                      {coinRequests ? (
                        coinRequests
                          .filter((coinRequest) => {
                            if (
                              coinRequest.attributes?.recharge_agent_account?.data?.id
                                ?.toString()
                                .includes(agentId.toString())
                            ) {
                              return true;
                            }

                            return false;
                          })
                          .map((coinRequest, i) => {
                            return (
                              <Tr key={i}>
                                {/* <Td>{i + 1}</Td> */}
                                {/* <Td>
                                  <Text>
                                    {`${coinRequest.first_name} ${coinRequest.last_name}` ||
                                      "No name"}
                                  </Text>
                                  <Text>User ID: {coinRequest.id}</Text>
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
                                    <span>
                                      {coinRequest.received_coins || 0}
                                    </span>
                                  </Text>
                                </Td> */}
                                <Td>
                                  {coinRequest.attributes?.from_user?.data?.id}
                                </Td>
                                <Td>{coinRequest.attributes?.coin_value}</Td>
                                <Td>{coinRequest.attributes?.status}</Td>
                                <Td>
                                  {moment(
                                    coinRequest.attributes?.createdAt
                                  ).format("MMM Do YY, h:mm a")}
                                </Td>
                                <Td>
                                  {moment(
                                    coinRequest.attributes?.updatedAt
                                  ).format("MMM Do YY, h:mm a")}
                                </Td>
                              </Tr>
                            );
                          })
                      ) : (
                        <Text textAlign={"center"}>No transactions found</Text>
                      )}
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

const RechargeAgentCard = ({ agentName = "No name", data }) => {
  console.log(data);
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
            USER ID:{" "}
            {data ? data.attributes?.recharge_agent_user?.data?.id : "null"}
          </Text>

          <Text fontWeight={600} color={""}>
            <span>
              <Icon mr="1" fontSize="30" color={"yellow.400"} as={GiTwoCoins} />
            </span>
            {data.attributes.recharge_agent_user.data?.attributes?.wallet || 0}{" "}
            Coins
          </Text>
        </Stack>
      </Flex>

      <Stack
        // direction={"row"}
        justify={"space-around"}
        spacing={6}
        // minWidth={"full"}
      >
        <RechargeCoins
          agentId={data.attributes.recharge_agent_user?.data?.id}
        />

        {/* <Button
          w={"full"}
          mt={8}
          bg={useColorModeValue("brand.400", "gray.900")}
          color={"white"}
          rounded={"md"}
          _hover={{
            transform: "translateY(-2px)",
            boxShadow: "lg",
          }}
        >
          View Agent Transactions
        </Button> */}
        <ViewAgentTransactions agentId={data.id} />
        <RemoveAgentButton id={data.id} />
      </Stack>
    </Flex>
  );
};

export default RechargeAgentCard;
