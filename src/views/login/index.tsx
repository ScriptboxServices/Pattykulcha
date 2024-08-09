"use client";

import React from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Link,
  CssBaseline,
  Grid,
  Autocomplete,
  InputAdornment,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { Icon, IconifyIcon } from "@iconify/react";
import { countryCodes } from "@/utils/constants";

export interface CountryCode {
  name: string;
  phone: number;
  code: string;
  icon: IconifyIcon | string;
}

// Define the Yup schema
const schema = yup.object().shape({
  phoneNumber: yup
    .string()
    .matches(/^\d+$/, "Phone number is not valid")
    .min(10, "Phone number must be at least 10 digits")
    .required("Phone number is required"),
  countryCode: yup.string().required(),
});

// Define the TypeScript interface based on the Yup schema
type IFormInput = yup.InferType<typeof schema>;

const filterOptions = (options: CountryCode[], state: any) =>
  options.filter((option) =>
    option.name.toLowerCase().includes(state.inputValue.toLowerCase())
  );

const Login: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: yupResolver(schema),
  });

  const router = useRouter();

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    console.log(data);
    // Navigate to /verification after successful login
    router.push("/verification");
  };

  return (
    <>
      <CssBaseline />
      <Box
        sx={{
          backgroundImage: "url(/images/bgimage.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundColor: "white",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Container
          component="main"
          maxWidth="xs"
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            padding: 4,
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography component="h1" variant="h5">
              Pattykulcha
            </Typography>
            <Typography
              component="h2"
              variant="subtitle1"
              align="left"
              sx={{ width: "100%", mt: 3 }}
            >
              Welcome to Pattykulcha!
            </Typography>
            <Typography
              variant="body2"
              align="left"
              sx={{ width: "100%", mt: 0.5 }}
              gutterBottom
            >
              Please sign-in to your account.
            </Typography>
            <Box
              component="form"
              noValidate
              sx={{ mt: 1 }}
              onSubmit={handleSubmit(onSubmit)}
            >
              <Grid container spacing={2}>
                <Grid item xs={5}>
                  <Controller
                    name="countryCode"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <Autocomplete
                        fullWidth
                        defaultValue={countryCodes[0]}
                        options={countryCodes}
                        filterOptions={filterOptions}
                        getOptionLabel={(option: CountryCode) =>
                          `${option.name} (${option.phone}) `
                        }
                        renderOption={(props, option: CountryCode) => (
                          <Box component="li" {...props}>
                            <Icon icon={option.icon} width={20} height={20} />
                            {option.name} ({option.phone})
                          </Box>
                        )}
                        value={
                          countryCodes.find(
                            (code) => code.phone == Number(value)
                          ) || null
                        }
                        onChange={(event, newValue) =>
                          onChange(newValue?.phone ?? "")
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Country Code"
                            placeholder="Select Country Code"
                            required
                            InputProps={{
                              ...params.InputProps,
                              startAdornment: (
                                <>
                                  {params.InputProps.startAdornment}
                                  <InputAdornment position="start">
                                    <Icon
                                      icon={
                                        countryCodes.find(
                                          (option) =>
                                            option.phone === Number(value)
                                        )?.icon || ""
                                      }
                                    />
                                  </InputAdornment>
                                </>
                              ),
                            }}
                          />
                        )}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={7}>
                  <Controller
                    name="phoneNumber"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        required
                        fullWidth
                        type="tel"
                        label="Phone Number"
                        placeholder="123-456-7890"
                        value={value}
                        onChange={onChange}
                        error={!!errors.phoneNumber}
                        helperText={errors.phoneNumber?.message ?? ""}
                        inputProps={{
                          maxLength: 10,
                          pattern: "[0-9]*",
                        }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <i className="ri-phone-fill" />
                            </InputAdornment>
                          ),
                        }}
                        InputLabelProps={{ style: { color: "black" } }}
                        onKeyDown={(e) => {
                          if (
                            !/[0-9]/.test(e.key) &&
                            e.key !== "Backspace" &&
                            e.key !== "Delete" &&
                            e.key !== "ArrowLeft" &&
                            e.key !== "ArrowRight"
                          ) {
                            e.preventDefault();
                          }
                        }}
                      />
                    )}
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  mb: 2,
                  backgroundColor: "black",
                  "&:hover": { backgroundColor: "black" },
                  borderRadius: 1,
                }}
              >
                Login
              </Button>
              <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                New on our platform?{" "}
                <Link
                  href="/createaccount"
                  variant="body2"
                  sx={{
                    color: "black",
                    textDecoration: "none",
                    fontWeight: "bold",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  Create An Account
                </Link>
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default Login;
