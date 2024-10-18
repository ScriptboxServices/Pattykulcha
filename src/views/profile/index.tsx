"use client";

import React, { useState, useEffect, useRef } from "react";
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
import Radio from "@mui/material/Radio";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {
  Person,
  Phone,
  Home,
  Email,
  Add,
  Close,
  Delete,
} from "@mui/icons-material";
import { useAuthContext, calculateDistance } from "@/context";
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
import { v4 } from "uuid";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  const { user, setMetaData, kitchenMetaData, metaData } = useAuthContext();

  const [loading, setLoading] = useState(false);
  const [me, setMe] = useState<User | null>(null);
  const [name, setName] = useState<string | undefined>("");
  const [phone, setPhone] = useState("");
  const [address1, setAddress1] = useState<any>({});
  const [email, setEmail] = useState<string | undefined>("");
  const [selectedAddr, setSelectedAddr] = useState<string>("");
  const [selectedAddress, setSelectedAddress] = useState<string>("primary");
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isEditingSecondaryAddress, setIsEditingSecondaryAddress] =
    useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);

  const handleNameEdit = () => {
    if (isEditingName) {
      updateUser("name");
    }
    setTimeout(() => {
      nameInputRef.current?.focus();
    }, 0);

    setIsEditingName((prev) => !prev);
  };

  const handleEmailEdit = () => {
    if (isEditingEmail) {
      updateUser("email");
    }
    setTimeout(() => {
      emailInputRef.current?.focus();
    }, 0);

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
          savedAddress: [
            { ...address1, isPrimary: false, _id: v4() },
            ...(metaData?.savedAddress ? metaData?.savedAddress : []),
          ],
        });
        const _metaData: any = await getUser();
        setMetaData({ ..._metaData });
        setLoading(false);
        setOpenDialog(false);
        setAddress1({});
        return;
      }
    } catch (err) {
      setLoading(false);
    }
  };

  const handleAddressSelection = (type: string) => {
    setSelectedAddress(type);
  };

  const handleDialogOpen = () => {
    setOpenDialog(!openDialog);
  };

  const removeAddress = async (_id: string) => {
    const docRef = doc(db, "users", user?.uid);
    setLoading(true);
    let filteredAddress = metaData?.savedAddress?.filter(
      (item: any) => item._id !== _id
    );
    await updateDoc(docRef, {
      savedAddress: [...filteredAddress],
    });
    const _metaData: any = await getUser();
    setMetaData({ ..._metaData });
    setLoading(false);
  };

  const handleChange = async (_id: string) => {
    setSelectedAddr(_id);
    const docRef = doc(db, "users", user?.uid);
    setLoading(true);
    let addr = metaData?.savedAddress?.find((item: any) => item._id === _id);
    let editAddress = metaData?.savedAddress?.map((item: any) => {
      let isPrimary = false;
      if (item._id === _id) isPrimary = true;
      return {
        ...item,
        isPrimary,
      };
    });
    await updateDoc(docRef, {
      address: {
        seperate: addr.seperate,
        raw: addr.raw,
        distance: addr.distance,
        latlng: addr.latlng,
      },
      savedAddress: [...editAddress],
    });
    const _metaData: any = await getUser();
    setMetaData({ ..._metaData });
    setLoading(false);
  };

  return (
    <>
      <CircularLodar isLoading={loading} />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          height: "auto",
          pt: { xs: 6, xl: 8 },
          pb: { xs: 6, xl: 8 },
          alignItem: "center",
          background: "#FAF3E0",
          minHeight: { xs: "100dvh", xl: "100dvh" },
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
                <Typography
                  variant="h4"
                  component="h2"
                  gutterBottom
                  sx={{ fontWeight: "bold" }}
                >
                  User Profile
                </Typography>
              </Box>
              <Card
                sx={{
                  borderRadius: "20px",
                }}
              >
                <CardContent sx={{ p: 0.5 }}>
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
                        inputRef={nameInputRef}
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
                        inputRef={emailInputRef}
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
                    {/* <ListItem
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        width: "100%",
                      }}
                    > */}

                    {metaData?.savedAddress
                      ?.sort((a: any, b: any) => b.isPrimary - a.isPrimary)
                      ?.map((addr: any) => {
                        return (
                          <ListItem
                            key={addr._id}
                            onClick={() => handleAddressSelection("primary")}
                            sx={{ cursor: "pointer" }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-start",
                                border: `${addr.isPrimary ? 2 : 1}px solid ${
                                  addr.isPrimary ? "green" : "grey"
                                }`,
                                borderRadius: "8px",
                                padding: {
                                  xs: "6px 15px 6px 13px",
                                  sm: "6px 35px 6px 13px",
                                },
                                width: "100%",
                                position: "relative",
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  width: "100%",
                                }}
                              >
                                {addr.isPrimary && (
                                  <Home
                                    sx={{
                                      background: "black",
                                      color: "white",
                                      borderRadius: "50%",
                                      fontSize: "32px",
                                      padding: "6px",
                                      marginRight: "12px",
                                    }}
                                  />
                                )}
                                <ListItemText
                                  secondary={addr.raw}
                                  sx={{
                                    wordWrap: "break-word",
                                    flex: 1,
                                  }}
                                />
                                {addr.isPrimary ? (
                                  <CheckCircleIcon
                                    sx={{
                                      position: "absolute",
                                      top: "10px",
                                      right: "7px",
                                      // transform: {
                                      //   xs: "translateY(0%)",
                                      // },
                                      color: "green",
                                      backgroundColor: "white",
                                      borderRadius: "50%",
                                    }}
                                  />
                                ) : (
                                  // <></>
                                  <Radio
                                    {...{
                                      onChange: () => handleChange(addr._id),
                                      name: "color-radio-button-demo",
                                      checked: selectedAddr === addr._id,
                                    }}
                                    sx={{
                                      position: "absolute",
                                      top: "10px",
                                      right: "7px",
                                      display: { xs: "none", sm: "block" },
                                      // transform: "translateY(-50%)",
                                      padding: 0,
                                      color: "green",
                                      "&.Mui-checked": {
                                        color: "green",
                                      },
                                    }}
                                  />
                                )}
                              </Box>
                              {!addr.isPrimary && (
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "flex-end",
                                    alignItems: "center",
                                    width: "100%",
                                    marginTop: "8px",
                                  }}
                                >
                                  <IconButton
                                    onClick={() => removeAddress(addr._id)}
                                    sx={{ padding: 0, marginRight: 2 }}
                                  >
                                    <Typography
                                      sx={{
                                        cursor: "pointer",
                                        color: "red",
                                        fontSize: "12px",
                                        textAlign: "center",
                                        backgroundColor: "#FEE2E2",
                                        display: { xs: "block", sm: "block" },
                                        height: "2em",
                                        paddingX: "0.5rem",
                                        paddingY: "0.2rem",
                                        borderRadius: "13px",
                                      }}
                                    >
                                      Remove
                                    </Typography>
                                  </IconButton>
                                  <IconButton
                                    onClick={() => handleChange(addr._id)}
                                    sx={{ padding: 0 }}
                                  >
                                    <Typography
                                      sx={{
                                        cursor: "pointer",
                                        color: "white",
                                        fontSize: "12px",
                                        textAlign: "center",
                                        backgroundColor: "green",
                                        display: { xs: "block", sm: "none" },
                                        height: "2em",
                                        paddingX: "0.5rem",
                                        paddingY: "0.2rem",
                                        borderRadius: "13px",
                                      }}
                                    >
                                      Make primary  
                                    </Typography>
                                  </IconButton>
                                </Box>
                              )}
                            </Box>
                          </ListItem>
                        );
                      })}
                    {(metaData?.savedAddress?.length < 5 ||
                      metaData?.savedAddress === undefined) && (
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
                            marginTop: "0.5rem",
                            fontWeight: "bold",
                            width: "80%",
                            "&:hover": {
                              backgroundColor: "#FFC107",
                              color: "white",
                            },
                          }}
                          onClick={handleDialogOpen}
                          // onClick={() => {
                          //   router.push("/add-address");
                          // }}
                        >
                          Add new Address
                        </Button>
                      </ListItem>
                    )}
                    {/* <ListItem
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        width: "100%",
                      }}
                    >
                      <Button
                        startIcon={<Delete />}
                        variant="contained"
                        sx={{
                          backgroundColor: "red",
                          color: "white",
                          marginTop: "0.2rem",
                          fontWeight: "bold",
                          width: "80%",
                          "&:hover": {
                            backgroundColor: "darkred",
                            color: "white",
                          },
                        }}
                      >
                        Delete Account
                      </Button>
                    </ListItem> */}
                  </List>
                </CardContent>
              </Card>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Dialog
        open={openDialog}
        onClose={handleDialogOpen}
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
          Enter your Address
          <IconButton onClick={handleDialogOpen}>
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
            }}
          >
            <Autocomplete
              apiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY}
              style={{
                outline: "none",
                color: "#8F8996",
                padding: "10px 8px",
                fontWeight: "bold",
                border: "none",
                fontSize: "1rem",
                flex: "1",
              }}
              // defaultValue={address1?.raw}
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

                        setAddress1({
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
          <DialogActions>
            <Button
              onClick={() => updateUser("address")}
              variant="contained"
              disabled={address1?.raw === "" || address1?.raw === undefined}
              sx={{
                backgroundColor: "#ECAB21",
                color: "white",
                paddingX: 4,
                paddingY: 1,
                marginTop: "0.5rem",
                marginBottom: "0.5rem",
                fontWeight: "bold",
                marginInline: "auto",
                "&:hover": {
                  backgroundColor: "#FFC107",
                  color: "white",
                },
              }}
            >
              Save address
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProfilePage;
