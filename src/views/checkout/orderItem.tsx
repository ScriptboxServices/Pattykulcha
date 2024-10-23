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
  Divider,
  Drawer,
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
import LocalOfferIcon from "@mui/icons-material/LocalOffer";

interface Props {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedOption: React.Dispatch<React.SetStateAction<string>>;
  selectedOption: string;
  setPickupTime: React.Dispatch<React.SetStateAction<string>>;
  pickupTime: string;
}

const OrderHome: React.FC<Props> = ({
  setLoading,
  setSelectedOption,
  selectedOption,
  pickupTime,
  setPickupTime,
}) => {
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
    status: false,
    message: "",
  });

  const [dialogerror, setdialogError] = useState({
    status: false,
    message: "",
  });
  const [dialogboxOpen, setDialogboxOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false); // State to manage dialog for larger screens

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
      setLoading(false);
    }
  };

  const getKulchaQuantity = () => {
    const quant = carts?.reduce((acc, order) => {
      return (acc = acc + order.order.kulcha.quantity);
    }, 0);
    return quant;
  };

  console.log(kitchenMetaData);

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
                      {/* <Box
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
                      </Box> */}
                      {/* <Box
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
                      </Box> */}
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
              marginTop={3}
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
                {/* <Link href="add-promo-code">
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    gap={2}
                  >
                    <Typography
                      variant="h6"
                      style={{
                        fontWeight: 600,
                        fontSize: "16px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <LocalOfferIcon sx={{ marginRight: 1 }} />{" "}
                      
                      Add a promo code
                    </Typography>
                  </Box>
                </Link> */}
                {/* <Divider sx={{ my: 2 }} /> */}
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

                {selectedOption != "pickup" && (
                  <Box display="flex" justifyContent="space-between" gap={2}>
                    <Typography
                      variant="h6"
                      style={{ fontWeight: 600, fontSize: "16px" }}
                    >
                      Delivery Charges
                    </Typography>
                    <Typography variant="h6" style={{ fontWeight: 600 }}>
                      $
                      {selectedOption === "pickup" ? (
                        "0.00"
                      ) : (
                        <>
                          {Number(
                            calculateDeliveryCharges(
                              metaData?.address?.distance?.value
                            )
                          ).toFixed(2)}
                        </>
                      )}
                    </Typography>
                  </Box>
                )}
                <Box display="flex" justifyContent="space-between" gap={2}>
                  <Typography variant="h6" style={{ fontWeight: 600 }}>
                    Total
                  </Typography>
                  <Typography variant="h6" style={{ fontWeight: 600 }}>
                    $
                    {Number(
                      Number(grandTotal) +
                        (selectedOption === "pickup"
                          ? 0
                          : Number(
                              calculateDeliveryCharges(
                                metaData?.address?.distance?.value
                              )
                            ))
                    ).toFixed(2)}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 2,
                  }}
                >
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{
                      backgroundColor: "#ECAB21",
                      color: "white",
                      paddingX: 4,
                      paddingY: 1,
                      mt: 2,
                      fontWeight: "bold",
                      borderRadius: "25px",
                      "&:hover": {
                        backgroundColor: "#FFC107",
                        color: "white",
                      },
                    }}
                    onClick={()=>{
                      router.push("/home")
                    }}
                  >
                    Add more
                  </Button>
                  <Button
                    onClick={() => {
                      if (!metaData?.address?.raw) {
                        if (isSmallScreen) {
                          setDrawerOpen(true);
                        } else {
                          setDialogOpen(true);
                        }
                        setdialogError({
                          status: true,
                          message: "Before proceeding, please update address.",
                        });
                        return;
                      }

                      if (!metaData?.name) {
                        if (isSmallScreen) {
                          setDrawerOpen(true);
                        } else {
                          setDialogOpen(true);
                        }
                        setdialogError({
                          status: true,
                          message: "A name is necessary to proceed.",
                        });
                        return;
                      }

                      if (!kitchenMetaData?.kitchen?.isShopOpen) {
                        if (isSmallScreen) {
                          setDrawerOpen(true);
                        } else {
                          setDialogOpen(true);
                        }
                        setdialogError({
                          status: true,
                          message: "We are currently offline.",
                        });
                        return;
                      }

                      if (selectedOption !== "pickup") {
                        if (!isAddressReachable) {
                          if (isSmallScreen) {
                            setDrawerOpen(true);
                          } else {
                            setDialogOpen(true);
                          }
                          setdialogError({
                            status: true,
                            message:
                              "We are unable to deliver to your address at this time. However, you can choose to pick up your order at a nearby location.",
                          });
                          return;
                        }
                        if (
                          kitchenMetaData?.data.distance.value > 5000 &&
                          kitchenMetaData?.data.distance.value < 10000
                        ) {
                          if (getKulchaQuantity() < 2) {
                            if (isSmallScreen) {
                              setDrawerOpen(true);
                            } else {
                              setDialogOpen(true);
                            }
                            setdialogError({
                              status: true,
                              message:
                                "For deliveries between 5km and 10km, the minimum order is 2 Kulchas.",
                            });
                            return;
                          }
                        }

                        if (kitchenMetaData?.data.distance.value > 10000) {
                          if (getKulchaQuantity() < 3) {
                            if (isSmallScreen) {
                              setDrawerOpen(true);
                              setdialogError({
                                status: true,
                                message:
                                  "For deliveries over 10km, the minimum order is 3 Kulchas.",
                              });
                            } else {
                              setDialogOpen(true);
                              setdialogError({
                                status: true,
                                message:
                                  "For deliveries over 10km, the minimum order is 3 Kulchas.",
                              });
                            }

                            return;
                          }
                        }
                      }

                      setError({
                        status: false,
                        message: "",
                      });

                      const encryptedData = encrypt({
                        selectedOption,
                        pickupTime,
                        kitchen: kitchenMetaData?.kitchen,
                      });

                      const url = encodeURIComponent(encryptedData);
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
                      borderRadius: "25px",
                      "&:hover": {
                        backgroundColor: "#FFC107",
                        color: "white",
                      },
                    }}
                  >
                    Continue
                  </Button>
                </Box>
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
      {isSmallScreen && (
        <Drawer
          anchor="bottom"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          sx={{
            "& .MuiDrawer-paper": {
              backgroundColor: "#FFFFFF",
              borderRadius: "16px 16px 0 0",
              height: {
                xs: "45dvh",
                sm: "35dvh",
                md: "40dvh",
              },
              padding: "24px",
              "@media (min-width: 400px)": {
                height: "40dvh",
              },
            },
          }}
        >
          <Box
            sx={{
              textAlign: "center",
              position: "relative",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
              }}
            >
              {/* Close Button */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <IconButton
                  aria-label="close"
                  onClick={() => setDrawerOpen(false)}
                  sx={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                  }}
                >
                  <CloseIcon sx={{ fontSize: { xs: "1.5rem", sm: "2rem" } }} />
                </IconButton>
              </Box>

              {/* Title */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    mb: 1,
                    color: "#162548",
                    textWrap: "wrap",
                    fontSize: "2rem",
                    "@media (max-width: 390px)": {
                      fontSize: "1.6rem",
                    },
                  }}
                >
                  Sorry, Something&apos;s Wrong
                </Typography>
              </Box>

              {dialogerror?.status && (
                <Typography
                  variant="h5"
                  sx={{
                    color: "#6B7280",
                    px: 2,
                    mb: 2,
                    mt: 2,
                    fontSize: {
                      xs: "1.2em", // Adjust font size for smaller screens
                      sm: "1.2em",
                    },
                  }}
                >
                  {dialogerror.message}
                </Typography>
              )}

              <Button
                onClick={() => setDrawerOpen(false)}
                sx={{
                  backgroundColor: "#ECAB21",
                  color: "#000000",
                  "&:hover": {
                    backgroundColor: "#d5971f",
                  },
                  paddingX: 4,
                  paddingY: 1,
                  marginInline: "auto",
                  borderRadius: "24px",
                  fontWeight: "bold",
                  width: { xs: "90%", sm: "75%" },
                  textTransform: "none",
                  height: "48px",
                }}
              >
                Okay
              </Button>
            </Box>
          </Box>
        </Drawer>
      )}

      {!isSmallScreen && (
        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ fontWeight: "bold" }}>
            <IconButton
              aria-label="close"
              onClick={() => setDialogOpen(false)}
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
            <Box
              sx={{
                textAlign: "center",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    width: "100%",
                  }}
                >
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      mb: 1,
                      color: "#162548",
                      textWrap: "wrap",
                      fontSize: "2rem",
                      "@media (max-width: 390px)": {
                        fontSize: "1.6rem",
                      },
                    }}
                  >
                    Sorry, Something&apos;s Wrong
                  </Typography>
                </Box>

                {dialogerror?.status && (
                  <Typography
                    variant="h5"
                    sx={{
                      color: "#6B7280",
                      px: 2,
                      mb: 2,
                      mt: 2,
                      fontSize: {
                        xs: "1.2em", // Adjust font size for smaller screens
                        sm: "1.2em",
                      },
                    }}
                  >
                    {dialogerror?.message}
                  </Typography>
                )}

                <Button
                  onClick={() => setDialogOpen(false)}
                  sx={{
                    backgroundColor: "#ECAB21",
                    color: "#ffff",
                    "&:hover": {
                      backgroundColor: "#d5971f",
                    },
                    paddingX: 4,
                    paddingY: 1,
                    marginInline: "auto",
                    borderRadius: "24px",
                    fontWeight: "bold",
                    width: { xs: "90%", sm: "75%" },
                    textTransform: "none",
                    height: "48px",
                  }}
                >
                  Okay
                </Button>
              </Box>
            </Box>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default OrderHome;
