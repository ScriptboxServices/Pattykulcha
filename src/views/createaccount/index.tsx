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
  Grid,
  InputAdornment,
  Autocomplete
} from "@mui/material";

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { countryCodes } from "@/utils/constants";
import { Icon } from "@iconify/react";

interface CreateAccountFormData {
  name: string;
  phone: string;
  countryCode: string;
}

const filterOptions = (options: typeof countryCodes, state: any) =>
  options.filter((option) =>
    option.name.toLowerCase().includes(state.inputValue.toLowerCase())
  );

// Create a Yup schema for validation
const createAccountSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  phone: yup
    .string()
    .required("Phone number is required")
    .min(10, "Phone number must be at least 10 digits long"),
  countryCode: yup.string().required("Country code is required"),
});

const CreateAccount: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateAccountFormData>({
    resolver: yupResolver(createAccountSchema),
  });

  const onSubmit = (data: CreateAccountFormData) => {
    console.log(data);
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
                        getOptionLabel={(option) =>
                          `${option.name} (${option.phone})`
                        }
                        renderOption={(props, option) => (
                          <Box component="li" {...props}>
                            <Icon icon={option.icon} width={20} height={20} />
                            {option.name} ({option.phone})
                          </Box>
                        )}
                        value={
                          countryCodes.find(
                            (code) => code.phone === value
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
                            error={!!errors.countryCode}
                            helperText={errors.countryCode?.message ?? ""}
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
                                            option.phone === value
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
                    name="phone"
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
                        error={!!errors.phone}
                        helperText={errors.phone?.message ?? ""}
                        inputProps={{
                          maxLength: 10,
                          pattern: "[0-9]*",
                        }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Icon icon="ri:phone-fill" />
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
