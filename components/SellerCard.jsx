import { API_URL } from "@/helper/api";
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
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";

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
                      src={`https://cloudmagician.co.in${sellerInfo?.attributes?.building_nameplate.data[0]?.attributes?.url}`}
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
                      src={`https://cloudmagician.co.in${sellerInfo?.attributes?.company_nameplate.data[0]?.attributes?.url}`}
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
const ViewProductsModal = ({ products }) => {
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
                        <Th>Sub-Category</Th>
                        <Th>Selling Price</Th>
                        <Th>Retail Price</Th>
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
                                <Text>{product.attributes.product_name}</Text>
                              </Flex>
                            </Td>
                            <Td>
                              {
                                product.attributes.ecommerce_subcategory?.data
                                  ?.attributes?.title
                              }
                            </Td>
                            <Td>${product.attributes.selling_price}</Td>
                            <Td>${product.attributes.retail_price}</Td>
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
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [values, setvalues] = useState({
    product_name: "",
    short_description: "",
    long_description: "",
    selling_price: "",
    retail_price: "",
    // ecommerce_category: "",
    ecommerce_subcategory: "",
    product_image: "",
    // loading: false,
    // error: "",
    // createdProduct: "",
    // getRedicrect: false,
    // formData: "",
  });

  const loadProduct = async () => {
    // console.log(productId);
    let res = await axios.get(
      `${API_URL}ecommerce-products/${productId}?populate=*`
    );
    let data = await res.data.data;
    // console.log(data);
    // console.log(data.attributes.selling_price);
    // console.log(data.attributes.retail_price);

    setvalues({
      ...values,
      product_name: data.attributes.product_name
        ? data.attributes.product_name
        : "",
      short_description: data.attributes.short_description
        ? data.attributes.short_description
        : "",
      long_description: data.attributes.long_description
        ? data.attributes.long_description
        : "",
      selling_price: data.attributes.selling_price
        ? data.attributes.selling_price
        : "",
      retail_price: data.attributes.retail_price
        ? data.attributes.retail_price
        : "",
      ecommerce_category:
        data.attributes?.ecommerce_category?.data?.attributes?.title,
      ecommerce_subcategory:
        data.attributes?.ecommerce_subcategory?.data?.attributes?.title,
      // product_image: data.attributes?.ecommerce_category?.data?.attributes?.title,
    });
    // console.log(values);
    onOpen();
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
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Product Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text fontSize={"sm"} as={"b"}>
              Product Name
            </Text>
            <Text mb={6}>{values.product_name}</Text>
            <Divider />
            <Text fontSize={"sm"} as={"b"} mt={8}>
              Short Description
            </Text>
            <Text mb={2}>{values.short_description}</Text>
            <Divider />
            <Text fontSize={"sm"} as={"b"} mt={8}>
              Long Description
            </Text>
            <Text mb={2}>{values.long_description}</Text>
            <Divider />
            <Text fontSize={"sm"} as={"b"} mt={8}>
              Retail Price
            </Text>
            <Text mb={2}>{values.retail_price} QAR</Text>
            <Divider />
            <Text fontSize={"sm"} as={"b"} mt={8}>
              Selling Price
            </Text>
            <Text mb={2}>{values.selling_price} QAR</Text>
            <Divider />
            <Text fontSize={"sm"} as={"b"} mt={8}>
              Sub-category
            </Text>
            <Text mb={2}>{values.ecommerce_subcategory}</Text>
            <Divider />
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

const SellerCard = ({ sellerName, displayName, data }) => {
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
              {sellerName ? sellerName : "Emiram"}
            </Heading>
            <Text color={"gray.500"}>
              {displayName ? displayName : "iTech Solutions"}
            </Text>
          </Stack>

          <Stack
            direction={"row"}
            justify={"space-around"}
            spacing={6}
            minWidth={"full"}
          >
            {/* <Stack spacing={0} align={"center"}>
              <Text fontWeight={600}>23</Text>
              <Text fontSize={"sm"} color={"gray.500"}>
                Products listed
              </Text>
            </Stack>
            <Stack spacing={0} align={"center"}>
              <Text fontWeight={600}>394</Text>
              <Text fontSize={"sm"} color={"gray.500"}>
                Sold Units
              </Text>
            </Stack>
            <Stack spacing={0} align={"center"}>
              <Text fontWeight={600}>$56k</Text>
              <Text fontSize={"sm"} color={"gray.500"}>
                Net Revenue
              </Text>
            </Stack> */}
          </Stack>

          <SellerInfoModal sellerInfo={data} />
          <ViewProductsModal
            products={data?.attributes.ecommerce_products.data}
          />
        </Box>
      </Box>
    </Center>
  );
};

export default SellerCard;
