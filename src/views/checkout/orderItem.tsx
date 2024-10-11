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
  IconButton,
  Dialog,
  DialogContent,
  Grid,
  DialogTitle,
} from "@mui/material";
import Image from "next/image";
import {
  calculateDeliveryCharges,
  calculateGrandTotal,
  getCartData,
  useAuthContext,
  useMenuContext,
} from "@/context";
import { usePathname, useRouter } from "next/navigation";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/firebase";
import Link from "next/link";
import WarningIcon from "@mui/icons-material/Warning";
import CloseIcon from "@mui/icons-material/Close";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { encrypt } from "@/utils/commonFunctions";

interface Props {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedOption: React.Dispatch<React.SetStateAction<string>>;
  selectedOption : string,
  setPickupTime: React.Dispatch<React.SetStateAction<string>>;
  pickupTime : string,
}

const OrderHome: React.FC<Props> = ({ setLoading,setSelectedOption,selectedOption ,pickupTime,setPickupTime }) => {
  const {
    setCount,
    grandTotal,
    setCarts,
    setGrandTotal,
    carts,
    isAddressReachable,
  } = useMenuContext();

  const router = useRouter();
  const pathName = usePathname();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const { user, metaData, kitchenMetaData } = useAuthContext();

  const [error, setError] = useState({
    status : false,
    message : ''
  });
  const [dialogboxOpen, setDialogboxOpen] = useState(false);

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
          setCarts([...result]);
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
          minHeight: { xs: "70vh", md: "70vh", lg: "70vh", xl: "80vh" },
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#FAF3E0",
          flexDirection: "column",
          paddingTop: 5,
          p: "1rem",
          position: "relative",
        }}
      >
        <Container maxWidth="xl">
          {carts?.length === 0 ? (
            <Paper
              sx={{
                width: "100%",
                paddingY: "20px",
                paddingX: "32px",
                backgroundColor: "#FFFFFF",
                textAlign: "center",
                margin: "0 auto",
                maxWidth: "400px",
                borderRadius: "12px",
              }}
            >
              <Image
                height={150}
                width={150}
                layout="fixed"
                style={{
                  marginInline: "auto",
                }}
                src="/images/cart.webp"
                alt="#"
              />
              <Typography
                variant="h6"
                sx={{
                  paddingBottom: "4px",
                  fontWeight: 700,
                  color: "#162548",
                  my: 1.34,
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
                    marginBottom: "16px",

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
                const total = calculateTotal(
                  Number(kulcha?.price) * Number(kulcha?.quantity),
                  additional
                );
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
                    <Box
                      sx={{ ml: isSmallScreen ? 0 : 3, flex: 1, width: "90%" }}
                    >
                      <Typography
                        variant="body1"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          fontWeight: "bold",
                          color: "#1F2937",
                          paddingBottom: "4px",
                        }}
                      >
                        {kulcha?.name}: x {kulcha?.quantity}
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
                      {additional?.length !== 0 && (
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
                                  {add?.items?.[0]?.name}: x
                                  {add?.items?.[0]?.quantity}
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
                      )}
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
                          justifyContent: "space-between",
                          width: "100%",
                          mt: 2,
                          flexDirection: isSmallScreen ? "row" : "row",
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
                        {/* <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginTop: "0.5rem",
                          }}
                        >
                          <IconButton
                            sx={{
                              color: "#336195",
                            }}
                          >
                            <RemoveCircleOutlineIcon />
                          </IconButton>
                          <Typography variant="body1" color="textPrimary">
                            {1}
                          </Typography>
                          <IconButton
                            sx={{
                              color: "#336195",
                            }}
                          >
                            <AddCircleOutlineIcon />
                          </IconButton>
                        </Box> */}
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
                  <Typography
                    variant="h6"
                    style={{ fontWeight: 600, fontSize: "16px" }}
                  >
                    Sub Total
                  </Typography>
                  <Typography variant="h6" style={{ fontWeight: 600 }}>
                    ${grandTotal}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" gap={2}>
                  <Typography
                    variant="h6"
                    style={{ fontWeight: 600, fontSize: "16px" }}
                  >
                    Delivery Charges
                  </Typography>
                  <Typography variant="h6" style={{ fontWeight: 600 }}>
                    $
                    {
                    selectedOption === 'pickup' ? '0.00' : <>      
                          {Number(
                            calculateDeliveryCharges(
                              metaData?.address?.distance?.value
                            )
                          ).toFixed(2)}
                        </>
}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" gap={2}>
                  <Typography variant="h6" style={{ fontWeight: 600 }}>
                    Total
                  </Typography>
                  <Typography variant="h6" style={{ fontWeight: 600 }}>
                    $
                    {Number(
                      Number(grandTotal) + (
                        selectedOption === 'pickup' ? 0 :
                        Number(
                          calculateDeliveryCharges(
                            metaData?.address?.distance?.value
                          )
                        )
                      )
                    ).toFixed(2)}
                  </Typography>
                </Box>
                <Button
                  onClick={() => {

                    if(selectedOption !== 'pickup'){
                      if (!metaData?.address?.raw) {
                        setError({
                          status : true,
                          message : 'Before proceeding, please update address.'
                        });
                        return;
                      }
                      if (!isAddressReachable) {
                        setDialogboxOpen(true);
                        return;
                      }
                    }
                    
                    if (!metaData?.name) {
                      setError({
                        status : true,
                        message : 'A name is necessary to proceed.'
                      });
                      return;
                    }
                    if (!kitchenMetaData?.isShopOpen) {
                      setDialogboxOpen(true);
                      return;
                    }
                    setError({
                      status : false,
                      message : ""
                    });
                    const url = encodeURIComponent(
                      encrypt({
                        selectedOption,
                        pickupTime
                      })
                    )
                    router.push(`/tip/${url}`);
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
                  Continue
                </Button>
                {error?.status && (
                  <Alert sx={{ mt: 2 }} variant="outlined" severity="error">
                    {error?.message}
                  </Alert>
                )}
              </Paper>
            </Box>
          )}
        </Container>
      </Box>
      <Dialog
        open={dialogboxOpen}
        onClose={() => setDialogboxOpen(!dialogboxOpen)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>
          <IconButton
            aria-label="close"
            onClick={() => setDialogboxOpen(!dialogboxOpen)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {kitchenMetaData?.isShopOpen ? (
              <>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "#ECAB21",
                  }}
                >
                  <WarningIcon sx={{ fontSize: "46px", marginTop: 3 }} />
                  <Typography
                    variant="body1"
                    color="textPrimary"
                    align="center"
                    sx={{ fontSize: "16px", mt: 2 }}
                  >
                    <p>
                      We&apos;re unable to deliver to your area at the moment.
                      Thank you for your understanding!
                      {/* Your location is currently outside our delivery zone, but you're welcome to place an order and <strong style={{fontSize:'1.4rem'}}>pick it up</strong> from our store. The delivery charge is set to <strong style={{fontSize:'1.4rem'}}>$0</strong>, and the distance between your location and our kitchen is <strong style={{fontSize:'1.4rem'}}>{metaData?.address?.distance?.text}.</strong> We look forward to serving you! */}
                    </p>
                    {/* <Button
                      onClick={() => {
                        setError(false);
                        router.push("/tip");
                      }}
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
                      Continue
                    </Button> */}
                  </Typography>
                </Box>
              </>
            ) : (
              <>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "#ECAB21",
                  }}
                >
                  <WarningIcon sx={{ fontSize: "46px", marginTop: 3 }} />
                  <Typography
                    variant="body1"
                    color="textPrimary"
                    align="center"
                    sx={{ fontSize: "18px", mt: 2 }}
                  >
                    We&apos;re temporarily offline and unable to deliver to your
                    area at the moment. We appreciate your understanding and
                    look forward to serving you again soon!
                  </Typography>
                </Box>
              </>
            )}
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default OrderHome;
