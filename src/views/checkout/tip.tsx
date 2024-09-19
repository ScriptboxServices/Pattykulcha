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
} from "@mui/material";
import { useRouter } from "next/navigation";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { calculateGrandTotal, useMenuContext } from "@/context";
import { encrypt } from "@/utils/commonFunctions";

const TipPage: React.FC = () => {
  const router = useRouter();
  const [selectedTip, setSelectedTip] = useState<number | null>(0);
  const [customTip, setCustomTip] = useState<number | null>(null);
  const [isCustomTipSelected, setIsCustomTipSelected] = useState(false);

  const tipOptions = [0, 15, 20, 30];

  const handleTipSelection = (tip: number) => {
    setIsCustomTipSelected(false);
    setSelectedTip(tip);
    setCustomTip(null); // Clear custom tip amount when a percentage is selected
  };

  const handleCustomTipClick = () => {
    setIsCustomTipSelected(true); 
    if (isCustomTipSelected) {
      setCustomTip(null);
    }
    setSelectedTip(null);
  };

  const handleCustomTipChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseFloat(event.target.value);
    setCustomTip(!isNaN(value) ? value : null);
  };

  const { grandTotal } = useMenuContext();
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
            100% of your tip goes to your courier. Tips are based on your order total of <strong>${grandTotal}</strong> before any discounts or promotions.
            <InfoOutlinedIcon
              fontSize="small"
              sx={{ verticalAlign: "middle", ml: 0.5 }}
            />
          </Typography>
        </Box>

        {/* Tip Options */}
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Typography variant="body1" sx={{ mb: 1, fontWeight: "bold" }}>
            Tip amount: $
            {isCustomTipSelected && customTip
              ? customTip.toFixed(2)
              : ((Number(grandTotal) * (selectedTip || 0)) / 100).toFixed(2)}
          </Typography>
          <Grid
            container
            spacing={2}
            justifyContent="center"
            sx={{ flexWrap: "wrap" }}
          >
            {tipOptions.map((tip) => (
              <Grid item key={tip} xs={3}>
                <Button
                  variant={selectedTip === tip ? "contained" : "outlined"}
                  onClick={() => handleTipSelection(tip)}
                  sx={{
                    width: "100%",
                    height: 40,
                    borderRadius: "20px",
                    backgroundColor: selectedTip === tip ? "#000" : "#fff",
                    color: selectedTip === tip ? "#fff" : "#000",
                    border: selectedTip === tip ? "none" : "1px solid #ccc",
                    "&:hover": {
                      backgroundColor: selectedTip === tip ? "#333" : "#f5f5f5",
                      color: selectedTip === tip ? "#fff" : "#000",
                    },
                  }}
                >
                  {tip}%
                </Button>
              </Grid>
            ))}
            <Grid item xs={12}>
              <Button
                variant={isCustomTipSelected ? "contained" : "text"}
                color="success"
                sx={{
                  height: 40,
                  borderRadius: "20px",
                  padding: "0 10px",
                  fontWeight: "bold",
                  backgroundColor: isCustomTipSelected ? "#000" : "#fff",
                  color: isCustomTipSelected ? "#fff" : "#ECAB21",
                  width: "50%",
                  "&:hover": {
                    backgroundColor: isCustomTipSelected ? "#333" : "#f5f5f5",
                    color: isCustomTipSelected ? "#fff" : "#ECAB21",
                  },
                }}
                onClick={handleCustomTipClick}
              >
                Custom tip
              </Button>
            </Grid>
          </Grid>
          {isCustomTipSelected && (
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                type="number"
                label="Enter custom tip amount"
                value={customTip !== null ? customTip : ""}
                onChange={handleCustomTipChange}
                InputProps={{
                  inputProps: { min: 0 },
                  inputMode:'numeric'
                }}
                sx={{ mt: 2 ,background:'#fff'}}
              />
            </Box>
          )}
        </Box>

        {/* Place Order Button */}
        <Button
          onClick={() => {
            router.push(`/payment/${encodeURIComponent(
              encrypt({ tip: isCustomTipSelected && customTip
                ? customTip.toFixed(2)
                : ((Number(grandTotal) * (selectedTip || 0)) / 100).toFixed(2) })
            )}`);
          }}
          variant="contained"
          fullWidth
          sx={{
            padding: 1,
            mt: 2,
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

export default TipPage;