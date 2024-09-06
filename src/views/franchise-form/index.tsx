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
  Alert,
  Autocomplete,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { countries } from "@/utils/constants";
import { useAuthContext } from "@/context";
import CircularLodar from "@/components/CircularLodar";
import { CountryType } from "@/context/types";
import { Close } from '@mui/icons-material';

// Define the Yup schema
const schema = yup.object().shape({
  fullName: yup.string().required("Full Name is required"),
  contactInfo: yup.object().shape({
    phoneNumber: yup
      .string()
      .matches(/^\d+$/, "Phone number is not valid")
      .min(10, "Phone number must be at least 10 digits")
      .required("Phone number is required"),
    email: yup.string().email("Invalid email address").required("Email is required"),
    address: yup.string().required("Address is required"),
  }),
  nationality: yup.mixed<CountryType>().required("Nationality is required"),
  currentOccupation: yup.string().required("Current Occupation is required"),
  businessExperience: yup.string().required("Relevant Business Experience is required"),
  yearsOfExperience: yup
    .number()
    .typeError("Must be a number")
    .min(0, "Years of Experience cannot be negative")
    .required("Years of Experience is required"),
  document: yup
    .mixed<File>()
    .required("Please attach a relevant document")
    .test("fileSize", "The file is too large", (value) => !value || (value && value.size <= 2000000)), // 2MB limit
});

type IFormInput = yup.InferType<typeof schema>;

const FranchiseForm: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState<CountryType | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<File | null>(null);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: yupResolver(schema),
  });

  const { user } = useAuthContext();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const defaultCountry =
      countries.find((country) => country.label === "Canada") || null;
    setSelectedCountry(defaultCountry);
  }, []);

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setError("");
    try {
      setLoading(true);
      // Handle form submission
      console.log("Form Data:", data, selectedDocument);
      setLoading(false);
      // Redirect or further processing
    } catch (err: any) {
      console.log(err);
      setLoading(false);
      setError("Failed to submit form.");
    }
  };

  const handleDocumentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedDocument(file);
    }
  };

  const handleDocumentRemove = () => {
    setSelectedDocument(null);
  };

  return (
    <>
      <CircularLodar isLoading={loading} />
      <CssBaseline />
      <Box
        sx={{
          backgroundColor: "#FFF8E1",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: { xs: "flex-start", sm: "center" },
          overflow: "hidden",
          pb: 2
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
            overflow: "hidden",
            marginTop: { xs: 4.24 },
            m: { xs: 2 }
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
              variant="h6"
              align="left"
              sx={{ width: "100%", mt: 2, fontWeight: "bold" }}
            >
              Become a Franchise of PattyKulcha
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
                    name="fullName"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        required
                        fullWidth
                        label="Full Name"
                        error={!!errors.fullName}
                        helperText={errors.fullName?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="nationality"
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
                            label="Choose Nationality"
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
                    name="contactInfo.phoneNumber"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        required
                        fullWidth
                        type="tel"
                        label="Phone Number"
                        value={value}
                        onChange={onChange}
                        error={!!errors.contactInfo?.phoneNumber}
                        helperText={errors.contactInfo?.phoneNumber?.message}
                        InputProps={{
                          startAdornment: selectedCountry && (
                            <InputAdornment position="start">
                              <Typography>+{selectedCountry.phone}</Typography>
                            </InputAdornment>
                          ),
                        }}
                        inputProps={{
                          maxLength: 10,
                        }}
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
                <Grid item xs={12}>
                  <Controller
                    name="contactInfo.email"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        required
                        fullWidth
                        type="email"
                        label="Email"
                        error={!!errors.contactInfo?.email}
                        helperText={errors.contactInfo?.email?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="contactInfo.address"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        required
                        fullWidth
                        label="Address"
                        error={!!errors.contactInfo?.address}
                        helperText={errors.contactInfo?.address?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="currentOccupation"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        required
                        fullWidth
                        label="Current Occupation"
                        error={!!errors.currentOccupation}
                        helperText={errors.currentOccupation?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="businessExperience"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        required
                        fullWidth
                        label="Relevant Business Experience"
                        multiline
                        rows={4}
                        error={!!errors.businessExperience}
                        helperText={errors.businessExperience?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="yearsOfExperience"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        required
                        fullWidth
                        label="Years of Experience"
                        type="number"
                        error={!!errors.yearsOfExperience}
                        helperText={errors.yearsOfExperience?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="document"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        fullWidth
                        label="Upload Document"
                        error={!!errors.document}
                        helperText={errors.document?.message}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        InputProps={{
                          endAdornment: selectedDocument && (
                            <IconButton onClick={handleDocumentRemove}>
                              <Close />
                            </IconButton>
                          ),
                          inputProps: {
                            type: "file",
                            accept: ".pdf,.doc,.docx,.jpg,.png",
                            onChange: handleDocumentChange,
                          },
                        }}
                      />
                    )}
                  />
                </Grid>
              </Grid>
              {error && (
                <Alert severity="error" className=" mt-2">
                  {error}
                </Alert>
              )}
              <Button
                type="submit"
                variant="contained"
                sx={{
                  backgroundColor: "#ECAB21",
                  marginInline:"auto",
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
                Submit Application
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default FranchiseForm;