import { API_URL } from "@/helper/api";
import { isAuthenticated } from "@/helper/auth";
import {
  Heading,
  Avatar,
  Box,
  Center,
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
  Input,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { MdEdit } from "react-icons/md";

const SellerInfoModal = ({ sellerInfo }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

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
        View Seller Details
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>About Seller</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Card>
              <CardHeader>
                <Heading size="md">Seller Info</Heading>
              </CardHeader>

              <CardBody>
                <Stack divider={<StackDivider />} spacing="4">
                  <Box>
                    <Heading size="xs" textTransform="uppercase">
                      Display Name
                    </Heading>
                    <Text pt="2" fontSize="sm">
                      {sellerInfo?.attributes.display_name}
                    </Text>
                  </Box>
                  <Box>
                    <Heading size="xs" textTransform="uppercase">
                      Seller Full Name
                    </Heading>
                    <Text pt="2" fontSize="sm">
                      {sellerInfo?.attributes.full_name}
                    </Text>
                  </Box>
                  <Box>
                    <Heading size="xs" textTransform="uppercase">
                      Shop ID
                    </Heading>
                    <Text pt="2" fontSize="sm">
                      {sellerInfo?.attributes.shop_id}
                    </Text>
                  </Box>
                  <Box>
                    <Heading size="xs" textTransform="uppercase">
                      Registration ID
                    </Heading>
                    <Text pt="2" fontSize="sm">
                      {sellerInfo?.attributes.registration_id}
                    </Text>
                  </Box>
                  <Box>
                    <Heading size="xs" textTransform="uppercase">
                      Establishment ID
                    </Heading>
                    <Text pt="2" fontSize="sm">
                      {sellerInfo?.attributes.establishment_id}
                    </Text>
                  </Box>
                  <Box>
                    <Heading size="xs" textTransform="uppercase">
                      Street Address
                    </Heading>
                    <Text pt="2" fontSize="sm">
                      {sellerInfo?.attributes.street_address}
                    </Text>
                  </Box>
                  <Box>
                    <Heading size="xs" textTransform="uppercase">
                      City
                    </Heading>
                    <Text pt="2" fontSize="sm">
                      {sellerInfo?.attributes.city}
                    </Text>
                  </Box>
                  <Box>
                    <Heading size="xs" textTransform="uppercase">
                      Email
                    </Heading>
                    <Text pt="2" fontSize="sm">
                      {sellerInfo?.attributes.email}
                    </Text>
                  </Box>
                  <Box>
                    <Heading size="xs" textTransform="uppercase">
                      Phone
                    </Heading>
                    <Text pt="2" fontSize="sm">
                      {sellerInfo?.attributes.phone}
                    </Text>
                  </Box>
                  <Box>
                    <Heading size="xs" textTransform="uppercase">
                      Alternate Phone
                    </Heading>
                    <Text pt="2" fontSize="sm">
                      {sellerInfo?.attributes.alternate_phone}
                    </Text>
                  </Box>
                  <Box>
                    <Heading size="xs" textTransform="uppercase">
                      Building Nameplate
                    </Heading>

                    <Image
                      src={
                        sellerInfo?.attributes?.building_nameplate.data[0]
                          ?.attributes?.url
                      }
                      alt="building_nameplate"
                      mx="auto"
                      my="4"
                    />
                  </Box>
                  <Box>
                    <Heading size="xs" textTransform="uppercase">
                      Company Nameplate
                    </Heading>

                    <Image
                      src={
                        sellerInfo?.attributes?.company_nameplate.data[0]
                          ?.attributes?.url
                      }
                      fallbackSrc=""
                      alt="building_nameplate"
                      mx="auto"
                      my="4"
                    />
                  </Box>
                </Stack>
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

const UpdateSellingPrice = ({ getProducts, productID }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [sellingPrice, setSellingPrice] = useState(null);
  const toast = useToast();
  let auth = isAuthenticated();
  let jwt = auth?.data?.jwt;

  const updateProduct = async () => {
    let res = await axios.put(
      `${API_URL}ecommerce-products/${productID}`,
      {
        data: { selling_price: sellingPrice },
      },
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );

    return res;
  };

  const onSubmit = (event) => {
    event.preventDefault();

    updateProduct().then((data) => {
      if (data.error) {
        toast({
          title: "Error",
          description: "Updation Failed",
          status: "danger",
          duration: 2000,
          isClosable: true,
        });
      } else {
        setSellingPrice(null);

        toast({
          title: "Success",
          description: "Selling Price updated successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        onClose();
        getProducts();
      }
    });
  };

  const handleChange = (e) => {
    setSellingPrice(e.target.value);
  };

  return (
    <>
      <Button onClick={onOpen} color="brand.400" bg="transparent">
        <MdEdit />
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Selling Price</ModalHeader>
          <ModalCloseButton />
          <ModalBody py={5}>
            <Flex>
              <Input
                placeholder=""
                type="number"
                mr={4}
                value={sellingPrice}
                onChange={handleChange}
              />
              <Button color="white" bg="brand.400" onClick={onSubmit}>
                Update
              </Button>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

const ViewProductsModal = ({ sellerID }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [products, setProducts] = useState([]);

  const getProducts = async () => {
    if (typeof window !== "undefined") {
      let auth = isAuthenticated();
      let jwt = auth.data?.jwt;
      let res = await axios.get(`${API_URL}seller-products/${sellerID}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      setProducts(res.data?.ecommerce_products);
      console.log("hellaaaaaaa", res.data?.ecommerce_products);
    }
  };

  useEffect(() => {
    getProducts();
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
        View Listed Products
      </Button>

      <Modal isOpen={isOpen} size="full" onClose={onClose}>
        <ModalOverlay />
        <ModalContent p="5">
          <ModalHeader>Seller Products</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Card>
              <CardHeader>
                <Heading size="md">Products by this seller</Heading>
              </CardHeader>

              <CardBody>
                <TableContainer bg={"#fff"} rounded={10} shadow={30} mt={5}>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Product Name</Th>
                        <Th>Category</Th>
                        <Th>Sub-Category</Th>
                        <Th>Selling Price</Th>
                        <Th>{"Seller's Price"}</Th>
                        <Th>Availability</Th>

                        <Th>Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {products?.map((product, i) => {
                        return (
                          <Tr key={i}>
                            <Td>
                              <Flex align="center">
                                {/* <Image
                                  boxSize="70px"
                                  objectFit="cover"
                                  src={`https://cloudmagician.co.in${product.attributes.product_image?.data?.attributes?.url}`}
                                  alt="product_img"
                                  fallbackSrc="https://via.placeholder.com/70"
                                  mr="2"
                                /> */}
                                <Text>{product.product_name}</Text>
                              </Flex>
                            </Td>
                            <Td>{product?.ecommerce_subcategory?.title}</Td>
                            <Td>{product?.ecommerce_category?.title}</Td>
                            <Td
                              display={"flex"}
                              justifyContent={"space-between"}
                              alignItems={"center"}
                            >
                              ${product.selling_price}
                              <UpdateSellingPrice
                                productID={product?.id}
                                getProducts={getProducts}
                              />
                            </Td>
                            <Td textAlign="center">${product.seller_price}</Td>
                            <Td>
                              <Badge colorScheme="green" textTransform={"none"}>
                                In-Stock
                              </Badge>
                            </Td>

                            <Td>
                              <ViewProductModal productId={product.id} />

                              {/* <Button
                                ml="4"
                                color="red.400"
                                onClick={() => handleDelete(product.id)}
                              >
                                <Icon as={MdDeleteOutline} />
                              </Button> */}
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

const ViewProductModal = ({ productId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [product, setProduct] = useState(null);

  const loadProduct = async () => {
    try {
      const response = await axios.get(
        `${API_URL}ecommerce-products/${productId}?populate=*`
      );
      const data = response.data.data;

      setProduct(data);
      setIsOpen(true);
    } catch (error) {
      console.error("Error loading product:", error);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Button
        onClick={loadProduct}
        colorScheme="brand.400"
        bg="brand.400"
        size="md"
      >
        View
      </Button>
      <Modal isOpen={isOpen} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Product Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {product ? (
              <Stack spacing={4}>
                <Box>
                  <Text fontSize="sm" fontWeight="bold">
                    Product Name
                  </Text>
                  <Text>{product.attributes.product_name}</Text>
                </Box>
                <Divider />
                <Box>
                  <Text fontSize="sm" fontWeight="bold">
                    Short Description
                  </Text>
                  <Text>{product.attributes.short_description}</Text>
                </Box>
                <Divider />
                <Box>
                  <Text fontSize="sm" fontWeight="bold">
                    Long Description
                  </Text>
                  <Text>{product.attributes.long_description}</Text>
                </Box>
                <Divider />
                <Box>
                  <Text fontSize="sm" fontWeight="bold">
                    {"Seller's Price"}
                  </Text>
                  <Text>{product.attributes.seller_price}</Text>
                </Box>
                <Divider />
                <Box>
                  <Text fontSize="sm" fontWeight="bold">
                    Selling Price
                  </Text>
                  <Text>{product.attributes.selling_price}</Text>
                </Box>
                <Divider />
                <Box>
                  <Text fontSize="sm" fontWeight="bold">
                    Sub-category
                  </Text>
                  <Text>
                    {
                      product.attributes.ecommerce_subcategory?.data?.attributes
                        ?.title
                    }
                  </Text>
                </Box>
                <Divider />
              </Stack>
            ) : (
              <Text>Loading product...</Text>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              bg="brand.400"
              mr={3}
              onClick={handleClose}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

const SellerCard = ({ sellerName, displayName, seller, profits, sellerID }) => {
  return (
    <Center py={6}>
      <Box
        maxW={"md"}
        w={"30vw"}
        bg={useColorModeValue("white", "gray.800")}
        boxShadow={"2xl"}
        rounded={"md"}
        overflow={"hidden"}
        display={"flex"}
        flexDirection="column"
        justify="center"
        alignItems={"center"}
      >
        <Image
          h={"120px"}
          w={"full"}
          alt="profile_pic"
          src={
            "https://images.unsplash.com/photo-1612865547334-09cb8cb455da?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80"
          }
          objectFit={"cover"}
        />
        <Flex justify={"center"} mt={-12}>
          <Avatar
            size={"xl"}
            src={""}
            alt={"Author"}
            shadow={"xl"}
            css={{
              border: "2px solid white",
            }}
          />
        </Flex>

        <Box p={6}>
          <Stack spacing={0} align={"center"} mb={5}>
            <Heading fontSize={"2xl"} fontWeight={500} fontFamily={"body"}>
              {sellerName ? sellerName : "No name"}
            </Heading>
            <Text color={"gray.500"}>
              {displayName ? displayName : "iTech Solutions"}
            </Text>
          </Stack>

          <Stack
            direction={"row"}
            justify={"space-evenly"}
            wrap="wrap"
            spacing={5}
            minWidth={"full"}
          >
            {/* <Stack spacing={0} align={"center"}>
              <Text fontWeight={600}>{23}</Text>
              <Text fontSize={"sm"} color={"gray.500"}>
                {"Seller's Total Revenue"}
              </Text>
            </Stack> */}
            <Stack spacing={0} align={"center"}>
              <Text fontWeight={600} color="green.500">
                {" "}
                ${profits[sellerID].seller_price_sum}
              </Text>
              <Text fontSize={"sm"} color={"gray.500"}>
                Seller Balance
              </Text>
            </Stack>
            <Stack spacing={0} align={"center"}>
              <Text fontWeight={600} color="green.500">
                $
                {profits[sellerID].selling_price_sum -
                  profits[sellerID].seller_price_sum}
              </Text>
              <Text fontSize={"sm"} color={"gray.500"}>
                Our Balance
              </Text>
            </Stack>
          </Stack>

          <SellerInfoModal sellerInfo={seller} />
          <ViewProductsModal
            products={seller?.attributes.ecommerce_products.data}
            sellerID={seller.id}
          />
        </Box>
      </Box>
    </Center>
  );
};

export default SellerCard;
