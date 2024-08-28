"use client";

import React, { useState } from "react";
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
import { countryCodes } from "@/utils/constants";
// import Autocomplete from "react-google-autocomplete";

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
  countryCode: yup.string().required(),
  vehicleDetails: yup.string().required("Vehicle details are required"),
});

type IFormInput = yup.InferType<typeof schema>;

const filterOptions = (options: CountryCode[], state: any) =>
  options.filter((option) =>
    option.name.toLowerCase().includes(state.inputValue.toLowerCase())
  );

const DriverPage: React.FC = () => {
  const [defaultCountry, setDefaultCountry] = useState<CountryCode | null>(
    countryCodes.find((country) => country.name == "Canada") || null
  );
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: yupResolver(schema),
    defaultValues: {
      countryCode: countryCodes
        .find((country) => country.name == "Canada")
        ?.phone.toString(),
    },
  });

  const [error, setError] = useState<string>("");

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setError("");
    try {
      // Simulate form submission
      console.log("Driver Details:", data);
      alert("Driver details submitted successfully!");
    } catch (err: any) {
      setError("Failed to submit driver details.");
    }
  };

  return (
    <>
      <CssBaseline />
      <Box
        sx={{
          backgroundColor: "white",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: { xs: "flex-start", sm: "center" },
          overflow: "hidden",
        }}
      >
        <Container
          component="main"
          maxWidth="md"
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            padding: 4,
            borderRadius: 2,
            boxShadow: 3,
            overflow: "hidden", // Prevent content overflow
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Link href="/home" passHref>
              <Image
                src="/images/logo.png"
                alt="logo"
                height={150}
                layout="fixed"
                width={170}
                priority
              />
            </Link>
            <Typography
              component="h2"
              variant="subtitle1"
              align="left"
              sx={{
                width: "100%",
                mt: 2,
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Join PattyKulcha as a Driver!
            </Typography>
            <Typography
              variant="body2"
              align="left"
              sx={{ width: "100%", mt: 0.5, mb: 3, textAlign: "center" }}
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
                        fullWidth
                        options={countryCodes}
                        filterOptions={filterOptions}
                        getOptionLabel={(option: CountryCode) =>
                          `${option.name} (${option.phone}) `
                        }
                        renderOption={(props, option: CountryCode) => (
                          <Box component="li" {...props}>
                            <Icon
                              icon={option.icon as IconifyIcon}
                              width={20}
                              height={20}
                            />
                            {option.name} ({option.phone})
                          </Box>
                        )}
                        value={
                          countryCodes.find(
                            (code) => code.phone == Number(value)
                          ) || defaultCountry
                        }
                        onChange={(event, newValue) =>
                          onChange(newValue?.phone ?? "")
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Country Code"
                            placeholder="Select Country Code"
                            required
                            InputProps={{
                              ...params.InputProps,
                              startAdornment: (
                                <>
                                  {params.InputProps.startAdornment}
                                  <InputAdornment position="start">
                                    <Icon
                                      icon={
                                        (countryCodes.find(
                                          (option) =>
                                            option.phone == Number(value)
                                        )?.icon ||
                                          defaultCountry?.icon) as IconifyIcon
                                      }
                                    />
                                  </InputAdornment>
                                </>
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
                        rows={4} // Increase the height of the textfield
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
        </Container>
      </Box>
    </>
  );
};

export default DriverPage;
