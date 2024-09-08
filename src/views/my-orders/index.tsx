"use client";

import React, { useEffect, useState, CSSProperties } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Divider,
  Avatar,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LockIcon from "@mui/icons-material/Lock";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useAuthContext } from "@/context";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db, storage } from "@/firebase";
import CircularLodar from "@/components/CircularLodar";
import Link from "next/link";
import CancelIcon from "@mui/icons-material/Cancel";
import axios from "axios";
import { getIdToken } from "firebase/auth";
import { getDownloadURL, ref } from "firebase/storage";

const tableHeaderStyle: CSSProperties = {
  border: "1px solid #ddd",
  padding: "8px",
  backgroundColor: "#e8f5ff",
  fontWeight: "bold",
  textAlign: "left" as "left", // Explicitly type it as a valid CSS 'textAlign' property
};

const tableCellStyle: CSSProperties = {
  border: "1px solid #ddd",
  padding: "8px",
  textAlign: "left" as "left", // Explicitly type it as a valid CSS 'textAlign' property
};

const OrdersPage: React.FC = () => {
  const { user, metaData } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState<boolean>(false);
  const [myOrders, setMyOrders] = useState<any>([]);
  const [invoiceUrl, setInvoiceUrl] = useState("");

  const init = async (initial : boolean) => {
    if (!user?.uid) return;
    try {
      const colRef = collection(db, "orders");
      const q = query(
        colRef,
        where("userId", "==", user?.uid),
        orderBy("createdAt", "desc")
      );
      if(initial) setLoading(true);
      const docs = await getDocs(q);
      let orders: any[] = [];
      if (docs.size > 0) {
        docs.forEach((doc) => {
          orders.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setMyOrders([...orders]);
      }
      if(initial) setLoading(false);
    } catch (err) {
      console.log(err);
    } finally {
      if(initial) setLoading(false);
    }
  };
  useEffect(() => {
    init(true);
  }, [user]);

  // const calculateGrandTotal = (order: any) => {
  //   const kulchaTotal = order.kulcha.price * order.kulcha.quantity;
  //   const additionalTotal = order.additional.reduce(
  //     (sum: number, item: any) =>
  //       sum + item.items[0].price * item.items[0].quantity,
  //     0
  //   );
  //   return kulchaTotal + additionalTotal;
  // };

  const handleDownloadInvoice = async () => {
    try {
      setLoading(true)
      const blob = await axios.get(invoiceUrl,{
        responseType : 'blob'
      })
      const url = window.URL.createObjectURL(blob.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Invoice.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      setLoading(false)
    } catch (error) {
      console.error("Error:", error);
      setLoading(false)
    }
  };

  const handleViewInvoice = async (order: any) => {
    console.log(order);
    setLoading(true);
    try {
      let filePath = order?.invoices?.key;
      if (!order?.invoices?.generated) {
        const token = await getIdToken(user);
        const result = await axios.post(
          "/api/invoice-generate",
          {
            userId: order.userId,
            orderId: order.id,
          },
          {
            headers: {
              "x-token": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (result.data.code === 1) {
          filePath = result.data.filePath;
        }
      }

      const storageRef = ref(storage, filePath);

      const [url] = await Promise.all([getDownloadURL(storageRef),init(false)]) ;

      setInvoiceUrl(url);
      setOpen(!open);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  return (
    <>
      <CircularLodar isLoading={loading} />
      <Box
        sx={{
          backgroundColor: "#fffaeb",
          minHeight: "100vh",
          padding: 4,
          display: "flex",
          justifyContent: "center",
          overflowY: "auto", // Make the container scrollable
        }}>
        <Box sx={{ maxWidth: "600px", width: "100%" }}>
          {" "}
          <Typography
            variant='h3'
            component='h2'
            sx={{
              color: "#333333",
              fontWeight: "bold",
              textAlign: "center",
              mb: 1.75,
            }}>
            My Orders
          </Typography>
          {myOrders.length > 0 ? (
            myOrders.map((orderDoc: any) => {
              const { order } = orderDoc;
              console.log(order);
              return (
                <Paper
                  key={order.id}
                  sx={{
                    padding: 2,
                    borderRadius: 2,
                    marginBottom: 3,
                    position: "relative",
                    boxShadow: 3,
                    minHeight: "150px",
                    width: "100%",
                  }}>
                  <OrderStatusChip status={orderDoc?.delivery?.message} />
                  {/* {orderDoc?.delivery?.message == "Delivered" && (
                    <>
                      <IconButton
                        sx={{ position: "absolute", top: 14, right: -3 }} // Position the 3-dot icon next to the status
                        onClick={(event) => handleMenuOpen(event, orderDoc)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                      <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                      >
                        <MenuItem onClick={() => handleDownloadInvoice()}>
                          Download Invoice
                        </MenuItem>
                        <MenuItem onClick={handleViewInvoice}>
                          View Invoice
                        </MenuItem>
                      </Menu>
                    </>
                  )} */}

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: 2,
                    }}>
                    <LockIcon sx={{ marginRight: 1 }} />
                    <Typography variant='body2' sx={{ fontWeight: "bold" }}>
                      ORD-{orderDoc?.orderNumber?.forCustomer}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: { xs: "flex-start", sm: "center" },
                      marginBottom: 2,
                      flexDirection: { xs: "column", sm: "row" },
                    }}></Box>
                  {order?.map((item: any, index: number) => {
                    const { kulcha, additional } = item.order;
                    return (
                      <Grid
                        container
                        spacing={2}
                        sx={{ marginBottom: 2 }}
                        key={index}>
                        <Grid item xs={12} sm={6} sx={{ display: "flex" }}>
                          <Avatar
                            variant='square'
                            src={kulcha?.image}
                            sx={{
                              width: 80,
                              height: 80,
                              borderRadius: 2,
                              marginRight: 2,
                            }}
                          />
                          <Box>
                            <Typography variant='body2' fontWeight='bold'>
                              {kulcha.name}
                            </Typography>
                            <Typography variant='body2'>
                              ${kulcha.price} x{kulcha.quantity}
                            </Typography>
                          </Box>
                        </Grid>
                        {additional?.length !== 0 && (
                          <Grid item xs={12} sx={{ marginTop: 1 }}>
                            <Typography
                              variant='body2'
                              sx={{ fontWeight: "bold", marginBottom: 0 }}>
                              Additional Items:
                            </Typography>
                            {additional.map((item: any, itemIndex: number) => (
                              <Typography
                                key={itemIndex}
                                variant='body2'
                                sx={{ display: "inline", marginRight: 2 }}>
                                {item.items[0].name} ({item.items[0].quantity})
                              </Typography>
                            ))}
                          </Grid>
                        )}
                      </Grid>
                    );
                  })}
                  <Typography
                    variant='body2'
                    fontWeight='bold'
                    textAlign='right'
                    sx={{ mt: -2 }}>
                    Total: {orderDoc?.grand_total}
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Box>
                    {/*<Typography variant="body2" color="textSecondary">
                      Name: {orderDoc?.customer?.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Phone: {orderDoc?.customer?.phoneNumber}
                    </Typography>*/}
                    <Typography variant='body2' color='textSecondary'>
                      <b style={{ color: "black" }}>Address:</b>{" "}
                      {orderDoc?.address?.raw || orderDoc?.address}
                    </Typography>
                    {/* <Typography variant="body2" color="textSecondary">
                      Distance: {orderDoc?.address?.distance?.text || ""}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Instructions: {orderDoc?.instructions}
                    </Typography> */}
                  </Box>
                  <Divider sx={{ marginY: 1 }} />
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-start",
                      flexDirection: "column",
                    }}>
                    {orderDoc?.delivery?.message != "Refunded" && (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-evenly",
                          marginTop: 1.45,
                          gap: { xs: 0.73 },
                        }}>
                        <Link href={`/product-review/${orderDoc.id}`}>
                          <Button
                            variant='contained'
                            sx={{
                              backgroundColor: "#ECAB21",
                              color: "white",
                              fontWeight: "bold",
                              "&:hover": {
                                backgroundColor: "#FFC107",
                                color: "white",
                              },
                            }}>
                            Review
                          </Button>
                        </Link>
                        <Button
                          variant='contained'
                          sx={{
                            backgroundColor: "#ECAB21",
                            color: "white",
                            fontWeight: "bold",
                            "&:hover": {
                              backgroundColor: "#FFC107",
                              color: "white",
                            },
                          }}
                          onClick={() => handleViewInvoice(orderDoc)}>
                          Invoice
                        </Button>

                        {/* <Link href={`/recipt/${orderDoc.id}`}>
                          <Button
                            variant="contained"
                            sx={{
                              backgroundColor: "#ECAB21",
                              color: "white",
                              fontWeight: "bold",
                              "&:hover": {
                                backgroundColor: "#FFC107",
                                color: "white",
                              },
                            }}
                          >
                            Receipt
                          </Button>
                        </Link> */}
                      </Box>
                    )}
                  </Box>
                </Paper>
              );
            })
          ) : (
            <Box
              sx={{
                padding: 4,
                textAlign: "center",
                alignItems: "center",
                height: "50vh",
                display: "flex",
              }}>
              <Paper
                sx={{
                  width: "100%",
                  padding: "24px",
                  backgroundColor: "#FFFFFF",
                  textAlign: "center",
                  margin: "0 auto",
                  maxWidth: "400px",
                  borderRadius: "12px",
                }}>
                <Typography variant='h6' sx={{ mb: 2 }}>
                  No orders yet
                </Typography>
                <Link href='/home'>
                  <Button
                    variant='contained'
                    color='primary'
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
                    }}>
                    ORDER NOW
                  </Button>
                </Link>
              </Paper>
            </Box>
          )}
          {myOrders.length > 0 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
              <Link href='/home'>
                <Button
                  variant='contained'
                  color='primary'
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
                  }}>
                  ORDER NOW
                </Button>
              </Link>
            </Box>
          )}
        </Box>
      </Box>

      <Dialog
        open={open}
        onClose={() => {
          setOpen(!open)
          setInvoiceUrl('')
        }}
        maxWidth='md'
        fullWidth
        sx={{ zIndex: "999" }}
        >
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <DialogTitle>Invoice</DialogTitle>
          <IconButton onClick={() =>{
          setOpen(!open)
          setInvoiceUrl('')
        }}>
            <CancelIcon />
          </IconButton>
        </Box>
        <DialogContent>
          <Box sx={{ textAlign: "center", overflow: "hidden" }}>
            <div style={{ width: "100%", height: "100vh" }}>
              <iframe
                src={invoiceUrl}
                title='PDF Viewer'
                style={{
                  width: "100%",
                  height: "100%",
                  border: "none",
                }}></iframe>
            </div>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            variant='contained'
            sx={{
              backgroundColor: "#ECAB21",
              color: "white",
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: "#FFC107",
                color: "white",
              },
            }}
            onClick={() => handleDownloadInvoice()}>
            Download invoice
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

// Custom Order Status Chip Component
const OrderStatusChip: React.FC<{ status: string }> = ({ status }) => {
  const statusColors = {
    "Out For Delivery": "#FFAB00",
    Delivered: "#4CAF50",
    Canceled: "#F44336",
    "New Order": "#FFAB00",
    Refunded: "#1E90FF",
  };

  return (
    <Chip
      label={status}
      sx={{
        position: "absolute",
        top: 14,
        right: 16,
        backgroundColor:
          statusColors[
            status as
              | "Out For Delivery"
              | "Delivered"
              | "Canceled"
              | "New Order"
              | "Refunded"
          ],
        color: "#fff",
      }}
    />
  );
};

export default OrdersPage;
