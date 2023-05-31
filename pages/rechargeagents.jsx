import React, { useEffect, useState } from "react";

import moment from "moment";
import {
  useToast,
  Text,
  useColorModeValue,
  Input,
  Button,
  Badge,
  Flex,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  InputRightElement,
  InputGroup,
  useDisclosure,
} from "@chakra-ui/react";
import { MdOutlineSearch } from "react-icons/md";
import axios from "axios";

import Sidebar from "@/components/Sidebar";
import Head from "next/head";
import RechargeAgentCard from "@/components/RechargeAgentCard";
import { isAuthenticated } from "@/helper/auth";
import { API_URL } from "@/helper/api";

const AssignAgent = ({ jwt, getRechargeAgents }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [agentId, setAgentId] = useState(null);
  const toast = useToast();

  const handleAssign = async () => {
    try {
      const body = {
        data: {
          recharge_agent_user: agentId,
        },
      };

      const res = await axios.post(`${API_URL}recharge-agent-accounts`, body, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      if (res.status === 200) {
        toast({
          title: "Success",
          description: "Agent assigned successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setAgentId("");
        getRechargeAgents();
      } else {
        throw new Error(res.error?.message);
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: `Couldn't assign agent: ${error.message}`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      onClose();
    }
  };

  const handleChange = (e) => {
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

const ViewAgentTopups = ({ jwt }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [topups, setTopups] = useState([]);

  const getData = () => {
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
        <ModalContent
          p="5"
          bgGradient="linear(to-b, #01DAB3, #490871)"
          color="#fff"
        >
          <ModalHeader color="white">Recharged Accounts</ModalHeader>
          <ModalCloseButton />
          <ModalBody color="#fff">
            <Table>
              <Thead>
                <Tr color="#fff">
                  <Th>ID.</Th>
                  <Th>Name</Th>
                  <Th>Coins</Th>
                  <Th>Date & Time</Th>
                </Tr>
              </Thead>
              <Tbody>
                {topups.length ? (
                  topups.map((topup, i) => (
                    <Tr key={i}>
                      <Td>
                        <Badge colorScheme="purple" variant="outline">
                          ID: {topup.recharge_done_for.id}
                        </Badge>
                      </Td>
                      <Td>{topup.recharge_done_for.username}</Td>
                      <Td>{topup.coin_value}</Td>
                      <Td>
                        {moment(topup.createdAt).format("MMM Do YY, h:mm a")}
                      </Td>
                    </Tr>
                  ))
                ) : (
                  <Text textAlign="center">No transactions found</Text>
                )}
              </Tbody>
            </Table>
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

  const getRechargeAgents = async () => {
    try {
      let res = await axios.get(
        `${API_URL}recharge-agent-accounts?populate=*`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      setRechargeAgents(res.data.data);
    } catch (err) {
      console.log(err);
    }
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
          <Flex justify="space-between">
            <Text fontSize="2xl" fontWeight="semibold">
              Recharge Agents List
            </Text>
            <Flex>
              <ViewAgentTopups jwt={jwt} />
              <AssignAgent jwt={jwt} getRechargeAgents={getRechargeAgents} />
            </Flex>
          </Flex>

          <InputGroup
            maxW="60vw"
            mx="auto"
            mt={6}
            bg="white"
            rounded="md"
            boxShadow="2xl"
          >
            <InputRightElement color="brand.400">
              <MdOutlineSearch />
            </InputRightElement>
            <Input
              type="text"
              name="Search"
              placeholder="Search..."
              onChange={(e) => setSearch(e.target.value.toLowerCase())}
              py={4}
            />
          </InputGroup>

          <Flex justify="space-around" flexWrap="wrap" gap={10} mt={10}>
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
              .map((rechargeAgent, i) => (
                <RechargeAgentCard
                  key={i}
                  agentName={
                    rechargeAgent.attributes?.recharge_agent_user?.data
                      ?.attributes?.first_name
                  }
                  data={rechargeAgent}
                  getRechargeAgents={getRechargeAgents}
                />
              ))}
          </Flex>
        </Sidebar>
      </main>
    </>
  );
};

export default RechargeAgents;
