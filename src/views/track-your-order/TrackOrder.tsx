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
  styled,
  StepConnector,
  keyframes,
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
import CheckIcon from "@mui/icons-material/Check";

const containerStyle = {
  width: "100%",
  height: "300px",
};

const initialCenter = {
  lat: -3.745,
  lng: -38.523,
};

const steps = ["Order Confirmed", "Preparing", "Out for Delivery", "Delivered"];

const items = [
  {
    id: 1,
    name: "Mix Kulcha",
    price: "$45.00",
    description: "Soft kulcha bread served with a spread of butter",
    location: { lat: -3.747, lng: -38.521 },
    image: "/images/landingpage/menu1.png", // Replace this with the actual image path
  },
];

const CustomConnector = styled(StepConnector)({
  "& .MuiStepConnector-line": {
    borderTopWidth: 4,
    borderRadius: 1,
    borderColor: "green",
    height: 40,
  },
});

const activeStepAnimation = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(0, 123, 255, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(0, 123, 255, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(0, 123, 255, 0);
  }
`;

const CustomStepIcon = styled("div")<{ completed?: boolean; active?: boolean }>(
  ({ completed, active }) => ({
    color: completed || active ? "green" : "#d3d3d3",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 24,
    height: 24,
    borderRadius: "50%",
    backgroundColor: completed || active ? "green" : "#d3d3d3",
    "& svg": {
      fill: "#fff",
    },
    boxShadow: active ? "0 0 0 10px rgba(0, 123, 255, 0.2)" : "none",
    animation: active ? `${activeStepAnimation} 1.5s infinite` : "none",
  })
);

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
  const [mapCenter, setMapCenter] = useState(initialCenter); // Added to handle dynamic center

  useEffect(() => {
    if (driver) {
      setMapCenter({ lat: driver?.latlng.lat, lng: driver?.latlng.lng });
    }
  }, [driver]);

  useEffect(() => {
    const init = async () => {
      try {
        const docRef = doc(db, "orders", orderId);
        const unsubscribeOrder = onSnapshot(docRef, (snapshot) => {
          if (snapshot.exists()) {
            setOrder({ ...snapshot.data() });

            if (
              snapshot.data().delivery.status === false &&
              snapshot.data().delivery.message === "Preparing"
            ) {
              setActiveStep(2);
            }

            if (
              snapshot.data().delivery.status === false &&
              snapshot.data().delivery.message === "Out For Delivery"
            ) {
              setActiveStep(3);
            }

            if (
              snapshot.data().delivery.status === true &&
              snapshot.data().delivery.message === "Delivered"
            ) {
              setActiveStep(4);
            }

            if (snapshot.data()?.driverId) {
              const driverQuery = query(
                collection(db, "driverlocation"),
                where("driverId", "==", snapshot.data().driverId)
              );

              const unsubscribeDriver = onSnapshot(driverQuery, (snapshot) => {
                snapshot.forEach((doc) => {
                  const driverData = { ...doc.data() };
                  setDriver(driverData);
                  setMapCenter({
                    lat: driverData.latlng.lat,
                    lng: driverData.latlng.lng,
                  }); // Set driver location as center
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
        });
    }
  }, [driver, order]);

  return (
    <Box
      sx={{
        padding: "20px",
        backgroundColor: "#FAF3E0",
        display: "flex",
        justifyContent: "center",
        minHeight: "100dvh",
      }}
    >
      <CircularLodar isLoading={loading} />
      <Box sx={{ maxWidth: "sm", width: "100%" }}>
        {/* Map Section */}
        <Paper elevation={3} sx={{ height: "300px", width: "100%", mb: 3 }}>
          {isLoaded && order?.driverId ? (
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={mapCenter} // Use dynamic center
              zoom={10}
              onLoad={(map) => setMap(map)}
              options={{
                mapId: "368d7f53a21ed6a2",
                mapTypeControl: false,
                zoomControl: false,
                streetViewControl: false,
                fullscreenControl: false,
              }}
            >
              {directionsResponse && (
                <DirectionsRenderer
                  options={{
                    polylineOptions: {
                      strokeColor: "#ff0000",
                    },
                    suppressMarkers: false,
                  }}
                  directions={directionsResponse}
                />
              )}
            </GoogleMap>
          ) : (
            <>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                {activeStep == 4 ? (
                  <Typography variant="h4">Order has been delivered</Typography>
                ) : (
                  <img
                    src="/mp3/your-food-is-being-prepared_2x.gif"
                    alt="Driver not assigned yet"
                    style={{ width: "600px", height: "300px" }}
                  />
                )}
              </Box>
            </>
          )}
        </Paper>

        <Paper
          elevation={3}
          sx={{ padding: "20px", marginBottom: "20px", width: "100%" }}
        >
          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
            Order Status
          </Typography>
          <Box sx={{ display: "flex",flexDirection:'column' }}>
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              Order {order?.orderNumber?.forCustomer}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              1:02 PM | Payment Mode: {order?.paymentMode} |{" "}
              {order?.order?.length} Item
            </Typography>
            
          </Box>
          <Divider sx={{ my: 2 }} />
          <Stepper
            activeStep={activeStep}
            alternativeLabel
            connector={<CustomConnector />}
            sx={{
              padding: "24px 0",
              "& .MuiStepLabel-label": {
                fontSize: "12px",
                fontWeight: "bold",
                color: "#000",
                "&.Mui-active": { color: "#000" },
                "&.Mui-completed": { color: "#000" },
              },
            }}
          >
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel
                  StepIconComponent={({ completed, active }) => (
                    <CustomStepIcon completed={completed} active={active}>
                      {completed ? <CheckIcon /> : null}
                    </CustomStepIcon>
                  )}
                >
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>

          <Divider sx={{ my: 2 }} />
          {/* Kulcha Image Section */}
          {order?.order.map((item: any) => (
            <Grid
              container
              alignItems="center"
              justifyContent="space-between"
              key={item.id}
              sx={{ marginBottom: "10px" }}
            >
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
                  <Typography variant="body1">
                    <strong>
                      {item.order.kulcha.name} x {item.order.kulcha.quantity}
                    </strong>
                  </Typography>
                </Box>
              </Grid>
              <Grid item>
                <Typography variant="body1" sx={{ textAlign: "right" }}>
                  {item.price}
                </Typography>
              </Grid>
            </Grid>
          ))}

          <Typography variant="body1">
            Delivering to: {order?.customer?.name}
            <br />
            {order?.address?.raw}
          </Typography>
          {/* <Divider sx={{ my: 2 }} /> */}

          {/* Horizontal Stepper */}
        </Paper>

        {/* Order Details */}
      </Box>
    </Box>
  );
};

export default TrackOrder;
