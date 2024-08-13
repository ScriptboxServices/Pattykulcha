"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Button,
  Container,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Remove, Add } from "@mui/icons-material";
import { getCartData,calculateGrandTotal } from "@/context";
import Image from "next/image";
import {
  IncludedItem,
  Kulcha,
  useAuthContext,
  useMenuContext,
} from "@/context";
import { usePathname, useRouter } from "next/navigation";
import { collection, deleteDoc, doc, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebase";

// Type guard to check if the item is an IncludedItem
const isIncludedItem = (item: Kulcha | IncludedItem): item is IncludedItem => {
  return (item as IncludedItem).items !== undefined;
};

const OrderHome: React.FC = () => {
  const {
    selectedkulchas,
    includedItems1,
    includedItems2,
    quantities,
    setCount,
    setQuantityForItem,
    grandTotal,
    setCarts,
    setGrandTotal,
    carts
  } = useMenuContext();

  const router = useRouter();
  const pathName = usePathname()
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const { user } = useAuthContext();

  const [loading, setLoading] = useState(false);

  // const handleIncrease = (id: string) => {
  //   setQuantityForItem(id, (quantities[id] || 1) + 1);
  // };

  // const handleDecrease = (id: string) => {
  //   setQuantityForItem(id, quantities[id] > 1 ? quantities[id] - 1 : 1);
  // };

  const calculateTotal = (item: any, addon: any[]) => {
    const additionalTotal = addon?.reduce((acc, value) => {
      return (acc = acc + Number(value?.items?.[0]?.price));
    }, Number(item));
    return Number(additionalTotal.toFixed(2));
  };

  const getData = async (_id :string) => {
    if(_id){
      const result = await getCartData(_id)
      if(result){
        setGrandTotal(calculateGrandTotal(result || []))
        setCarts([...result] || [])
        setCount(result.length)
      }
    }
  }

  const handleRemove = async (id: string) => {
    console.log("first",id)
    try{
      const docRef = doc(db,'carts',id)
      await deleteDoc(docRef)
      getData(user?.id)
    }catch(err){
      console.log(err);
    }
  };

  useEffect(() => {
    getData(user?.uid)
  },[user])

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "10vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FAF3E0",
        flexDirection: "column",
        p: 4,
      }}>
      <Container maxWidth='xl'>
        {
          carts?.length !== 0 ? <>     
            {carts?.map((item) => {
              const { order } = item;
              const { kulcha, additional } = order;
              const total = calculateTotal(kulcha?.price, additional);
              return (
                <Paper
                  key={item.id}
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    p: 4,
                    backgroundColor: "#FFFFFF",
                    width: isSmallScreen ? "100%" : "57%",
                    boxShadow: "none",
                    mb: 2,
                    flexDirection: isSmallScreen ? "column" : "row",
                    borderRadius: "12px",
                    border: "1px solid #E5E7EB",
                    margin: "0 auto",
                    marginTop: "14px",
                  }}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "20px",
                      height: "auto",
                      justifyContent: "center",
                      mb: isSmallScreen ? 2 : 0,
                    }}>
                    <Image
                      src={kulcha?.image}
                      style={{
                        objectFit: "contain",
                        border: "1px solid black",
                        borderRadius: "50%",
                        height: "80px",
                      }}
                      alt={item.name}
                      width={80}
                      height={80}
                    />
                  </Box>
                  <Box sx={{ ml: isSmallScreen ? 0 : 3, flex: 1 }}>
                    <Typography
                      variant='h6'
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        fontWeight: "bold",
                        color: "#1F2937",
                        paddingBottom: "4px",
                      }}>
                      {kulcha?.name}
    
                      {/* Conditionally render price */}
                      {!(
                        item.quantity == 1 &&
                        (item.name == "Chana" ||
                          item.name == "Imli Pyaz Chutney" ||
                          item.name == "Amul Butter")
                      ) && (
                        <Typography
                          variant='body1'
                          sx={{ color: "#1F2937", fontWeight: "bold", mr: 2 }}>
                          ${kulcha?.price}
                        </Typography>
                      )}
                    </Typography>
                    <Typography
                      variant='h6'
                      sx={{
                        fontSize: "12px",
                        color: "#1F2937",
                        paddingBottom: "4px",
                      }}>
                      Add on items :
                    </Typography>
                    {additional?.map((add : any) => {
                      return (
                        <Box
                          key={add?.id}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            mt: isSmallScreen ? 2 : 0,
                            justifyContent: "space-between",
                            width: isSmallScreen ? "100%" : "auto",
                          }}>
                          <Typography
                            variant='body1'
                            sx={{
                              color: "#1F2937",
                              fontWeight: "bold",
                              fontSize: "14px",
                              mr: 2,
                            }}>
                            {add?.items?.[0]?.name}
                          </Typography>
                          <Typography
                            variant='body1'
                            sx={{
                              color: "#1F2937",
                              fontWeight: "bold",
                              fontSize: "14px",
                              mr: 2,
                            }}>
                            ${add?.items?.[0]?.price}
                          </Typography>
                        </Box>
                      );
                    })}
                    <hr style={{ margin: "3px 0" }}></hr>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mt: isSmallScreen ? 2 : 0,
                        justifyContent: "space-between",
                        width: isSmallScreen ? "100%" : "auto",
                      }}>
                      <Typography
                        variant='body1'
                        sx={{
                          color: "#1F2937",
                          fontWeight: "bold",
                          fontSize: "14px",
                          mr: 2,
                        }}>
                        Sub Total
                      </Typography>
                      <Typography
                        variant='body1'
                        sx={{
                          color: "#1F2937",
                          fontWeight: "bold",
                          fontSize: "14px",
                          mr: 2,
                        }}>
                        ${total}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mt: isSmallScreen ? 2 : 0,
                        justifyContent: "space-between",
                        width: isSmallScreen ? "100%" : "auto",
                      }}>
                      <Typography
                        variant='body1'
                        sx={{
                          color: "#1F2937",
                          fontWeight: "bold",
                          fontSize: "14px",
                          mr: 2,
                        }}>
                        Tax
                      </Typography>
                      <Typography
                        variant='body1'
                        sx={{
                          color: "#1F2937",
                          fontWeight: "bold",
                          fontSize: "14px",
                          mr: 2,
                        }}>
                        ${(total * 0.13).toFixed(2)}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mt: isSmallScreen ? 2 : 0,
                        justifyContent: "space-between",
                        width: isSmallScreen ? "100%" : "auto",
                      }}>
                      <Typography
                        variant='body1'
                        sx={{
                          color: "#1F2937",
                          fontWeight: "bold",
                          fontSize: "14px",
                          mr: 2,
                        }}>
                        Total
                      </Typography>
                      <Typography
                        variant='body1'
                        sx={{
                          color: "#1F2937",
                          fontWeight: "bold",
                          fontSize: "14px",
                          mr: 2,
                        }}>
                        ${(total * 0.13 + total)?.toFixed(2)}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: isSmallScreen
                          ? "space-between"
                          : "flex-start",
                        width: "100%",
                        mt: 2,
                      }}>
                      {/* <Button
                        onClick={() => router.push(`/cart`)}
                        sx={{
                          textTransform: "none",
                          color: "#1F2937",
                          fontWeight: "bold",
                          mr: 1,
                          backgroundColor: "#F3F4F6",
                          borderRadius: "5px",
                          px: 2,
                          "&:hover": {
                            backgroundColor: "#E5E7EB",
                          },
                        }}>
                        Edit
                      </Button> */}
                      <Button
                        onClick={() => handleRemove(item.id)}
                        sx={{
                          textTransform: "none",
                          color: "#B91C1C",
                          fontWeight: "bold",
                          backgroundColor: "#FEE2E2",
                          borderRadius: "5px",
                          px: 2,
                          "&:hover": {
                            backgroundColor: "#FECACA",
                          },
                        }}>
                        Remove
                      </Button>
                    </Box>
                  </Box>
                </Paper>
              );
            })} 
          </> : <>
              <Box
                alignItems={'center'}
              >
              <Typography
                      variant='h6'
                      sx={{
                        paddingBottom: "4px",
                        textAlign:'center',fontWeight: 700, color: "#162548", my: 3 
                      }}>

                      Your cart is empty.
                    </Typography>
              </Box>
          </> 
        }
        {/* <Box
          sx={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
          <Typography
            variant='h6'
            sx={{ mt: 4, fontWeight: "bold", color: "#1F2937" }}>
            Total: ${calculateGrandTotal()}
          </Typography>
        </Box> */}
          {
            pathName !== '/payment' && carts?.length !== 0 &&
            <Box
              display='flex'
              justifyContent='center'
              alignItems='center'
              minHeight='60vh'
              bgcolor='#FAF3E0'
              width='100%'
              padding={2}>
              <Paper
                elevation={3}
                style={{
                  padding: "24px",
                  width: "100%",
                  maxWidth: "900px",
                  margin: "0",
                }}>
                <Box display='flex' justifyContent="space-between" gap={2}>
                  <Typography variant='h6' style={{ fontWeight: 600 }}>
                    Total
                  </Typography>
                  <Typography variant='h6' style={{ fontWeight: 600 }}>
                    ${grandTotal}
                  </Typography>
                </Box>
                <Button
                  onClick={() => router.push(`/payment`)} 
                  fullWidth
                  variant="contained"
                  sx={{
                    backgroundColor: "#ECAB21",
                    color: "white",
                    paddingX: 4,
                    paddingY: 1,
                    mt:2,
                    fontWeight: "bold",
                    "&:hover": {
                      backgroundColor: "#FFC107",
                      color: "white",
                    },
                  }}
                >
                  Proceed to Payment
                </Button>
              </Paper>
            </Box>
          }
      </Container>
    </Box>
  );
};

export default OrderHome;
