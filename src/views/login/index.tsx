"use client";

import React, { useEffect, useState } from "react";
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
import { useRouter } from "next/navigation";
import { countries } from "@/utils/constants";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "@/firebase";
import { useAuthContext, useMenuContext } from "@/context";
import CircularLodar from "@/components/CircularLodar";
import { CountryType } from "@/context/types";

// Define the Yup schema
const schema = yup.object().shape({
  phoneNumber: yup
    .string()
    // .matches(/^\d+$/, "Phone number is not valid")
    .min(10, "Phone number must be at least 10 digits")
    .required("Phone number is required"),
  countryCode: yup.mixed<CountryType>().required(),
});

type IFormInput = yup.InferType<typeof schema>;

const Login: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState<CountryType | null>(null);
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm<IFormInput>({
    resolver: yupResolver(schema),
    defaultValues: {
      countryCode: countries.find((country) => country.label === "Canada"),
    },
  });

  const { user } = useAuthContext();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [recaptchaVerifier, setRecaptchaVerifier] =
    useState<RecaptchaVerifier | null>(null);
  const router = useRouter();
  const { confirmationResult, setConfirmationResult } = useMenuContext();

  useEffect(() => {
    if (user) {
      router.push("/home");
    }
  }, [user]);

  useEffect(() => {
    const recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
      size: "invisible",
    });

    setRecaptchaVerifier(recaptchaVerifier);
    return () => {
      recaptchaVerifier.clear();
    };
  }, [auth]);

  useEffect(() => {
    if (!confirmationResult) return;
    router.push("/verification");
  }, [confirmationResult]);

  useEffect(() => {
    const defaultCountry = countries.find((country) => country.label === "Canada") || null;
    setSelectedCountry(defaultCountry);
  }, []);

  // Function to format phone number (add dash after 3rd digit)
  const formatPhoneNumber = (value: string) => {
    // Remove all non-digit characters
    const phoneNumber = value?.replace(/\D/g, "");

    // Format the number as xxx-xxx
    const formattedPhoneNumber = phoneNumber?.replace(/(\d{3})(\d{0,3})(\d{0,4})?/, (match, p1, p2, p3) => {
      if (p3) return `${p1}-${p2}-${p3}`;
      else if (p2) return `${p1}-${p2}`;
      else return `${p1}`;
    });

    return formattedPhoneNumber;
  };

  // Function to strip formatting (remove dash)
  const stripPhoneNumberFormatting = (formattedNumber: string) => {
    return formattedNumber.replace(/\D/g, ""); // Remove all non-digit characters
  };

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setError("");
    if (!recaptchaVerifier) return;

    try {
      setLoading(true);

      // Strip the formatting before sending to Firebase
      const plainPhoneNumber = stripPhoneNumberFormatting(data.phoneNumber);

      const confirmation = await signInWithPhoneNumber(
        auth,
        `+${data?.countryCode?.phone}${plainPhoneNumber}`,
        recaptchaVerifier
      );

      setLoading(false);
      setConfirmationResult(confirmation);
    } catch (err: any) {
      setLoading(false);
      if (err.code == "auth/invalid-phone-number") {
        setError("Invalid phone number.");
      } else {
        setError("Failed to send otp.");
      }
    }
  };

  return (
    <>
      <CircularLodar isLoading={loading} />
      <div id="recaptcha-container" />
      <CssBaseline />
      <Box
        sx={{
          backgroundColor: "white",
          height: "100dvh",
          display: "flex",
          justifyContent: "center",
          alignItems: { xs: "flex-start", sm: "center" },
          overflow: "hidden",
        }}
      >
        <Container
          component="main"
          maxWidth="xs"
          sx={{
            backgroundColor: { xs: "none", sm: "rgba(255, 255, 255, 0.9)" },
            padding: 4,
            borderRadius: 2,
            boxShadow: 3,
            overflow: "hidden",
            marginTop: { xs: 4.24 },
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
              sx={{ width: "100%", mt: 2, fontWeight: "bold" }}
            >
              Welcome to Patty kulcha!
            </Typography>
            <Typography
              variant="body2"
              align="left"
              sx={{ width: "100%", mt: 0.5, mb: 3 }}
              gutterBottom
            >
              Please sign-in to your account.
            </Typography>
            <Box
              component="form"
              noValidate
              sx={{ mt: 1, width: "100%" }}
              onSubmit={handleSubmit(onSubmit)}
            >
              <Grid container spacing={2}>
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
                    name="phoneNumber"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        required
                        fullWidth
                        type="tel"
                        label="Phone Number"
                        placeholder="(123)-456-7890"
                        value={formatPhoneNumber(value)} // Format the number with dashes
                        onChange={(e) => {
                          const formattedValue = formatPhoneNumber(e.target.value);
                          onChange(formattedValue); // Update form value with the formatted number
                          setValue("phoneNumber", formattedValue); // Manually set the value
                        }}
                        error={!!errors.phoneNumber}
                        helperText={errors.phoneNumber?.message ?? ""}
                        inputProps={{
                          maxLength: 12, // Adjusted for the format xxx-xxx-xxxx
                          pattern: "[0-9]*",
                        }}
                        InputProps={{
                          startAdornment: selectedCountry && (
                            <InputAdornment position="start">
                              <Typography>+{selectedCountry.phone}</Typography>
                            </InputAdornment>
                          ),
                        }}
                        InputLabelProps={{ style: { color: "black" } }}
                        sx={{
                          "@media (max-width: 600px)": {
                            marginTop: "7px",
                          },
                        }}
                        // onKeyDown={(e) => {
                        //   // Prevent non-numeric input except for control keys
                        //   if (
                        //     !/[0-9]/.test(e.key) &&
                        //     e.key !== "Backspace" &&
                        //     e.key !== "Delete" &&
                        //     e.key !== "ArrowLeft" &&
                        //     e.key !== "ArrowRight"
                        //   ) {
                        //     e.preventDefault();
                        //   }
                        // }}
                      />
                    )}
                  />
                  <Typography variant="subtitle1" sx={{ mt: 0.5, fontSize: "11px" }}>
                    We’ll call or text you to confirm your number. Standard
                    message and data rates apply.
                    <Button
                      sx={{
                        fontSize: "11px",
                        color: 'black',
                        ml: -1,
                        mt: -0.3,
                        textTransform: "none",
                        textDecoration: 'underline',
                        fontWeight: 500
                      }}
                      onClick={() => {
                        router.push("/privacypolicy")
                      }}
                    >
                      {" "}Privacy Policy
                    </Button>
                  </Typography>
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
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
                Login
              </Button>
              {error && (
                <Alert severity="error" className=" mt-2">
                  {error}
                </Alert>
              )}
            </Box>
            <Button
              fullWidth
              variant="outlined"
              sx={{
                color: "#ECAB21",
                borderColor: "#ECAB21",
                paddingX: 4,
                paddingY: 1,
                mt: 2,
                fontWeight: "bold",
                "&:hover": {
                  borderColor: "#FFC107",
                  color: "#FFC107",
                },
              }}
              component="a"
              href="tel:+18333381313"
            >
              Need Help?
            </Button>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default Login;
