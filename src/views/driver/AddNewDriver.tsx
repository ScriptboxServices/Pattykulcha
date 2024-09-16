"use client";

import React, { useState,useEffect } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import Image from "next/image";
import * as yup from "yup";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  CssBaseline,
  Grid,
  Autocomplete,
  InputAdornment,
  Alert,
} from "@mui/material";
import { Icon, IconifyIcon } from "@iconify/react";
import { countries } from "@/utils/constants";
import { CountryType } from "@/context/types";

export interface CountryCode {
  name: string;
  phone: number;
  code: string;
  icon: IconifyIcon | string;
}

// Define the Yup schema for validation
const schema = yup.object().shape({
  fullName: yup.string().required("Full name is required"),
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  phoneNumber: yup
    .string()
    .matches(/^\d+$/, "Phone number is not valid")
    .min(10, "Phone number must be at least 10 digits")
    .required("Phone number is required"),
  countryCode: yup.mixed<CountryType>().required(),
  vehicleDetails: yup.string().required("Vehicle details are required"),
});

type IFormInput = yup.InferType<typeof schema>;

const filterOptions = (options: CountryCode[], state: any) =>
  options.filter((option) =>
    option.name.toLowerCase().includes(state.inputValue.toLowerCase())
  );

const DriverPage: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: yupResolver(schema),
    defaultValues: {
      countryCode:  countries.find((country) => country.label === "Canada"),
    },
  });

  const [error, setError] = useState<string>("");
  const [selectedCountry, setSelectedCountry] = useState<CountryType | null>(
    null
  );

  useEffect(() => {
    const defaultCountry =
      countries.find((country) => country.label === "Canada") || null;
    setSelectedCountry(defaultCountry);
  }, []);

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setError("");
    try {
      // Simulate form submission
      alert("Driver details submitted successfully!");
    } catch (err: any) {
      setError("Failed to submit driver details.");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "80vh",
        backgroundColor: "white",
        marginBottom:3,
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "md",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          padding: 4,
          borderRadius: 2,
          boxShadow: 3,
          overflow: "hidden", // Prevent content overflow
        }}
      >
        <CssBaseline />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Typography
            component="h2"
            variant="subtitle1"
            align="center"
            sx={{
              width: "100%",
              mt: 2,
              fontWeight: "bold",
            }}
          >
            Join PattyKulcha as a Driver!
          </Typography>
          <Typography
            variant="body2"
            align="center"
            sx={{ width: "100%", mt: 0.5, mb: 3 }}
            gutterBottom
          >
            Please fill in your details to get started.
          </Typography>
          <Box
            component="form"
            noValidate
            sx={{ mt: 1, width: "100%" }}
            onSubmit={handleSubmit(onSubmit)}
          >
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Controller
                  name="fullName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      required
                      fullWidth
                      label="Full Name"
                      placeholder="John Doe"
                      {...field}
                      error={!!errors.fullName}
                      helperText={errors.fullName?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      required
                      fullWidth
                      label="Email"
                      placeholder="john.doe@example.com"
                      {...field}
                      error={!!errors.email}
                      helperText={errors.email?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={4}>
                <Controller
                  name="countryCode"
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
                            height={15} // Maintain aspect ratio similar to the original img
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
                                height={15} // Maintain aspect ratio similar to the original img
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
              <Grid item xs={8}>
                <Controller
                  name="phoneNumber"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      required
                      fullWidth
                      type="tel"
                      label="Phone Number"
                      placeholder="123-456-7890"
                      value={value}
                      onChange={onChange}
                      error={!!errors.phoneNumber}
                      helperText={errors.phoneNumber?.message ?? ""}
                      inputProps={{
                        maxLength: 10,
                        pattern: "[0-9]*",
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <i className="ri-phone-fill" />
                          </InputAdornment>
                        ),
                      }}
                      InputLabelProps={{ style: { color: "black" } }}
                      sx={{
                        "@media (max-width: 600px)": {
                          marginTop: "7px",
                        },
                      }}
                      onKeyDown={(e) => {
                        if (
                          !/[0-9]/.test(e.key) &&
                          e.key != "Backspace" &&
                          e.key != "Delete" &&
                          e.key != "ArrowLeft" &&
                          e.key != "ArrowRight"
                        ) {
                          e.preventDefault();
                        }
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="vehicleDetails"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      required
                      fullWidth
                      label="Vehicle Details"
                      placeholder="Vehicle Make, Model, License Plate"
                      {...field}
                      error={!!errors.vehicleDetails}
                      helperText={errors.vehicleDetails?.message}
                      multiline
                      rows={4}
                    />
                  )}
                />
              </Grid>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  backgroundColor: "#ECAB21",
                  color: "white",
                  paddingX: 4,
                  paddingY: 1,
                  margin: "0 auto",
                  mt: 2,
                  fontWeight: "bold",

                  "&:hover": {
                    backgroundColor: "#FFC107",
                    color: "white",
                  },
                }}
              >
                Submit Details
              </Button>
            </Grid>

            {error && (
              <Alert severity="error" className=" mt-2">
                {error}
              </Alert>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default DriverPage;