"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  styled,
  Container,
} from "@mui/material";
import Link from "next/link";
import { useAuthContext, useMenuContext } from "@/context";
import { useRouter } from "next/navigation";
import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore";
import CircularLodar from "@/components/CircularLodar";
import { auth, db } from "@/firebase";
import { encrypt } from "@/utils/commonFunctions";

const StyledRoot = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  height: "100vh",
  margin: "0 auto",
  width: "100%",
  paddingTop: theme.spacing(4),
  alignItems: "center",
  [theme.breakpoints.up("xs")]: {
    paddingTop: theme.spacing(4),
    width: "90%", 
  },
  [theme.breakpoints.up("sm")]: {
    paddingTop: theme.spacing(10),
    width: "70%",
  },
  [theme.breakpoints.up("md")]: {
    justifyContent: "center",
    paddingTop: 0,
    width: "40%",
    alignItems: "center",
  },
  [theme.breakpoints.up("lg")]: {
    width: "35%", 
    alignItems: "center",
  },
  [theme.breakpoints.up("xl")]: {
    width: "30%", 
    alignItems: "center",
  },
}));

const StyledForm = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[6],
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(3),
  },
  [theme.breakpoints.up("md")]: {
    padding: theme.spacing(4),
  },
}));

const StyledCodeInput = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-evenly",
  marginBottom: "1rem",
  "& > *": {
    margin: theme.spacing(0.5),
    width: "40px",
    height: "40px",
    [theme.breakpoints.up("sm")]: {
      width: "40px",
      height: "40px",
      margin: theme.spacing(0.1),
      justifyContent: "center",
    },
  },
}));

