import { useEffect, useState } from "react";
import { useToast, Text, Flex } from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import { MdDeleteOutline } from "react-icons/md";
import Head from "next/head";

import Sidebar from "@/components/Sidebar";
import SellerCard from "@/components/SellerCard";
import { isAuthenticated } from "@/helper/auth";
import { API_URL } from "@/helper/api";

const Sellers = () => {
  const [sellers, setSellers] = useState([]);
  const [profits, setProfits] = useState([]);
  const toast = useToast();

  const auth = isAuthenticated();
  const jwt = auth.data?.jwt;

  const getSellerEarnings = async () => {
    let res = await axios.get(`${API_URL}seller-earnings`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    let data = res.data;
    setProfits(data);
  };

  const getSellers = async () => {
    try {
      const res = await axios.get(`${API_URL}seller-accounts?populate=*`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      setSellers(res.data.data);
      console.log("hurrr", sellers);
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Failed to fetch sellers",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    getSellers();
    getSellerEarnings();
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
              Manage Sellers
            </Text>
          </Flex>
          <Flex justify="space-around" flexWrap="wrap">
            {sellers.map((seller, i) => (
              <SellerCard
                key={i}
                sellerName={
                  seller?.attributes?.seller?.data?.attributes?.first_name
                }
                displayName={seller?.attributes?.display_name}
                seller={seller}
                profits={profits}
                sellerID={seller?.id}
              />
            ))}
          </Flex>
        </Sidebar>
      </main>
    </>
  );
};

export default Sellers;
