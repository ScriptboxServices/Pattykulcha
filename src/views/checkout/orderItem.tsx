"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Container,
  useMediaQuery,
  useTheme,
  Alert,
} from "@mui/material";
import Image from "next/image";
import { calculateGrandTotal, getCartData, useAuthContext, useMenuContext } from "@/context";
import { usePathname, useRouter } from "next/navigation";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/firebase";
import Link from "next/link";

interface Props {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const OrderHome: React.FC<Props> = ({ setLoading }) => {
  const {
    address,
    setCount,
    grandTotal,
    setCarts,
    setGrandTotal,
    carts,
  } = useMenuContext();

  const router = useRouter();
  const pathName = usePathname();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const { user } = useAuthContext();

  const [error, setError] = useState(false);

  const calculateTotal = (item: any, addon: any[]) => {
    const additionalTotal = addon?.reduce((acc, value) => {
      return (acc =
        acc +
        Number(value?.items?.[0]?.price) * Number(value?.items?.[0]?.quantity));
    }, Number(item));
    return Number(additionalTotal.toFixed(2));
  };

  const getData = async (_id: string) => {
    try {
      if (_id) {
        const result = await getCartData(_id);
        if (result) {
          setGrandTotal(calculateGrandTotal(result || []));
          setCarts([...result] || []);
          setCount(result.length);
        }
        return;
      }
    } catch (err) {
      console.log(err);
      return err;
    }
  };