const VerificationPage: React.FC = () => {
  const [verificationCode, setVerificationCode] = useState<string[]>(
    Array(6).fill("")
  );
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { confirmationResult, setConfirmationResult } = useMenuContext();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const router = useRouter();
  const { setMetaData } = useAuthContext();
  const [timer, setTimer] = useState<number>(60);
  const [resendDisabled, setResendDisabled] = useState<boolean>(true);
  const { kulcha } = useMenuContext();

  const handleCodeChange =
    (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const newCode = [...verificationCode];
      newCode[index] = event.target.value;
      setVerificationCode(newCode);

      if (event.target.value && index < verificationCode.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    };

  const handleKeyDown =
    (index: number) => (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Backspace" && !verificationCode[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    };

  useEffect(() => {
    inputRefs.current[0]?.focus();
    startTimer();
  }, []);

  useEffect(() => {
    if (timer == 0) {
      setResendDisabled(false);
    } else {
      setResendDisabled(true);
    }
  }, [timer]);

  const startTimer = () => {
    setResendDisabled(true);
    setTimer(60);

    const countdown = setInterval(() => {
      setTimer((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(countdown);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    if (verificationCode.join("").length === 6) {
      submitOtp();
    }
  }, [verificationCode]);

  const submitOtp = async () => {
    if (verificationCode.join("").length !== 6) {
      setError("Please enter complete OTP.");
      return;
    }

    if (!confirmationResult) {
      return router.push("/login");
    }

    try {
      setLoading(true);
      const result = await confirmationResult?.confirm(
        verificationCode?.join("")
      );
      const { user } = result;
      if (user) {
        const docRef = doc(db, "users", user.uid);

        const find = await getDoc(docRef);
        if (!find.exists()) {
          await setDoc(docRef, {
            phoneNumber: user?.phoneNumber,
            profile: "",
            email: "",
            name: "",
            address: {
              raw: "",
              seperate: {
                state: "",
                city: "",
                postal_code: "",
                line1: "",
              },
            },
            savedAddress:[],
            role: "customer",
            isKitchen: false,
            foodTruckId: "",
            isDriver: false,
            driverId: "",
            enable: true,
            createdAt :Timestamp.now()
          });

          const userSaved = await getDoc(doc(db, "users", user?.uid));
          if (userSaved.exists()) {
            setMetaData({
              ...userSaved.data(),
            });
          }
        }
      }
      setConfirmationResult(null);
      setLoading(false);
      if (!localStorage.getItem("kulcha")) {
        router.push("/home");
      } else {
        router.push(
          `/cart/${encodeURIComponent(encrypt({ kulcha_name:localStorage.getItem("kulcha.name") }))}`
        );
      }
    } catch (err: any) {
      console.log(err.code);
      setLoading(false);
      if (err.code === "auth/invalid-verification-code") {
        setError("Invalid verification code.");
      }
    }
  };

  const handleVerify = (e: any) => {
    e.preventDefault();
    submitOtp();
  };

  const handleResend = () => {
    startTimer();
  };

  return (
    <>
      <CircularLodar isLoading={loading} />
      <Box
        sx={{
          backgroundColor: "white",
          height: "100dvh",
          display: "flex",
          justifyContent: "center",
          alignItems: { xs: "flex-start", sm: "center" },
          overflow: "hidden",
        }}
      >
        <Container
          component="main"
          maxWidth="xl"
          sx={{
            height: "100dvh",
            display: "flex",
            justifyContent: "center",
            alignItems: { xs: "flex-start", sm: "center" },
            backgroundColor: "white",
            padding: { xs: 1, sm: 4, md: 4 },
            overflow: "hidden",
          }}
        >
          <StyledRoot>
            <StyledForm>
              <Typography variant="h4" sx={{ mt: "1rem" }} gutterBottom>
                Verify your phone number
              </Typography>
              <Typography variant="body1" sx={{ mb: "1rem" }} gutterBottom>
                Check the messages for the verification code, sent to your phone
                number.
              </Typography>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ fontWeight: 400, mb: "1rem" }}
              >
                Enter OTP
              </Typography>
              <div style={{ display: "flex", justifyContent: "space-evenly" }}>
                {verificationCode.map((code, index) => (
                  <TextField
                    key={index}
                    type="tel"
                    variant="outlined"
                    value={code}
                    onChange={handleCodeChange(index)}
                    onKeyDown={handleKeyDown(index)}
                    inputProps={{ maxLength: 1 }}
                    inputRef={(el) => (inputRefs.current[index] = el)}
                    sx={{
                      margin: 0.5,
                      // border: "1px solid black",
                      borderRadius: 1,
                      "& .MuiOutlinedInput-root": {
                        "&.Mui-focused fieldset": {
                          borderColor: "black",
                        },
                        "& input": {
                          textAlign: "center",
                        },
                        "&.Mui-focused input": {
                          borderColor: "black",
                          color: "black",
                        },
                      },
                    }}
                  />
                ))}
              </div>
              <Box mt={1.25}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleVerify}
                  fullWidth
                  sx={{
                    backgroundColor: "#ECAB21",
                    color: "white",
                    paddingX: 4,
                    paddingY: 1,
                    marginTop: "1rem",
                    marginBottom: "1rem",
                    fontWeight: "bold",
                    "&:hover": {
                      backgroundColor: "#FFC107",
                      color: "white",
                    },
                  }}
                >
                  Confirm
                </Button>
                {/* <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleResend}
                  fullWidth
                  disabled={resendDisabled}
                  sx={{
                    paddingX: 4,
                    paddingY: 1,
                    fontWeight: "bold",
                    color: "black",
                  }}
                >
                  {resendDisabled
                    ? `Resend OTP in ${Math.floor(timer / 60)}:${String(
                        timer % 60
                      ).padStart(2, "0")}`
                    : "Resend OTP"}
                </Button> */}
                {error && (
                  <Alert sx={{ mt: 2 }} severity="error">
                    {error}
                  </Alert>
                )}
              </Box>
            </StyledForm>
          </StyledRoot>
        </Container>
      </Box>
    </>
  );
};

export default VerificationPage;
