"use client";

import Autocomplete from "react-google-autocomplete";
import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Container,
  Link,
  ToggleButtonGroup,
  ToggleButton,
  TextField,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import SaveIcon from "@mui/icons-material/Save";
import { useMenuContext } from "@/context";

const OrderPage: React.FC = () => {
  const { address, setAddress,instructions,setInstructions } = useMenuContext();
  const [selectedOption, setSelectedOption] = useState("delivery");
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isEditingInstructions, setIsEditingInstructions] = useState(false);

  const handleOptionChange = (
    event: React.MouseEvent<HTMLElement>,
    newOption: string | null
  ) => {
    if (newOption) {
      setSelectedOption(newOption);
    }
  };

  const handleEditClick = (field: string) => {
    if (field == "address") {
      setIsEditingAddress(true);
    } else if (field == "instructions") {
      setIsEditingInstructions(true);
    }
  };

  const handleSaveClick = (field: string) => {
    if (field == "address") {
      localStorage.setItem(
        "address",
        JSON.stringify({
          ...address,
        })
      );
      setIsEditingAddress(false);
    } else if (field == "instructions") {
      localStorage.setItem('instructions',instructions)
      setIsEditingInstructions(false);
    }
  };

  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(event.target.value);
  };

  const handleInstructionsChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setInstructions(event.target.value);
  };

  return (
    <Box
      sx={{
        backgroundImage: "url('/images/checkout/checkout1.png')",
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}
    >
      <Container maxWidth="md">
        <Paper
          sx={{
            p: 4,
            backgroundColor: "white",
            borderRadius: 4,
            boxShadow: 3,
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
          }}
        >
          <Box sx={{ width: { xs: "100%", md: "50%" }, mb: { xs: 4, md: 0 } }}>
            <Link
              href="#"
              underline="none"
              sx={{ display: "flex", alignItems: "center", mb: 3 }}
            >
              <ArrowBackIcon sx={{ fontSize: 20, color: "#162548" }} />
              <Typography
                variant="body1"
                sx={{ ml: 1, fontWeight: 600, color: "#162548" }}
              >
                Back To Menu
              </Typography>
            </Link>

            <Typography
              variant="h3"
              component="h1"
              sx={{ fontWeight: 700, color: "#162548", mb: 3 }}
            >
              YOUR
              <br />
              ORDER
            </Typography>

            <ToggleButtonGroup
              value={selectedOption}
              exclusive
              onChange={handleOptionChange}
              sx={{
                mb: 3,
                "& .MuiToggleButton-root": {
                  borderRadius: 50,
                  px: 3,
                  py: 1,
                  border: "none",
                  "&.Mui-selected": {
                    backgroundColor: "#F59E0B",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#F59E0B",
                    },
                  },
                },
              }}
            >
              <ToggleButton value="delivery">
                <LocalShippingIcon sx={{ mr: 1 }} />
                Delivery
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <Box sx={{ width: { xs: "100%", md: "50%" } }}>
            {selectedOption == "delivery" && (
              <Box>
                <Box sx={{ mb: 2 }}>
                  {isEditingAddress ? (
                    <Box display="flex" sx={{gap:'17px'}} alignItems="center">
                      <Autocomplete
                        apiKey={process.env.GOOGLE_API_KEY}
                        style={{
                          outline: "none",
                          color: "#8F8996",
                          padding: "14px 10px",
                          fontWeight: "bold",
                          border: "1px solid grey",
                          fontSize: "1rem",
                          flex: "1",
                        }}
                        defaultValue={address?.raw}
                        // required={true}
                        // placeholder='Search the address'
                        onPlaceSelected={(place) => {

                          if(!place) return 

                          let zipCode: string;
                          let city: string;
                          let state: string;
                          for (
                            let i = 0;
                            i < (place.address_components?.length ?? 0);
                            i++
                          ) {
                            for (
                              let j = 0;
                              j < (place.address_components![i].types.length ?? 0 );
                              j++
                            ) {
                              if (
                                place.address_components![i].types[j] ==
                                "postal_code"
                              ) {
                                zipCode = place.address_components![i].long_name;
                              }
                              if (
                                place?.address_components![i].types[j] ==
                                "locality"
                              ) {
                                city = place.address_components[i].long_name;
                              }
                              if (
                                place?.address_components![i].types[j] ==
                                "administrative_area_level_1"
                              ) {
                                state = place?.address_components[i].long_name;
                              }
                            }
                          }

                          const geocoder = new window.google.maps.Geocoder();
                          const post = place.geometry?.location

                          if(!post) return

                          const latlng = new window.google.maps.LatLng(post.lat(),post.lng());
                          geocoder.geocode(
                            { location: latlng },
                            (results: any, status: any) => {
                              if (status === "OK") {
                                if (results.length !== 0) {
                                  let plusCode = "";
                                  let postalCode = "";
                                  for (let i = 0; i < results.length; i++) {
                                    for (
                                      let j = 0;
                                      j < results[i].types.length;
                                      j++
                                    ) {
                                      if (results[i].types[j] == "plus_code") {
                                        plusCode =
                                          results[i]?.plus_code.global_code;
                                      }
                                      if (
                                        results[i].types[j] == "postal_code"
                                      ) {
                                        postalCode =
                                          results[i]?.address_components[j]
                                            .long_name;
                                      }
                                    }
                                  }

                                  console.log(
                                    state + "sssss",
                                    city,
                                    zipCode,
                                    plusCode,
                                    postalCode
                                  );
                                  setAddress({
                                    ...address,
                                    raw: place.formatted_address,
                                    seperate: {
                                      state: state,
                                      city: city,
                                      postal_code:
                                        postalCode || plusCode || zipCode,
                                      line1:
                                        place.formatted_address?.split(",")[0],
                                    },
                                  });
                                } else {
                                  console.error("No results found");
                                }
                              } else {
                                console.error(
                                  "Geocoder failed due to: " + status
                                );
                              }
                            }
                          );
                        }}
                        options={{
                          componentRestrictions: { country: ["ca"] },
                          types: ["geocode", "establishment"],
                        }}
                      />
                      <IconButton onClick={() => handleSaveClick("address")}>
                        <SaveIcon sx={{ color: "#6B7280" }} />
                      </IconButton>
                    </Box>
                  ) : (
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      Address: {address?.raw}
                      <IconButton onClick={() => handleEditClick("address")}>
                        <EditIcon sx={{ color: "#6B7280" }} />
                      </IconButton>
                    </Typography>
                  )}
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body1" color="text.secondary">
                    Delivery Time: 30 To 45 Minutes
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  {isEditingInstructions ? (
                    <Box display="flex" alignItems="center">
                      <TextField
                        fullWidth
                        variant="outlined"
                        value={instructions}
                        onChange={handleInstructionsChange}
                        sx={{ mr: 2 }}
                      />
                      <IconButton
                        onClick={() => handleSaveClick("instructions")}
                      >
                        <SaveIcon sx={{ color: "#6B7280" }} />
                      </IconButton>
                    </Box>
                  ) : (
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      Special Instructions: {instructions}
                      <IconButton
                        onClick={() => handleEditClick("instructions")}
                      >
                        <EditIcon sx={{ color: "#6B7280" }} />
                      </IconButton>
                    </Typography>
                  )}
                </Box>
              </Box>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default OrderPage;
