"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  IconButton,
  Grid,
  Container,
  TextField,
  InputAdornment,
} from "@mui/material";
import { useRouter } from "next/navigation";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ClearIcon from "@mui/icons-material/Clear";
import { useMenuContext } from "@/context";
import { encrypt } from "@/utils/commonFunctions";

interface Props {
  selectedOption: string;
  pickupTime: string;
  kitchen: any;
}

const TipPage: React.FC<Props> = ({ selectedOption, pickupTime, kitchen }) => {
  const router = useRouter();
  const [selectedTip, setSelectedTip] = useState<number | null>(0);
  const [customTip, setCustomTip] = useState<number | null>(null);
  const [isCustomTipSelected, setIsCustomTipSelected] = useState(false);
  const [customTipError, setCustomTipError] = useState(false); // State for error

  const tipOptions = [0, 1, 2, 3, 4, 5];

  const handleTipSelection = (tip: number) => {
    setIsCustomTipSelected(false);
    setSelectedTip(tip);
    setCustomTip(null);
    setCustomTipError(false); // Reset error on tip selection
  };

  const handleCustomTipClick = () => {
    setIsCustomTipSelected(true);
    setCustomTip(null);
    setSelectedTip(null);
    setCustomTipError(false); // Reset error when custom tip is clicked
  };

  const handleCustomTipChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value);
    if (!isNaN(value) && value >= 0) {
      setCustomTip(value);
      setCustomTipError(false); // Clear error if value is valid
    } else {
      setCustomTip(null);
    }
  };

  const clearCustomTip = () => {
    setCustomTip(null);
    setIsCustomTipSelected(false);
    setSelectedTip(0); // Set the selected tip to 0
    setCustomTipError(false); // Clear error when clearing the custom tip
  };
  
  const { grandTotal } = useMenuContext();

  const proceedToPayment = () => {
    if (isCustomTipSelected && customTip === null) {
      setCustomTipError(true); // Show error if custom tip is selected but empty
    } else {
      router.push(
        `/payment/${encodeURIComponent(
          encrypt({
            tip:
              isCustomTipSelected && customTip
                ? customTip.toFixed(2) 
                : selectedTip?.toFixed(2),
            pickupTime,
            selectedOption,
            kitchen,
          })
        )}`
      );
    }
  };

  return (
    <Box
      sx={{
        padding: 2,
        backgroundColor: "#FAF3E0",
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Container maxWidth="sm">
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <IconButton
            onClick={() => {
              router.back();
            }}
          >
            <ArrowBackIcon sx={{ fontSize: 20, color: "black" }} />
          </IconButton>
          <Typography
            variant="body1"
            sx={{ ml: 1, fontWeight: 600, color: "black" }}
          >
            Back to Cart
          </Typography>
        </Box>

        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
            Add a tip
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
            100% of your tip goes to your courier. Tips are based on your order
            total of <strong>${grandTotal}</strong> before any discounts or
            promotions.
            <InfoOutlinedIcon
              fontSize="small"
              sx={{ verticalAlign: "middle", ml: 0.5 }}
            />
          </Typography>
        </Box>

        <Box sx={{ textAlign: "center", mb: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
            Tip amount: $
            {isCustomTipSelected
              ? customTip ? customTip.toFixed(2) : '0.00'
              : selectedTip?.toFixed(2)}
          </Typography>

          {/* Tip buttons in one row */}
          <Grid
            container
            spacing={2}
            justifyContent="center"
            sx={{ flexWrap: "nowrap" }}
          >
            {tipOptions.map((tip) => (
              <Grid item key={tip} xs={2}>
                <Button
                  variant={selectedTip === tip ? "contained" : "outlined"}
                  onClick={() => handleTipSelection(tip)}
                  sx={{
                    width: "100%",
                    height: 40,
                    minWidth: "40px",
                    borderRadius: "20px",
                    backgroundColor: selectedTip === tip ? "#ECAB21" : "#fff",
                    color: selectedTip === tip ? "#fff" : "#000",
                    border: selectedTip === tip ? "none" : "1px solid #ccc",
                    "&:hover": {
                      backgroundColor:
                        selectedTip === tip ? "#ECAB21" : "#f5f5f5",
                      color: selectedTip === tip ? "#fff" : "#000",
                    },
                  }}
                >
                  ${tip}
                </Button>
              </Grid>
            ))}
          </Grid>

          {/* Custom tip displayed on the next line */}
          <Grid container justifyContent="center" sx={{ mt: 2 }}>
            <Grid item xs={12}>
              <Typography
                variant="body1"
                sx={{
                  textAlign: "right",
                  fontWeight: "bold",
                  color: "black",
                  textDecoration: "underline",
                  cursor: "pointer",
                  width: "100%",
                  "&:hover": {
                    textDecoration: "underline",
                    color: "black",
                  },
                }}
                onClick={handleCustomTipClick}
              >
                Custom tip
              </Typography>
            </Grid>
          </Grid>

          {/* Custom tip input */}
          {isCustomTipSelected && (
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                type="tel"
                label="Enter custom tip amount"
                value={customTip !== null ? customTip : ''}
                onChange={handleCustomTipChange}
                InputProps={{
                  inputProps: { min: 0 },
                  inputMode: "numeric",
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={clearCustomTip}>
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mt: 2, background: "#fff" }}
                error={customTipError} // Show error if custom tip is empty
                helperText={customTipError ? "Custom tip cannot be empty" : ""}
              />
            </Box>
          )}
        </Box>

        <Button
          onClick={proceedToPayment}
          variant="contained"
          fullWidth
          sx={{
            padding: 1,
            mt: 2,
            borderRadius:"25px",
            backgroundColor: "#ECAB21",
            color: "white",
            marginTop: "0.5rem",
            fontWeight: "bold",
            "&:hover": {
              backgroundColor: "#FFC107",
              color: "white",
            },
          }}
        >
          Proceed to Payment
        </Button>
      </Container>
    </Box>
  );
};

export default TipPage;
