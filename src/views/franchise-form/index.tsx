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
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context";
import CircularLodar from "@/components/CircularLodar";
import { Close } from "@mui/icons-material";

// Define the Yup schema
const schema = yup.object().shape({
  fullName: yup.string().required("Name is required"),
  phoneNumber: yup
    .string()
    .matches(/^\d+$/, "Phone number is not valid")
    .min(10, "Phone number must be at least 10 digits")
    .required("Phone number is required"),
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  statusInCanada: yup
    .string()
    .oneOf(["Work Permit"], "Please select a valid status in Canada")
    .required("Status in Canada is required"),
  workPermitExpiry: yup.date(),

  hasFoodTrucks: yup
    .string()
    .oneOf(["Yes", "No"], "Please select Yes or No")
    .required("Please indicate if you have food trucks"),
  document: yup
    .mixed<File>()
    .required("Please attach a relevant document")
    .test(
      "fileSize",
      "The file is too large",
      (value) => !value || (value && value.size <= 2000000)
    ), // 2MB limit
});

type IFormInput = yup.InferType<typeof schema>;

const FranchiseForm: React.FC = () => {
  const [selectedDocument, setSelectedDocument] = useState<File | null>(null);
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: yupResolver(schema),
  });

  const { user } = useAuthContext();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const statusInCanada = watch("statusInCanada");

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
          pb: 2,
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
            m: { xs: 2 },
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
                        label="Name"
                        error={!!errors.fullName}
                        helperText={errors.fullName?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="phoneNumber"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        required
                        fullWidth
                        type="tel"
                        label="Phone Number"
                        error={!!errors.phoneNumber}
                        helperText={errors.phoneNumber?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        required
                        fullWidth
                        type="email"
                        label="Email"
                        error={!!errors.email}
                        helperText={errors.email?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="statusInCanada"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        required
                        fullWidth
                        label="Status in Canada"
                        error={!!errors.statusInCanada}
                        helperText={errors.statusInCanada?.message}
                      />
                    )}
                  />
                </Grid>
                {statusInCanada === "Work Permit" && (
                  <Grid item xs={12}>
                    <Controller
                      name="workPermitExpiry"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          required
                          fullWidth
                          label="Work Permit Expiry"
                          type="date"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          InputProps={{
                            inputProps: {
                              min: new Date().toISOString().split("T")[0], // Ensures no dates before today
                            },
                          }}
                          error={!!errors.workPermitExpiry}
                          helperText={errors.workPermitExpiry?.message}
                        />
                      )}
                    />
                  </Grid>
                )}
                <Grid item xs={12}>
                  <Controller
                    name="hasFoodTrucks"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth error={!!errors.hasFoodTrucks}>
                        <InputLabel>Do you have food trucks?</InputLabel>
                        <Select {...field} label="Do you have food trucks?">
                          <MenuItem value="Yes">Yes</MenuItem>
                          <MenuItem value="No">No</MenuItem>
                        </Select>
                        {errors.hasFoodTrucks && (
                          <Typography variant="body2" color="error">
                            {errors.hasFoodTrucks.message}
                          </Typography>
                        )}
                      </FormControl>
                    )}
                  />
                </Grid>
              </Grid>
              {error && (
                <Alert severity="error" className=" mt-2">
                  {error}
                </Alert>
              )}
              <Box sx={{ textAlign: "center", mt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    backgroundColor: "#ECAB21",
                    color: "white",
                    paddingX: 4,
                    paddingY: 1,
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
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default FranchiseForm;
