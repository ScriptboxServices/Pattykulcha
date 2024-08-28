"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  List,
  ListItem,
  ListItemText,
  Grid,
  Box,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
} from "@mui/material";
import {
  Person,
  Phone,
  Home,
  Email,
  Add,
  Close,
  Search,
} from "@mui/icons-material";
import { useAuthContext } from "@/context";
import CircularLodar from "@/components/CircularLodar";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/firebase";
import { updateProfile } from "firebase/auth";
import Autocomplete from "react-google-autocomplete";

type User = {
  name: string;
  email: string;
  phoneNumber: string;
  profile: string;
  address: {
    raw: string;
    seperate: {
      state: string;
      city: string;
      postal_code: string;
      line1: string;
    };
  };
};

const ProfilePage: React.FC = () => {
  const { user, setMetaData, kitchenMetaData } = useAuthContext();

  const [loading, setLoading] = useState(false);
  const [me, setMe] = useState<User | null>(null);
  const [name, setName] = useState<string | undefined>("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState<any | undefined>();
  const [address1, setAddress1] = useState<any | undefined>();
  const [email, setEmail] = useState<string | undefined>("");
  const [secondaryAddress, setSecondaryAddress] = useState<any | undefined>();
  const [selectedAddress, setSelectedAddress] = useState<string>("primary"); // Track selected address
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isEditingSecondaryAddress, setIsEditingSecondaryAddress] =
    useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const handleNameEdit = () => {
    if (isEditingName) {
      updateUser("name");
    }
    setIsEditingName((prev) => !prev);
  };

  const handleEmailEdit = () => {
    if (isEditingEmail) {
      updateUser("email");
    }
    setIsEditingEmail((prev) => !prev);
  };

  const handleAddressEdit = () => {
    if (isEditingAddress) {
      updateUser("address");
    }
    setIsEditingAddress((prev) => !prev);
  };

  useEffect(() => {
    setName(me?.name);
    setEmail(me?.email);
    setAddress({
      ...me?.address,
    });
  }, [me]);

  const getUser = async () => {
    const docRef = doc(db, "users", user?.uid);
    try {
      const userDoc = await getDoc(docRef);
      if (userDoc.exists()) {
        const { name, email, profile, phoneNumber, address } = userDoc.data();
        setMe({
          name,
          profile,
          email,
          phoneNumber,
          address,
        });
        return {
          id: userDoc.id,
          ...userDoc.data(),
        };
      }
    } catch (err) {
      console.log(err);
      return err;
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        await getUser();
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };
    init();
  }, [user]);

  const calculateDistance = (source: string, destinations: string) => {
    return new Promise((resolve, reject) => {
      try {
        const service = new google.maps.DistanceMatrixService();
        const request: any = {
          origins: [source],
          destinations: [destinations],
          travelMode: window.google.maps.TravelMode.DRIVING,
          unitSystem: window.google.maps.UnitSystem.METRIC,
          avoidHighways: false,
          avoidTolls: false,
        };

        service.getDistanceMatrix(request, (response: any, status: any) => {
          if (status === "OK") {
            const distance = response.rows[0].elements[0].distance;
            resolve(distance);
          } else {
            console.error("Distance failed due to: " + status);
          }
        });
      } catch (err) {
        reject(err);
      }
    });
  };

  const updateUser = async (type: string) => {
    const docRef = doc(db, "users", user?.uid);
    try {
      setLoading(true);
      if (type === "name") {
        await updateDoc(docRef, {
          name: name,
        });
        await updateProfile(user, {
          displayName: name,
        });
        const metaData: any = await getUser();
        setMetaData({ ...metaData });
        setLoading(false);
        return;
      }

      if (type === "email") {
        await updateDoc(docRef, {
          email: email,
        });
        const metaData: any = await getUser();
        setMetaData({ ...metaData });
        setLoading(false);
        return;
      }

      if (type === "address") {
        await updateDoc(docRef, {
          address: address,
        });
        const metaData: any = await getUser();
        setMetaData({ ...metaData });
        setLoading(false);
        return;
      }
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const handleAddressSelection = (type: string) => {
    setSelectedAddress(type);
  };

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  return (
    <>
      <CircularLodar isLoading={loading} />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          height:'auto',
          pt:{ xs: 6, xl: 8},
          pb:{ xs: 6, xl: 8},
          alignItem: "center",
          background: "#FAF3E0",
          minHeight: { xs: "100%", xl: "100d%"},
        }}
      >
        <Grid
          container
          spacing={4}
          maxWidth="md"
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                width: {
                  xs: "90%",
                  sm: "85%",
                  md: "100%",
                },
                margin: "0 auto",
              }}
            >
              <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: 2, // Adds margin below the title
            }}
          >
            <Typography variant="h4" component="h2" gutterBottom sx={{fontWeight:'bold'}}>
              User Profile
            </Typography>
          </Box>
              <Card
                sx={{
                  borderRadius: "20px",
                }}
              >
                <CardContent>
                  <List>
                    <ListItem>
                      <TextField
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        fullWidth
                        variant="outlined"
                        size="small"
                        sx={{
                          borderRadius: "10px",
                          height: "56px",
                          "& .MuiOutlinedInput-root": {
                            height: "100%",
                          },
                        }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Person
                                sx={{
                                  background: "black",
                                  color: "white",
                                  borderRadius: "50%",
                                  fontSize: "32px",
                                  padding: "6px",
                                  mr: 1,
                                }}
                              />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={handleNameEdit}
                                sx={{ ml: 1 }}
                              >
                                {isEditingName ? (
                                  <Typography
                                    sx={{
                                      cursor: "pointer",
                                      color: "black",
                                      textDecoration: "underline",
                                      ml: 1,
                                      fontSize: "14px",
                                    }}
                                  >
                                    Save
                                  </Typography>
                                ) : (
                                  <Typography
                                    sx={{
                                      cursor: "pointer",
                                      color: "black",
                                      textDecoration: "underline",
                                      ml: 1,
                                      fontSize: "14px",
                                    }}
                                  >
                                    Edit
                                  </Typography>
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        disabled={!isEditingName}
                      />
                    </ListItem>
                    <ListItem>
                      <TextField
                        value={me?.phoneNumber}
                        fullWidth
                        variant="outlined"
                        size="small"
                        disabled
                        sx={{
                          height: "56px",
                          "& .MuiOutlinedInput-root": {
                            height: "100%",
                          },
                        }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Phone
                                sx={{
                                  background: "black",
                                  color: "white",
                                  borderRadius: "50%",
                                  fontSize: "32px",
                                  padding: "6px",
                                  mr: 1,
                                }}
                              />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </ListItem>

                    <ListItem>
                      <TextField
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        fullWidth
                        variant="outlined"
                        size="small"
                        sx={{
                          height: "56px",
                          "& .MuiOutlinedInput-root": {
                            height: "100%",
                          },
                        }}
                        disabled={!isEditingEmail}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Email
                                sx={{
                                  background: "black",
                                  color: "white",
                                  borderRadius: "50%",
                                  fontSize: "32px",
                                  padding: "6px",
                                  mr: 1,
                                }}
                              />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={handleEmailEdit}
                                sx={{ ml: 1 }}
                              >
                                {isEditingEmail ? (
                                  <Typography
                                    sx={{
                                      cursor: "pointer",
                                      color: "black",
                                      textDecoration: "underline",
                                      ml: 1,
                                      fontSize: "14px",
                                    }}
                                  >
                                    Save
                                  </Typography>
                                ) : (
                                  <Typography
                                    sx={{
                                      cursor: "pointer",
                                      color: "black",
                                      textDecoration: "underline",
                                      ml: 1,
                                      fontSize: "14px",
                                    }}
                                  >
                                    Edit
                                  </Typography>
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </ListItem>
                    <ListItem
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        width: "100%",
                      }}
                    >
                      <Button
                        variant="contained"
                        sx={{
                          backgroundColor: "#ECAB21",
                          color: "white",
                          paddingX: 4,
                          paddingY: 1,
                          marginTop: "0.5rem",
                          marginBottom: "0.5rem",
                          fontWeight: "bold",
                          width:'80%',
                          "&:hover": {
                            backgroundColor: "#FFC107",
                            color: "white",
                          },
                        }}
                      >
                        Submit
                      </Button>
                    </ListItem>
                    <ListItem
                      onClick={() => handleAddressSelection("primary")}
                      sx={{ cursor: "pointer" }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          border: "1px solid grey",
                          borderRadius: "8px",
                          padding: "6px 10px",                         
                          width: "100%",
                          position: "relative",
                        }}
                      >
                        <Home
                          sx={{
                            background: "black",
                            color: "white",
                            borderRadius: "50%",
                            fontSize: "32px", // Adjust the fontSize as needed
                            padding: "6px",
                          }}
                        />
                        {isEditingAddress ? (
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
                              marginLeft: "16px",
                              border:'none'
                            }}
                            defaultValue={address?.raw}
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
                                    city =
                                      place.address_components[i].long_name;
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

                              const geocoder =
                                new window.google.maps.Geocoder();
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

                                      const distance = await calculateDistance(
                                        kitchenMetaData?.address?.raw,
                                        place.formatted_address || ""
                                      );

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
                                        distance,
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
                        ) : (
                          <ListItemText
                            secondary={me?.address?.raw}
                            sx={{ ml: 2 }}
                          />
                        )}
                        {/* {selectedAddress === "primary" && (
                        <CheckCircle sx={{ color: "green", ml: 2 }} />
                      )} */}
                        <IconButton onClick={handleAddressEdit} sx={{ ml: 1 }}>
                          {isEditingAddress ? (
                            <Typography
                              sx={{
                                cursor: "pointer",
                                color: "black",
                                textDecoration: "underline",
                                ml: 1,
                                fontSize: "14px",
                              }}
                            >
                              Save
                            </Typography>
                          ) : (
                            <Typography
                              sx={{
                                cursor: "pointer",
                                color: "black",
                                textDecoration: "underline",
                                ml: 1,
                                fontSize: "14px",
                              }}
                            >
                              Edit
                            </Typography>
                          )}
                        </IconButton>
                      </Box>
                    </ListItem>
                    <ListItem
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        width: "100%",
                      }}
                    >
                      <Button
                        startIcon={<Add />}
                        variant="contained"
                        sx={{
                          backgroundColor: "#ECAB21",
                          color: "white",
                          paddingX: 4,
                          paddingY: 1,
                          marginTop: "0.5rem",
                          fontWeight: "bold",
                          width:'80%',
                          "&:hover": {
                            backgroundColor: "#FFC107",
                            color: "white",
                          },
                        }}
                        onClick={handleDialogOpen}
                      >
                        Add new Address
                      </Button>
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: { borderRadius: "10px" }, // Set border radius
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Enter your Address
          <IconButton onClick={handleDialogClose}>
            <Close sx={{ color: "#ECAB21" }} />
          </IconButton>
        </DialogTitle>
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
              position: "relative",
            }}
          >
            <Home
              sx={{
                background: "black",
                color: "white",
                borderRadius: "50%",
                fontSize: "32px", // Adjust the fontSize as needed
                padding: "6px",
                marginRight: "8px", // Add some spacing between the icon and the text input
              }}
            />
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
              defaultValue={address1?.raw}
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

                        const distance = await calculateDistance(
                          kitchenMetaData?.address?.raw,
                          place.formatted_address || ""
                        );

                        setAddress1({
                          raw: place.formatted_address,
                          seperate: {
                            state: state,
                            city: city,
                            postal_code: zipCode || plusCode || postalCode,
                            line1: place.formatted_address?.split(",")[0],
                          },
                          distance,
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
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProfilePage;