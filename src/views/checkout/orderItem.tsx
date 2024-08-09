"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Button,
  Container,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Remove, Add } from "@mui/icons-material";
import Image from "next/image";
import { useMenuContext } from "@/context";
import { useRouter } from "next/navigation";

// Define types for item and context
interface Item {
  id: string;
  items: Array<{
    name: string;
    price: number;
  }>;
}

interface MenuContextType {
  includedItems: Item[];
  setIncludedItems: React.Dispatch<React.SetStateAction<Item[]>>;
  quantities: Record<string, number>;
  setQuantityForItem: (id: string, quantity: number) => void;
}

const OrderHome: React.FC = () => {
  const {
    includedItems,
    setIncludedItems,
    quantities,
    setQuantityForItem,
  } = useMenuContext() as MenuContextType;

  const handleIncrease = (id: string) => {
    setQuantityForItem(id, (quantities[id] || 1) + 1);
  };

  const handleDecrease = (id: string) => {
    setQuantityForItem(id, quantities[id] > 1 ? quantities[id] - 1 : 1);
  };

  const handleRemove = (id: string) => {
    setIncludedItems((prevItems) =>
      prevItems.filter((item) => item.id !== id)
    );
  };

  const calculateTotal = () => {
    return includedItems
      .reduce((total, item) => {
        const itemPrice = item.items[0].price; // Assuming each item has a price stored in items array
        return total + itemPrice * (quantities[item.id] || 1);
      }, 0)
      .toFixed(2);
  };

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const router = useRouter();

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "10vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FAF3E0",
        flexDirection: "column",
        p: 4,
      }}
    >
      <Container maxWidth="xl">
        {includedItems.map((item) => (
          <Paper
            key={item.id}
            sx={{
              display: "flex",
              alignItems: "center",
              p: 4,
              backgroundColor: "#FFFFFF",
              width: isSmallScreen ? "100%" : "57%", // Set card width to 600px or full width on small screens
              boxShadow: "none",
              mb: 2,
              flexDirection: isSmallScreen ? "column" : "row",
              borderRadius: "12px",
              border: "1px solid #E5E7EB",
              margin: "0 auto", // Center the card
              marginTop: "14px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mb: isSmallScreen ? 2 : 0,
              }}
            >
              <Image
                src="/images/checkout/checkout2.png"
                alt={item.items[0].name}
                width={80}
                height={80}
              />
            </Box>
            <Box sx={{ ml: isSmallScreen ? 0 : 3, flex: 1 }}>
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", color: "#1F2937", paddingBottom: "4px" }}
              >
                {item.items[0].name}
              </Typography>
              <Typography variant="body1" sx={{ color: "#4B5563", mb: 1, pb: 2 }}>
                {item.items.slice(1).map((subItem) => subItem.name).join(", ")}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: isSmallScreen
                    ? "space-between"
                    : "flex-start",
                  width: "100%",
                }}
              >
                <Button
                  onClick={() => router.push(`/cart`)}
                  sx={{
                    textTransform: "none",
                    color: "#1F2937",
                    fontWeight: "bold",
                    mr: 1,
                    backgroundColor: "#F3F4F6",
                    borderRadius: "5px",
                    px: 2,
                    "&:hover": {
                      backgroundColor: "#E5E7EB",
                    },
                  }}
                >
                  Edit
                </Button>
                <Button
                  onClick={() => handleRemove(item.id)}
                  sx={{
                    textTransform: "none",
                    color: "#B91C1C",
                    fontWeight: "bold",
                    backgroundColor: "#FEE2E2",
                    borderRadius: "5px",
                    px: 2,
                    "&:hover": {
                      backgroundColor: "#FECACA",
                    },
                  }}
                >
                  Remove
                </Button>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mt: isSmallScreen ? 2 : 0,
                justifyContent: isSmallScreen ? "space-between" : "flex-start",
                width: isSmallScreen ? "100%" : "auto",
              }}
            >
              <Typography
                variant="body1"
                sx={{ color: "#1F2937", fontWeight: "bold", mr: 2 }}
              >
                ${item.items[0].price.toFixed(2)}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <IconButton
                  onClick={() => handleDecrease(item.id)}
                  sx={{
                    color: "#1F2937",
                    border: "1px solid #D1D5DB",
                    borderRadius: "50%",
                  }}
                >
                  <Remove />
                </IconButton>
                <Typography
                  variant="body1"
                  sx={{ mx: 2, color: "#1F2937", fontWeight: "bold" }}
                >
                  {quantities[item.id] || 1}
                </Typography>
                <IconButton
                  onClick={() => handleIncrease(item.id)}
                  sx={{
                    color: "#1F2937",
                    border: "1px solid #D1D5DB",
                    borderRadius: "50%",
                  }}
                >
                  <Add />
                </IconButton>
              </Box>
            </Box>
          </Paper>
        ))}
        <Box sx={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
          <Typography
            variant="h6"
            sx={{ mt: 4, fontWeight: "bold", color: "#1F2937" }}
          >
            Total: ${calculateTotal()}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default OrderHome;
