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
  Button,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LockIcon from "@mui/icons-material/Lock";
import { useAuthContext } from "@/context";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebase";
import CircularLodar from "@/components/CircularLodar";
import Link from "next/link";

const PreviousOrdersPage: React.FC = () => {
  const { user, kitchenMetaData } = useAuthContext();
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

  const handleReorder = (orderId: string) => {
    // Logic for reordering the items can be implemented here
    console.log(`Reordering items from order: ${orderId}`);
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
          overflowY: "auto",
        }}
      >
        <Box sx={{ maxWidth: "600px", width: "100%" }}>
          <Typography
            variant="h3"
            component="h2"
            sx={{
              color: "#333333",
              fontWeight: "bold",
              textAlign: "center",
              mb: 1.75,
            }}
          >
            Recent Activity
          </Typography>
          {myOrders.length > 0 ? (
            myOrders.map((orderDoc: any) => {
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
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between", // Align items to opposite ends
                      alignItems: "center",
                      marginBottom: 2,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <LockIcon sx={{ marginRight: 1 }} />
                      <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                        ORDER-123
                      </Typography>
                    </Box>
                    <Button
                      variant="contained"
                      size="small"
                      sx={{
                        backgroundColor: "#ECAB21",
                        color: "white",
                        "&:hover": {
                          backgroundColor: "#FFC107",
                          color: "white",
                        },
                      }}
                      onClick={() => handleReorder(order.id)}
                    >
                      Reorder
                    </Button>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: { xs: "flex-start", sm: "center" },
                      marginBottom: 2,
                      flexDirection: { xs: "column", sm: "row" },
                    }}
                  >
                    <LocationOnIcon
                      sx={{
                        marginRight: 1,
                        display: { xs: "none", sm: "block" },
                      }}
                    />

                    <Typography variant="body2">
                      {orderDoc?.address?.seperate?.city},{" "}
                      {orderDoc?.address?.seperate?.state}, Canada
                    </Typography>
                  </Box>
                  {order?.map((item: any, index: number) => {
                    const { kulcha, additional } = item.order;
                    return (
                      <Grid
                        container
                        spacing={2}
                        sx={{ marginBottom: 2 }}
                        key={index}
                      >
                        <Grid item xs={12} sm={6} sx={{ display: "flex" }}>
                          <Avatar
                            variant="square"
                            src={kulcha?.image}
                            sx={{
                              width: 80,
                              height: 80,
                              borderRadius: 2,
                              marginRight: 2,
                            }}
                          />
                          <Box>
                            <Typography variant="body2" fontWeight="bold">
                              {kulcha.name}
                            </Typography>
                            <Typography variant="body2">
                              ${kulcha.price} x{kulcha.quantity}
                            </Typography>
                          </Box>
                        </Grid>
                        {additional?.length !== 0 && (
                          <Grid item xs={12} sx={{ marginTop: 1 }}>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: "bold", marginBottom: 1 }}
                            >
                              Additional Items:
                            </Typography>
                            {additional.map((item: any, itemIndex: number) => (
                              <Typography
                                key={itemIndex}
                                variant="body2"
                                sx={{ display: "inline", marginRight: 2 }}
                              >
                                {item.items[0].name} ({item.items[0].quantity})
                              </Typography>
                            ))}
                          </Grid>
                        )}
                      </Grid>
                    );
                  })}
                  <Divider sx={{ my: 2 }} />

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-start",
                      flexDirection: "column",
                    }}
                  >
                    <Box sx={{ display: "flex", gap: 0.56 }}>
                      <Typography
                        variant="body2"
                        fontWeight="bold"
                        textAlign="right"
                      >
                        Total Tax: {orderDoc?.total_tax}
                      </Typography>
                      <Typography
                        variant="body2"
                        fontWeight="bold"
                        textAlign="right"
                      >
                        Total: {orderDoc?.grand_total}
                      </Typography>
                    </Box>
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
              }}
            >
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
                <Typography variant="h6" sx={{ mb: 2 }}>
                  No orders yet
                </Typography>
                <Link href="/home">
                  <Button
                    variant="contained"
                    color="primary"
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
                    ORDER NOW
                  </Button>
                </Link>
              </Paper>
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
};

export default PreviousOrdersPage;
