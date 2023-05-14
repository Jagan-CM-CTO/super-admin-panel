import Sidebar from "@/components/Sidebar";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import {
  useToast,
  Text,
  useColorModeValue,
  InputGroup,
  Table,
  InputRightElement,
  Flex,
  Button,
  Icon,
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  Input,
  FormLabel,
  Textarea,
  NumberInput,
  NumberIncrementStepper,
  NumberDecrementStepper,
  NumberInputStepper,
  NumberInputField,
  Select,
  Card,
  CardBody,
  TableContainer,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
} from "@chakra-ui/react";

import { MdOutlineSearch } from "react-icons/md";
import axios from "axios";
import { useRouter } from "next/router";
import SellerCard from "../components/SellerCard";
import { isAuthenticated } from "@/helper/auth";
import RechargeAgentCard from "@/components/RechargeAgentCard";
import moment from "moment";
import { API_URL } from "@/helper/api";

const AssignAgent = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [agentId, setAgentId] = useState(null);

  const toast = useToast();
  const router = useRouter();

  const auth = isAuthenticated();
  const jwt = auth.data?.jwt;
  const handleAssign = async () => {
    // console.log(agentId);
    let body = {
      data: {
        recharge_agent_user: agentId,
      },
    };
    // console.log(body);
    let res = await axios.post(`${API_URL}recharge-agent-accounts`, body, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    // console.log(res);
    if (res.status !== 200) {
      // console.log("HURRRRR", res);
      toast({
        title: "error",
        description: `Couldn't assign agent\n ${res.error?.message}`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } else {
      toast({
        title: "Success",
        description: "Agent assigned successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onClose();
      router.reload();
    }
    return res;
  };

  const handleChange = (e) => {
    // console.log(e.target.value);
    setAgentId(e.target.value);
  };

  return (
    <>
      <Button onClick={onOpen} bg="brand.400" color="white">
        Assign Agent
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Assign Agent</ModalHeader>
          <ModalCloseButton />
          <ModalBody py={5}>
            <Flex>
              <Input
                placeholder="User ID"
                type="number"
                mr={4}
                value={agentId}
                onChange={handleChange}
              />
              <Button color="white" bg="brand.400" onClick={handleAssign}>
                Assign
              </Button>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

const ViewAgentTopups = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [topups, setTopups] = useState([]);

  const getData = () => {
    let auth = isAuthenticated();
    let jwt = auth.data?.jwt;

    try {
      axios
        .get(`${API_URL}recharges-by-me?sort=createdAt:DESC&populate=*`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        })
        .then((res) => {
          console.log(res);
          setTopups(res.data);
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
        // w={"full"}

        bg={useColorModeValue("#151f21", "gray.900")}
        color={"white"}
        mr={4}
        rounded={"md"}
        _hover={{
          transform: "translateY(-2px)",
          boxShadow: "lg",
        }}
      >
        Recharged Accounts
      </Button>

      <Modal
        isOpen={isOpen}
        size="full"
        onClose={onClose}
        bgGradient="linear(to-b, #01DAB3, #490871)"
      >
        <ModalOverlay />
        <ModalContent p="5" bgGradient="linear(to-b, #01DAB3, #490871)">
          <ModalHeader color="white">Recharged Accounts</ModalHeader>
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
                        <Th color="white">ID.</Th>
                        <Th color="white">Name</Th>
                        <Th color="white">Coins</Th>
                        <Th color="white">Date & Time</Th>
                      </Tr>
                    </Thead>
                    <Tbody color="white">
                      {topups ? (
                        topups.map((topup, i) => {
                          return (
                            <Tr key={i}>
                              <Td>
                                <Badge
                                  colorScheme="purple"
                                  color="white"
                                  variant="outline"
                                >
                                  ID: {topup.recharge_done_for.id}
                                </Badge>
                              </Td>
                              <Td>{topup.recharge_done_for.username}</Td>
                              <Td>{topup.coin_value}</Td>
                              <Td>
                                {moment(topup.createdAt).format(
                                  "MMM Do YY, h:mm a"
                                )}
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

const RechargeAgents = () => {
  const [rechargeAgents, setRechargeAgents] = useState([]);
  const [search, setSearch] = useState(false);
  const toast = useToast();

  let auth = isAuthenticated();
  let jwt = auth.data?.jwt;
  // console.log(jwt);
  const getRechargeAgents = async () => {
    let res = await axios.get(`${API_URL}recharge-agent-accounts?populate=*`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    setRechargeAgents(res.data.data);
  };

  useEffect(() => {
    getRechargeAgents();
  }, []);

  return (
    <>
      <Head>
        <title>Peace Garden</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Sidebar>
          <Flex justify={"space-between"}>
            <Text fontSize={"2xl"} fontWeight={"semibold"}>
              Recharge Agents List
            </Text>
            <Flex>
              <ViewAgentTopups />
              <AssignAgent />
            </Flex>
          </Flex>

          <InputGroup
            maxW="60vw"
            mx="auto"
            mt={6}
            bg="white"
            rounded="md"
            boxShadow={"2xl"}
          >
            <InputRightElement color="brand.400">
              <MdOutlineSearch />
            </InputRightElement>
            <Input
              type="text"
              name="Secrch"
              placeholder="Search..."
              onChange={(e) => setSearch(e.target.value.toLowerCase())}
              py={4}
            />
          </InputGroup>

          <Flex justify={"space-around"} flexWrap={"wrap"} gap={10} mt={10}>
            {rechargeAgents
              .filter((rechargeAgent) => {
                if (!search) {
                  return true;
                }

                if (
                  rechargeAgent.attributes?.recharge_agent_user?.data?.id
                    ?.toString()
                    .includes(search) ||
                  rechargeAgent.attributes?.recharge_agent_user?.data?.attributes?.first_name
                    ?.toLowerCase()
                    .includes(search)
                ) {
                  return true;
                }

                return false;
              })

              .map((rechargeAgent, i) => {
                // console.log("Recharge", rechargeAgent);
                return (
                  <RechargeAgentCard
                    key={i}
                    agentName={
                      rechargeAgent.attributes?.recharge_agent_user?.data
                        ?.attributes?.first_name
                    }
                    data={rechargeAgent}
                  />
                );
              })}
          </Flex>
        </Sidebar>
      </main>
    </>
  );
};

export default RechargeAgents;
