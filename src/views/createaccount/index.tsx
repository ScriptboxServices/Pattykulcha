"use client";
import React from "react";
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Link,
  Typography,
  Box,
  Container,
  CardContent,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";


interface CreateAccountFormData {
  phone: string;
}

// Create a Yup schema for validation
const createAccountSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  phone: yup
    .string()
    .required("Phone number is required")
    .min(10, "Phone number must be at least 10 digits long"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters long"),
});

const CreateAccount: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateAccountFormData>({
    resolver: yupResolver(createAccountSchema) as any,
  });



  const onSubmit = (data: CreateAccountFormData) => {
    console.log(data);
  };

  return (
    <Container
      component="main"
      maxWidth="xl"
      sx={{
        backgroundImage: 'url(/images/bgimage.png)',
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
        padding: 2,
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 450,
          p: 2,
          bgcolor: "white",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          borderRadius: 4,
        }}
      >
        <CardContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography
              component="h1"
              variant="h5"
              sx={{ color: "black", mb: 2, fontWeight: 500 }}
            >
              Create an Account
            </Typography>
            <form
              noValidate
              onSubmit={handleSubmit(onSubmit)}
              style={{ width: "100%" }}
            >
              <Controller
                name="phone"
                control={control}
                defaultValue=""
                render={({ field, fieldState }) => (
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    label="Phone Number"
                    autoComplete="tel"
                    {...field}
                    error={!!fieldState.error}
                    helperText={
                      fieldState.error ? fieldState.error.message : null
                    }
                    InputProps={{
                      style: { color: "black" },
                      sx: {
                        "& .MuiOutlinedInput-root": {
                          "&.Mui-focused fieldset": {
                            borderColor: "black",
                          },
                          "&.Mui-focused": {
                            backgroundColor: "black",
                            color: "white",
                          },
                        },
                      },
                    }}
                    InputLabelProps={{ style: { color: "black" } }}
                  />
                )}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    value="remember"
                    sx={{
                      color: "black",
                      "&.Mui-checked": {
                        color: "black",
                      },
                    }}
                  />
                }
                label="Remember me"
                sx={{ color: "black", mt: 0.5 }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  mb: 2,
                  bgcolor: "black",
                  "&:hover": { bgcolor: "rgba(0, 0, 0, 0.8)" },
                  fontWeight: 600,
                }}
              >
                Create Account
              </Button>
              <Box textAlign="center" sx={{ mt: 2 }}>
                <Typography variant="body2" sx={{ color: "black" }}>
                  Already have an account?&nbsp;
                  <Link
                    href="/login"
                    variant="body2"
                    sx={{
                      fontWeight: "bold",
                      color: "black",
                      textDecoration: "none",
                      "&:hover": { textDecoration: "underline" },
                    }}
                  >
                    Sign in
                  </Link>
                </Typography>
              </Box>
            </form>
          </Box>
        </CardContent>
      </Box>
    </Container>
  );
};

export default CreateAccount;