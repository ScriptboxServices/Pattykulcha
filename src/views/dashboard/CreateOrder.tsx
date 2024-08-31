"use client";

import React, { useEffect, useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Image from "next/image";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import {
  Box,
  Button,
  Container,
  TextField,
  CssBaseline,
  Grid,
  Autocomplete,
  InputAdornment,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  Avatar,
  Typography,
  IconButton,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { drinkOptions } from "@/constants/MenuOptions";
import { getImageSrc } from "../cart";
import { v4 as uuidv4 } from "uuid";
import { Icon, IconifyIcon } from "@iconify/react";
import GoogleAddressAutocomplete from "react-google-autocomplete"; // Import Autocomplete from react-google-autocomplete
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import { countries, countryCodes } from "@/utils/constants";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { menuItems } from "@/constants/MenuOptions";
export interface CountryCode {
  name: string;
  phone: number;
  code: string;
  icon: IconifyIcon | string;
}
import {
  FIXED_INCLUDE_ITEMS,
  calculateDistance,
  useAuthContext,
} from "@/context";
import CircularLodar from "@/components/CircularLodar";
import {
  Timestamp,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/firebase";
import { getIdToken } from "firebase/auth";
import axios from "axios";
import { useMenuContext } from "@/context";
import { CountryType } from "@/context/types";

// Define the Yup schema
const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  phoneNumber: yup
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .required("Phone number is required"),
  paymentmethod: yup.string().required("Payment method is required"),
  countryCode: yup.mixed<CountryType>().required(),
  instructions: yup.string().required("Special instructions are required"),
});

// Define the TypeScript interface based on the Yup schema
type IFormInput = yup.InferType<typeof schema>;

const filterOptions = (options: CountryCode[], state: any) =>
  options.filter((option) =>
    option.name.toLowerCase().includes(state.inputValue.toLowerCase())
  );

const MakeOrder: React.FC = () => {
  const [userData, setUserData] = useState<any>({});
  const [includedItems1, setIncludedItems1] = useState<any[]>([]);
  const [includedItems2, setIncludedItems2] = useState<any[]>([]);
  const [allKulcha, setAllKulcha] = useState<any[]>([...menuItems]);
  const [address, setAddress] = useState<any>({});
  const [isDrinkDialogOpen, setIsDrinkDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { kitchenMetaData, user } = useAuthContext();
  const [selectedCountry, setSelectedCountry] = useState<CountryType | null>(
    null
  );
  const handleDrinkDialog = () => {
    setIsDrinkDialogOpen(!isDrinkDialogOpen);
  };

  const handleDrinkSelect = (drink: string) => {
    const drinkItem = drinkOptions.find((d) => d.name == drink);
    handleAddItem(drinkItem!.name);
  };

  useEffect(() => {
    const defaultCountry =
      countries.find((country) => country.label === "Canada") || null;
    setSelectedCountry(defaultCountry);
  }, []);

  const handleAddItem = (itemName: string) => {
    const existingItem = includedItems2.find((includedItem) =>
      includedItem.items.some((item: any) => item.name === itemName)
    );

    if (existingItem) {
      // If item already exists, remove it
      handleRemoveItem(existingItem.id);
    } else {
      // Otherwise, add it
      const itemId = uuidv4();
      const drink = drinkOptions.find((drink) => drink.name == itemName);

      const price =
        drink?.price ||
        (itemName == "Chana"
          ? 1.5
          : itemName == "Imli Pyaz Chutney"
          ? 1.5
          : itemName == "Amul Butter"
          ? 2.5
          : itemName == "Normal Butter"
          ? 1.5
          : itemName == "Pickle"
          ? 1 // Assuming the price for Pickle is 1.5
          : 0); // Default price if item is not in the above lists

      const newItem = {
        id: itemId,
        items: [{ name: itemName, price, quantity: 1 }],
      };

      setIncludedItems2([...includedItems2, newItem]);
    }
  };

  const handleRemoveItem = (itemId: string) => {
    setIncludedItems2(includedItems2.filter((item) => item.id !== itemId));
  };

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: yupResolver(schema),
    defaultValues: {
      countryCode: countries.find((country) => country.label === "Canada"),
      name: "",
      phoneNumber: "",
      instructions: "",
      paymentmethod: "",
    },
  });

  const [error, setError] = useState<string>("");
  const [status, setStatus] = useState<string | null>(null);

  const onSubmit = async (data: IFormInput) => {
    if (!address.raw) {
      setError("Please provide customer address.");
      return;
    }
    if (includedItems1.length === 0) {
      setError("Please select atleast one kulcha.");
      return;
    }
    try {
      setLoading(true);
      setError("");
      setStatus(null);
      const token = await getIdToken(user);
      const result = await axios.post(
        "/api/addOrder",
        {
          withKulcha: [...FIXED_INCLUDE_ITEMS],
          includedItems1,
          includedItems2,
          address,
          ...data,
          createdAt: Timestamp.now(),
        },
        {
          headers: {
            "x-token": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (result.data.code === 1) {
        setStatus(result.data.code);
        setIncludedItems2([]);
        setIncludedItems1([]);
        setValue("name", "");
        setValue("instructions", "");
        setValue("phoneNumber", "");
        setValue("paymentmethod", "");
        setAllKulcha([...menuItems]);
      }
      setLoading(false);
    } catch (err: any) {
      console.log(err);
      setError(err.response.data.message);
      setLoading(false);
    }
  };

  const handleAddKulcha = (kulcha: any) => {
    if (includedItems1.some((item: any) => item.name === kulcha.name)) {
      let arr = allKulcha.map((item) => {
        if (item.name === kulcha.name) {
          return {
            ...item,
            quantity: 1,
          };
        }
        return item;
      });
      setAllKulcha([...arr]);
      setIncludedItems1([
        ...includedItems1.filter((item) => item.name !== kulcha.name),
      ]);
      return;
    }
    setIncludedItems1([...includedItems1, kulcha]);
  };

  const handleIncreaseQTY = (e: any, name: string) => {
    e.stopPropagation();
    let changed: any;
    let arr = allKulcha.map((item) => {
      if (item.name === name) {
        changed = {
          ...item,
          quantity: item.quantity + 1,
        };
        return changed;
      }
      return item;
    });
    let filtered = includedItems1.filter((item) => {
      return item.name !== name;
    });
    setIncludedItems1([...filtered, changed]);
    setAllKulcha([...arr]);
  };

  const handleDecreaseQTY = (e: any, name: string) => {
    e.stopPropagation();
    let changed: any;
    let arr = allKulcha.map((item) => {
      if (item.name === name) {
        changed = {
          ...item,
          quantity: item.quantity - 1 < 1 ? item.quantity : item.quantity - 1,
        };
        return changed;
      }
      return item;
    });
    let filtered = includedItems1.filter((item) => {
      return item.name !== name;
    });
    setIncludedItems1([...filtered, changed]);
    setAllKulcha([...arr]);
  };

  const handleDecreaseQTYDrink = (_id: string) => {
    const arr = [...includedItems2];
    arr.forEach((item) => {
      if (item.id === _id) {
        if (item.items[0].quantity > 1)
          item.items[0].quantity = item.items[0].quantity - 1;
      }
    });
    setIncludedItems2([...arr]);
  };

  const handleIncreaseQTYDrink = (_id: string) => {
    const arr = [...includedItems2];
    arr.forEach((item) => {
      if (item.id === _id) {
        item.items[0].quantity = item.items[0].quantity + 1;
      }
    });

    setIncludedItems2([...arr]);
  };

  useEffect(() => {
    setAddress({
      ...userData?.address,
    });
    setValue("name", userData?.name);
  }, [userData]);

  const checkuser = (value: any) => {
    if (value?.length === 10) {
      setLoading(true);
      const colRef = collection(db, "users");
      const q = query(
        colRef,
        where("phoneNumber", "==", `+${selectedCountry?.phone}${value}`)
      );
      getDocs(q).then((user) => {
        console.log(user.size);
        let userDoc: any;
        if (user.size > 0) {
          user.forEach((doc) => {
            console.log(doc);
            userDoc = {
              id: doc.id,
              ...doc.data(),
            };
          });
          setUserData(userDoc);
        }
        setLoading(false);
      });
    }
    return value;
  };

  const { extraItems } = useMenuContext();

  return (
    <>
      <CssBaseline />
      <Box
        sx={{
          backgroundColor: "white",
          height: "auto",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          overflowY: "auto",
        }}>
        <CircularLodar isLoading={loading} />
        <Typography variant='h4' sx={{ marginBottom: 2, marginTop: 2 }}>
          Make an Order
        </Typography>
        <Container
          component='main'
          maxWidth='md'
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            padding: 4,
            borderRadius: 2,
            boxShadow: 3,
            overflow: "hidden",
          }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
            }}>
            <Box
              component='form'
              noValidate
              sx={{
                mt: 1,
                maxWidth: "100%",
                // boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              }}
              onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Controller
                    name='countryCode'
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <Autocomplete
                        id='country-select-demo'
                        fullWidth
                        options={countries}
                        autoHighlight
                        getOptionLabel={(option) => option.label}
                        renderOption={(props, option) => {
                          const { key, ...optionProps } = props;
                          return (
                            <Box
                              key={key}
                              component='li'
                              sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                              {...optionProps}>
                              <Image
                                loading='lazy'
                                width={20}
                                height={15} // Maintain aspect ratio similar to the original `img`
                                src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                                alt={`${option.label} flag`}
                              />
                              {option.label} ({option.code}) +{option.phone}
                            </Box>
                          );
                        }}
                        value={selectedCountry}
                        onChange={(event, newValue) => {
                          onChange(newValue);
                          setSelectedCountry(newValue || (null as any));
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label='Choose a country code'
                            inputProps={{
                              ...params.inputProps,
                              autoComplete: "new-password", // Correct way to pass autoComplete
                            }}
                            InputProps={{
                              ...params.InputProps,
                              startAdornment: selectedCountry && (
                                <InputAdornment position='start'>
                                  <Image
                                    loading='eager'
                                    width={20}
                                    height={15} // Maintain aspect ratio similar to the original `img`
                                    src={`https://flagcdn.com/w20/${selectedCountry.code.toLowerCase()}.png`}
                                    priority
                                    alt='#'
                                  />
                                  <Typography sx={{ ml: 1 }}>
                                    +{selectedCountry.phone}
                                  </Typography>
                                </InputAdornment>
                              ),
                            }}
                          />
                        )}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={8}>
                  <Controller
                    name='phoneNumber'
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        required
                        fullWidth
                        type='tel'
                        label='Phone Number'
                        placeholder='(123)-456-7890'
                        value={value}
                        onChange={(e) => onChange(checkuser(e.target.value))}
                        error={!!errors.phoneNumber}
                        helperText={errors.phoneNumber?.message ?? ""}
                        inputProps={{
                          maxLength: 10,
                          pattern: "[0-9]*",
                        }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position='start'>
                              <i className='ri-phone-fill' />
                            </InputAdornment>
                          ),
                        }}
                        InputLabelProps={{ style: { color: "black" } }}
                        onKeyDown={(e) => {
                          if (
                            !/[0-9]/.test(e.key) &&
                            e.key !== "Backspace" &&
                            e.key !== "Delete" &&
                            e.key !== "ArrowLeft" &&
                            e.key !== "ArrowRight"
                          ) {
                            e.preventDefault();
                          }
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name='name'
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        required
                        fullWidth
                        label='Customer Name'
                        placeholder='Customer Name'
                        value={value}
                        onChange={onChange}
                        error={!!errors.name}
                        helperText={errors.name?.message ?? ""}
                        InputLabelProps={{ style: { color: "black" } }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <GoogleAddressAutocomplete
                    key={address?.raw || "default"}
                    apiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY}
                    style={{
                      outline: "none",
                      color: "#8F8996",
                      padding: "14px 10px",
                      fontWeight: "bold",
                      border: "1px solid grey",
                      fontSize: "1rem",
                      width: "100%",
                    }}
                    defaultValue={address?.raw}
                    onPlaceSelected={(place) => {
                      if (!place) return;

                      let zipCode = "";
                      let city = "";
                      let state = "";

                      place.address_components?.forEach((component) => {
                        if (component.types.includes("postal_code")) {
                          zipCode = component.long_name;
                        }
                        if (component.types.includes("locality")) {
                          city = component.long_name;
                        }
                        if (
                          component.types.includes(
                            "administrative_area_level_1"
                          )
                        ) {
                          state = component.long_name;
                        }
                      });

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
                                  if (results[i].types[j] == "plus_code") {
                                    plusCode =
                                      results[i]?.plus_code.global_code;
                                  }
                                  if (results[i].types[j] == "postal_code") {
                                    postalCode =
                                      results[i]?.address_components[j]
                                        .long_name;
                                  }
                                }
                              }
                              const { distance }: any = await calculateDistance(
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
                </Grid>
                <Grid
                  item
                  xs={12}
                  display='flex'
                  justifyContent='center'
                  flexDirection='column'
                  alignItems='center'>
                  {allKulcha?.map((kulcha: any, index: number) => {
                    return (
                      <Box sx={{ mb: 2 }} key={index}>
                        <Box
                          onClick={() => handleAddKulcha(kulcha)}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            width: "850px",
                            border: includedItems1.some(
                              (item: any) => item.name === kulcha.name
                            )
                              ? "2px solid green"
                              : "1px solid #ddd",
                            borderRadius: "10px",
                            boxShadow: "1px 1px 2px #4e5664",
                            p: 2,
                            cursor: "pointer",
                          }}>
                          <Avatar
                            src={kulcha?.image}
                            sx={{
                              width: 50,
                              height: 50,
                              mr: 2,
                            }}
                          />
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant='body1'>
                              {kulcha?.name} &nbsp;
                              <Typography
                                component='span'
                                variant='body2'
                                color='textSecondary'>
                                Qty: {kulcha?.quantity}
                              </Typography>
                            </Typography>
                            <Typography
                              variant='body1'
                              sx={{ fontSize: "14px" }}>
                              ${Number(kulcha.price)}
                            </Typography>
                          </Box>
                          <Box sx={{ textAlign: "right" }}>
                            <Typography
                              variant='body1'
                              sx={{ fontSize: "14px" }}>
                              ${Number(kulcha.price) * Number(kulcha?.quantity)}
                            </Typography>
                          </Box>
                        </Box>
                        {includedItems1.some(
                          (item: any) => item.name === kulcha.name
                        ) && (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "end",
                            }}>
                            <IconButton
                              onClick={(e) =>
                                handleDecreaseQTY(e, kulcha?.name)
                              }
                              sx={{
                                color: "#336195",
                              }}>
                              <RemoveCircleOutlineIcon />
                            </IconButton>
                            <Typography variant='body1' color='textPrimary'>
                              {kulcha.quantity || 1}
                            </Typography>
                            <IconButton
                              onClick={(e) =>
                                handleIncreaseQTY(e, kulcha?.name)
                              }
                              sx={{
                                color: "#336195",
                              }}>
                              <AddCircleOutlineIcon />
                            </IconButton>
                          </Box>
                        )}
                      </Box>
                    );
                  })}
                </Grid>
                <Grid
                  item
                  xs={12}
                  sx={{ mb: 4 }}
                  display='flex'
                  justifyContent='center'
                  flexDirection='row'
                  alignItems='center'
                  gap={5}>
                  {extraItems.map((item, index) => {
                    return (
                      <Grid item xs={6} sm={4} md={1.6} key={index}>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "1rem",
                            backgroundColor: "white",
                            borderRadius: "8px",
                            textAlign: "center",
                            position: "relative",
                            cursor: "pointer",
                            height: {
                              xs: "160px",
                              sm: "120px",
                              md: "150px",
                              lg: "150px",
                            },
                            boxShadow: "1px 1px 3px #4e5664", // Updated box-shadow
                            border: includedItems2.some((_item: any) => {
                              return item === _item.items[0].name;
                            })
                              ? "2px solid green"
                              : "1px solid #ddd",
                            // border: "1px solid black",
                          }}
                          onClick={() => handleAddItem(item)}>
                          <Image
                            src={getImageSrc(item)}
                            alt={item}
                            width={150}
                            height={150}
                            style={{
                              width: "50%", // Set the width to 65% of the container
                              height: "50%", // Set the height to 55% of the container
                              objectFit: "contain",
                              marginTop: 1,
                            }}
                          />
                          <Typography
                            variant='body1'
                            color='textPrimary'
                            sx={{ mt: 2 }}>
                            {item}
                          </Typography>
                        </Box>
                      </Grid>
                    );
                  })}
                </Grid>
                <Grid container spacing={1} justifyContent='center'>
                  <Grid item xs={12}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "1rem",
                        backgroundColor: "white",
                        border: "2px solid #dcdcdc",
                        borderRadius: "8px",
                        textAlign: "left",
                        position: "relative",
                        cursor: "pointer",
                        marginLeft: "15px",
                        // margin: "0.3rem 0",
                        width: { xs: "100%", md: "843px" },
                      }}
                      onClick={handleDrinkDialog}>
                      <Box display='flex' alignItems='center'>
                        <Image
                          src='/images/landingpage/Drinks.svg'
                          alt='Add a Drink'
                          layout='fixed'
                          width={50}
                          height={50}
                          style={{
                            objectFit: "cover",
                            borderRadius: "50%",
                          }}
                        />
                        <Typography
                          variant='body1'
                          color='textPrimary'
                          sx={{ marginLeft: "1rem" }}>
                          Add a Drink
                        </Typography>
                      </Box>
                      <ArrowForwardIosIcon />
                    </Box>
                  </Grid>
                  <Grid container justifyContent='space-evenly' mt={1.75}>
                    {includedItems2.length == 0 ? (
                      <></>
                    ) : (
                      includedItems2.map((item) => (
                        <Grid item xs={6} sm={4} md={1.6} key={item.id}>
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                              padding: "1rem",
                              backgroundColor: "white",
                              border: "2px solid #87939f",
                              borderRadius: "8px",
                              textAlign: "center",
                              position: "relative",
                              cursor: "pointer",
                              height: { xs: "200px", sm: "230px" },
                              width: { xs: "130px", sm: "130px" },
                              margin: "0.5rem",
                              boxShadow: "2px 2px 3px #4e5664",
                            }}>
                            <CheckCircleIcon
                              sx={{
                                position: "absolute",
                                top: "10px",
                                right: "10px",
                                color: "#336195",
                                backgroundColor: "white",
                                borderRadius: "50%",
                              }}
                            />
                            <Image
                              src={getImageSrc(item.items[0].name)}
                              alt={item.items[0].name}
                              width={150}
                              height={150}
                              style={{
                                width: "65%",
                                height: "55%",
                                objectFit: "contain",
                              }}
                            />
                            <Typography
                              variant='body1'
                              color='textPrimary'
                              sx={{ fontSize: "12px" }}>
                              {item.items[0].name}
                            </Typography>
                            <Typography variant='body2' color='textSecondary'>
                              ${item.items[0].price.toFixed(2)}
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}>
                              <IconButton
                                onClick={() => handleDecreaseQTYDrink(item.id)}
                                sx={{
                                  color: "#336195",
                                }}>
                                <RemoveCircleOutlineIcon />
                              </IconButton>
                              <Typography variant='body1' color='textPrimary'>
                                {item.items[0].quantity || 1}
                              </Typography>
                              <IconButton
                                onClick={() => handleIncreaseQTYDrink(item.id)}
                                sx={{
                                  color: "#336195",
                                }}>
                                <AddCircleOutlineIcon />
                              </IconButton>
                            </Box>
                            <Button
                              variant='outlined'
                              onClick={() => handleRemoveItem(item.id)}
                              sx={{
                                backgroundColor: "transparent",
                                color: "#336195",
                                border: "1px solid #336195",
                                marginTop: "auto",
                                borderRadius: "20px",
                                textTransform: "none",
                              }}>
                              Remove
                            </Button>
                          </Box>
                        </Grid>
                      ))
                    )}
                  </Grid>
                </Grid>
                <Grid item xs={12} md={12}>
                  <Controller
                    name='paymentmethod'
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <FormControl fullWidth>
                        <InputLabel>Payment method</InputLabel>
                        <Select
                          label='Payment method'
                          value={value}
                          onChange={onChange}
                          error={!!errors.paymentmethod}>
                          <MenuItem value='Cash'>Cash</MenuItem>
                          <MenuItem value='Online'>Online</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name='instructions'
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        placeholder='Special instructions'
                        fullWidth
                        value={value}
                        onChange={onChange}
                        minRows={2}
                        multiline
                        error={!!errors.instructions}
                        helperText={errors.instructions?.message ?? ""}
                      />
                    )}
                  />
                </Grid>
              </Grid>
              <Button
                type='submit'
                variant='contained'
                sx={{
                  marginLeft: "40%",
                  backgroundColor: "#ECAB21",
                  color: "white",
                  paddingX: 4,
                  paddingY: 1,

                  mt: 2,
                  fontWeight: "bold",
                  "&:hover": {
                    backgroundColor: "#FFC107",
                    color: "white",
                  },
                }}>
                Submit Order
              </Button>
              {/* <OrderReceiptPrinter/> */}
              {error && (
                <Alert severity='error' sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}
              {Number(status) === 1 && (
                <Alert severity='success' sx={{ mt: 2 }}>
                  Order Placed successfully.
                </Alert>
              )}
            </Box>
          </Box>
        </Container>
      </Box>
      <Dialog
        open={isDrinkDialogOpen}
        onClose={handleDrinkDialog}
        maxWidth='sm'
        fullWidth>
        <DialogTitle sx={{ fontWeight: "bold" }}>
          Add a Drink{" "}
          <IconButton
            aria-label='close'
            onClick={handleDrinkDialog}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {drinkOptions.map((drink) => (
              <Grid item xs={12} sm={6} md={4} key={drink.name}>
                <Card
                  onClick={() => handleDrinkSelect(drink.name)}
                  sx={{
                    border: includedItems2.some((item) =>
                      item.items.some((i: any) => i.name === drink.name)
                    )
                      ? "2px solid green"
                      : "1px solid #ddd",
                    position: "relative",
                    cursor: "pointer",
                    height: "270px", // Ensure all cards have the same height
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center", // Align items center horizontally
                  }}>
                  <Image
                    alt={drink.name}
                    src={drink.image}
                    width={150}
                    height={150}
                    style={{
                      width: "65%", // Set the width to 65% of the container
                      height: "55%", // Set the height to 55% of the container
                      objectFit: "contain",
                      display: "block", // Ensures the image is treated as a block-level element
                      margin: "0 auto", // Center horizontally within the container
                    }}
                  />
                  <CardContent sx={{ textAlign: "center" }}>
                    <Typography
                      variant='body1'
                      color='textPrimary'
                      sx={{ fontSize: "18px" }}>
                      {drink.name}
                    </Typography>
                    <Typography variant='body2' color='textSecondary'>
                      ${drink.price.toFixed(2)}
                    </Typography>
                    {includedItems2.some((item) =>
                      item.items.some((i: any) => i.name === drink.name)
                    ) && (
                      <CheckCircleIcon
                        sx={{
                          position: "absolute",
                          top: "10px",
                          right: "10px",
                          color: "green",
                          backgroundColor: "white",
                          borderRadius: "50%",
                        }}
                      />
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        {/* <DialogActions>
          <Button onClick={handleDrinkDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDrinkDialogClose} color="primary">
            Save
          </Button>
        </DialogActions> */}
      </Dialog>
    </>
  );
};

export default MakeOrder;
