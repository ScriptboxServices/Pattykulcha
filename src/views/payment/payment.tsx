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
import { useMenuContext } from "@/context";

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

const CheckoutMain = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(validationSchema) as any,
  });

  const { includedItems,  quantities, } =
    useMenuContext();

  const onSubmit = (data: FormValues) => {
    console.log("Form Data: ", data);
    // Handle form submission
  };

  const calculateTotal = () => {
    return includedItems
      .reduce((total, item) => {
        const itemPrice = item.items[0].price; // Assuming each item has a price stored in items array
        return total + itemPrice * (quantities[item.id] || 1);
      }, 0)
      .toFixed(2);
  };

  return (
    <Container maxWidth="xl" sx={{ bgcolor: "#FAF3E0", py: 5 }}>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Card sx={{ width: { xs: "100%", sm: "90%", md: "80%", lg: "85%" } }}>
          <CardContent>
            <Typography variant="h4" mb={2}>
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
                  <Grid container spacing={2}>
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
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={6} sm={3}>
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
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={6} sm={3}>
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
                    border={1}
                    borderColor="grey.300"
                    borderRadius={2}
                  >
                    <Typography variant="h5" mb={3}>
                      Order Summary
                    </Typography>

                    <Box display="flex" justifyContent="space-between">
                      <Typography>Number of Items</Typography>
                      <Typography>{includedItems.length}</Typography>
                    </Box>
                    <Divider sx={{ my: 3 }} />
                    <Box display="flex" justifyContent="space-between" mb={3}>
                      <Typography variant="h6">Total</Typography>
                      <Typography variant="h6">{calculateTotal()}</Typography>
                    </Box>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      fullWidth
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
