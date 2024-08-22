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
} from "@mui/material";
import {
  Person,
  Phone,
  Home,
  Email,
  Edit,
  Save,
  CheckCircle,
} from "@mui/icons-material";
import { useAuthContext } from "@/context";
import CircularLodar from "@/components/CircularLodar";
import { collection, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
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
    separate: {
      state: string;
      city: string;
      postal_code: string;
      line1: string;
    };
  };
};

const ProfilePage: React.FC = () => {
  const { user , setMetaData } = useAuthContext();

  const [loading, setLoading] = useState(false);
  const [me, setMe] = useState<User | null>(null);
  const [name, setName] = useState<string | undefined>("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState<any | undefined>();
  const [email, setEmail] = useState<string | undefined>("");
  const [secondaryAddress, setSecondaryAddress] = useState<any | undefined>();
  const [selectedAddress, setSelectedAddress] = useState<string>("primary"); // Track selected address
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isEditingSecondaryAddress, setIsEditingSecondaryAddress] = useState(false);

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
          id : userDoc.id,
          ...userDoc.data()
        } 
      }
    } catch (err) {
      console.log(err);
      return err
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
        const metaData : any =  await getUser();
        setMetaData({...metaData})
        setLoading(false);
        return;
      }

      if (type === "email") {
        await updateDoc(docRef, {
          email: email,
        });
        const metaData : any =  await getUser();
        setMetaData({...metaData})
        setLoading(false);
        return;
      }

      if (type === "address") {
        await updateDoc(docRef, {
          address: address,
        });
        const metaData : any =  await getUser();
        setMetaData({...metaData})
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

  return (
    <>
      <CircularLodar isLoading={loading} />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItem:'center',
          pt: 4,
          pb: 4,
          background: "#FAF3E0",
          minHeight: {xs:'60vh',md:'70vh',lg:'70vh',xl:'80vh'}
        }}>
        <Grid container spacing={4} maxWidth="md" sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                width: {
                  xs: "90%", // For extra-small screens (mobile)
                  sm: "85%", // For small screens like tablets
                  md: "100%", // For medium screens and above
                },
                margin: "0 auto", // Center the card horizontally
              }}>
              <Card>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      mb: 2,
                    }}>
                    <Typography variant="h5" component="h2" gutterBottom>
                      User Profile
                    </Typography>
                  </Box>
                  <List>
                    <ListItem>
                      <Person />
                      {isEditingName ? (
                        <TextField
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          fullWidth
                          variant="outlined"
                          size="small"
                          sx={{ ml: 2 }}
                        />
                      ) : (
                        <ListItemText
                          primary="Name"
                          secondary={me?.name}
                          sx={{ ml: 2 }}
                        />
                      )}
                      <IconButton onClick={handleNameEdit} sx={{ ml: 1 }}>
                        {isEditingName ? <Save /> : <Edit />}
                      </IconButton>
                    </ListItem>
                    <ListItem>
                      <Phone />
                      <ListItemText
                        primary="Phone"
                        secondary={me?.phoneNumber}
                        sx={{ ml: 2 }}
                      />
                    </ListItem>

                    <ListItem>
                      <Email />
                      {isEditingEmail ? (
                        <TextField
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          fullWidth
                          variant="outlined"
                          size="small"
                          sx={{ ml: 2 }}
                        />
                      ) : (
                        <ListItemText
                          primary="Email"
                          secondary={me?.email}
                          sx={{ ml: 2 }}
                        />
                      )}
                      <IconButton onClick={handleEmailEdit} sx={{ ml: 1 }}>
                        {isEditingEmail ? <Save /> : <Edit />}
                      </IconButton>
                    </ListItem>
                    {/* Primary Address */}
                    <ListItem onClick={() => handleAddressSelection("primary")} sx={{ cursor: "pointer" }}>
                      <Home />
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
                                j < (place.address_components![i].types.length ?? 0);
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
                            const post = place.geometry?.location;

                            if (!post) return;

                            const latlng = new window.google.maps.LatLng(
                              post.lat(),
                              post.lng()
                            );
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
                                    setAddress({
                                      raw: place.formatted_address,
                                      separate: {
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
                      ) : (
                        <ListItemText
                          primary="Address"
                          secondary={me?.address?.raw}
                          sx={{ ml: 2 }}
                        />
                      )}
                      {/* {selectedAddress === "primary" && (
                        <CheckCircle sx={{ color: "green", ml: 2 }} />
                      )} */}
                      <IconButton onClick={handleAddressEdit} sx={{ ml: 1 }}>
                        {isEditingAddress ? <Save /> : <Edit />}
                      </IconButton>
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default ProfilePage;
