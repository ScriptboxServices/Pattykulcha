"use client";

import React from "react";
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
import { IncludedItem, Kulcha, useMenuContext } from "@/context";
import { useRouter } from "next/navigation";

// Type guard to check if the item is an IncludedItem
const isIncludedItem = (
  item: Kulcha | IncludedItem
): item is IncludedItem => {
  return (item as IncludedItem).items !== undefined;
};

const OrderHome: React.FC = () => {
  const {
    selectedkulchas,
    includedItems1,
    includedItems2,
    quantities,
    setQuantityForItem,
  } = useMenuContext();

  const router = useRouter();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const mergeItems = () => {
    const combinedItems = [...selectedkulchas, ...includedItems1, ...includedItems2];

    const itemMap = combinedItems.reduce((acc, item) => {
      let itemName: string;
      let itemPrice: number;

      if (isIncludedItem(item)) {
        itemName = item.items[0].name;
        itemPrice = item.items[0].price;
      } else {
        itemName = item.name;
        itemPrice = item.price; // Assuming price is not available for Kulcha items
      }

      if (acc[itemName]) {
        acc[itemName].quantity +=  1;
      } else {
        acc[itemName] = {
          id: '3',
          name: itemName,
          price: itemPrice,
          quantity: 1,
        };
      }
      return acc;
    }, {} as Record<string, { id: string; name: string; price: number; quantity: number }>);

    return Object.values(itemMap);
  };

  const mergedItems = mergeItems();

  const handleIncrease = (id: string) => {
    setQuantityForItem(id, (quantities[id] || 1) + 1);
  };

  const handleDecrease = (id: string) => {
    setQuantityForItem(id, quantities[id] > 1 ? quantities[id] - 1 : 1);
  };

  const handleRemove = (id: string) => {
    // Remove item logic here
  };

  const calculateTotal = () => {
    return mergedItems
      .reduce((total, item) => {
        return total + item.price * item.quantity;
      }, 0)
      .toFixed(2);
  };

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
        {mergedItems.map((item) => (
          <Paper
            key={item.id}
            sx={{
              display: "flex",
              alignItems: "center",
              p: 4,
              backgroundColor: "#FFFFFF",
              width: isSmallScreen ? "100%" : "57%",
              boxShadow: "none",
              mb: 2,
              flexDirection: isSmallScreen ? "column" : "row",
              borderRadius: "12px",
              border: "1px solid #E5E7EB",
              margin: "0 auto",
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
                alt={item.name}
                width={80}
                height={80}
              />
            </Box>
            <Box sx={{ ml: isSmallScreen ? 0 : 3, flex: 1 }}>
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", color: "#1F2937", paddingBottom: "4px" }}
              >
                {item.name}
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
              {/* Conditionally render price */}
              {!(item.quantity == 1 && (item.name == "Chana" ||item.name == "Imli Pyaz Chutney" || item.name == "Amul Butter")) && (
                <Typography
                  variant="body1"
                  sx={{ color: "#1F2937", fontWeight: "bold", mr: 2 }}
                >
                  ${item.price.toFixed(2)}
                </Typography>
              )}
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
                  {item.quantity}
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
