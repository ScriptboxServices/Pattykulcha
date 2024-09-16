"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
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
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/system";
import { AvailabilityState } from "@/context/types";

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

const DriverPage: React.FC = () => {
  const [permitType, setPermitType] = useState<string>("");
  const [licenseType, setLicenseType] = useState<string>("");
  const [drivingLicense, setDrivingLicense] = useState<File | null>(null);
  const [carInsurance, setCarInsurance] = useState<File | null>(null);
  const [availability, setAvailability] = useState<AvailabilityState>({
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
  });
  const [acceptedTerms, setAcceptedTerms] = useState<boolean>(false);

  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    setFile: React.Dispatch<React.SetStateAction<File | null>>
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleAvailabilityChange = (day: keyof AvailabilityState) => {
    setAvailability({ ...availability, [day]: !availability[day] });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
  };

  return (
    <Box sx={{ backgroundColor: "#FAF3E0",paddingY:8,minHeight:"100dvh" }}>
      <StyledContainer maxWidth="sm">
        <Typography variant="h5" style={{ marginBottom: "1rem" }}>
          Drive With Pattykulcha
        </Typography>

        <TextField
          fullWidth
          select
          label="Select Permit Type"
          value={permitType}
          onChange={(e) => setPermitType(e.target.value as string)}
          margin="normal"
          variant="outlined"
        >
          <MenuItem value="study">Study Permit</MenuItem>
          <MenuItem value="work">Work Permit</MenuItem>
          <MenuItem value="Permanent Residence">Permanent Residence</MenuItem>
          <MenuItem value="Citizen">Citizen</MenuItem>
        </TextField>

        <TextField
          fullWidth
          select
          label="Select License Type"
          value={licenseType}
          onChange={(e) => setLicenseType(e.target.value as string)}
          margin="normal"
          variant="outlined"
        >
          <MenuItem value="G2">G2</MenuItem>
          <MenuItem value="G">G</MenuItem>
          <MenuItem value="AZ">AZ</MenuItem>
        </TextField>

        <Box my={1.23}>
          <StyledButton
            variant="outlined"
            startIcon={<CloudUploadIcon />}
            fullWidth
            style={{ marginBottom: "1rem" }}
          >
            {drivingLicense
              ? drivingLicense.name
              : "Click to upload driving license"}
            <input
              type="file"
              hidden
              onChange={(e) => handleFileChange(e, setDrivingLicense)}
            />
          </StyledButton>

          <StyledButton
            variant="outlined"
            startIcon={<CloudUploadIcon />}
            fullWidth
          >
            {carInsurance ? carInsurance.name : "Click to upload car insurance"}
            <input
              type="file"
              hidden
              onChange={(e) => handleFileChange(e, setCarInsurance)}
            />
          </StyledButton>
        </Box>

        <Box my={2} style={{ marginBottom: "1.5rem" }}>
          <Typography variant="h6" style={{ textAlign: "center",marginBottom:"1rem" }}>
            Your Availability
          </Typography>
          {Object.keys(availability).map((day) => (
            <AvailabilityGrid key={day} container>
              <Grid item>{day.charAt(0).toUpperCase() + day.slice(1)}</Grid>
              <Grid item>
                <Switch
                  checked={availability[day as keyof AvailabilityState]}
                  onChange={() =>
                    handleAvailabilityChange(day as keyof AvailabilityState)
                  }
                  color="primary"
                />
              </Grid>
            </AvailabilityGrid>
          ))}
        </Box>

        <FormControlLabel
          control={
            <Checkbox
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              color="primary"
            />
          }
          label="I accept the terms and condition & privacy policy"
          style={{ marginBottom: "1.5rem" }}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleSubmit}
          // disabled={!acceptedTerms}
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
      </StyledContainer>
    </Box>
  );
};

export default DriverPage;
