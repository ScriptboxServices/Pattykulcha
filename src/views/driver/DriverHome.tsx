"use client";

import React, { useState, ChangeEvent, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Avatar,
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Select,
  MenuItem,
  Chip,
  FormControl,
  InputLabel,
  Divider,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import CircularLodar from "@/components/CircularLodar";
import Link from "next/link";
import CancelIcon from "@mui/icons-material/Cancel";
import { useAuthContext } from "@/context";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  GoogleMap,
  DirectionsRenderer,
  useJsApiLoader,
} from "@react-google-maps/api";
import { db } from "@/firebase";
import { useRouter } from "next/navigation";

const DriverOrders: React.FC = () => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string,
  });
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("Out For Delivery");
  const { user, metaData, driverMetaData } = useAuthContext();
  const startOfToday = Timestamp.fromDate(
    new Date(new Date().setHours(0, 0, 0, 0))
  );
  const endOfToday = Timestamp.fromDate(
    new Date(new Date().setHours(23, 59, 59, 999))
  );
  const [newOrders, setNewOrders] = useState<any[]>([]);
  const [allOrders, setAllOrders] = useState<any[]>([]);
  const [openMapModal, setOpenMapModal] = useState(false);
  const [source, setSource] = useState({
    lat: 0,
    lng: 0,
  });
  const [destination, setDestination] = useState({
    lat: 0,
    lng: 0,
  });
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const router = useRouter();

  useEffect(() => {
    let watchPos: any;
    if (navigator.geolocation && driverMetaData) {
      watchPos = navigator.geolocation.watchPosition(
        async (position) => {
          const docRef = doc(db, "driverlocation", driverMetaData.id);
          await setDoc(docRef, {
            driverId: driverMetaData.id,
            isOnline: true,
            name: driverMetaData.name,
            latlng: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
          });
          setSource({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        async (err) => {
          await updateDoc(doc(db, "driverlocation", driverMetaData.id), {
            isOnline: false,
          });
          console.log(err);
        },
        {
          enableHighAccuracy: true,
          timeout: Infinity,
          maximumAge: 0,
        }
      );
    }
    return () => {
      if (watchPos) {
        updateDoc(doc(db, "driverlocation", driverMetaData.id), {
          isOnline: false,
        });
        navigator.geolocation.clearWatch(watchPos);
      }
    };
  }, [driverMetaData]);

  useEffect(() => {
    // if (driverMetaData?.userId !== user?.uid) {
    //   return router.push('/home')
    // }
  }, [user, driverMetaData]);

  useEffect(() => {
    if (!metaData?.isDriver) return;
    const colRef = collection(db, "orders");
    const newOrderQuery = query(
      colRef,
      where("driverId", "==", metaData?.driverId),
      where("delivery.message", "!=", "Preparing"),
      where("createdAt", ">=", startOfToday),
      where("createdAt", "<=", endOfToday),
      orderBy("createdAt", "desc")
    );
    const unsubscribeNewOrder = onSnapshot(newOrderQuery, (snapshot) => {
      let newOrders: any[] = [];
      let sortedOrders: any[] = [];

      snapshot.forEach((doc) => {
        const { delivery, pickUpAction } = doc.data();
        sortedOrders.push({
          id: doc.id,
          ...doc.data(),
        });
        if (
          delivery.status === false &&
          delivery.message === "Out For Delivery" &&
          !pickUpAction
        ) {
          newOrders.push({
            id: doc.id,
            ...doc.data(),
          });
        }
      });
      sortedOrders.sort(
        (a: any, b: any) =>
          a.address?.distance?.value - b.address?.distance?.value
      );
      setNewOrders([...newOrders]);
      setAllOrders([...sortedOrders]);
    });
    return () => {
      unsubscribeNewOrder();
    };
  }, [metaData, user]);

  const updateOrderStatus = async (
    _id: string,
    message: string,
    status: boolean
  ) => {
    try {
      setLoading(true);
      const docRef = doc(db, "orders", _id);
      await updateDoc(docRef, {
        delivery: {
          message,
          status,
        },
      });
      setLoading(false);
    } catch (err) {
      console.log(err);
      return err;
    } finally {
      setLoading(false);
    }
  };

  const cancelOrderStatus = async (_id: string) => {
    try {
      setLoading(true);
      const docRef = doc(db, "orders", _id);
      await updateDoc(docRef, {
        canceled: true,
        delivery: {
          message: "Canceled",
          status: false,
        },
      });
      setLoading(false);
    } catch (err) {
      console.log(err);
      return err;
    } finally {
      setLoading(false);
    }
  };

  // Function to filter orders by status
  const handleFilterChange = (event: ChangeEvent<{ value: unknown }>) => {
    setFilterStatus(event.target.value as string);
    const filteredOrders = allOrders.filter(
      (order) => order.delivery.message === (event.target.value as string)
    );
    filteredOrders.sort(
      (a: any, b: any) =>
        a.address?.distance?.value - b.address?.distance?.value
    );
    setNewOrders([...filteredOrders]);
  };

  useEffect(() => {
    if (source.lat && source.lng && destination.lat && destination.lng) {
      if (window.navigator.geolocation) {
        const directionService = new window.google.maps.DirectionsService();
        directionService
          .route({
            origin: {
              lat: source.lat,
              lng: source.lng,
            },
            destination: {
              lat: destination.lat,
              lng: destination.lng,
            },
            travelMode: window.google.maps.TravelMode.DRIVING,
          })
          .then((res: any) => {
            setDirectionsResponse(res);
          })
          .catch((err) => {
            console.log(err);
          })
          .finally(() => {
            console.log("LLLLLLLLLLLLLL");
          });
      } else {
        console.log("Geolocation is not supported by this browser.");
      }
    }
  }, [source, destination, openMapModal]);

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
        }}>
        <Box sx={{ maxWidth: "600px", width: "100%" }}>
          <Typography
            variant='h3'
            component='h2'
            sx={{
              color: "#333333",
              fontWeight: "bold",
              textAlign: "center",
              mb: 1.75,
            }}>
            Today Orders
          </Typography>
          <Box>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Filter by Status</InputLabel>
              <Select
                sx={{ backgroundColor: "#fff" }}
                value={filterStatus}
                onChange={handleFilterChange as any}
                label='Filter by Status'>
                <MenuItem value='Out For Delivery'>Out For Delivery</MenuItem>
                <MenuItem value='Delivered'>Delivered</MenuItem>
                <MenuItem value='Canceled'>Canceled</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {newOrders.length > 0 ? (
            newOrders?.map((_order: any) => {
              const { order } = _order;
              const { latlng } = _order.address;
              return (
                <Paper
                  key={_order.id}
                  sx={{
                    padding: 2,
                    borderRadius: 2,
                    marginBottom: 3,
                    position: "relative",
                    boxShadow: 3,
                    minHeight: "150px",
                    width: "100%",
                  }}>
                  <Chip
                    label={_order?.delivery?.message}
                    sx={{
                      position: "absolute",
                      top: 14,
                      right: 16,
                      backgroundColor: getStatusColor(
                        _order?.delivery?.message
                      ),
                      color: "#fff",
                      cursor: "pointer",
                    }}
                  />

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: 2,
                    }}>
                    <LockIcon sx={{ marginRight: 1 }} />
                    <Typography variant='body2' sx={{ fontWeight: "bold" }}>
                      {_order?.orderNumber?.forKitchen}
                    </Typography>
                  </Box>

                  {order?.map((order_: any) => {
                    return (
                      <Grid
                        key={_order.id}
                        container
                        spacing={2}
                        sx={{ marginBottom: 2 }}>
                        <Grid item xs={12} sm={6} sx={{ display: "flex" }}>
                          <Avatar
                            variant='square'
                            src={order_?.order?.kulcha?.image}
                            sx={{
                              width: 80,
                              height: 80,
                              borderRadius: 2,
                              marginRight: 2,
                            }}
                          />
                          <Box>
                            <Typography variant='body2' fontWeight='bold'>
                              {order_?.order?.kulcha?.name}
                            </Typography>
                            <Typography variant='body2'>
                              ${order_?.order?.kulcha?.price.toFixed(2)} x
                              {order_?.order?.kulcha?.quantity}
                            </Typography>
                          </Box>
                        </Grid>
                        {order_?.order?.additional?.length > 0 && (
                          <Grid item xs={12} sx={{ marginTop: 1 }}>
                            <Typography
                              variant='body2'
                              sx={{ fontWeight: "bold", marginBottom: 0 }}>
                              Additional Items:
                            </Typography>
                            {order_?.order?.additional.map(
                              (item: any, itemIndex: number) => (
                                <Typography
                                  key={itemIndex}
                                  variant='body2'
                                  sx={{ display: "inline", marginRight: 2 }}>
                                  {item.items[0].name} ({item.items[0].quantity}
                                  )
                                </Typography>
                              )
                            )}
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
                    Total: $
                    {Number(
                      Number(_order?.grand_total) +
                        Number(_order.deliverCharge || 0)
                    ).toFixed(2)}
                  </Typography>

                  <Divider sx={{ my: 2 }} />
                  <Box>
                    <Typography variant='body2' color='textSecondary'>
                      <b style={{ color: "black" }}>Customer Name:</b>{" "}
                      {_order?.customer?.name}
                    </Typography>
                    <Typography variant='body2' color='textSecondary'>
                      <b style={{ color: "black" }}>Phone Number:</b>{" "}
                      {_order?.customer?.phoneNumber}
                    </Typography>
                    <Typography variant='body2' color='textSecondary'>
                      <b style={{ color: "black" }}>Address:</b>{" "}
                      {_order?.address?.raw}
                    </Typography>
                    <Typography variant='body2' color='textSecondary'>
                      <b style={{ color: "black" }}>Distance:</b>{" "}
                      {_order?.address?.distance?.text}
                    </Typography>
                    <Typography variant='body2' color='textSecondary'>
                      <b style={{ color: "black" }}>Instructions:</b>{" "}
                      {_order?.Instructions}
                    </Typography>
                  </Box>
                  <Divider sx={{ marginY: 1 }} />
                  <Typography
                    variant='body2'
                    color='textSecondary'
                    sx={{ display: "flex", gap: 1 }}>
                    <Typography
                      variant='body2'
                      color='textSecondary'
                      sx={{ display: "flex", gap: 1 }}>
                      <Button
                        onClick={() =>
                          updateOrderStatus(_order.id, "Delivered", true)
                        }
                        variant='contained'
                        sx={{
                          backgroundColor: "#ECAB21",
                          color: "white",
                          marginTop: 2,
                          fontWeight: "bold",
                          fontSize: "10px",
                          "&:hover": {
                            backgroundColor: "white",
                            color: "#ECAB21",
                          },
                        }}>
                        Delivered
                      </Button>
                    </Typography>
                    <Button
                      variant='contained'
                      onClick={() => cancelOrderStatus(_order.id)}
                      sx={{
                        backgroundColor: "red",
                        color: "white",
                        fontWeight: "bold",
                        marginTop: 2,
                        fontSize: "10px",
                        "&:hover": {
                          backgroundColor: "white",
                          color: "red",
                        },
                      }}>
                      Cancel
                    </Button>
                    <Button
                      onClick={() => {
                        setDestination({
                          lat: latlng.lat,
                          lng: latlng.lng,
                        });
                        setOpenMapModal(true);
                      }}
                      variant='contained'
                      sx={{
                        backgroundColor: "#ECAB21",
                        color: "white",
                        marginTop: 2,
                        fontWeight: "bold",
                        fontSize: "10px",
                        "&:hover": {
                          backgroundColor: "white",
                          color: "#ECAB21",
                        },
                      }}>
                      Go (Open Map)
                    </Button>
                    <Button
                      variant='contained'
                      component='a'
                      href={`tel:${_order?.customer?.phoneNumber}`}
                      sx={{
                        backgroundColor: "#ECAB21",
                        color: "white",
                        marginTop: 2,
                        fontWeight: "bold",
                        fontSize: "10px",
                        "&:hover": {
                          backgroundColor: "white",
                          color: "#ECAB21",
                        },
                      }}>
                      Call
                    </Button>
                  </Typography>
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
              </Paper>
            </Box>
          )}
        </Box>
      </Box>
      <Dialog
        open={openMapModal}
        sx={{ zIndex: "999" }}
        onClose={() => setOpenMapModal(!openMapModal)}
        PaperProps={{
          sx: {
            borderRadius: 4,
            minWidth: 370,
          },
        }}>
        <DialogContent>
          {isLoaded && (
            <GoogleMap
              options={{ mapId: "368d7f53a21ed6a2" }}
              mapContainerStyle={{
                width: "100%",
                height: "500px",
              }}
              center={{
                lat: source.lat,
                lng: source.lng,
              }}
              zoom={15}>
              {directionsResponse !== null && (
                <DirectionsRenderer
                  options={{
                    polylineOptions: {
                      strokeColor: "#ff0000",
                    },
                    suppressMarkers: false,
                    draggable: true,
                  }}
                  directions={directionsResponse}
                />
              )}
            </GoogleMap>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

const getStatusColor = (status: string) => {
  const statusColors: Record<string, string> = {
    "Out For Delivery": "#FFAB00",
    Delivered: "#4CAF50",
    Canceled: "#F44336",
    Preparing: "#FFAB00",
    Refunded: "#1E90FF",
  };
  return statusColors[status] || "#FFAB00";
};

export default DriverOrders;
