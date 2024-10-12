"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Divider,
  Stepper,
  Step,
  StepLabel,
  Grid,
} from "@mui/material";
import {
  GoogleMap,
  useJsApiLoader,
  DirectionsRenderer,
  InfoWindow,
} from "@react-google-maps/api";
import React from "react";
import CircularLodar from "@/components/CircularLodar";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/firebase";

const containerStyle = {
  width: "100%",
  height: "300px",
};

const initialCenter = {
  lat: -3.745,
  lng: -38.523,
};

const steps = ["Order Confirmed", "Preparing", "Out for Delivery", "Delivered"];

// Define an array with details for items (like Kulcha)
const items = [
  {
    id: 1,
    name: "Mix Kulcha",
    price: "$45.00",
    description: "Soft kulcha bread served with a spread of butter",
    location: { lat: -3.747, lng: -38.521 },
    image: "/images/landingpage/menu1.png", // Replace this with the actual image path
  },
  // Add more items if needed
];

const TrackOrder = ({ orderId }: { orderId: string }) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string,
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [order, setOrder] = useState<any>();
  const [driver, setDriver] = useState<any>();
  const [activeStep, setActiveStep] = useState<number>(1);
  const [directionsResponse, setDirectionsResponse] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        const docRef = doc(db, "orders", orderId);
        const unsubscribeOrder = onSnapshot(docRef, (snapshot) => {
          if (snapshot.exists()) {
            setOrder({ ...snapshot.data() });

            if(snapshot.data().delivery.status === false && snapshot.data().delivery.message === 'Preparing') {
                setActiveStep(2)
            }

            if(snapshot.data().delivery.status === false && snapshot.data().delivery.message === 'Out For Delivery') {
                setActiveStep(3)
            }

            if(snapshot.data().delivery.status === true && snapshot.data().delivery.message === 'Delivered') {
                setActiveStep(4)
            }

            if (snapshot.data()?.driverId) {
              const driverQuery = query(
                collection(db, "driverlocation"),
                where("driverId", "==", snapshot.data().driverId)
              );

              const unsubscribeDriver = onSnapshot(driverQuery, (snapshot) => {
                snapshot.forEach((doc) => {
                  setDriver({ ...doc.data() });
                });
              });

              return () => unsubscribeDriver();
            }
          }
        });

        return () => unsubscribeOrder();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (driver && order && order?.delivery.status !== true) {
      const directionService = new window.google.maps.DirectionsService();
      directionService
        .route({
          origin: {
            lat: driver?.latlng.lat,
            lng: driver?.latlng.lng,
          },
          destination: {
            lat: order.address.latlng.lat,
            lng: order.address.latlng.lng,
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
  }, [driver, order]);
  console.log(order);
  return (
    <Box
      sx={{
        padding: "20px",
        backgroundColor: "#FAF3E0",
        display: "flex",
        justifyContent: "center",
        minHeight: "100dvh",
      }}>
      <CircularLodar isLoading={loading} />
      <Box sx={{ maxWidth: "sm", width: "100%" }}>
        {/* Map Section */}
        <Paper elevation={3} sx={{ height: "300px", width: "100%", mb: 3 }}>
          {isLoaded && order?.driverId ? (
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={initialCenter}
              zoom={10}
              options={{
                mapTypeControl: false, // Disable map type control
              }}>
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
          ) : (
            <>
              <Typography variant='body1'>Driver not assigned yet.</Typography>
            </>
          )}
        </Paper>

        {/* Order Status */}
        <Paper
          elevation={3}
          sx={{ padding: "20px", marginBottom: "20px", width: "100%" }}>
          <Typography variant='h6' sx={{ fontWeight: "bold", mb: 2 }}>
            Order Status
          </Typography>
          <Typography variant='body1'>
            Delivering to {order?.customer?.name}
            <br />
            {order?.address?.raw}
          </Typography>
          <Divider sx={{ my: 2 }} />

          {/* Horizontal Stepper */}
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel
                  sx={{
                    "& .MuiStepIcon-root.Mui-active": { color: "#ECAB21" }, // Active step color
                    "& .MuiStepIcon-root.Mui-completed": { color: "#ECAB21" }, // Completed step color
                  }}>
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Paper>

        {/* Order Details */}
        <Paper elevation={3} sx={{ padding: "20px", width: "100%" }}>
          <Typography variant='h6' sx={{ fontWeight: "bold", mb: 2 }}>
            Order #31
          </Typography>
          <Typography variant='body2' sx={{ mt: 1 }}>
            1:02 PM | Payment Mode: {order?.paymentMode} |{" "}
            {order?.order?.length} Item
          </Typography>
          <Divider sx={{ my: 2 }} />

          {/* Kulcha Image Section */}
          {order?.order.map((item: any) => (
            <Grid
              container
              alignItems='center'
              justifyContent='space-between'
              key={item.id}
              sx={{ marginBottom: "10px" }}>
              <Grid item sx={{ display: "flex", alignItems: "center" }}>
                <img
                  src={item.order.kulcha.image}
                  alt={item.order.kulcha.name}
                  style={{
                    width: "60px",
                    height: "60px",
                    marginRight: "10px",
                    borderRadius: "50%", // This makes the image circular
                    objectFit: "cover", // Ensures the image covers the entire circle
                  }}
                />
                <Box>
                  <Typography variant='body1'>
                    <strong>
                      {item.order.kulcha.name} x {item.order.kulcha.quantity}
                    </strong>
                  </Typography>
                </Box>
              </Grid>
              <Grid item>
                <Typography variant='body1' sx={{ textAlign: "right" }}>
                  {item.price}
                </Typography>
              </Grid>
            </Grid>
          ))}

          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography variant='body2' sx={{ fontWeight: "bold" }}>
              Subtotal:
            </Typography>
            <Typography variant='body2'>${order?.basic_amount}</Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography variant='body2' sx={{ fontWeight: "bold" }}>
              Delivery Charges:
            </Typography>
            <Typography variant='body2'>${order?.deliverCharge}</Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography variant='body2' sx={{ fontWeight: "bold" }}>
              Taxes:
            </Typography>
            <Typography variant='body2'>${order?.total_tax}</Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography variant='body2' sx={{ fontWeight: "bold" }}>
              Tip Amount:
            </Typography>
            <Typography variant='body2'>${order?.tip}</Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
            <Typography variant='body2' sx={{ fontWeight: "bold" }}>
              Grand Total:
            </Typography>
            <Typography variant='body2'>${order?.grand_total}</Typography>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default TrackOrder;
