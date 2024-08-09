"use client";

import React, { useState, useRef } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  styled,
  Container,
} from "@mui/material";
import Link from "next/link";

const StyledRoot = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100vh",
  margin: "0 auto",
  width: "30%",
});

const StyledForm = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[6],
}));

const StyledCodeInput = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  "& > *": {
    margin: theme.spacing(0, 1),
  },
}));

const VerificationPage: React.FC = () => {
  const [verificationCode, setVerificationCode] = useState<string[]>(
    Array(6).fill("")
  );

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleCodeChange =
    (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const newCode = [...verificationCode];
      newCode[index] = event.target.value;
      setVerificationCode(newCode);

      // Automatically focus the next input if the current input has a value and it's not the last input
      if (event.target.value && index < verificationCode.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    };

  const handleKeyDown =
    (index: number) => (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Backspace" && !verificationCode[index] && index > 0) {
        // If backspace is pressed and the current input is empty, move focus to the previous input
        inputRefs.current[index - 1]?.focus();
      }
    };

  const handleVerify = () => {
    // Add your verification logic here
    console.log("Verifying with code:", verificationCode.join(""));
  };

  return (
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
        padding: 2,
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
                variant="outlined"
                value={code}
                onChange={handleCodeChange(index)}
                onKeyDown={handleKeyDown(index)}
                inputProps={{ maxLength: 1 }}
                inputRef={(el) => (inputRefs.current[index] = el)}
                sx={{
                  width: "50px",
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
          <Link href='/home'>
          <Box mt={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleVerify}
              fullWidth
              style={{ backgroundColor: "black" }}
            >
              Confirm
            </Button>
          </Box>
          </Link>
        </StyledForm>
      </StyledRoot>
    </Container>
  );
};

export default VerificationPage;