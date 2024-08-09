// pages/verification.tsx
"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  styled,
  Container,
} from "@mui/material";

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
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState<string[]>(
    Array(6).fill("")
  );

  const handleCodeChange =
    (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const newCode = [...verificationCode];
      newCode[index] = event.target.value;
      setVerificationCode(newCode);
    };

  const handleVerify = () => {
    // Add your verification logic here
    console.log(
      "Verifying email:",
      email,
      "with code:",
      verificationCode.join("")
    );
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
            Verify your email
          </Typography>
          <Typography variant="body1" gutterBottom>
            Check your inbox and spam folder for the verification code, sent to
            your email (alakhhanpal2003@gmail.com).
          </Typography>
          <Box mt={2} className={StyledCodeInput.toString()}>
            {verificationCode.map((code, index) => (
              <TextField
                key={index}
                variant="outlined"
                value={code}
                onChange={handleCodeChange(index)}
                inputProps={{ maxLength: 1 }}
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
          </Box>
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
        </StyledForm>
      </StyledRoot>
    </Container>
  );
};

export default VerificationPage;
