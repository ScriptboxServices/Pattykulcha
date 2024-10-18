"use client";

import React, { useEffect, useState } from "react";
import {
  Container,
  TextField,
  Button,
  MenuItem,
  Switch,
  FormControlLabel,
  Checkbox,
  Box,
  Grid,
  Typography,
  Snackbar,
  Alert,
  useMediaQuery,
  useTheme,
  Card,
  IconButton,
  Link,
} from "@mui/material";
import { styled } from "@mui/system";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  addDoc,
  collection,
  query,
  where,
  getDocs,
  Timestamp,
  doc,
} from "firebase/firestore";
import { db } from "@/firebase";
import { useAuthContext } from "@/context";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DirectionsBikeIcon from "@mui/icons-material/DirectionsBike";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import CircularLodar from "@/components/CircularLodar";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";

interface FormValues {
  jobType: string;
  name: string;
  contactNumber: string;
  permitType: string;
  licenseType?: string;
  availability: {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
  };
  acceptedTerms: boolean;
}

const StyledContainer = styled(Container)({
  width: "100%",
  padding: "2rem",
  backgroundColor: "#FAF3E0",
  textAlign: "center",
});

const AvailabilityGrid = styled(Grid)({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0.5rem 1rem",
  backgroundColor: "#ffffff",
  borderRadius: "8px",
  boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
  marginBottom: "1rem",
});

// Form validation schema using Yup
const schema = yup.object({
  name: yup.string().required("Name is required."),
  permitType: yup.string().required("Please select a permit type."),
  licenseType: yup.string(),
  availability: yup
    .object({
      monday: yup.boolean(),
      tuesday: yup.boolean(),
      wednesday: yup.boolean(),
      thursday: yup.boolean(),
      friday: yup.boolean(),
      saturday: yup.boolean(),
      sunday: yup.boolean(),
    })
    .test(
      "atLeastOneDay",
      "Please select at least one day of availability.",
      (value) => {
        return Object.values(value).some((day) => day);
      }
    ),
  acceptedTerms: yup
    .boolean()
    .oneOf([true], "You must accept the terms and conditions."),
});

