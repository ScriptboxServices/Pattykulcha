/* eslint-disable react/display-name */
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
  Alert,
  CardContent,
  Divider,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  calculateDeliveryCharges,
  IncludedItem,
  Kulcha,
  useAuthContext,
  useMenuContext,
} from "@/context";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { encrypt } from "@/utils/commonFunctions";

type PaymentMethod = "VisaCard" | "upi" | "masterCard";

interface FormValues {
  paymentMethod: PaymentMethod;
  cardNumber: string;
  expDate: string;
  cvv: string;
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PK ?? "");

const validationSchema = Yup.object().shape({
  paymentMethod: Yup.string().required("Payment method is required"),
  cardNumber: Yup.string().required("Card number is required"),
  expDate: Yup.string().required("Expiration date is required"),
  cvv: Yup.string().required("CVV is required"),
});

interface CheckoutFormProps {
  errorFunc: (message: string) => void;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  paymentId: string;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({
  errorFunc,
  setLoading,
  paymentId,
}) => {
  const stripe = useStripe();
  const router = useRouter();
  const elements = useElements();
  const { user } = useAuthContext();
  const [isPaymentReady, setIsPaymentReady] = useState(false);

  useEffect(() => {
    if (!elements) return;

    const paymentElement: any = elements.getElement(PaymentElement);
    if (paymentElement) {
      const handleChange = (event: any) => {
        setIsPaymentReady(event.complete);
      };
      paymentElement.on("change", handleChange);
      return () => {
        paymentElement.off("change", handleChange);
      };
    }
  }, [elements]);

  const delay = () => {
    return new Promise((resolve, _) => {
      setTimeout(() => {
        resolve(true);
      }, 5000);
    });
  };

  const handleSubmit = async (event: any) => {
    const return_url = `https://pattykulcha.com/orderconformation/${encodeURIComponent(
      encrypt({ payment_id: paymentId })
    )}`;
    try {
      event.preventDefault();
      if (!stripe || !elements) return;
      setLoading(true);
      const result = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
        confirmParams: {
          return_url: return_url,
          save_payment_method: true,
          payment_method_data: {
            billing_details: {
              phone: user?.phoneNumber,
              name: user?.displayName || "Customer",
            },
          },
        },
      });
      if (result.error) {
        throw result.error;
      } else {
        const { id } = result.paymentIntent;
        await delay();
        router.replace(
          `/orderconformation/${encodeURIComponent(
            encrypt({ payment_id: id })
          )}`
        );
        setLoading(false);
      }
    } catch (err: any) {
      console.error(err.type);
      if (err.type === "StripeCardError") {
        console.error("Your card was declined:", err.message);
        errorFunc(
          "Your card was declined. Please check your card details and try again."
        );
      } else if (err.type === "StripeInvalidRequestError") {
        console.error("Invalid request:", err.message);
        errorFunc(
          "There was an error with your payment request. Please try again."
        );
      } else {
        console.error("An unexpected error occurred:", err.message);
        errorFunc(
          "An unexpected error occurred. Please try again or contact support."
        );
      }
      setLoading(false);
    }
  };

  return (
    <Box>
      <PaymentElement
        options={{
          wallets: { applePay: "auto", googlePay: "auto" },
          terms: {
            googlePay: "always",
            applePay: "always",
            auBecsDebit: "always",
            bancontact: "always",
            card: "always",
            cashapp: "always",
            ideal: "always",
            paypal: "always",
            sepaDebit: "always",
            sofort: "always",
            usBankAccount: "always",
          },
          fields: {
            billingDetails: {
              address: "auto",
              name: "auto",
            },
          },
        }}
      />
      <Button
        onClick={handleSubmit}
        type="submit"
        variant="contained"
        disabled={!isPaymentReady}
        sx={{
          backgroundColor: "#ECAB21",
          color: "white",
          borderRadius: 2,
          py: 1.5,
          mt: 3,
          paddingX: 4,
          paddingY: 1,
          fontWeight: "bold",
          "&:hover": {
            backgroundColor: "#FFC107",
            color: "white",
          },
        }}
        fullWidth
      >
        Proceed With Payment
      </Button>
    </Box>
  );
};

