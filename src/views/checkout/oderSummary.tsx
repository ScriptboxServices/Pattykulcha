"use client";

import React from "react";
import { Box, Typography, Paper, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { IncludedItem, Kulcha, useMenuContext } from "@/context";

const isIncludedItem = (item: Kulcha | IncludedItem): item is IncludedItem => {
  return (item as IncludedItem).items !== undefined;
};

const AddCouponComponent: React.FC = () => {
  const router = useRouter();
  const { selectedkulchas, includedItems1, includedItems2, address,instructions } =
    useMenuContext();

  const mergeItems = () => {
    const combinedItems = [
      ...selectedkulchas,
      ...includedItems1,
      ...includedItems2,
    ];

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

  const calculateTotal = () => {
    return mergedItems
      .reduce((total, item) => {
        return total + item.price * item.quantity;
      }, 0)
      .toFixed(2);
  };

  const handleProceedToPayment = () => {
    if(!address?.raw || instructions) return
    router.push("/payment");
  };

  const details = [{ label: "Total", value: `${calculateTotal()}` }];

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="60vh"
      bgcolor="#FAF3E0"
      width="100%"
      padding={2}
    >
      <Paper
        elevation={3}
        style={{
          padding: "24px",
          width: "100%",
          maxWidth: "900px",
          margin: "0",
        }}
      >
        <Box display="flex" flexDirection="column" gap={2}>
          <Typography variant="h6" style={{ fontWeight: 600 }}>
            Total
          </Typography>
          {details.map((item, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent="space-between"
              width="100%"
            >
              <Typography variant="body1" color="textSecondary">
                {item.label}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                {item.value}
              </Typography>
            </Box>
          ))}
          <Button
            variant="contained"
            color="primary"
            onClick={handleProceedToPayment}
            style={{ marginTop: "16px", alignSelf: "flex-end" }}
          >
            Proceed to Payment
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default AddCouponComponent;
