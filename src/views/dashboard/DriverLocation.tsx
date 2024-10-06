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
  onSnapshot,
  orderBy,
  query,
  Timestamp,
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
} from "@mui/material";
import { useAuthContext } from "@/context";
const containerStyle = {
  width: "100%",
  height: "calc(100vh - 123px)",
};

const initialCenter = {
  lat: 43.59129,
  lng: -79.650253,
};

interface Driver {
  id: number;
  name: string;
  currentLocation: { lat: number; lng: number };
  nextDestination: { lat: number; lng: number };
}

function DriverLocation() {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string,
  });
  const { user, metaData } = useAuthContext();

  const [map, setMap] = useState<google.maps.Map | null>(null);

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

  const startOfToday = Timestamp.fromDate(
    new Date(new Date().setHours(0, 0, 0, 0))
  );
  const endOfToday = Timestamp.fromDate(
    new Date(new Date().setHours(23, 59, 59, 999))
  );

  useEffect(() => {
    const colRef = collection(db, "driverlocation");
    const unsubscribePosition = onSnapshot(colRef, (snapshot) => {
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

    const newOrderQuery = query(
      collection(db, "orders"),
      where("kitchenId", "==", metaData?.foodTruckId),
      where("createdAt", ">=", startOfToday),
      where("createdAt", "<=", endOfToday),
      orderBy("createdAt", "desc")
    );
    const unsubscribeNewOrder = onSnapshot(newOrderQuery, (snapshot) => {
      let newOrders: any[] = [];
      snapshot.forEach((doc) => {
        const { delivery, canceled, pickUpAction } = doc.data();
        console.log("object");
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

    return () => {
      unsubscribeNewOrder();
      unsubscribePosition();
    };
  }, []);

  return (
    <Box>
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
                      width: "200px",
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
        {isLoaded && (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={initialCenter}
            zoom={10}
            // onLoad={onLoad}
            onUnmount={onUnmount}
            options={{}}>
            {locations.map((driver: any) => (
              <React.Fragment key={driver.id}>
                <MarkerF
                  position={{ lat: driver.latlng.lat, lng: driver.latlng.lng }}
                  label={{
                    text : driver.name,
                    color: "#000",
                    fontSize: "18px", 
                    fontWeight: "bold",
                  }}
                  icon={{
                    url : "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
                    scaledSize: new window.google.maps.Size(50, 50),
                  }}
                />
              </React.Fragment>
            ))}

            {newOrders.map((order: any) => {
              const { latlng } = order.address;
              if (latlng)
                return (
                  <>
                    <React.Fragment key={order.id}>
                      <MarkerF
                        position={{ lat: latlng.lat, lng: latlng.lng }}
                        icon={{
                          url : "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                          scaledSize: new window.google.maps.Size(50, 50),
                        }}
                        label={{
                          text : `Order - #${order?.orderNumber?.forKitchen}`,
                          color: "#000",
                          fontSize: "18px", 
                          fontWeight: "bold",
                        }
                        }
                      />
                    </React.Fragment>
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
