"use client";

import Autocomplete from "react-google-autocomplete";
import React, { useEffect, useState } from "react";
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
import { getUserMetaData, useAuthContext, useMenuContext } from "@/context";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { rejects } from "assert";

interface Props {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const OrderPage: React.FC<Props> = ({ setLoading }) => {
  const { user, metaData, setMetaData, kitchenMetaData } = useAuthContext();
  const { instructions, setInstructions, setIsAddressReachable } = useMenuContext();
  const [selectedOption, setSelectedOption] = useState("delivery");
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [address, setAddress] = useState<any>({ ...metaData.address });
  const [isEditingInstructions, setIsEditingInstructions] = useState(false);
  const handleOptionChange = (
    event: React.MouseEvent<HTMLElement>,
    newOption: string | null
  ) => {
    if (newOption) {
      setSelectedOption(newOption);
    }
  };

  const calculateDistance = (source : string , destinations : string) => {
    return new Promise((resolve,reject) => {
      try{
        const service = new google.maps.DistanceMatrixService();
        const request: any = {
          origins: [source],
          destinations: [destinations],
          travelMode: window.google.maps.TravelMode.DRIVING,
          unitSystem: window.google.maps.UnitSystem.METRIC,
          avoidHighways: false,
          avoidTolls: false,
        };
    
        service.getDistanceMatrix(request, (response : any, status: any) => {
          if (status === "OK") {
            const distance = response.rows[0].elements[0].distance;
            if (distance.value > 10000) {
              setIsAddressReachable(false)
            } else {
              setIsAddressReachable(true)
            }
            resolve(distance)
          } else {
            console.error("Distance failed due to: " + status);
          }
        });
      }catch(err) {
        reject(err)
      }
    })
  }

  useEffect(() => {
    if (metaData?.address?.raw !== "" && kitchenMetaData?.address?.raw !== "") {
      calculateDistance(kitchenMetaData?.address?.raw , metaData?.address?.raw)
    }
  }, [metaData, kitchenMetaData]);

  const handleEditClick = (field: string) => {
    if (field == "address") {
      setIsEditingAddress(true);
    } else if (field == "instructions") {
      setIsEditingInstructions(true);
    }
  };

  const handleSaveClick = async (field: string) => {
    if (field == "address") {
      setLoading(true);
      await updateDoc(doc(db, "users", user.uid), {
        address: address,
      });
      const metaData: any = await getUserMetaData(user?.uid);
      setMetaData({ ...metaData });
      setLoading(false);
      setIsEditingAddress(false);
    } else if (field == "instructions") {
      localStorage.setItem("instructions", instructions);
      setIsEditingInstructions(false);
    }
  };

  const isAddressReach  = async (_id : string) => {
    if(!_id){
      return
    }


    //Do some logic here regarding address.

  }

  // const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setAddress(event.target.value);
  // };

  const handleInstructionsChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setInstructions(event.target.value);
  };

  return (
    <>
      <Box
        sx={{
          background: "#FAF3E0",
          minHeight: "400px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pt:4
        }}
      >
        <Container maxWidth="md">
          <Paper
            sx={{
              p: 2,
              pt:3,
              pl:3,
              backgroundColor: "white",
              borderRadius: 4,
              boxShadow: 3,
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: "center",
            }}
          >
            <Box
              sx={{ width: { xs: "100%", md: "50%" }, mb: { xs: 4, md: 0 } }}
            >
              <Link
                href="/home"
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
              <Box sx={{ mb: 2 }}>
                <Typography variant="body1" color="text.secondary">
                  Delivery Time: 30 To 45 Minutes
                </Typography>
              </Box>
              {selectedOption == "delivery" && (
                <Box>
                  <Box sx={{ mb: 2 }}>
                    {isEditingAddress ? (
                      <Box
                        display="flex"
                        sx={{ gap: "17px" }}
                        alignItems="center"
                      >
                        <Autocomplete
                          apiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY}
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
                          // placeholder = 'Search the address'
                          onPlaceSelected={(place) => {
                            if (!place) return;

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
                                j <
                                (place.address_components![i].types.length ??
                                  0);
                                j++
                              ) {
                                if (
                                  place.address_components![i].types[j] ==
                                  "postal_code"
                                ) {
                                  zipCode =
                                    place.address_components![i].long_name;
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
                                  state =
                                    place?.address_components[i].long_name;
                                }
                              }
                            }

                            const geocoder = new window.google.maps.Geocoder();
                            const post = place.geometry?.location;

                            if (!post) return;

                            const latlng = new window.google.maps.LatLng(
                              post.lat(),
                              post.lng()
                            );
                            geocoder.geocode(
                              { location: latlng },
                              async (results: any, status: any) => {
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
                                        if (
                                          results[i].types[j] == "plus_code"
                                        ) {
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
                                    const distance =  await calculateDistance(kitchenMetaData?.address?.raw, place.formatted_address || '')

                                    setAddress({
                                      raw: place.formatted_address,
                                      seperate: {
                                        state: state,
                                        city: city,
                                        postal_code:
                                          zipCode || plusCode || postalCode,
                                        line1:
                                          place.formatted_address?.split(
                                            ","
                                          )[0],
                                      },
                                      distance
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
                        <IconButton
                        sx={{background:'#F59E0B',borderRadius:'50%',"&:hover": {
                          backgroundColor: "#FFC107",
                          color: "white",
                        },}}
                        onClick={() => handleSaveClick("address")}>
                          <SaveIcon sx={{ color: "#ffffff" }} />
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
                        <IconButton
                        sx={{background:'#F59E0B',borderRadius:'50%',"&:hover": {
                          backgroundColor: "#FFC107",
                          color: "white",
                        }}}
                        onClick={() => handleEditClick("address")}>
                          <EditIcon sx={{ color: "#ffffff" }} />
                        </IconButton>
                      </Typography>
                    )}
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
                        sx={{background:'#F59E0B',borderRadius:'50%',"&:hover": {
                          backgroundColor: "#FFC107",
                          color: "white",
                        },}}
                        onClick={() => handleSaveClick("instructions")}
                        >
                          <SaveIcon sx={{ color: "#ffffff" }} />
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
                        Delivery Instructions: {instructions}
                        <IconButton
                        sx={{background:'#F59E0B',borderRadius:'50%',"&:hover": {
                          backgroundColor: "#FFC107",
                          color: "white",
                        },}}
                        onClick={() => handleEditClick("instructions")}
                        >
                          <EditIcon sx={{ color: "#ffffff" }} />
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
    </>
  );
};

export default OrderPage;