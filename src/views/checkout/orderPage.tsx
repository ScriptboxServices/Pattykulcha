"use client";

import Autocomplete from "react-google-autocomplete";

import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Container,
  Link,
  ToggleButtonGroup,
  ToggleButton,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  IconButton,
  Alert,
  InputAdornment,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import {
  getUserMetaData,
  useAuthContext,
  useMenuContext,
  calculateDistance,
  getNearestKitchen,
} from "@/context";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { v4 } from "uuid";
import { updateProfile } from "firebase/auth";

interface Props {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedOption: React.Dispatch<React.SetStateAction<string>>;
  selectedOption: string;
  setPickupTime: React.Dispatch<React.SetStateAction<string>>;
  pickupTime: string;
}

const OrderPage: React.FC<Props> = ({
  setLoading,
  setSelectedOption,
  selectedOption,
  setPickupTime,
  pickupTime,
}) => {
  const { user, metaData, setMetaData, kitchenMetaData, allKitchens,setKitchenMetaData } = useAuthContext();
  const { instructions, setInstructions, setIsAddressReachable } =
    useMenuContext();
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [address, setAddress] = useState<any>({});
  const [openDialog, setOpenDialog] = useState(false);
  const [openInstructionsDialog, setOpenInstructionsDialog] = useState(false);
  const [isEditingInstructions, setIsEditingInstructions] = useState(false);
  const [openPickupTimeDialog, setOpenPickupTimeDialog] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [timeError, setTimeError] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [name, setName] = useState<string | undefined>(metaData?.name);

  const changeTime = (e: any) => {
    setPickupTime(e.target.value);
  };

  const handleEditName = () => {
    setIsEditingName(true);
    setTimeout(() => {
      nameInputRef.current?.focus();
    }, 0);
  };

  const handlePickupTimeClick = () => {
    setOpenPickupTimeDialog(true);
  };

  const handleNameSave = async () => {
    try {
      setLoading(true);
      const docRef = doc(db, "users", user?.uid);
      await updateDoc(docRef, { name });
      await updateProfile(user, { displayName: name });
      setMetaData((prev: any) => ({ ...prev, name }));
      setIsEditingName(false);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  function convertToMinutes(timeStr: string) {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
  }

  const handlePickupTimeSave = () => {
    const time1Minutes = convertToMinutes(
      `${new Date().getHours()}:${new Date().getMinutes()}`
    );
    const time2Minutes = convertToMinutes(pickupTime);
    if (time2Minutes < time1Minutes) {
      setTimeError("Past time is not allowed.");
      return "Past time is not allowed.";
    }
    setTimeError("");
    setOpenPickupTimeDialog(false);

    return "";
  };

  const handleOptionChange = (
    event: React.MouseEvent<HTMLElement>,
    newOption: string | null
  ) => {
    if (newOption) {
      setSelectedOption(newOption);
    }
  };

  useEffect(() => {
    const init = async () => {
      if (
        metaData?.address?.raw !== "" &&
        allKitchens?.length !== 0
      ) {
        // const { flag }: any = await calculateDistance(
        //   kitchenMetaData?.address?.raw,
        //   metaData?.address?.raw,
        //   Number(kitchenMetaData?.orderRange)
        // );
        const kitchen : any = await getNearestKitchen(metaData?.address,allKitchens)
        setIsAddressReachable(kitchen?.data?.flag);
        setKitchenMetaData(kitchen)
        await updateDoc(doc(db,'users',metaData?.id),{
          "address.distance" : kitchen.data.distance
        })
      }
    };
    init();
  }, [metaData, allKitchens]);

  const handleEditClick = (field: string) => {
    if (field == "address") {
      setOpenDialog(true);
    } else if (field == "instructions") {
      setOpenInstructionsDialog(true);
    }
  };

  const handleSaveClick = async (field: string) => {
    if (field == "address") {
      setLoading(true);
      let editAddress =
        metaData?.savedAddress !== undefined
          ? metaData?.savedAddress?.map((addr: any) => {
              return {
                ...addr,
                isPrimary: false,
              };
            })
          : [];
      await updateDoc(doc(db, "users", user.uid), {
        address: address,
        savedAddress: [
          { ...address, isPrimary: true, _id: v4() },
          ...editAddress,
        ],
      });
      const userData: any = await getUserMetaData(user?.uid);
      setMetaData({ ...userData });
      setLoading(false);
      setOpenDialog(false);
    } else if (field == "instructions") {
      localStorage.setItem("instructions", instructions);
      setIsEditingInstructions(false);
      setLoading(false);
      setOpenInstructionsDialog(false);
    }
  };

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
          pt: 4,
          paddingBottom: "1rem",
        }}
      >
        <Container maxWidth="md">
          <Paper
            sx={{
              p: 2,
              pt: 3,
              pl: 3,
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
                sx={{ fontWeight: 700, color: "#162548", mb: 1 }}
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
                  mb: { xs: 0, md: 3 },
                  display: "flex",
                  justifyContent: "flex-start",
                  "& .MuiToggleButton-root": {
                    borderRadius: 25,
                    px: { xs: 2, sm: 4 },
                    py: 1.5,
                    mr: 1,
                    border: "none",
                    backgroundColor: "#F3F4F6",
                    color: "#4B5563",
                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                    transition:
                      "background-color 0.3s, box-shadow 0.3s, transform 0.3s",
                    "&:hover": {
                      backgroundColor: "#E5E7EB",
                      transform: "scale(1.05)",
                    },
                    "&.Mui-selected": {
                      backgroundColor: "#F59E0B",
                      color: "white",
                      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
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
                <ToggleButton value="pickup">
                  <ShoppingBagIcon sx={{ mr: 1 }} />
                  Pickup
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>

            <Box sx={{ width: { xs: "100%", md: "50%" } }}>
              {/* <Box sx={{ mb: 2 }}>
                <Typography
                  variant="h6"
                  color="text.secondary"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    fontWeight: "bold",
                    color: "#1F2937",
                    paddingBottom: "4px",
                  }}
                >
                  Delivery Time: 30 To 45 Minutes
                </Typography>
              </Box> */}
              {selectedOption == "delivery" && (
                <Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="h6"
                      color="text.secondary"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        fontWeight: "bold",
                        color: "#1F2937",
                        paddingBottom: "4px",
                      }}
                    >
                      Delivery Time: 1 Hour
                    </Typography>
                  </Box>
                  <Box
                    sx={{ mb: 2, cursor: "pointer" }}
                    onClick={() => handleEditClick("address")}
                  >
                    <Typography
                      color="text.secondary"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        color: "#1F2937",
                        paddingBottom: "4px",
                        fontSize: { xs: "16px", lg: "18px" },
                      }}
                    >
                      Address: {metaData?.address?.raw}
                      <IconButton
                        sx={{
                          background: "#F59E0B",
                          borderRadius: "50%",
                          "&:hover": {
                            backgroundColor: "#FFC107",
                            color: "white",
                          },
                        }}
                        onClick={() => handleEditClick("address")}
                      >
                        <EditIcon sx={{ color: "#ffffff" }} />
                      </IconButton>
                    </Typography>
                  </Box>

                  <Box
                    sx={{ mb: 3, cursor: "pointer" }}
                    onClick={() => handleEditClick("instructions")}
                  >
                    <Typography
                      color="text.secondary"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        color: "#1F2937",
                        paddingBottom: "4px",
                        fontSize: { xs: "16px", lg: "18px" },
                        wordBreak: "break-all",
                      }}
                    >
                      Delivery Instructions: {instructions}
                      <IconButton
                        sx={{
                          background: "#F59E0B",
                          borderRadius: "50%",
                          "&:hover": {
                            backgroundColor: "#FFC107",
                            color: "white",
                          },
                        }}
                        onClick={() => handleEditClick("instructions")}
                      >
                        <EditIcon sx={{ color: "#ffffff" }} />
                      </IconButton>
                    </Typography>
                  </Box>
                  <Box
                    sx={{ mb: 3, cursor: "pointer" }}
                    onClick={handleEditName}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        color: "#1F2937",
                        paddingBottom: "4px",
                        fontSize: { xs: "16px", lg: "18px" },
                        wordBreak: "break-all",
                      }}
                    >
                      {/* Conditionally render the TextField or the name */}
                      {isEditingName ? (
                        <TextField
                          inputRef={nameInputRef}
                          fullWidth
                          variant="outlined"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <Button
                                  variant="contained"
                                  onClick={handleNameSave}
                                  // disabled={!name}
                                  sx={{
                                    backgroundColor: "#ECAB21",
                                    color: "white",
                                    "&:hover": {
                                      backgroundColor: "#FFC107",
                                      color: "white",
                                    },
                                  }}
                                >
                                  Save
                                </Button>
                              </InputAdornment>
                            ),
                          }}
                        />
                      ) : (
                        <>
                          Name: {metaData?.name}
                          <IconButton
                            sx={{
                              background: "#F59E0B",
                              borderRadius: "50%",
                              "&:hover": {
                                backgroundColor: "#FFC107",
                                color: "white",
                              },
                            }}
                            onClick={handleEditName}
                          >
                            <EditIcon sx={{ color: "#ffffff" }} />
                          </IconButton>
                        </>
                      )}
                    </Typography>
                  </Box>
                </Box>
              )}

              {selectedOption == "pickup" && (
                <Box>
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ mb: 2, cursor: "pointer" }}>
                      <Typography
                        // variant="h6"
                        color="text.secondary"
                        sx={{
                          color: "#1F2937",
                          paddingBottom: "4px",
                          fontWeight:"bold",
                          fontSize: { xs: "16px", lg: "18px" },
                        }}
                      >
                       Pickup Address: {kitchenMetaData?.kitchen?.address?.raw}
                      </Typography>
                    </Box>

                    <Typography
                      variant="h6"
                      color="text.secondary"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        fontWeight: "bold",
                        color: "#1F2937",
                        paddingBottom: "4px",
                      }}
                    >
                      Pickup Time: {pickupTime}
                      <IconButton
                        sx={{
                          background: "#F59E0B",
                          borderRadius: "50%",
                          "&:hover": {
                            backgroundColor: "#FFC107",
                            color: "white",
                          },
                        }}
                        onClick={handlePickupTimeClick}
                      >
                        <EditIcon sx={{ color: "#ffffff" }} />
                      </IconButton>
                    </Typography>
                  </Box>

                  {/* Pickup Time Dialog */}
                  <Dialog
                    open={openPickupTimeDialog}
                    onClose={() => {
                      const err: string = handlePickupTimeSave();
                      if (err) return;
                      setOpenPickupTimeDialog(false);
                    }}
                    maxWidth="xs"
                    fullWidth
                    sx={{ zIndex: "999" }}
                    PaperProps={{
                      sx: { borderRadius: "10px" },
                    }}
                  >
                    <DialogTitle
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontWeight: "bold",
                      }}
                    >
                      Edit Pickup Time
                      <IconButton
                        onClick={() => {
                          const err: string = handlePickupTimeSave();
                          if (err) return;
                          setOpenPickupTimeDialog(false);
                        }}
                      >
                        <CloseIcon sx={{ color: "#ECAB21" }} />
                      </IconButton>
                    </DialogTitle>
                    <DialogContent>
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        <strong>From:</strong>635 Kaiser Dr, Mississauga, ON L5W
                        1T6, Canada 2R7
                      </Typography>

                      <TextField
                        fullWidth
                        label="Select Time"
                        value={pickupTime}
                        onChange={changeTime}
                        type="time"
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />

                      <Box
                        sx={{
                          mt: 2,
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <Button
                          variant="contained"
                          sx={{
                            backgroundColor: "#ECAB21",
                            color: "white",
                            paddingX: 4,
                            paddingY: 1,
                            fontWeight: "bold",
                            "&:hover": {
                              backgroundColor: "#FFC107",
                              color: "white",
                            },
                          }}
                          onClick={handlePickupTimeSave}
                        >
                          Continue Order
                        </Button>
                      </Box>
                      {timeError && (
                        <Alert
                          sx={{ mt: 2 }}
                          variant="outlined"
                          severity="error"
                        >
                          {timeError}
                        </Alert>
                      )}
                    </DialogContent>
                  </Dialog>
                  <Box
                    sx={{ mb: 3, cursor: "pointer" }}
                    onClick={handleEditName}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        color: "#1F2937",
                        paddingBottom: "4px",
                        fontSize: { xs: "16px", lg: "18px" },
                        wordBreak: "break-all",
                      }}
                    >
                      {/* Conditionally render the TextField or the name */}
                      {isEditingName ? (
                        <TextField
                          inputRef={nameInputRef}
                          fullWidth
                          variant="outlined"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <Button
                                  variant="contained"
                                  onClick={handleNameSave}
                                  // disabled={!name}
                                  sx={{
                                    backgroundColor: "#ECAB21",
                                    color: "white",
                                    "&:hover": {
                                      backgroundColor: "#FFC107",
                                      color: "white",
                                    },
                                  }}
                                >
                                  Save
                                </Button>
                              </InputAdornment>
                            ),
                          }}
                        />
                      ) : (
                        <>
                          Name: {metaData?.name}
                          <IconButton
                            sx={{
                              background: "#F59E0B",
                              borderRadius: "50%",
                              "&:hover": {
                                backgroundColor: "#FFC107",
                                color: "white",
                              },
                            }}
                            onClick={handleEditName}
                          >
                            <EditIcon sx={{ color: "#ffffff" }} />
                          </IconButton>
                        </>
                      )}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 3, cursor: "pointer" }}>
                    <Typography
                      color="text.secondary"
                      sx={{
                        color: "#1F2937",
                        paddingBottom: "4px",
                        fontSize: { xs: "16px", lg: "18px" },
                      }}
                    >
                      <b>Pickup Instructions:</b> Your order will be ready for
                      pickup <strong>one hour</strong> after being placed. Thank
                      you for your patience! Once you arrive at the location,
                      please press <strong>&rdquo;I am here&rdquo;</strong> from
                      the My Orders section.
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>
          </Paper>
        </Container>
      </Box>
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(!openDialog)}
        maxWidth="xs"
        fullWidth
        sx={{ zIndex: "999" }}
        PaperProps={{
          sx: { borderRadius: "10px" },
        }}
      >
          <DialogTitle
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
            >
            {
                metaData?.savedAddress?.length < 5 ? <>
                
                Enter your Address
                </> : <>Please Note</>
            }
            <IconButton onClick={() => setOpenDialog(!openDialog)}>
              <CloseIcon sx={{ color: "#ECAB21" }} />
            </IconButton>
        </DialogTitle>
        {
          metaData?.savedAddress?.length >= 5 ? <>
            <DialogContent>
            <Box sx={{ mb: 3, cursor: "pointer" }}>
                    <Typography
                      color="text.secondary"
                      sx={{
                        color: "#1F2937",
                        paddingBottom: "4px",
                        fontSize: { xs: "18px", lg: "20px" },
                      }}
                    >
                     You can save a maximum of <b>5 addresses</b>. To add a new address, you may need to delete an existing one. Thank you for your understanding!
                    </Typography>
                  </Box>
            </DialogContent>
          </> : <>       
            <DialogContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  border: "1px solid grey",
                  borderRadius: "8px",
                  padding: "6px 10px",
                  marginTop: "8px",
                  width: "100%",
                }}
              >
                <Autocomplete
                  apiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY}
                  style={{
                    outline: "none",
                    color: "#8F8996",
                    padding: "10px",
                    fontWeight: "bold",
                    border: "none",
                    fontSize: "1rem",
                    flex: "1",
                  }}
                  // defaultValue={address?.raw}
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
                        j < (place.address_components![i].types.length ?? 0);
                        j++
                      ) {
                        if (
                          place.address_components![i].types[j] == "postal_code"
                        ) {
                          zipCode = place.address_components![i].long_name;
                        }
                        if (place?.address_components![i].types[j] == "locality") {
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
                              for (let j = 0; j < results[i].types.length; j++) {
                                if (results[i].types[j] == "plus_code") {
                                  plusCode = results[i]?.plus_code.global_code;
                                }
                                if (results[i].types[j] == "postal_code") {
                                  postalCode =
                                    results[i]?.address_components[j].long_name;
                                }
                              }
                            }

                            const { distance }: any = await calculateDistance(
                              kitchenMetaData?.address?.raw,
                              place.formatted_address || "",
                              Number(kitchenMetaData?.orderRange)
                            );
                            setAddress({
                              raw: place.formatted_address,
                              seperate: {
                                state: state,
                                city: city,
                                postal_code: zipCode || plusCode || postalCode,
                                line1: place.formatted_address?.split(",")[0],
                              },
                              distance,
                              latlng: {
                                lat: post.lat(),
                                lng: post.lng(),
                              },
                            });
                          } else {
                            console.error("No results found");
                          }
                        } else {
                          console.error("Geocoder failed due to: " + status);
                        }
                      }
                    );
                  }}
                  options={{
                    componentRestrictions: { country: ["ca"] },
                    types: ["geocode", "establishment"],
                  }}
                />
              </Box>
              <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#ECAB21",
                    color: "white",
                    paddingX: 4,
                    paddingY: 1,
                    fontWeight: "bold",
                    "&:hover": {
                      backgroundColor: "#FFC107",
                      color: "white",
                    },
                  }}
                  disabled={address?.raw === "" || address?.raw === undefined}
                  onClick={() => handleSaveClick("address")}
                >
                  Submit
                </Button>
              </Box>
            </DialogContent>
          </>
        }
      </Dialog>

      <Dialog
        open={openInstructionsDialog} 
        onClose={() => setOpenInstructionsDialog(!openInstructionsDialog)}
        maxWidth="xs"
        fullWidth
        sx={{ zIndex: "999" }}
        PaperProps={{
          sx: { borderRadius: "10px" },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Enter Delivery Instructions
          <IconButton
            onClick={() => setOpenInstructionsDialog(!openInstructionsDialog)}
          >
            <CloseIcon sx={{ color: "#ECAB21" }} />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            variant="outlined"
            value={instructions}
            onChange={handleInstructionsChange}
            placeholder="Enter your delivery instructions here"
            sx={{ mt: 2 }}
          />
          <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#ECAB21",
                color: "white",
                paddingX: 4,
                paddingY: 1,
                fontWeight: "bold",
                "&:hover": {
                  backgroundColor: "#FFC107",
                  color: "white",
                },
              }}
              onClick={() => handleSaveClick("instructions")}
            >
              Submit
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default OrderPage;
