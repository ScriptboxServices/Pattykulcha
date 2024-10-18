"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Container,
  Autocomplete,
  Grid,
  Paper,
  InputAdornment,
  Card,
  IconButton,
  Button,
  Alert,
  Link,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
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
import CheckIcon from "@mui/icons-material/Check";
import { Message, Phone } from "@mui/icons-material";

// Define validation schema
const schema = yup.object().shape({
  name: yup.string().required("First Name is required"),
  phone: yup
    .string()
    // .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
    .required("Phone is required"),
  message: yup.string().required("Message is required"),
  countryCode: yup.mixed<CountryType>().required(),
});

const ContactUs: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState<CountryType | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuthContext();
  const [error, setError] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const options = [
    {
      id: "message",
      title: "Write a Message",
      description: "Send us a message and we will respond promptly.",
      icon: <Message fontSize="large" />,
      action: () => setShowForm(true), // Show the form when clicked
    },
    {
      id: "call",
      title: "Call Now",
      description: "Give us a call for instant support.",
      icon: <Phone fontSize="large" />,
      action: () => (window.location.href = "tel:+18333381313"), // Initiate call when clicked
    },
  ];

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

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digit characters
    const phoneNumber = value?.replace(/\D/g, "");

    // Format the number as xxx-xxx
    const formattedPhoneNumber = phoneNumber?.replace(
      /(\d{3})(\d{0,3})(\d{0,4})?/,
      (match, p1, p2, p3) => {
        if (p3) return `${p1}-${p2}-${p3}`;
        else if (p2) return `${p1}-${p2}`;
        else return `${p1}`;
      }
    );

    return formattedPhoneNumber;
  };

  // Function to strip formatting (remove dash)
  const stripPhoneNumberFormatting = (formattedNumber: string) => {
    return formattedNumber.replace(/\D/g, ""); // Remove all non-digit characters
  };

  const onSubmit = async (data: any) => {
    console.log(data);
    const { name, message, countryCode } = data;
    const plainPhoneNumber = stripPhoneNumberFormatting(data.phone);
    try {
      setIsLoading(true);
      const colRef = collection(db, "contactus");
      const result = await addDoc(colRef, {
        createdAt: Timestamp.now(),
        customer: {
          name: name,
          phoneNumber: `+${countryCode.phone}${plainPhoneNumber}`,
        },
        foodTruckId: KITCHEN_ID,
        message: message,
        track: {
          message: "Initiate",
          status: false,
        },
        userId: user ? user?.uid : "",
      });
      setIsLoading(false);
      setValue("name", "");
      setValue("phone", "");
      setValue("message", "");
      setError(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  return (
    <>
      <CircularLodar isLoading={isLoading} />
      <Box
        sx={{
          display: "flex",
          minHeight: "100dvh",
          backgroundColor: "#FAF3E0",
          pt: 10,
        }}
      >
        <Container maxWidth="md">
          {/* Interactive Card Component */}
          {!showForm && (
            <>
              <Typography
                variant="h3"
                sx={{ textAlign: "center", mb: 3, fontWeight: "600" }}
              >
                CONTACT US
              </Typography>
              <Card
                sx={{
                  backgroundColor: "#FAF3E0",
                  boxShadow: "none",
                  border: "none",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#FAF3E0",
                    paddingY: 4,
                  }}
                >
                  <Grid
                    container
                    spacing={2}
                    justifyContent="center"
                    flexDirection="row"
                  >
                    {options.map((option) => (
                      <Grid item xs={10} sm={5} md={5} key={option.id}>
                        <Card
                          sx={{
                            padding: 2,
                            textAlign: "center",
                            height: "200px",
                            border:
                              selectedOption === option.id
                                ? "2px solid #3f51b5"
                                : "1px solid #ccc",
                            borderRadius: "10px",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            "&:hover": {
                              boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                            },
                          }}
                          onClick={() => {
                            setSelectedOption(option.id);
                            option.action();
                          }}
                        >
                          <IconButton
                            sx={{
                              backgroundColor:
                                selectedOption === option.id
                                  ? "#3f51b5"
                                  : "#ECAB21",
                              color:
                                selectedOption === option.id
                                  ? "white"
                                  : "white",
                              marginBottom: 1,
                              "&:hover": {
                                backgroundColor: "#ECAB21",
                                color: "white",
                              },
                            }}
                          >
                            {option.icon}
                          </IconButton>
                          <Typography
                            variant="h6"
                            sx={{ marginBottom: 1, fontWeight: "600" }}
                          >
                            {option.title}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ marginBottom: 2, color: "black" }}
                          >
                            {option.description}
                          </Typography>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </Card>
            </>
          )}

          {/* Show form when "Write a Message" is clicked */}
          {showForm && (
            <Paper
              elevation={4}
              sx={{
                borderRadius: "16px",
                p: 4,
                mb: 6,
                backgroundColor: "rgba(255, 255, 255, 0.85)",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  position: "relative",
                  mb: 2,
                }}
              >
                <Link
                  onClick={() => setShowForm(false)}
                  underline="none"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                    position: "absolute",
                    left: 0,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: "50%",
                      border: "1px solid #E0E0E0",
                      width: 28,
                      height: 28,
                    }}
                  >
                    <ArrowBackIcon sx={{ fontSize: 17, color: "#ffbb00" }} />
                  </Box>
                </Link>

                <Typography
                  variant="h4"
                  sx={{ fontWeight: 600, mx: "auto" }}
                  align="center"
                  gutterBottom
                >
                  Contact Us
                </Typography>
              </Box>

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
                                  height={15}
                                  src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`} // Dynamic URL using backticks
                                  alt={`${option.label} flag`} // Dynamic alt attribute
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
                      render={({ field: { onChange, value } }) => (
                        <TextField
                          value={formatPhoneNumber(value)} // Format the number with dashes
                          fullWidth
                          type="tel"
                          label="Phone"
                          variant="outlined"
                          onChange={(e) => {
                            const formattedValue = formatPhoneNumber(
                              e.target.value
                            );
                            onChange(formattedValue);
                            setValue("phone", formattedValue);
                          }}
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
                    {!error && (
                      <Alert
                        icon={<CheckIcon fontSize="inherit" />}
                        severity="success"
                        sx={{ marginTop: 2 }}
                      >
                        Thank you for contacting us! We&rsquo;ve received your
                        message and will get back to you as soon as possible.
                      </Alert>
                    )}
                  </Grid>
                </Grid>
              </form>
            </Paper>
          )}
        </Container>
      </Box>
    </>
  );
};

export default ContactUs;
