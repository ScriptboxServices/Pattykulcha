"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  List,
  ListItem,
  Grid,
  Box,
  IconButton,
  Button,
  InputAdornment,
} from "@mui/material";
import { Person, Phone, Email, DirectionsCar } from "@mui/icons-material";

// Dummy user data
const dummyUserData = {
  name: "John Doe",
  phone: "123-456-7890",
  email: "johndoe@example.com",
  vehicleDetails: "Toyota Prius - 2020",
};

const DriverProfilePage: React.FC = () => {
  // State hooks for managing the input fields
  const [name, setName] = useState<string>(dummyUserData.name);
  const [phone, setPhone] = useState<string>(dummyUserData.phone);
  const [email, setEmail] = useState<string>(dummyUserData.email);
  const [vehicleDetails, setVehicleDetails] = useState<string>(
    dummyUserData.vehicleDetails
  );

  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [isEditingEmail, setIsEditingEmail] = useState<boolean>(false);
  const [isEditingPhone, setIsEditingPhone] = useState<boolean>(false);
  const [isEditingVehicleDetails, setIsEditingVehicleDetails] =
    useState<boolean>(false);

  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const vehicleInputRef = useRef<HTMLInputElement>(null);

  const handleNameEdit = () => {
    setIsEditingName((prev) => !prev);
    if (!isEditingName) {
      setTimeout(() => {
        nameInputRef.current?.focus();
      }, 0);
    }
  };

  const handleEmailEdit = () => {
    setIsEditingEmail((prev) => !prev);
    if (!isEditingEmail) {
      setTimeout(() => {
        emailInputRef.current?.focus();
      }, 0);
    }
  };

  const handlePhoneEdit = () => {
    setIsEditingPhone((prev) => !prev);
    if (!isEditingPhone) {
      setTimeout(() => {
        phoneInputRef.current?.focus();
      }, 0);
    }
  };

  const handleVehicleDetailsEdit = () => {
    setIsEditingVehicleDetails((prev) => !prev);
    if (!isEditingVehicleDetails) {
      setTimeout(() => {
        vehicleInputRef.current?.focus();
      }, 0);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        height: "auto",
        pt: { xs: 6, xl: 8 },
        pb: { xs: 6, xl: 8 },
        alignItem: "center",
        background: "#FAF3E0",
        minHeight: { xs: "100%", xl: "100d%" },
      }}
    >
      <Grid
        container
        spacing={4}
        maxWidth="md"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              width: {
                xs: "90%",
                sm: "85%",
                md: "100%",
              },
              margin: "0 auto",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mb: 2, // Adds margin below the title
              }}
            >
              <Typography
                variant="h4"
                component="h2"
                gutterBottom
                sx={{ fontWeight: "bold" }}
              >
                Driver Profile
              </Typography>
            </Box>
            <Card
              sx={{
                borderRadius: "20px",
              }}
            >
              <CardContent>
                <List>
                  <ListItem>
                    <TextField
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      fullWidth
                      variant="outlined"
                      size="small"
                      sx={{
                        borderRadius: "10px",
                        height: "56px",
                        "& .MuiOutlinedInput-root": {
                          height: "100%",
                        },
                      }}
                      inputRef={nameInputRef}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person
                              sx={{
                                background: "black",
                                color: "white",
                                borderRadius: "50%",
                                fontSize: "32px",
                                padding: "6px",
                                mr: 1,
                              }}
                            />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={handleNameEdit} sx={{ ml: 1 }}>
                              <Typography
                                sx={{
                                  cursor: "pointer",
                                  color: "black",
                                  textDecoration: "underline",
                                  ml: 1,
                                  fontSize: "14px",
                                }}
                              >
                                {isEditingName ? "Save" : "Edit"}
                              </Typography>
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      disabled={!isEditingName}
                    />
                  </ListItem>
                  <ListItem>
                    <TextField
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      fullWidth
                      variant="outlined"
                      size="small"
                      sx={{
                        height: "56px",
                        "& .MuiOutlinedInput-root": {
                          height: "100%",
                        },
                      }}
                      inputRef={phoneInputRef}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Phone
                              sx={{
                                background: "black",
                                color: "white",
                                borderRadius: "50%",
                                fontSize: "32px",
                                padding: "6px",
                                mr: 1,
                              }}
                            />
                          </InputAdornment>
                        )
                      }}
                      disabled
                    />
                  </ListItem>

                  <ListItem>
                    <TextField
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      fullWidth
                      variant="outlined"
                      size="small"
                      sx={{
                        height: "56px",
                        "& .MuiOutlinedInput-root": {
                          height: "100%",
                        },
                      }}
                      inputRef={emailInputRef}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email
                              sx={{
                                background: "black",
                                color: "white",
                                borderRadius: "50%",
                                fontSize: "32px",
                                padding: "6px",
                                mr: 1,
                              }}
                            />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={handleEmailEdit} sx={{ ml: 1 }}>
                              <Typography
                                sx={{
                                  cursor: "pointer",
                                  color: "black",
                                  textDecoration: "underline",
                                  ml: 1,
                                  fontSize: "14px",
                                }}
                              >
                                {isEditingEmail ? "Save" : "Edit"}
                              </Typography>
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      disabled={!isEditingEmail}
                    />
                  </ListItem>

                  <ListItem>
                    <TextField
                      value={vehicleDetails}
                      onChange={(e) => setVehicleDetails(e.target.value)}
                      fullWidth
                      variant="outlined"
                      size="small"
                      sx={{
                        height: "56px",
                        "& .MuiOutlinedInput-root": {
                          height: "100%",
                        },
                      }}
                      inputRef={vehicleInputRef}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <DirectionsCar
                              sx={{
                                background: "black",
                                color: "white",
                                borderRadius: "50%",
                                fontSize: "32px",
                                padding: "6px",
                                mr: 1,
                              }}
                            />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={handleVehicleDetailsEdit}
                              sx={{ ml: 1 }}
                            >
                              <Typography
                                sx={{
                                  cursor: "pointer",
                                  color: "black",
                                  textDecoration: "underline",
                                  ml: 1,
                                  fontSize: "14px",
                                }}
                              >
                                {isEditingVehicleDetails ? "Save" : "Edit"}
                              </Typography>
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      disabled={!isEditingVehicleDetails}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DriverProfilePage;