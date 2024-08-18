"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Grid,
  Box,
  Collapse,
  IconButton,
} from "@mui/material";
import {
  Person,
  Phone,
  Home,
  Email,
  ShoppingCart,
  ExpandMore,
  ExpandLess,
  CameraAlt,
  Edit,
  Save,
} from "@mui/icons-material";
import { useAuthContext, useMenuContext } from "@/context";
import CircularLodar from "@/components/CircularLodar";
import { collection, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { db } from "@/firebase";
import { updateEmail, updateProfile } from "firebase/auth";
import Autocomplete from "react-google-autocomplete";

interface Order {
  id: string;
  items: Array<{ name: string; price: number }>;
  total: number;
  date: string;
  delivered: boolean;
}

type User = {
  name: string;
  email: string;
  phoneNumber: string;
  profile: string;
  address: {
    raw : string,
    seperate: {
      state: string,
      city: string,
      postal_code: string,
      line1:string,
    }
  };
};
const ProfilePage: React.FC = () => {

  const { user } = useAuthContext();

  console.log(user, "Abhishek");

  const [loading, setLoading] = useState(false);
  const [me, setMe] = useState<User | null>(null);
  const [name, setName] = useState<string | undefined>('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState<any | undefined>();
  const [email, setEmail] = useState<string | undefined>('');
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [expandedOrderIds, setExpandedOrderIds] = useState<string[]>([]);

  // useEffect(() => {
  //   const storedOrders = localStorage.getItem("orders");
  //   const parsedOrders = storedOrders ? JSON.parse(storedOrders) : dummyOrders;

  //   setOrders(parsedOrders);

  //   const nonDeliveredOrderIds = parsedOrders
  //     .filter((order: Order) => !order.delivered)
  //     .map((order: Order) => order.id);

  //   setExpandedOrderIds(nonDeliveredOrderIds);
  // }, []);

  const toggleOrderExpand = (orderId: string) => {
    setExpandedOrderIds((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleNameEdit = () => {
    if (isEditingName) {
      updateUser('name')
    }
    setIsEditingName((prev) => !prev);
  };

  const handleEmailEdit = () => {
    if (isEditingEmail) {
      updateUser('email')
    }
    setIsEditingEmail((prev) => !prev);
  };

  const handleAddressEdit = () => {
    if (isEditingAddress) {
      updateUser('address')
    }
    setIsEditingAddress((prev) => !prev);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    setName(me?.name)
    setEmail(me?.email)
    setAddress({
      ...me?.address
    })
  },[me])

  const getUser = async () => {
    const docRef = doc(db, "users", user?.uid);
    try {
      const user = await getDoc(docRef);
      if (user.exists()) {
        const { name, email, profile, phoneNumber ,address} = user.data();
        setMe({
          name,
          profile,
          email,
          phoneNumber,
          address 
        });
      }
      return
    } catch (err) {
      console.log(err);
      return
    }
  };

  const getMyOrders = async () => {

    try{
      const colRef = collection(db,'orders')
      const q = query(colRef, where("userId", "==", user?.uid));
      let myOrders : any[] = []
      const result =await  getDocs(q)
  
      if(result.size > 0){
        result.forEach(doc => {
          myOrders.push({
            _id:doc.id,
            ...doc.data()
          })
        })
      }
      setOrders([...myOrders])
      console.log(result);
      return
    }catch(err) {
      console.log(err);
      return err
    }
  }

  console.log(orders,"Poddar Poddar");

  useEffect(() => {
    const init = async () => {
      try{
        setLoading(true)
        await Promise.allSettled([getUser(),getMyOrders()])
        setLoading(false)
      }catch(err) {
        console.log(err);
        setLoading(false)
      }
    }
    init()
  }, [user]);

  const updateUser = async (type: string) => {
    const docRef = doc(db, "users", user?.uid);
    try {
      setLoading(true);
      if (type === "name") {
        await updateDoc(docRef, {
          name: name,
        });
        await updateProfile(user,{
          displayName : name
        })
        await getUser()
        setLoading(false);
        return;
      }

      if (type === "email") {
        await updateDoc(docRef, {
          email: email,
        });
        // await updateEmail(user,email || '')
        await getUser()
        setLoading(false);
        return;
      }

      if (type === "address") {
        await updateDoc(docRef, {
          address: address,
        });
        // await updateEmail(user,email || '')
        await getUser()
        setLoading(false);
        return;
      }
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  return (
    <>
      <CircularLodar isLoading={loading} />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          pt: 4,
          pb: 4,
          background: "#FAF3E0",
        }}>
        <Grid container spacing={4} maxWidth='md'>
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
                    <Box sx={{ position: "relative" }}>
                      <Avatar
                        sx={{ width: 80, height: 80, mb: 2 }}
                        src={uploadedImage ? uploadedImage : undefined}>
                        {!uploadedImage && <Person fontSize='large' />}
                      </Avatar>
                      <IconButton
                        color='primary'
                        aria-label='upload picture'
                        component='label'
                        sx={{ position: "absolute", bottom: 0, right: 0 }}>
                        <input
                          hidden
                          accept='image/*'
                          type='file'
                          onChange={handleImageUpload}
                        />
                        {!uploadedImage && <CameraAlt />}
                      </IconButton>
                      {uploadedImage && (
                        <IconButton
                          color='primary'
                          aria-label='edit picture'
                          component='label'
                          sx={{ position: "absolute", top: 0, right: 0 }}>
                          <input
                            hidden
                            accept='image/*'
                            type='file'
                            onChange={handleImageUpload}
                          />
                          <Edit />
                        </IconButton>
                      )}
                    </Box>
                    <Typography variant='h5' component='h2' gutterBottom>
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
                          variant='outlined'
                          size='small'
                          sx={{ ml: 2 }}
                        />
                      ) : (
                        <ListItemText
                          primary='Name'
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
                        primary='Phone'
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
                          variant='outlined'
                          size='small'
                          sx={{ ml: 2 }}
                        />
                      ) : (
                        <ListItemText
                          primary='Email'
                          secondary={me?.email}
                          sx={{ ml: 2 }}
                        />
                      )}
                      <IconButton onClick={handleEmailEdit} sx={{ ml: 1 }}>
                        {isEditingEmail ? <Save /> : <Edit />}
                      </IconButton>
                    </ListItem>
                    <ListItem>
                    <Home />
                      {isEditingAddress ? (
                      <Autocomplete
                      apiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY }
                      style={{
                        outline: "none",
                        color: "#8F8996",
                        padding: "14px 10px",
                        fontWeight: "bold",
                        border: "1px solid grey",
                        fontSize: "1rem",
                        flex: "1",
                        marginLeft:'16px'
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
                      ) : (
                        <ListItemText
                          primary='Address'
                          secondary={me?.address?.raw}
                          sx={{ ml: 2 }}
                        />
                      )}
                      <IconButton onClick={handleAddressEdit} sx={{ ml: 1 }}>
                        {isEditingAddress ? <Save /> : <Edit />}
                      </IconButton>
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Box>
          </Grid>

          {/* <Grid item xs={12} md={6}>
            <Box
              sx={{
                width: {
                  xs: "90%", // For extra-small screens (mobile)
                  sm: "85%", // For small screens like tablets
                  md: "100%", // For medium screens and above
                },
                margin: "0 auto", // Center the card horizontally
              }}>
              <Typography
                variant='h6'
                component='h3'
                sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <ShoppingCart sx={{ mr: 1 }} />
                My Orders
              </Typography>
              <Grid container spacing={2}>
                {orders.map((order) => (
                  <Grid item xs={12} key={order.id}>
                    <Card
                      sx={{
                        transition:
                          "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                        transform: expandedOrderIds.includes(order.id)
                          ? "scale(1.03)"
                          : "none",
                        boxShadow: expandedOrderIds.includes(order.id)
                          ? "0 8px 30px rgba(0, 0, 0, 0.2)"
                          : "none",
                      }}>
                      <CardContent>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            cursor: "pointer",
                          }}
                          onClick={() => toggleOrderExpand(order.id)}>
                          <Typography
                            variant='body1'
                            component='div'
                            color='text.primary'>
                            Order #{order.id}
                          </Typography>
                          <IconButton>
                            {expandedOrderIds.includes(order.id) ? (
                              <ExpandLess />
                            ) : (
                              <ExpandMore />
                            )}
                          </IconButton>
                        </Box>
                        <Collapse
                          in={expandedOrderIds.includes(order.id)}
                          timeout='auto'
                          unmountOnExit>
                          <Typography
                            variant='body2'
                            component='div'
                            color='text.secondary'>
                            Date: {order.date}
                          </Typography>
                          <List>
                            {order.items.map((item) => (
                              <ListItem key={item.name} sx={{ paddingLeft: 0 }}>
                                <ListItemText
                                  primary={item.name}
                                  secondary={`$${item.price.toFixed(2)}`}
                                  sx={{ display: "block" }}
                                />
                              </ListItem>
                            ))}
                          </List>
                          <Typography
                            variant='body2'
                            component='div'
                            color='text.primary'>
                            Total: ${order.total.toFixed(2)}
                          </Typography>
                          {!order.delivered && (
                            <Typography
                              variant='body2'
                              component='div'
                              color='error'
                              sx={{ fontWeight: "bold", mt: 1 }}>
                              Not Delivered
                            </Typography>
                          )}
                        </Collapse>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
                {orders.length === 0 && (
                  <Grid item xs={12}>
                    <Typography variant='body2' color='text.secondary'>
                      No orders found.
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Box>
          </Grid> */}
        </Grid>
      </Box>
    </>
  );
};

export default ProfilePage;
