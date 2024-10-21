"use client";

import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
  MarkerF,
} from "@react-google-maps/api";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/firebase";
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { useAuthContext } from "@/context";
import CircularLodar from "@/components/CircularLodar";
const containerStyle = {
  width: "100%",
  height: "calc(100vh - 123px)",
};

const initialCenter = {
  lat: 43.59129,
  lng: -79.650253,
};

function DriverLocation() {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string,
  });
  const { user, metaData } = useAuthContext();
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [drivers, setDrivers] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // const onLoad = React.useCallback((map: google.maps.Map) => {
  //   const bounds = new google.maps.LatLngBounds(initialCenter);
  //   map.fitBounds(bounds);
  //   setMap(map);
  // }, []);

  const onUnmount = React.useCallback(() => {
    setMap(null);
  }, []);

  const [locations, setLocations] = useState<any>([]);
  const [newOrders, setNewOrders] = useState<any>([]);
  const [kitchens, setKitchens] = useState<any>([]);

  const startOfToday = Timestamp.fromDate(
    new Date(new Date().setHours(0, 0, 0, 0))
  );
  const endOfToday = Timestamp.fromDate(
    new Date(new Date().setHours(23, 59, 59, 999))
  );

  const getDrivers = async () => {
    const driverColRef = collection(db, "drivers");
    const drivers = await getDocs(driverColRef);

    let arr: any = [];
    if (drivers.size > 0) {
      drivers.forEach((doc) => {
        arr.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setDrivers([...arr]);
    }
  };

  const handleDriverSelect = async (orderId: string, driverId: string) => {
    const docRef = doc(db, "orders", orderId);
    const driverRef = doc(db, "drivers", driverId);
    setLoading(true);
    let name = "";
    const _driver = await getDoc(driverRef);
    console.log(_driver.exists());
    if (_driver.exists()) {
      name = _driver.data().name;
    }
    await updateDoc(docRef, {
      driverId: driverId,
      driverName: name,
    });
    setLoading(false);
  };

  useEffect(() => {
    let unsubscribeNewOrder: any;
    let unsubscribePosition: any;
    let unsubscribeKitchen: any;

    if (metaData) {
      const colRef = collection(db, "driverlocation");
      unsubscribePosition = onSnapshot(colRef, (snapshot) => {
        let loc: any = [];
        snapshot.forEach((doc) => {
          const { isOnline } = doc.data();
          if (isOnline) {
            loc.push({
              id: doc.id,
              ...doc.data(),
            });
          }
        });
        setLocations([...loc]);
      });

      const kitchenColRef = collection(db, "foodtrucks");
      unsubscribeKitchen = onSnapshot(kitchenColRef, (snapshot) => {
        let kitchen: any = [];
        snapshot.forEach((doc) => {
          kitchen.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setKitchens([...kitchen]);
      });

      const newOrderQuery = query(
        collection(db, "orders"),
        where("kitchenId", "==", metaData?.foodTruckId),
        where("createdAt", ">=", startOfToday),
        where("createdAt", "<=", endOfToday),
        orderBy("createdAt", "desc")
      );
      unsubscribeNewOrder = onSnapshot(newOrderQuery, (snapshot) => {
        let newOrders: any[] = [];
        snapshot.forEach((doc) => {
          const { delivery, canceled, pickUpAction } = doc.data();
          if (
            delivery.status === false &&
            (delivery.message === "Preparing" ||
              delivery.message === "Out For Delivery") &&
            !pickUpAction &&
            !canceled
          ) {
            newOrders.push({
              id: doc.id,
              ...doc.data(),
            });
          }
        });
        setNewOrders([...newOrders]);
      });
      getDrivers();
    }
    return () => {
      if (unsubscribeNewOrder) {
        unsubscribeNewOrder();
      }

      if (unsubscribePosition) {
        unsubscribePosition();
      }

      if (unsubscribeKitchen) {
        unsubscribeKitchen();
      }
    };
  }, [metaData]);

  return (
    <Box>
      <CircularLodar isLoading={loading} />
      <Box
        sx={{
          height: "90px",
          display: "flex",
          alignItems: "center",
          padding: "0 20px",
          gap: 1,
          width: "850px",
          overflowX: "auto",
          mt: 2,
          "&::-webkit-scrollbar": {
            height: "8px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "orange",
            borderRadius: "10px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "#f1f1f1",
          },
        }}>
        {locations?.length !== 0 ? (
          <>
            {locations.map((driver: any) => {
              return (
                <>
                  <Card
                    key={driver.id}
                    style={{
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "165px",
                      height: "80px",
                      padding: "10px",
                      border: "1px solid grey",
                      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                      backgroundColor: "#f9f9f9",
                      flexShrink: 0,
                    }}>
                    <Typography sx={{ fontSize: "18px" }}>
                      {driver.name}
                    </Typography>
                    <Box>
                      <Chip
                        variant='outlined'
                        label={driver.isOnline ? "Online" : "Offline"}
                        color={driver.isOnline ? "success" : "default"}
                        style={{ fontSize: "14px", fontWeight: "bold" }}
                      />
                    </Box>
                  </Card>
                </>
              );
            })}
          </>
        ) : (
          <>
            <Typography sx={{ fontSize: "18px" }}>
              No driver is online
            </Typography>
          </>
        )}
      </Box>
      <Box sx={{ mt: 2 }}>
          <Box display='flex' sx={{padding: "0 20px",pb:2}} gap={2}>
          <Chip
            sx={{
              backgroundColor: "#678ffc",
              color: "#ffffff",
              fontWeight: "bold",
            }}
            label='Kitchens'
          />
          <Chip
            sx={{
              backgroundColor: "#fd7567",
              color: "#ffffff",
              fontWeight: "bold",
            }}
            label='Orders'
          />
          <Chip
            sx={{
              backgroundColor: "#00e64d",
              color: "#ffffff",
              fontWeight: "bold",
            }}
            label='Drivers'
          />
        </Box>
        {isLoaded && (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={initialCenter}
            zoom={10}
            // onLoad={onLoad}
            onUnmount={onUnmount}
            options={{
              mapId: "368d7f53a21ed6a2",
              mapTypeControl: false,
              zoomControl: false,
              streetViewControl: false,
              fullscreenControl: false,
            }}>
            {locations.map((driver: any) => {
              return (
                <React.Fragment key={driver.id}>
                  <MarkerF
                    position={{
                      lat: driver.latlng.lat,
                      lng: driver.latlng.lng,
                    }}
                    label={{
                      text: driver.name,
                      color: "#000",
                      fontSize: "18px",
                      fontWeight: "bold",
                    }}
                    icon={{
                      url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
                      scaledSize: new window.google.maps.Size(50, 50),
                      labelOrigin: new window.google.maps.Point(25, -10),
                    }}
                  />
                </React.Fragment>
              );
            })}

            {kitchens.map((kitchen: any) => {
              return (
                <React.Fragment key={kitchen.id}>
                  <MarkerF
                    position={{
                      lat: kitchen.address.latlng.lat,
                      lng: kitchen.address.latlng.lng,
                    }}
                    label={{
                      text: kitchen.name,
                      color: "#000",
                      fontSize: "18px",
                      fontWeight: "bold",
                    }}
                    icon={{
                      url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                      scaledSize: new window.google.maps.Size(50, 50),
                      labelOrigin: new window.google.maps.Point(25, -10),
                    }}
                  />
                </React.Fragment>
              );
            })}

            {newOrders.map((order: any) => {
              const { latlng } = order.address;
              if (latlng)
                return (
                  <>
                    <React.Fragment key={order.id}>
                      <MarkerF
                        position={{ lat: latlng.lat, lng: latlng.lng }}
                        icon={{
                          url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
                          scaledSize: new window.google.maps.Size(50, 50),
                          labelOrigin: new window.google.maps.Point(25, -10),
                        }}
                        onClick={() => setSelectedItem(order)}
                        label={{
                          text: `Order - #${order?.orderNumber?.forKitchen}`,
                          color: "#000",
                          fontSize: "18px",
                          fontWeight: "bold",
                        }}
                      />
                    </React.Fragment>
                    {selectedItem?.id === order.id && (
                      <InfoWindow
                        position={{ lat: latlng.lat, lng: latlng.lng }}
                        onCloseClick={() => setSelectedItem(null)}
                        options={{
                          pixelOffset: new window.google.maps.Size(0, -35),
                        }}>
                        <Box sx={{ width: "250px" }}>
                          <Box
                            sx={{
                              marginRight: 2,
                              padding: "2px 8px",
                              backgroundColor: "#f1f1f1",
                              borderRadius: 2,
                              position: "absolute",
                              top: 7,
                              width: "220px",
                            }}>
                            <Typography
                              variant='h6'
                              sx={{ fontWeight: "bold" }}>
                              Order #{selectedItem?.orderNumber?.forKitchen}
                            </Typography>
                          </Box>
                          <Typography variant='body1'>
                            Name :{" "}
                            <strong>{selectedItem?.customer.name}</strong>
                          </Typography>
                          <Typography variant='body1'>
                            Phone :{" "}
                            <strong>
                              {selectedItem?.customer.phoneNumber}
                            </strong>
                          </Typography>
                          <Typography variant='body1'>
                            Address :{" "}
                            <strong>{selectedItem?.address.raw}</strong>
                          </Typography>
                          <FormControl
                            fullWidth
                            variant='outlined'
                            sx={{ mt: 2 }}>
                            <InputLabel>Select Driver</InputLabel>
                            <Select
                              value={order.driverId}
                              onChange={(e) =>
                                handleDriverSelect(order.id, e.target.value)
                              }
                              label='Select Driver'
                              fullWidth
                              sx={{
                                borderRadius: 2,
                              }}>
                              {drivers.map((driver: any) => (
                                <MenuItem key={driver.id} value={driver.id}>
                                  {driver.name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Box>
                      </InfoWindow>
                    )}
                  </>
                );
            })}
          </GoogleMap>
        )}
      </Box>
    </Box>
  );
}

export default DriverLocation;