  const handleRemove = async (id: string) => {
    try {
      setLoading(true);
      const docRef = doc(db, "carts", id);
      await deleteDoc(docRef);
      await getData(user?.uid);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  return (
    <>
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
          position: "relative",
          backgroundImage:
            "url('/images/small/chana.png'), url('/images/small/chilli.png')",
          backgroundPosition: "left top 25%, right top 25%",
          backgroundSize: "200px 200px, 200px 200px",
          backgroundRepeat: "no-repeat, no-repeat",
          zIndex: 1,
        }}
      >
        <Container maxWidth="xl">
          {carts?.length === 0 ? (
            <Paper
              sx={{
                width: "100%",
                padding: "24px",
                backgroundColor: "#FFFFFF",
                textAlign: "center",
                margin: "0 auto",
                maxWidth: "400px",
                borderRadius: "12px",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  paddingBottom: "4px",
                  fontWeight: 700,
                  color: "#162548",
                  my: 3,
                }}
              >
                Your cart is empty.
              </Typography>
              <Link href="/home">
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#ECAB21",
                    color: "white",
                    borderRadius: 20,
                    paddingX: 4,
                    paddingY: 1,
                    fontWeight: "bold",
                    "&:hover": {
                      backgroundColor: "#FFC107",
                      color: "white",
                    },
                  }}
                >
                  Order Now
                </Button>
              </Link>
            </Paper>
          ) : (
            <>
              {carts?.map((item) => {
                const { order } = item;
                const { kulcha, additional } = order;
                const total = calculateTotal(kulcha?.price, additional);
                return (
                  <Paper
                    key={item.id}
                    sx={{
                      display: "flex",
                      alignItems: { xs: "center", lg: "flex-start" },
                      p: { xs: 2, lg: 4 },
                      backgroundColor: "#FFFFFF",
                      width: isSmallScreen ? "100%" : "57%",
                      boxShadow: "none",
                      mb: 2,
                      flexDirection: isSmallScreen ? "column" : "row",
                      borderRadius: "12px",
                      border: "1px solid #E5E7EB",
                      margin: "0 auto",
                      marginTop: "14px",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "20px",
                        height: "auto",
                        justifyContent: "center",
                        mb: isSmallScreen ? 2 : 0,
                      }}
                    >
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
                        variant="h6"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          fontWeight: "bold",
                          color: "#1F2937",
                          paddingBottom: "4px",
                        }}
                      >
                        {kulcha?.name} (quantity :{" "}
                          {kulcha?.quantity})
                        <Typography
                          variant="body1"
                          sx={{
                            color: "#1F2937",
                            fontWeight: "bold",
                            mr: 2,
                          }}
                        >
                          ${kulcha?.price} x {kulcha?.quantity}
                        </Typography>
                      </Typography>
                        {
                          additional?.length !== 0 && (
                            <>
                              <Typography
                                variant="h6"
                                sx={{
                                  fontSize: "12px",
                                  color: "#1F2937",
                                  paddingBottom: "4px",
                                }}
                              >
                                Add on items :
                              </Typography>
                              {additional?.map((add: any) => {
                                return (
                                  <Box
                                    key={add?.id}
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      mt: isSmallScreen ? 2 : 0,
                                      justifyContent: "space-between",
                                      width: isSmallScreen ? "100%" : "auto",
                                    }}
                                  >
                                    <Typography
                                      variant="body1"
                                      sx={{
                                        color: "#1F2937",
                                        fontWeight: "bold",
                                        fontSize: "14px",
                                        mr: 2,
                                      }}
                                    >
                                      {add?.items?.[0]?.name} (quantity :{" "}
                                      {add?.items?.[0]?.quantity})
                                    </Typography>
                                    <Typography
                                      variant="body1"
                                      sx={{
                                        color: "#1F2937",
                                        fontWeight: "bold",
                                        fontSize: "14px",
                                        mr: 2,
                                      }}
                                    >
                                      ${add?.items?.[0]?.price} x{" "}
                                      {add?.items?.[0]?.quantity}
                                    </Typography>
                                  </Box>
                                );
                              })}
                            </>
                          ) 
                        }
                      <hr style={{ margin: "3px 0" }}></hr>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mt: isSmallScreen ? 2 : 0,
                          justifyContent: "space-between",
                          width: isSmallScreen ? "100%" : "auto",
                        }}
                      >
                        <Typography
                          variant="body1"
                          sx={{
                            color: "#1F2937",
                            fontWeight: "bold",
                            fontSize: "14px",
                            mr: 2,
                          }}
                        >
                          Sub Total
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            color: "#1F2937",
                            fontWeight: "bold",
                            fontSize: "14px",
                            mr: 2,
                          }}
                        >
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
                        }}
                      >
                        <Typography
                          variant="body1"
                          sx={{
                            color: "#1F2937",
                            fontWeight: "bold",
                            fontSize: "14px",
                            mr: 2,
                          }}
                        >
                          Tax
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            color: "#1F2937",
                            fontWeight: "bold",
                            fontSize: "14px",
                            mr: 2,
                          }}
                        >
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
                        }}
                      >
                        <Typography
                          variant="body1"
                          sx={{
                            color: "#1F2937",
                            fontWeight: "bold",
                            fontSize: "14px",
                            mr: 2,
                          }}
                        >
                          Total
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            color: "#1F2937",
                            fontWeight: "bold",
                            fontSize: "14px",
                            mr: 2,
                          }}
                        >
                          ${(total * 0.13 + total)?.toFixed(2)}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: isSmallScreen
                            ? "center"
                            : "flex-start",
                          width: "100%",
                          mt: 2,
                        }}
                      >
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
                          }}
                        >
                          Remove
                        </Button>
                      </Box>
                    </Box>
                  </Paper>
                );
              })}
            </>
          )}
          {pathName !== "/payment" && carts?.length !== 0 && (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight="40vh"
              bgcolor="#FAF3E0"
              width="100%"              
            >
              <Paper
                elevation={3}
                style={{
                  padding: "24px",
                  width: "100%",
                  maxWidth: "500px",
                  margin: "0",
                }}
              >
                <Box display="flex" justifyContent="space-between" gap={2}>
                  <Typography variant="h6" style={{ fontWeight: 600 }}>
                    Total
                  </Typography>
                  <Typography variant="h6" style={{ fontWeight: 600 }}>
                    ${grandTotal}
                  </Typography>
                </Box>
                <Button
                  onClick={() => {
                    if (!address?.raw) {
                      setError(true);
                      return;
                    }
                    setError(false);
                    return router.push("/payment");
                  }}
                  fullWidth
                  variant="contained"
                  sx={{
                    backgroundColor: "#ECAB21",
                    color: "white",
                    paddingX: 4,
                    paddingY: 1,
                    mt: 2,
                    fontWeight: "bold",
                    "&:hover": {
                      backgroundColor: "#FFC107",
                      color: "white",
                    },
                  }}
                >
                  Proceed to Payment
                </Button>
                {error && (
                  <Alert sx={{ mt: 2 }} variant="outlined" severity="error">
                    Before proceeding, please update address.
                  </Alert>
                )}
              </Paper>
            </Box>
          )}
        </Container>
      </Box>
    </>
  );
};

export default OrderHome;
