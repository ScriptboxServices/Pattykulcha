"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Container,
  Link,
  ToggleButtonGroup,
  ToggleButton,
  TextField,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import SaveIcon from "@mui/icons-material/Save";

const OrderPage: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState("delivery");
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isEditingInstructions, setIsEditingInstructions] = useState(false);
  const [address, setAddress] = useState("123 Delivery St, Apt 4B");
  const [instructions, setInstructions] = useState("Leave at the door.");

  const handleOptionChange = (
    event: React.MouseEvent<HTMLElement>,
    newOption: string | null
  ) => {
    if (newOption) {
      setSelectedOption(newOption);
    }
  };

  const handleEditClick = (field: string) => {
    if (field == "address") {
      setIsEditingAddress(true);
    } else if (field == "instructions") {
      setIsEditingInstructions(true);
    }
  };

  const handleSaveClick = (field: string) => {
    if (field == "address") {
      setIsEditingAddress(false);
    } else if (field == "instructions") {
      setIsEditingInstructions(false);
    }
  };

  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(event.target.value);
  };

  const handleInstructionsChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setInstructions(event.target.value);
  };

  return (
    <Box
      sx={{
        backgroundImage: "url('/images/checkout/checkout1.png')",
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}
    >
      <Container maxWidth="md">
        <Paper
          sx={{
            p: 4,
            backgroundColor: "white",
            borderRadius: 4,
            boxShadow: 3,
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
          }}
        >
          <Box sx={{ width: { xs: "100%", md: "50%" }, mb: { xs: 4, md: 0 } }}>
            <Link
              href="#"
              underline="none"
              sx={{ display: "flex", alignItems: "center", mb: 3 }}
            >
              <ArrowBackIcon sx={{ fontSize: 20, color: "#162548" }} />
              <Typography
                variant="body1"
                sx={{ ml: 1, fontWeight: 600, color: "#162548" }}
              >
                Back To Menu
              </Typography>
            </Link>

            <Typography
              variant="h3"
              component="h1"
              sx={{ fontWeight: 700, color: "#162548", mb: 3 }}
            >
              YOUR
              <br />
              ORDER
            </Typography>

            <ToggleButtonGroup
              value={selectedOption}
              exclusive
              onChange={handleOptionChange}
              sx={{
                mb: 3,
                "& .MuiToggleButton-root": {
                  borderRadius: 50,
                  px: 3,
                  py: 1,
                  border: "none",
                  "&.Mui-selected": {
                    backgroundColor: "#F59E0B",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#F59E0B",
                    },
                  },
                },
              }}
            >
              <ToggleButton value="delivery">
                <LocalShippingIcon sx={{ mr: 1 }} />
                Delivery
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <Box sx={{ width: { xs: "100%", md: "50%" } }}>
            {selectedOption == "delivery" && (
              <Box>
                <Box sx={{ mb: 2 }}>
                  {isEditingAddress ? (
                    <Box display="flex" alignItems="center">
                      <TextField
                        fullWidth
                        variant="outlined"
                        value={address}
                        onChange={handleAddressChange}
                        sx={{ mr: 2 }}
                      />
                      <IconButton onClick={() => handleSaveClick("address")}>
                        <SaveIcon sx={{ color: "#6B7280" }} />
                      </IconButton>
                    </Box>
                  ) : (
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      Address: {address}
                      <IconButton onClick={() => handleEditClick("address")}>
                        <EditIcon sx={{ color: "#6B7280" }} />
                      </IconButton>
                    </Typography>
                  )}
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body1" color="text.secondary">
                    Delivery Time: 30 To 45 Minutes
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  {isEditingInstructions ? (
                    <Box display="flex" alignItems="center">
                      <TextField
                        fullWidth
                        variant="outlined"
                        value={instructions}
                        onChange={handleInstructionsChange}
                        sx={{ mr: 2 }}
                      />
                      <IconButton
                        onClick={() => handleSaveClick("instructions")}
                      >
                        <SaveIcon sx={{ color: "#6B7280" }} />
                      </IconButton>
                    </Box>
                  ) : (
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      Special Instructions: {instructions}
                      <IconButton
                        onClick={() => handleEditClick("instructions")}
                      >
                        <EditIcon sx={{ color: "#6B7280" }} />
                      </IconButton>
                    </Typography>
                  )}
                </Box>
              </Box>
            )}

            
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default OrderPage;