interface CheckoutProps {
  setLoading: any;
  clientSecret: string;
  ephemeralKey: string;
  payment_id: string;
  customer: string;
  tip : string,
  selectedOption : string
}

const CheckoutMain: React.FC<CheckoutProps> = ({
  setLoading,
  clientSecret,
  ephemeralKey,
  payment_id,
  customer,
  tip,
  selectedOption
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(validationSchema) as any,
  });

  const router = useRouter();
  const { count, grandTotal } = useMenuContext();
  const {metaData} = useAuthContext()
  const [error, setError] = useState("");

  const errorFunc = (error: string) => {
    setError(error);
  };

  return (
    <Box
      sx={{
        bgcolor: "#FAF3E0",
        py: 4,
        pb: 8,
        backgroundSize: "cover",
        minHeight: { xs: "40vh", md: "50vh", lg: "60vh", xl: "75vh" },
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <CardContent sx={{ px: { xs: 3, sm: 6 }, py: 4 }}>
          <Typography
            variant="h3"
            component="h2"
            sx={{
              color: "#333333",
              fontWeight: "bold",
              textAlign: "center",
              mb: 1.5,
            }}
          >
            Checkout
          </Typography>
          <form>
            <Grid container spacing={4}>
              <Grid item xs={12} md={5}>
                <Box
                  p={3}
                  bgcolor="background.paper"
                  borderRadius={2}
                  sx={{ boxShadow: 2 }}
                >
                  {/* <Typography variant="h6" mb={2}>
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
                            <Image
                              src="https://img.icons8.com/color/48/000000/visa.png"
                              alt="Visa"
                              width={48}
                              height={30}
                              style={{ maxWidth: "48px" }}
                            />
                          }
                        />
                      </RadioGroup>
                    )}
                  />
                  <Divider sx={{ my: 3 }} /> */}
                  <Typography variant="h5" mb={3} textAlign="center">
                    Order Summary
                  </Typography>

                  <Box display="flex" justifyContent="space-between" mb={2}>
                    <Typography>Number of Items</Typography>
                    <Typography>{count}</Typography>
                  </Box>
                  <Divider sx={{ my: 3 }} />
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="h6" sx={{fontSize:'16px'}}>Sub Total</Typography>
                    <Typography variant="h6" sx={{fontSize:'16px'}}>${grandTotal}</Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="h6" sx={{fontSize:'16px'}}>Delivery Charges</Typography>
                    <Typography variant="h6" sx={{fontSize:'16px'}}>${selectedOption === 'pickup' ?'0.00' : Number(calculateDeliveryCharges(metaData?.address?.distance?.value)).toFixed(2)}</Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="h6" sx={{fontSize:'16px'}}>Tip Amount</Typography>
                    <Typography variant="h6" sx={{fontSize:'16px'}}>${Number(tip).toFixed(2)}</Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" mb={3}>
                    <Typography variant="h6">Total</Typography>
                    <Typography variant="h6">${Number(Number(grandTotal) + (selectedOption === 'pickup' ?  0 :  Number(calculateDeliveryCharges(metaData?.address?.distance?.value)) ) + Number(tip)).toFixed(2)}</Typography>
                  </Box>
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
              <Grid item xs={12} md={7}>
                <Box
                  p={3}
                  bgcolor="background.paper"
                  borderRadius={2}
                  sx={{ boxShadow: 2 }}
                >
                  <Typography variant="h6" mb={2}>
                    Credit Card Info
                  </Typography>
                  {clientSecret && (
                    <Elements
                      stripe={stripePromise}
                      options={{
                        clientSecret,
                        customerOptions: { customer, ephemeralKey },
                        fonts: [
                          {
                            cssSrc:
                              "https://fonts.googleapis.com/css?family=Roboto",
                          },
                        ],
                      }}
                    >
                      <CheckoutForm
                        errorFunc={errorFunc}
                        setLoading={setLoading}
                        paymentId={payment_id}
                      />
                    </Elements>
                  )}
                </Box>
              </Grid>
            </Grid>
            {error && (
              <Box>
                <Alert sx={{ mt: 4 }} severity="error">
                  {error}
                </Alert>
              </Box>
            )}
          </form>
        </CardContent>
      </Box>
    </Box>
  );
};

export default CheckoutMain;
