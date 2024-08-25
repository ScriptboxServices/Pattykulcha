"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Divider,
  Avatar,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LockIcon from "@mui/icons-material/Lock";
import { useAuthContext } from "@/context";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebase";
import CircularLodar from "@/components/CircularLodar";

// Sample data array for orders
const orders = [
  {
    id: "ORD-1234",
    status: "Out For Delivery",
    location: "Ontario, Canada",
    estimatedArrival: "30 min",
    destination: "Toronto, Canada",
    kulcha: {
      name: "Paneer Kulcha",
      price: 15.99,
      quantity: 2,
      image: "/images/Img/5.jpg",
    },
    additional: [
      { items: [{ name: "Imli Chutney", quantity: 1, price: 1.5 }] },
      { items: [{ name: "Channa", quantity: 2, price: 1.5 }] },
    ],
  },
  {
    id: "ORD-5678",
    status: "Delivered",
    location: "Los Angeles, USA",
    estimatedArrival: "15 Aug 2024",
    destination: "Santa Monica, California",
    kulcha: {
      name: "Aloo Kulcha",
      price: 12.99,
      quantity: 1,
      image: "/images/Img/5.jpg",
    },
    additional: [
      { items: [{ name: "Normal Butter", quantity: 1, price: 0.5 }] },
      { items: [{ name: "Hot Coffee", quantity: 1, price: 3.5 }] },
    ],
  },
  {
    id: "ORD-91011",
    status: "Canceled",
    location: "Chicago, USA",
    estimatedArrival: "N/A",
    destination: "Downtown, Chicago",
    kulcha: {
      name: "Mix Kulcha",
      price: 12.99,
      quantity: 3,
      image: "/images/Img/5.jpg",
    },
    additional: [],
  },
];

const OrdersPage: React.FC = () => {
  const { user, metaData, kitchenMetaData } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [myOrders, setMyOrders] = useState<any>([]);
  useEffect(() => {
    const init = async () => {
      try {
        const colRef = collection(db, "orders");
        const q = query(colRef, where("userId", "==", user?.uid));
        setLoading(true);
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
        setLoading(false);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [user, kitchenMetaData]);

  const calculateGrandTotal = (order: any) => {
    const kulchaTotal = order.kulcha.price * order.kulcha.quantity;
    const additionalTotal = order.additional.reduce(
      (sum: number, item: any) =>
        sum + item.items[0].price * item.items[0].quantity,
      0
    );
    return kulchaTotal + additionalTotal;
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
          <Typography variant='h4' fontWeight='bold' gutterBottom>
            My Orders
          </Typography>
          {myOrders.map((orderDoc: any) => {
            const { order } = orderDoc;
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
                <Box
                  sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}>
                  <LockIcon sx={{ marginRight: 1 }} />
                  <Typography variant='body2' sx={{ fontWeight: "bold" }}>
                    ORD-1234
                  </Typography>
                </Box>
                <Box
                  sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}>
                  <LocationOnIcon sx={{ marginRight: 1 }} />
                  <Typography variant='body2' sx={{ marginRight: 1 }}>
                    {orderDoc?.address?.seperate?.line1 || "Location not set"}
                  </Typography>
                  <Divider orientation='vertical' flexItem sx={{ marginX: 1 }} />
                  <Typography variant='body2' sx={{ marginRight: 1 }}>
                    Estimated arrival: 30 min
                  </Typography>
                  <Divider orientation='vertical' flexItem sx={{ marginX: 1 }} />
                  <Typography variant='body2'>
                    {orderDoc?.address?.seperate?.city},{" "}
                    {orderDoc?.address?.seperate?.state}, Canada
                  </Typography>
                </Box>
                {order?.map((item: any) => {
                  const { kulcha, additional } = item.order;
                  return (
                    <Grid container spacing={2} sx={{ marginBottom: 2 }}>
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
                            sx={{ fontWeight: "bold", marginBottom: 1 }}>
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
                <Divider sx={{ my: 2 }} />
                <Box>
                  <Typography
                    variant='body2'
                    sx={{ fontWeight: "bold", marginBottom: 1 }}>
                    Billing Address :
                  </Typography>
                  <Typography variant='body2' color='textSecondary'>
                    Name: {orderDoc?.customer?.name}
                  </Typography>
                  <Typography variant='body2' color='textSecondary'>
                    Phone: {orderDoc?.customer?.phoneNumber}
                  </Typography>
                  <Typography variant='body2' color='textSecondary'>
                    Address: {orderDoc?.address?.raw || orderDoc?.address}
                  </Typography>
                  <Typography variant='body2' color='textSecondary'>
                    Distance: {orderDoc?.address?.distance?.text || ""}
                  </Typography>
                  <Typography variant='body2' color='textSecondary'>
                    Instructions: {orderDoc?.instructions}
                  </Typography>
                </Box>
                <Divider sx={{ marginY: 2 }} />
                <Typography variant='body2' fontWeight='bold' textAlign='right'>
                  Total Tax: {orderDoc?.total_tax}
                </Typography>
                <Typography variant='body2' fontWeight='bold' textAlign='right'>
                  Total: {orderDoc?.grand_total}
                </Typography>
              </Paper>
            );
          })}
        </Box>
      </Box>
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
  };

  return (
    <Chip
      label={status}
      sx={{
        position: "absolute",
        top: 16,
        right: 16,
        backgroundColor:
          statusColors[
            status as
              | "Out For Delivery"
              | "Delivered"
              | "Canceled"
              | "New Order"
          ],
        color: "#fff",
      }}
    />
  );
};

export default OrdersPage;
