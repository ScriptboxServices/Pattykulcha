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
import { useMenuContext } from "@/context";
import { useRouter } from "next/navigation";
import { doc, getDoc, setDoc } from "firebase/firestore";
import CircularLodar from "@/components/CircularLodar";
import { auth, db } from "@/firebase";

const StyledRoot = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100vh",
  margin: "0 auto",
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    width: "80%",
  },
  [theme.breakpoints.up("md")]: {
    width: "60%",
  },
  [theme.breakpoints.up("lg")]: {
    width: "40%",
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
  justifyContent: "center",
  "& > *": {
    margin: theme.spacing(0.5),
    width: "40px",
    [theme.breakpoints.up("sm")]: {
      width: "50px",
    },
  },
}));

const VerificationPage: React.FC = () => {
  const [verificationCode, setVerificationCode] = useState<string[]>(Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { confirmationResult, setConfirmationResult } = useMenuContext();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const handleCodeChange = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const newCode = [...verificationCode];
    newCode[index] = event.target.value;
    setVerificationCode(newCode);

    if (event.target.value && index < verificationCode.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number) => (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && !verificationCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
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
      const result = await confirmationResult?.confirm(verificationCode?.join(""));
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
              separate: {
                state: "",
                city: "",
                postal_code: "",
                line1: "",
              },
            },
          });
        }
      }
      setConfirmationResult(null);
      setLoading(false);
      router.push("/home");
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

  return (
    <>
      <CircularLodar isLoading={loading} />
      <Container
        component="main"
        maxWidth="xl"
        sx={{
          backgroundImage: "url(/images/bgimage.png)",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "white",
          padding: { xs: 2, sm: 4, md: 4 },
          overflow: "hidden",
        }}
      >
        <StyledRoot>
          <StyledForm>
            <Typography variant="h4" gutterBottom>
              Verify your phone number
            </Typography>
            <Typography variant="body1" gutterBottom>
              Check the messages for the verification code, sent to your phone number.
            </Typography>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 400 }}>
              Enter OTP
            </Typography>
            <StyledCodeInput>
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
                    border: "1px solid black",
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
            </StyledCodeInput>
            <Box mt={2}>
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
                  fontWeight: "bold",
                  "&:hover": {
                    backgroundColor: "#FFC107",
                    color: "white",
                  },
                }}
              >
                Confirm
              </Button>
              {error && <Alert sx={{ mt: 2 }} severity="error">{error}</Alert>}
            </Box>
          </StyledForm>
        </StyledRoot>
      </Container>
    </>
  );
};

export default VerificationPage;