const CareersPage: React.FC = () => {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("md"));

  const { user, metaData } = useAuthContext();
  const [showForm, setShowForm] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>("");

  const options = [
    {
      id: "Driver form",
      title: "Apply for driver",
      description: "Reach out to us and we will respond promptly.",
      icon: <DirectionsBikeIcon fontSize="large" />,
      jobType: "Driver",
      action: () => {
        setSelectedOption("Driver");
        setShowForm(true);
      },
    },
    {
      id: "Helper form",
      title: "Apply for helper",
      jobType: "Helper",
      description: "Contact us directly for immediate assistance.",
      icon: <RestaurantIcon fontSize="large" />,
      action: () => {
        setSelectedOption("Helper");
        setShowForm(true);
      },
    },
    {
      id: "Customer support form", // New option for customer support
      title: "Apply for customer support",
      jobType: "Customer Support",
      description: "We are here to help. Apply for our customer support role.",
      icon: <SupportAgentIcon fontSize="large" />, // Assuming you have a customer support icon like this
      action: () => {
        setSelectedOption("Customer Support");
        setShowForm(true);
      },
    },
  ];

  console.log(selectedOption);

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    trigger,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      jobType: "Driver",
      name: "",
      contactNumber: "",
      permitType: "",
      licenseType: "",
      availability: {
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
        sunday: false,
      },
      acceptedTerms: false,
    },
  });

  useEffect(() => {
    if (metaData) {
      setValue("name", metaData.name || "");
      setValue("contactNumber", metaData.phoneNumber || "");
    }
  }, [metaData, selectedOption]);

  const [success, setSuccess] = useState({
    status: false,
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setSuccess({
      status: false,
      message: "",
    });
    try {
      setLoading(true);
      const careerDocRef = doc(db, "careers", metaData?.phoneNumber);
      const driversCollectionRef = collection(careerDocRef, selectedOption);

      const querySnapshot = await getDocs(driversCollectionRef);
      const driversList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      if (driversList.length !== 0) {
        setSuccess({
          status: true,
          message: "You are already applied for this position.",
        });
        return;
      }

      await addDoc(driversCollectionRef, {
        userId: metaData?.id,
        phoneNumber: data?.contactNumber,
        createdAt: Timestamp.now(),
        acceptedTerms: data.acceptedTerms,
        availability: data.availability,
        permitType: data.permitType,
        licenseType: data.licenseType,
        name: data?.name,
      });
      setSuccess({
        status: true,
        message: "Your application is submitted successfully.",
      });
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
      reset({
        permitType: "",
        licenseType: "",
        availability: {
          monday: false,
          tuesday: false,
          wednesday: false,
          thursday: false,
          friday: false,
          saturday: false,
          sunday: false,
        },
        acceptedTerms: false,
      });
    }
  };

  return (
    <Box sx={{ backgroundColor: "#FAF3E0", paddingY: 8, minHeight: "100dvh" }}>
      <CircularLodar isLoading={loading} />
      <Typography
        variant={"h4"}
        sx={{
          marginBottom: "1rem",
          textAlign: {xs:"left",sm:"center"},
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontWeight: 700,
          ml:2,
        }}
      >
        Build your career with Patty kulcha
      </Typography>
      <StyledContainer>
        <Container
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "auto",
          }}
        >
          {!showForm && (
            <>
              <Card
                sx={{
                  backgroundColor: "#fff",
                  border: "none",
                  boxShadow: "none",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#FAF3E0",
                    // paddingY: 2,
                  }}
                >
                  <Grid
                    container
                    spacing={2}
                    justifyContent="center"
                    flexDirection="row"
                  >
                    {options.map((option) => (
                      <Grid item xs={12} sm={5} md={4} key={option.id}>
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
                            setSuccess({
                              status: false,
                              message: "",
                            });
                            reset({
                              permitType: "",
                              licenseType: "",
                              availability: {
                                monday: false,
                                tuesday: false,
                                wednesday: false,
                                thursday: false,
                                friday: false,
                                saturday: false,
                                sunday: false,
                              },
                              acceptedTerms: false,
                            });
                          }}
                        >
                          <IconButton
                            sx={{
                              backgroundColor:
                                selectedOption === option.id
                                  ? "#3f51b5"
                                  : "#ECAB21",
                              color: "white",
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
        </Container>

        {showForm && (
          <Box
            sx={{ background: "#fff", p: 4, maxWidth: "750px", margin: "auto" }}
          >
            <Box sx={{ display: "flex" }}>
              <Link
                onClick={() => setShowForm(false)}
                underline="none"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 2,
                  cursor: "pointer",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: "50%", // Makes the box circular
                    border: "1px solid #E0E0E0", // Light gray border
                    width: 28, // Circle size
                    height: 28, // Circle size
                  }}
                >
                  <ArrowBackIcon sx={{ fontSize: 17, color: "#ffbb00" }} />
                </Box>
              </Link>
              <Typography
                variant={isLargeScreen ? "h4" : "h5"}
                style={{
                  marginBottom: "1rem",
                  textAlign: "center",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontWeight: 600,
                  flex: "1 1",
                }}
              >
                Apply for {selectedOption}
              </Typography>
            </Box>

            <form onSubmit={handleSubmit(onSubmit)}>
              <Controller
                name="jobType"
                control={control}
                render={({ field }) => (
                  <TextField
                    fullWidth
                    label="Job Type"
                    {...field}
                    value={selectedOption}
                    margin="normal"
                    variant="outlined"
                    disabled
                  />
                )}
              />

              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    // key={field.value}
                    fullWidth
                    label="Name"
                    {...field}
                    margin="normal"
                    variant="outlined"
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />

              <Controller
                name="contactNumber"
                control={control}
                render={({ field }) => (
                  <TextField
                    // key={field.value}
                    fullWidth
                    disabled
                    placeholder="Contact Number"
                    {...field}
                    margin="normal"
                    variant="outlined"
                  />
                )}
              />

              <Controller
                name="permitType"
                control={control}
                render={({ field }) => (
                  <TextField
                    fullWidth
                    select
                    label="Select Permit Type"
                    {...field}
                    margin="normal"
                    variant="outlined"
                    error={!!errors.permitType}
                    helperText={errors.permitType?.message}
                  >
                    <MenuItem value="study">Study Permit</MenuItem>
                    <MenuItem value="work">Work Permit</MenuItem>
                    <MenuItem value="Permanent Residence">
                      Permanent Residence
                    </MenuItem>
                    <MenuItem value="Citizen">Citizen</MenuItem>
                  </TextField>
                )}
              />

              {selectedOption === "Driver" && (
                <Controller
                  name="licenseType"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      fullWidth
                      select
                      label="Select License Type"
                      {...field}
                      margin="normal"
                      variant="outlined"
                      error={!!errors.licenseType}
                      helperText={errors.licenseType?.message}
                    >
                      <MenuItem value="G2">G2</MenuItem>
                      <MenuItem value="G">G</MenuItem>
                      <MenuItem value="AZ">AZ</MenuItem>
                    </TextField>
                  )}
                />
              )}

              <Box my={2} style={{ marginBottom: "1.5rem" }}>
                <Typography
                  variant="h6"
                  style={{ textAlign: "center", marginBottom: "1rem" }}
                >
                  Your Availability
                </Typography>
                <Controller
                  name="availability"
                  control={control}
                  render={({ field }) => (
                    <>
                      {Object.keys(field.value).map((day) => (
                        <AvailabilityGrid key={day} container>
                          <Grid item>
                            {day.charAt(0).toUpperCase() + day.slice(1)}
                          </Grid>
                          <Grid item>
                            <Switch
                              checked={
                                field.value[
                                  day as keyof FormValues["availability"]
                                ]
                              }
                              onChange={() => {
                                setValue(
                                  `availability.${day}` as keyof FormValues,
                                  !field.value[
                                    day as keyof FormValues["availability"]
                                  ]
                                );
                                trigger(`availability.${day}` as any);
                              }}
                              color="primary"
                            />
                          </Grid>
                        </AvailabilityGrid>
                      ))}
                    </>
                  )}
                />
                {errors.availability && (
                  <Typography color="error">
                    {errors.availability.message}
                  </Typography>
                )}
              </Box>
              <Controller
                name="acceptedTerms"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        {...field}
                        color="primary"
                        checked={field.value}
                      />
                    }
                    label="I accept the terms and condition & privacy policy"
                  />
                )}
              />
              {errors.acceptedTerms && (
                <Typography color="error">
                  {errors.acceptedTerms.message}
                </Typography>
              )}

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
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
                Submit
              </Button>
              {Boolean(Object.keys(errors).length) && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  Please correct the highlighted errors.
                </Alert>
              )}
              {success?.status && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  {success?.message}
                </Alert>
              )}
            </form>
          </Box>
        )}
      </StyledContainer>
    </Box>
  );
};

export default CareersPage;
