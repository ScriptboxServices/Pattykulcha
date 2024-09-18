"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Container,
  Autocomplete,
  Grid,
  Paper,
  InputAdornment,
} from "@mui/material";
import { Person, Email, Phone, Message } from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Image from "next/image";
import { CountryType } from "@/context/types";
import { countries } from "@/utils/constants";
import CircularLodar from "@/components/CircularLodar";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "@/firebase";
import { KITCHEN_ID, useAuthContext } from "@/context";

const schema = yup.object().shape({
  name: yup.string().required("First Name is required"),
  phone: yup
    .string()
    .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
    .required("Phone is required"),
  message: yup.string().required("Message is required"),
  countryCode: yup.mixed<CountryType>().required(),
});

const ContactUs: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState<CountryType | null>(
    null
  );
  const [isLoading,setIsLoading] = useState(false)
  const {user} = useAuthContext()

  useEffect(() => {
    const defaultCountry =
      countries.find((country) => country.label === "Canada") || null;
    setSelectedCountry(defaultCountry);
  }, []);

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      countryCode: countries.find((country) => country.label === "Canada"),
    },
  });

  const onSubmit = async (data: any) => {
    console.log(data);
    const {name,message,phone,countryCode} = data
    try{
      setIsLoading(true)
      const colRef = collection(db,'contactus')
      const result = await addDoc(colRef,{
        createdAt : Timestamp.now(),
        customer : {
          name : name,
          phoneNumber :  `+${countryCode.phone}${phone}`
        },
        foodTruckId : KITCHEN_ID,
        message : message,
        track : {
          message: 'Initiate',
          status : false
        },
        userId : user ? user?.uid : ''
      })
      setIsLoading(false)
      setValue("name", "");
      setValue("phone", "");
      setValue("message", "");
    }catch(err){
      console.log(err);
      setIsLoading(false)
    }
  };

  return (
    <>
      <CircularLodar isLoading={isLoading} />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100dvh",
          backgroundColor: "#FAF3E0",
          py: 4,
        }}
      >
        <Container maxWidth="md">
          <Paper
            elevation={4}
            sx={{
              borderRadius: "16px",
              p: 4,
              backgroundColor: "rgba(255, 255, 255, 0.85)",
            }}
          >
            <Typography
              variant="h4"
              sx={{ fontWeight: 600 }}
              align="center"
              gutterBottom
            >
              Contact Us
            </Typography>

            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={3}>
          
                <Grid item xs={12}>
                  <Controller
                    name="countryCode"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <Autocomplete
                        id="country-select-demo"
                        fullWidth
                        options={countries}
                        autoHighlight
                        getOptionLabel={(option) => option.label}
                        renderOption={(props, option) => {
                          const { key, ...optionProps } = props;
                          return (
                            <Box
                              key={key}
                              component="li"
                              sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                              {...optionProps}
                            >
                              <Image
                                loading="lazy"
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
                            label="Choose a country code"
                            inputProps={{
                              ...params.inputProps,
                              autoComplete: "new-password",
                            }}
                            InputProps={{
                              ...params.InputProps,
                              startAdornment: selectedCountry && (
                                <InputAdornment position="start">
                                  <Image
                                    loading="eager"
                                    width={20}
                                    height={15}
                                    src={`https://flagcdn.com/w20/${selectedCountry.code.toLowerCase()}.png`}
                                    priority
                                    alt="#"
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
                <Grid item xs={12}>
                  <Controller
                    name="phone"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        type="tel"
                        label="Phone"
                        variant="outlined"
                        error={!!errors.phone}
                        helperText={errors.phone?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="text"
                        fullWidth
                        label="Name"
                        variant="outlined"
                        error={!!errors.name}
                        helperText={errors.name?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="message"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        multiline
                        rows={4}
                        label="Message"
                        placeholder="Write your message..."
                        variant="outlined"
                        error={!!errors.message}
                        helperText={errors.message?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box
                    display="flex"
                    justifyContent="space-evenly"
                    sx={{
                      flexDirection: { xs: "column", sm: "row" },
                    }}
                  >
                    <Button
                      variant="contained"
                      sx={{
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
                      }}
                      component="a"
                      href="tel:+1437996-5431"
                    >
                      Call now
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      sx={{
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
                      }}
                    >
                      Send Message
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Container>
      </Box>
    </>
  );
};

export default ContactUs;
