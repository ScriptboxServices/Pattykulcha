"use client";

import React, { useRef, ChangeEvent } from "react";
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
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ClearIcon from "@mui/icons-material/Clear";
import { styled } from "@mui/system";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FormValues } from "@/context/types";

const StyledContainer = styled(Container)({
  padding: "2rem",
  backgroundColor: "white",
  borderRadius: "8px",
  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
  textAlign: "center",
});

const StyledButton = styled(Button)({
  border: "2px dashed #ccc",
  color: "#777",
  padding: "1rem",
  textTransform: "none",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
});

const FileDisplay = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
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

const MAX_FILE_SIZE_MB = 3;
const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "application/pdf",
];


// Define Yup schema for form validation
const schema = yup.object({
  permitType: yup.string().required("Please select a permit type."),
  licenseType: yup.string().required("Please select a license type."),
  drivingLicense: yup
    .mixed()
    .required("Please upload your driving license.")
    .test("fileSize", "File size should not exceed 3 MB", (file: any) => {
      return !file || file.size <= MAX_FILE_SIZE_MB * 1024 * 1024;
    })
    .test(
      "fileType",
      "Only JPG, PNG, and PDF files are allowed.",
      (file: any) => {
        return !file || ALLOWED_FILE_TYPES.includes(file.type);
      }
    ),
  carInsurance: yup
    .mixed()
    .required("Please upload your car insurance.")
    .test("fileSize", "File size should not exceed 3 MB", (file: any) => {
      return !file || file.size <= MAX_FILE_SIZE_MB * 1024 * 1024;
    })
    .test(
      "fileType",
      "Only JPG, PNG, and PDF files are allowed.",
      (file: any) => {
        return !file || ALLOWED_FILE_TYPES.includes(file.type);
      }
    ),
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

const DriverPage: React.FC = () => {
  const drivingLicenseInputRef = useRef<HTMLInputElement>(null);
  const carInsuranceInputRef = useRef<HTMLInputElement>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
  } = useForm<FormValues>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      permitType: "",
      licenseType: "",
      drivingLicense: null,
      carInsurance: null,
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

  const onSubmit = (data: FormValues) => {
    console.log("Form Data:", data);
  };

  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    setField: (file: File | null) => void
  ) => {
    const file = e.target.files?.[0] || null;
    setField(file);
    trigger();
  };

  return (
    <Box sx={{ backgroundColor: "#FAF3E0", paddingY: 8, minHeight: "100vh" }}>
      <StyledContainer maxWidth="sm">
        <Typography variant="h5" style={{ marginBottom: "1rem" }}>
          Drive With Pattykulcha
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
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

          <Controller
            name="drivingLicense"
            control={control}
            render={({ field }) => (
              <Box my={1.23}>
                <StyledButton
                  variant="outlined"
                  startIcon={<CloudUploadIcon />}
                  fullWidth
                  onClick={() => drivingLicenseInputRef.current?.click()}
                >
                  {field.value ? (
                    <FileDisplay>
                      <span>{(field.value as File).name}</span>
                      <IconButton
                        onClick={() => {
                          setValue("drivingLicense", null);
                          trigger("drivingLicense");
                        }}
                      >
                        <ClearIcon />
                      </IconButton>
                    </FileDisplay>
                  ) : (
                    "Click to upload driving license"
                  )}
                </StyledButton>
                <input
                  type="file"
                  ref={drivingLicenseInputRef}
                  hidden
                  onChange={(e) =>
                    handleFileChange(e, (file) =>
                      setValue("drivingLicense", file)
                    )
                  }
                />
                {errors.drivingLicense && (
                  <Typography color="error">
                    {errors.drivingLicense.message}
                  </Typography>
                )}
              </Box>
            )}
          />

          <Controller
            name="carInsurance"
            control={control}
            render={({ field }) => (
              <Box my={1.23}>
                <StyledButton
                  variant="outlined"
                  startIcon={<CloudUploadIcon />}
                  fullWidth
                  onClick={() => carInsuranceInputRef.current?.click()}
                >
                  {field.value ? (
                    <FileDisplay>
                      <span>{(field.value as File).name}</span>
                      <IconButton
                        onClick={() => {
                          setValue("carInsurance", null);
                          trigger("carInsurance");
                        }}
                      >
                        <ClearIcon />
                      </IconButton>
                    </FileDisplay>
                  ) : (
                    "Click to upload car insurance"
                  )}
                </StyledButton>
                <input
                  type="file"
                  ref={carInsuranceInputRef}
                  hidden
                  onChange={(e) =>
                    handleFileChange(e, (file) =>
                      setValue("carInsurance", file)
                    )
                  }
                />
                {errors.carInsurance && (
                  <Typography color="error">
                    {errors.carInsurance.message}
                  </Typography>
                )}
              </Box>
            )}
          />
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
                            field.value[day as keyof FormValues["availability"]]
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
                control={<Checkbox {...field} color="primary" />}
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
        </form>

        {errors && (
          <Snackbar
            open={Boolean(Object.keys(errors).length)}
            autoHideDuration={6000}
          >
            <Alert severity="error">
              Please correct the highlighted errors.
            </Alert>
          </Snackbar>
        )}
      </StyledContainer>
    </Box>
  );
};

export default DriverPage;
