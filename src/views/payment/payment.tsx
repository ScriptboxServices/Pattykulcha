"use client";

import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { IncludedItem, Kulcha, useMenuContext } from "@/context";

type PaymentMethod = "VisaCard" | "upi" | "masterCard";

interface FormValues {
  paymentMethod: PaymentMethod;
  cardNumber: string;
  expDate: string;
  cvv: string;
}

const validationSchema = Yup.object().shape({
  paymentMethod: Yup.string().required("Payment method is required"),
  cardNumber: Yup.string().required("Card number is required"),
  expDate: Yup.string().required("Expiration date is required"),
  cvv: Yup.string().required("CVV is required"),
});

const isIncludedItem = (
  item: Kulcha | IncludedItem
): item is IncludedItem => {
  return (item as IncludedItem).items !== undefined;
};

const CheckoutMain = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(validationSchema) as any,
  });

  const {
    selectedkulchas,
    includedItems1,
    includedItems2,
    quantities,
  } = useMenuContext();


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
        itemPrice = item.price; 
      }

      if (acc[itemName]) {
        acc[itemName].quantity += quantities[item.id] || 1;
      } else {
        acc[itemName] = {
          id: item.id,
          name: itemName,
          price: itemPrice,
          quantity: quantities[item.id] || 1,
        };
      }
      return acc;
    }, {} as Record<string, { id: string; name: string; price: number; quantity: number }>);

    return Object.values(itemMap);
  };

  const mergedItems1 = mergeItems();

  const onSubmit = (data: FormValues) => {
    console.log("Form Data: ", data);
    // Handle form submission
  };

  const calculateTotal = () => {
    return mergedItems1
      .reduce((total, item) => {
        return total + item.price * item.quantity;
      }, 0)
      .toFixed(2);
  };


  return (
    <Container maxWidth="xl" sx={{ bgcolor: "#FAF3E0", py: 4 , pb: 8}}>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Card
          sx={{
            width: { xs: "100%", sm: "90%", md: "75%", lg: "70%" },
            boxShadow: 3,
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <CardContent sx={{ px: { xs: 3, sm: 6 }, py: 4 }}>
            <Typography variant="h4" mb={2} textAlign="center">
              Checkout
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={4}>
                <Grid item xs={12} md={7}>
                  <FormControl component="fieldset">
                    <Typography variant="h6" mb={2}>
                      Payment Method
                    </Typography>
                    <Controller
                      name="paymentMethod"
                      control={control}
                      defaultValue="VisaCard"
                      render={({ field }) => (
                        <RadioGroup row {...field}>
                          <FormControlLabel
                            value="VisaCard"
                            control={<Radio />}
                            label={
                              <img
                                src="https://img.icons8.com/color/48/000000/visa.png"
                                alt="Visa"
                                style={{ maxWidth: "48px" }}
                              />
                            }
                          />
                          {/* Add more payment methods if needed */}
                        </RadioGroup>
                      )}
                    />
                  </FormControl>

                  <Divider sx={{ my: 4 }} />

                  <Typography variant="h6" mb={2}>
                    Credit Card Info
                  </Typography>
                  <Grid container spacing={2} >
                    <Grid item xs={12}>
                      <Controller
                        name="cardNumber"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <TextField
                            {...field}
                            required
                            fullWidth
                            id="cardNumber"
                            label="Card Number"
                            variant="outlined"
                            error={!!errors.cardNumber}
                            helperText={errors.cardNumber?.message}
                            InputProps={{
                              sx: { height: '50px' },  // Adjust the height here
                            }}
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={6} sm={6}>
                      <Controller
                        name="expDate"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <TextField
                            {...field}
                            required
                            fullWidth
                            id="expDate"
                            label="EXP. Date (MM/YY)"
                            variant="outlined"
                            error={!!errors.expDate}
                            helperText={errors.expDate?.message}
                            InputProps={{
                              sx: { height: '50px' },  // Match height with Card Number
                            }}
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={6} sm={6}>
                      <Controller
                        name="cvv"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <TextField
                            {...field}
                            required
                            fullWidth
                            id="cvv"
                            label="CVV"
                            variant="outlined"
                            error={!!errors.cvv}
                            helperText={errors.cvv?.message}
                            InputProps={{
                              sx: { height: '50px' },  // Match height with Card Number
                            }}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} md={5}>
                  <Box
                    p={3}
                    bgcolor="background.paper"
                    borderRadius={2}
                    sx={{ boxShadow: 2 }}
                  >
                    <Typography variant="h5" mb={3} textAlign="center">
                      Order Summary
                    </Typography>

                    <Box display="flex" justifyContent="space-between" mb={2}>
                      <Typography>Number of Items</Typography>
                      <Typography>{mergedItems1.length}</Typography>
                    </Box>
                    <Divider sx={{ my: 2 }} />
                    <Box display="flex" justifyContent="space-between" mb={3}>
                      <Typography variant="h6">Total</Typography>
                      <Typography variant="h6">${calculateTotal()}</Typography>
                    </Box>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      fullWidth
                      sx={{ py: 1.5 }}
                    >
                      Proceed With Payment
                    </Button>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      align="center"
                      mt={2}
                    >
                      By continuing, you accept to our Terms of Services and
                      Privacy Policy. Please note that payments are
                      non-refundable.
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default CheckoutMain;
