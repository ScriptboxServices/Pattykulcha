"use client";

import { useAuthContext, useMenuContext } from "@/context";
import {
  Box,
  Typography,
  Link,
  Button,
  Grid,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  TextField,
  InputAdornment,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CloseIcon from "@mui/icons-material/Close";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CancelIcon from "@mui/icons-material/Cancel";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const KitchenLocations = () => {
  const [selectedOption, setSelectedOption] = useState("delivery");
  const [address1, setAddress1] = useState<any>({});
  const { metaData, kitchenProfile } = useAuthContext();
  const [loading, setLoading] = useState(false);

  const handleButtonClick = (option: React.SetStateAction<string>) => {
    setSelectedOption(option);
  };

  const { allKitchens } = useAuthContext();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState("");
  // const [allkitchens, setKitchens] = useState<any[]>([]);

  // const getAllKitchens = async () => {
  //   setLoading(true);
  //   const kitchenRef = collection(db, "foodtrucks");
  //   const kitchens = await getDocs(kitchenRef);

  //   let arr: any = [];
  //   if (kitchens.size > 0) {
  //     kitchens.forEach((doc) => {
  //       arr.push({
  //         id: doc.id,
  //         ...doc.data(),
  //       });
  //     });
  //     setKitchens([...arr]);
  //   }
  //   setLoading(false);
  // };

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  const handleEditClick = (address: string) => {
    setSelectedAddress(address);
  };

  // Function to handle input change
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState("");

  // Simple debounce function
  const debounce = (func: Function, wait: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  };

  // Function to handle input change
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);

    if (value.length < 3) {
      setSuggestions([]); // Clear suggestions for short inputs
      return;
    }

    // Fetch suggestions after a delay
    fetchSuggestions(value);
  };

  // Fetch suggestions from Google Places API
  const fetchSuggestions = useCallback(
    debounce((input: string) => {
      const service = new window.google.maps.places.AutocompleteService();
      service.getPlacePredictions(
        { input: input, componentRestrictions: { country: "ca" } },
        (predictions, status) => {
          if (
            status === window.google.maps.places.PlacesServiceStatus.OK &&
            predictions
          ) {
            const formattedSuggestions = predictions.map((prediction) => ({
              description: prediction.description,
              structured_formatting: prediction.structured_formatting,
              placeId: prediction.place_id,
            }));
            setSuggestions(formattedSuggestions);
          }
        }
      );
    }, 300),
    []
  );

  const handleSelectSuggestion = (suggestion: any) => {
    setInputValue(suggestion.description); // Set input value to the selected address
    setSuggestions([]); // Clear the suggestions after selection
    console.log(
      "Selected Address:",
      suggestion.description,
      "Place ID:",
      suggestion.placeId
    );
  };

  return (
    <Box
      sx={{
        background: "#FAF3E0",
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        pt: 4,
        paddingBottom: "1rem",
        px: 2,
      }}
    >
      {/* Content Container */}
      <Box
        sx={{
          width: { xs: "100%", sm: "80%", md: "100%", textAlign: "left" },
          maxWidth: "600px",
          alignSelf: { xs: "center", xl: "flex-start" },
          ml: { xs: 0, xl: 20 },
          mt: { xs: 2, sm: 4 },
        }}
      >
        {/* Heading */}
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            color: "#162548",
            mb: 2,
          }}
        >
          Our Locations
        </Typography>

        {/* Primary Address with Edit Icon */}
        <Typography
          sx={{
            fontWeight: "bold",
            color: "grey",
            mb: 1,
            fontSize: "18px",
            display: "flex",
            flexDirection: { xs: "column", sm: "row" }, // Column on mobile, row on desktop
            alignItems: { xs: "flex-start", sm: "center" }, // Align items flex-start on mobile, center on desktop
          }}
        >
          {/* Primary Address Label */}
          <Typography
            component="span"
            sx={{
              fontWeight: "bold",
              color: "grey",
              fontSize: "18px",
            }}
          >
            Primary Address:
          </Typography>

          {/* Address and Edit Icon Container */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mt: { xs: 1, sm: 0 }, // Add margin top on mobile for better spacing
            }}
          >
            <Typography
              component="span"
              sx={{
                color: "#333333",
                fontWeight: "bold",
                fontSize: "18px",
                ml: { xs: 0, sm: 1 }, // Remove margin-left on mobile, add margin-left on desktop
              }}
            >
              {metaData?.address?.seperate.city},{" "}
              {metaData?.address?.seperate.state}{" "}
              {metaData?.address?.seperate.postal_code}
            </Typography>

            {/* MUI Edit Icon */}
            <IconButton
              onClick={toggleDrawer(true)}
              sx={{ ml: { sm: 3, xs: 0 }, mt: { xs: 1, sm: 0 } }}
            >
              <KeyboardArrowDownIcon
                sx={{
                  color: "#757575",
                  fontSize: "20px",
                  cursor: "pointer",
                }}
              />
            </IconButton>
          </Box>
        </Typography>

        <Link
          href="#"
          underline="hover"
          sx={{
            color: "#162548",
            textDecoration: "underline",
            fontSize: "20px",
            fontWeight: "bold",
          }}
        >
          Use my current location
        </Link>
      </Box>

      {/* Delivery Options */}
      <Box
        sx={{
          width: { xs: "100%", sm: "50%" },
          mt: 4,
          ml: { xs: 0, xl: 20 },
          alignSelf: { xs: "center", xl: "flex-start" },
        }}
      >
        <Grid container spacing={2} justifyContent="flex-start">
          <Grid item xs={4} sm={4} md={3}>
            <Button
              onClick={() => handleButtonClick("pickup")}
              sx={{
                borderRadius: "30px",
                border: "2px solid #FFC107",
                padding: "8px 24px",
                color: selectedOption === "pickup" ? "#000" : "#555",
                fontWeight: "bold",
                backgroundColor:
                  selectedOption === "pickup" ? "#ECAB21" : "transparent",
                width: "100%", // Full width within its grid cell
                "&:hover": {
                  backgroundColor:
                    selectedOption === "pickup" ? "#FFC107" : "#ECAB21",
                },
              }}
            >
              Pickup
            </Button>
          </Grid>
          <Grid item xs={4} sm={4} md={3}>
            <Button
              onClick={() => handleButtonClick("delivery")}
              sx={{
                borderRadius: "30px",
                border: "2px solid #FFC107",
                padding: "8px 24px",
                color: selectedOption === "delivery" ? "#000" : "#555",
                fontWeight: "bold",
                backgroundColor:
                  selectedOption === "delivery" ? "#ECAB21" : "transparent",
                width: "100%", // Full width within its grid cell
                "&:hover": {
                  backgroundColor: "#ECAB21",
                },
              }}
            >
              Delivery
            </Button>
          </Grid>

          <Grid item xs={4} sm={4} md={3}>
            <Button
              onClick={() => handleButtonClick("dine-in")}
              sx={{
                borderRadius: "30px",
                border: "2px solid #FFC107",
                padding: "8px 14px",
                color: selectedOption === "dine-in" ? "#000" : "#555",
                fontWeight: "bold",
                backgroundColor:
                  selectedOption === "dine-in" ? "#ECAB21" : "transparent",
                width: "100%", // Full width within its grid cell
                "&:hover": {
                  backgroundColor: "#ECAB21",
                },
              }}
            >
              Dine-in
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Box
        sx={{
          width: { xs: "100%", sm: "80%", md: "80%", xl: "80%" },
          mt: 4,
        }}
      >
        <Grid container spacing={3}>
          {allKitchens?.map((kitchen: any, index: number) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Box
                sx={{
                  background: "#FFFFFF",
                  borderRadius: "10px",
                  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                  p: 3,
                  mb: 4,
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  {/* Online Status */}
                  {kitchen?.isShopOpen ? (
                    <Box
                      sx={{
                        backgroundColor: "#28A745",
                        color: "#FFFFFF",
                        fontWeight: "bold",
                        borderRadius: "5px", // Pill shape
                        padding: "5px 15px", // Padding for pill effect
                        display: "inline-block", // Ensure it’s inline
                        fontSize: "14px", // Adjust font size
                      }}
                    >
                      Online
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        backgroundColor: "red",
                        color: "#FFFFFF",
                        fontWeight: "bold",
                        borderRadius: "5px", // Pill shape
                        padding: "5px 15px", // Padding for pill effect
                        display: "inline-block", // Ensure it’s inline
                        fontSize: "14px", // Adjust font size
                      }}
                    >
                      Offline
                    </Box>
                  )}

                  {/* Distance (Icon + Text) */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Image
                      src="/images/kitchen-locations/image4.png" // Replace with correct path
                      alt="Distance"
                      width="24"
                      height="24"
                    />
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: "bold", color: "#162548" }}
                    >
                      {kitchen?.address?.distance?.text}
                    </Typography>
                  </Box>

                  {/* Time (Icon + Text with Blue Block) */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Box sx={{ position: "relative" }}>
                      <Image
                        src="/images/kitchen-locations/image5.png" // Replace with correct path
                        alt="Time"
                        width="24"
                        height="24"
                      />
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: "bold", color: "#162548" }}
                    >
                      1 Hour
                    </Typography>
                  </Box>
                </Box>

                {/* Address */}
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: "bold",
                    color: "#162548",
                    mb: 1,
                    mt: 3,
                    textAlign: "left",
                    fontSize: { xs: "18px", md: "20px" },
                  }}
                >
                  {kitchen?.address?.raw}
                </Typography>

                {/* Timings */}
                <Typography
                  variant="body1"
                  sx={{
                    color: "grey", // Grey color to match the image
                    fontWeight: "bold",
                    textAlign: "left",
                    display: "flex", // Flex to align elements properly
                    alignItems: "flex-start", // Align vertically
                    gap: "0.3rem", // Add spacing between elements
                    flexDirection: "column",
                    fontSize: "14px",
                    mt: 1,
                  }}
                >
                  {/* Timings Label */}
                  Timings:
                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                    }}
                  >
                    <Typography
                      component="span"
                      sx={{
                        fontWeight: "bold",
                        color: "grey",
                        fontSize: "14px",
                      }}
                    >
                      9:00 AM - 11:00 PM
                    </Typography>
                    <Typography
                      component="span"
                      sx={{
                        color: "grey",
                        fontSize: "14px",
                        fontWeight: "normal",
                      }}
                    >
                      (Mon - Sun)
                    </Typography>
                  </Box>
                </Typography>

                <Divider sx={{ my: 3 }} />

                {/* Delivery Options Icons */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-around", // Adjust spacing to evenly spread icons
                    mb: 2,
                  }}
                >
                  <Box
                    sx={{
                      textAlign: "center",
                      display: "flex",
                      gap: 0.7,
                      position: "relative",
                    }}
                  >
                    <Image
                      src="/images/kitchen-locations/image1.png"
                      alt="Delivery"
                      width="24"
                      height="28"
                    />
                    <Image
                      src="/images/kitchen-locations/image6.png"
                      alt="Dine-in"
                      width="7"
                      height="18"
                      style={{
                        position: "absolute",
                        left: 16,
                        top: 20,
                        transform: "rotate(-15deg)", // Rotating the image 45 degrees towards the top-left
                        transformOrigin: "top left", // The origin of the rotation is set to the top-left corner
                      }}
                    />

                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: "bold",
                        fontSize: "12px",
                        color: "#162548",
                        mt: "2px",
                      }}
                    >
                      Delivery
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: "center", display: "flex", gap: 0.7 }}>
                    <Image
                      src="/images/kitchen-locations/image2.png"
                      alt="Pickup"
                      width="24"
                      height="28"
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: "bold",
                        fontSize: "12px",
                        color: "#162548",
                        mt: "2px",
                      }}
                    >
                      Pickup
                    </Typography>
                  </Box>

                  <Box sx={{ textAlign: "center", display: "flex", gap: 0.7 }}>
                    <Image
                      src="/images/kitchen-locations/image3.png"
                      alt="Dine-in"
                      width="32"
                      height="28"
                    />

                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: "bold",
                        fontSize: "12px",
                        color: "#162548",
                        mt: "2px",
                      }}
                    >
                      Dine-in
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Order Now Button */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: "#ECAB21",
                      color: "#FFFFFF",
                      fontWeight: "bold",
                      borderRadius: "25px",
                      width: "60%",
                      padding: "10px",
                      justifyContent: "center",
                      "&:hover": {
                        backgroundColor: "#FFC107",
                      },
                    }}
                  >
                    Order Now
                  </Button>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
      <Drawer anchor="bottom" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{
            width: "100vw",
            maxHeight: "90vh",
            p: 2,
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#fff",
            borderRadius: "20px 20px 0 0",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", fontSize: "27px", alignSelf: "center" }}
            >
              Addresses
            </Typography>
            <IconButton onClick={toggleDrawer(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Search Bar */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#f1f1f1",
              borderRadius: "30px",
              padding: "0px 10px",
              width: "100%",
              mb: 2,
            }}
          >
            <TextField
              fullWidth
              placeholder="Search"
              variant="standard"
              value={inputValue}
              onChange={handleInputChange}
              InputProps={{
                disableUnderline: true,
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#757575", mr: 1 }} />
                  </InputAdornment>
                ),
                autoComplete: "false",
                endAdornment: inputValue != "" && (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => {
                        setInputValue("");
                        setSuggestions([]);
                      }}
                      sx={{
                        ml: 4,
                      }}
                    >
                      <CancelIcon sx={{ color: "#757575" }} />
                    </IconButton>
                  </InputAdornment>
                ),
                sx: {
                  fontSize: "16px",
                  padding: "10px",
                },
              }}
              sx={{
                borderRadius: "30px",
                backgroundColor: "#f1f1f1",
              }}
            />
          </Box>

          {/* Display address suggestions */}

          {suggestions.map((suggestion, index) => (
            <Box key={index}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  p: 1.5,
                  fontSize: "14px",
                  "&:hover": { backgroundColor: "#f1f1f1" },
                }}
                onClick={() => handleSelectSuggestion(suggestion)}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <LocationOnIcon sx={{ color: "#757575" }} />
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: "bold", fontSize: "1.2em" }}
                    >
                      {suggestion.structured_formatting.main_text}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#757575" }}>
                      {suggestion.structured_formatting.secondary_text}
                    </Typography>
                  </Box>
                </Box>

                {/* Right Edit Icon */}
                <IconButton edge="end">
                  <EditIcon sx={{ color: "#757575" }} />
                </IconButton>
              </Box>

              {/* Custom Divider */}
              <Divider
                sx={{
                  my: 1, // Vertical margin
                  borderColor: "#e0e0e0", // Custom border color (lighter gray)
                  borderWidth: 1, // Thickness of the divider
                  width: "100%", // Ensure it stretches fully
                  opacity: 0.6, // Control opacity for a softer look
                }}
              />
            </Box>
          ))}

          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", mb: 1, fontSize: "1.7em", mt: 1 }}
          >
            Explore nearby
          </Typography>

          <List sx={{ backgroundColor: "#f7f7f7", mb: 2, width: "100%", p: 0 }}>
            <ListItem>
              <LocationOnIcon sx={{ color: "#000", mr: 2 }} />
              <ListItemText
                primary={
                  <Typography
                    sx={{ fontWeight: "bold", color: "#000", fontSize: "16px" }}
                  >
                    {metaData?.address?.seperate?.line1}
                  </Typography>
                }
                secondary={
                  <Typography sx={{ color: "#888", fontSize: "14px" }}>
                    {metaData?.address?.seperate.city},{" "}
                    {metaData?.address?.seperate.state}{" "}
                    {metaData?.address?.seperate.postal_code}
                  </Typography>
                }
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  onClick={() => handleEditClick("7159 Magistrate Terr")}
                >
                  <EditIcon sx={{ color: "#757575" }} />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          </List>

          {/* Saved Addresses Section */}
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: "bold", fontSize: "1.7em" }}
          >
            Saved addresses
          </Typography>
          <List>
            {metaData?.savedAddress?.map((address: any, index: number) => (
              <Box key={index}>
                <ListItem sx={{ px: 0 }}>
                  <LocationOnIcon sx={{ color: "#757575", mr: 2 }} />
                  <ListItemText
                    primary={
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: "bold",
                          color: "#333",
                          fontSize: "18px",
                        }}
                      >
                        {address?.seperate?.line1}
                      </Typography>
                    }
                    secondary={
                      <Typography sx={{ color: "#888", fontSize: "14px" }}>
                        {address?.seperate.city}, {address?.seperate.state}{" "}
                        {address?.seperate.postal_code}
                      </Typography>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={() => handleEditClick(address.primary)}
                    >
                      <EditIcon sx={{ color: "#757575" }} />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>

                {/* Divider after each address */}
                <Divider
                  sx={{
                    my: 0.2, // Optional margin (space between items)
                    borderColor: "#e0e0e0", // Custom border color (light gray)
                  }}
                />
              </Box>
            ))}
          </List>

          {/* Time Preference Section */}
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", mt: 1, fontSize: "1.3em" }}
          >
            Time preference
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 1,
              // backgroundColor: "#f1f1f1",
              borderRadius: "10px",
              padding: "10px",
              mb: 5,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <AccessTimeIcon sx={{ color: "#757575" }} />
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", fontSize: "1.15em" }}
              >
                Deliver now
              </Typography>
            </Box>
            <Button
              variant="outlined"
              sx={{
                fontWeight: "bold",
                textTransform: "none",
                borderRadius: "20px",
                fontSize: "1em",
                borderColor: "#E0E0E0",
                padding: "5px 15px",
                backgroundColor: "#F6F6F6",
                color: "#000",
                "&:hover": {
                  backgroundColor: "#E0E0E0",
                },
              }}
            >
              Schedule
            </Button>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

export default KitchenLocations;
