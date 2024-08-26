"use client";

import React, { useEffect, useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Box,
  Button,
  Container,
  TextField,
  CssBaseline,
  Grid,
  Autocomplete as MUIAutocomplete,
  InputAdornment,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Typography,
  IconButton,
} from "@mui/material";
import { Icon, IconifyIcon } from "@iconify/react";
import Autocomplete from "react-google-autocomplete"; // Import Autocomplete from react-google-autocomplete
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import { countryCodes } from "@/utils/constants";

export interface CountryCode {
  name: string;
  phone: number;
  code: string;
  icon: IconifyIcon | string;
}

// Define the Yup schema
const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  phoneNumber: yup
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .required("Phone number is required"),
  countryCode: yup.string().required(),
  address: yup.string().required("Address is required"),
  kulchas: yup
    .array()
    .of(
      yup.object().shape({
        kulchaType: yup.string().required("Kulcha type is required"),
        quantity: yup.number().required("Quantity is required").min(1),
      })
    )
    .min(1, "At least one kulcha is required"),
  paymentmethod: yup.string().required("Payment method is required"),
  paymentstatus: yup.string().required("Payment status is required"),
  instructions: yup.string().required("Special instructions are required"),
  additionalItems: yup
    .array()
    .of(
      yup.object().shape({
        item: yup.string().required("Additional item is required"),
        quantity: yup.number().required("Quantity is required").min(1),
      })
    )
    .min(1, "At least one additional item is required"),
});

// Define the TypeScript interface based on the Yup schema
type IFormInput = yup.InferType<typeof schema>;

const filterOptions = (options: CountryCode[], state: any) =>
  options.filter((option) =>
    option.name.toLowerCase().includes(state.inputValue.toLowerCase())
  );

const MakeOrder: React.FC = () => {
  const [defaultCountry, setDefaultCountry] = useState<CountryCode | null>(
    null
  );
  const [address, setAddress] = useState<any>({});
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: yupResolver(schema),
    defaultValues: {
      countryCode: countryCodes.find((country) => country.name == "Canada")
        ?.phone.toString(),
      address: "",
      kulchas: [{ kulchaType: "", quantity: 1 }],
      name: "",
      phoneNumber: "",
      paymentmethod: "",
      paymentstatus: "",
      instructions: "",
      additionalItems: [{ item: "", quantity: 1 }],
    },
  });

  const { fields: kulchaFields, append: addKulcha, remove: removeKulcha } =
    useFieldArray({
      control,
      name: "kulchas",
    });

  const {
    fields: additionalItemFields,
    append: addAdditionalItem,
    remove: removeAdditionalItem,
  } = useFieldArray({
    control,
    name: "additionalItems",
  });

  const [error, setError] = useState<string>("");

  useEffect(() => {
    setDefaultCountry(
      countryCodes.find((country) => country.name == "India") || null
    );
  }, []);

  const onSubmit = (data: IFormInput) => {
    setError("");
    console.log("Form Submitted:", data);
  };

  return (
    <>
      <CssBaseline />
      <Box
        sx={{
          backgroundColor: "white",
          height: "auto",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          overflowY: "auto",
        }}
      >
        <Typography variant="h4" sx={{ marginBottom: 2,marginTop:2 }}>
          Make an Order
        </Typography>
        <Container
          component="main"
          maxWidth="md"
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            padding: 4,
            borderRadius: 2,
            boxShadow: 3,
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Box
              component="form"
              noValidate
              sx={{ mt: 1, width: "100%" }}
              onSubmit={handleSubmit(onSubmit)}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="name"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        required
                        fullWidth
                        label="Name"
                        placeholder="Your Name"
                        value={value}
                        onChange={onChange}
                        error={!!errors.name}
                        helperText={errors.name?.message ?? ""}
                        InputLabelProps={{ style: { color: "black" } }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Autocomplete
                    apiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY}
                    style={{
                      outline: "none",
                      color: "#8F8996",
                      padding: "14px 10px",
                      fontWeight: "bold",
                      border: "1px solid grey",
                      fontSize: "1rem",
                      width: "100%",
                    }}
                    defaultValue={address?.raw}
                    onPlaceSelected={(place) => {
                      if (!place) return;

                      let zipCode = "";
                      let city = "";
                      let state = "";

                      place.address_components?.forEach((component) => {
                        if (component.types.includes("postal_code")) {
                          zipCode = component.long_name;
                        }
                        if (component.types.includes("locality")) {
                          city = component.long_name;
                        }
                        if (
                          component.types.includes("administrative_area_level_1")
                        ) {
                          state = component.long_name;
                        }
                      });

                      const post = place.geometry?.location;
                      if (!post) return;

                      setAddress({
                        raw: place.formatted_address,
                        separate: {
                          state: state,
                          city: city,
                          postal_code: zipCode,
                          line1: place.formatted_address?.split(",")[0],
                        },
                      });
                    }}
                    options={{
                      componentRestrictions: { country: ["ca"] },
                      types: ["geocode", "establishment"],
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Controller
                    name="countryCode"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <MUIAutocomplete
                        fullWidth
                        options={countryCodes}
                        filterOptions={filterOptions}
                        getOptionLabel={(option: CountryCode) =>
                          `${option.name} (${option.phone}) `
                        }
                        renderOption={(props, option: CountryCode) => (
                          <Box component="li" {...props}>
                            <Icon
                              icon={option.icon as IconifyIcon}
                              width={20}
                              height={20}
                            />
                            {option.name} ({option.phone})
                          </Box>
                        )}
                        value={
                          countryCodes.find(
                            (code) => code.phone == Number(value)
                          ) || defaultCountry
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
                                        (countryCodes.find(
                                          (option) =>
                                            option.phone == Number(value)
                                        )?.icon ||
                                          defaultCountry?.icon) as IconifyIcon
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
                <Grid item xs={12} md={8}>
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
                {kulchaFields.map((field, index) => (
                  <React.Fragment key={field.id}>
                    <Grid item xs={12} md={6}>
                      <Controller
                        name={`kulchas.${index}.kulchaType`}
                        control={control}
                        render={({ field }) => (
                          <FormControl fullWidth required>
                            <InputLabel>Kulcha Type</InputLabel>
                            <Select
                              {...field}
                              label="Kulcha Type"
                              error={!!errors.kulchas?.[index]?.kulchaType}
                            >
                              <MenuItem value="Mix Kulcha">Mix Kulcha</MenuItem>
                              <MenuItem value="Paneer Kulcha">Paneer Kulcha</MenuItem>
                              <MenuItem value="Aloo Kulcha">Aloo Kulcha</MenuItem>
                              <MenuItem value="Onion Kulcha">Onion Kulcha</MenuItem>
                              <MenuItem value="Gobi Kulcha">Gobi Kulcha</MenuItem>
                            </Select>
                          </FormControl>
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={5}>
                      <Controller
                        name={`kulchas.${index}.quantity`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            fullWidth
                            required
                            InputProps={{ inputProps: { min: 1 } }}
                            label="Quantity"
                            type="number"
                            {...field}
                            error={!!errors.kulchas?.[index]?.quantity}
                            helperText={
                              errors.kulchas?.[index]?.quantity?.message ?? ""
                            }
                          />
                        )}
                      />
                    </Grid>
                    {index !== 0 && (
                      <Grid item xs={12} md={1}>
                        <IconButton
                          aria-label="delete"
                          color="secondary"
                          onClick={() => removeKulcha(index)}
                          sx={{ mt: 2, color: "black" }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Grid>
                    )}
                  </React.Fragment>
                ))}
                <Grid item xs={12}>
                  <Button
                    variant="outlined"
                    startIcon={<AddCircleOutlineIcon />}
                    disabled={kulchaFields.length >= 5} // Updated check
                    onClick={() =>{
                      if(kulchaFields.length<5){
                        addKulcha({ kulchaType: "", quantity: 1 })
                      }
                    }}
                  >
                    Add Kulcha
                  </Button>
                </Grid>

                {additionalItemFields.map((field, index) => (
                  <React.Fragment key={field.id}>
                    <Grid item xs={12} md={6}>
                      <Controller
                        name={`additionalItems.${index}.item`}
                        control={control}
                        render={({ field }) => (
                          <FormControl fullWidth required>
                            <InputLabel>Additional Item</InputLabel>
                            <Select
                              {...field}
                              label="Additional Item"
                              error={!!errors.additionalItems?.[index]?.item}
                            >
                              <MenuItem value="Channa">Channa</MenuItem>
                              <MenuItem value="Imli Chatney">Imli Chatney</MenuItem>
                              <MenuItem value="Normal Butter">Normal Butter</MenuItem>
                              <MenuItem value="Amul Butter">Amul Butter</MenuItem>
                            </Select>
                          </FormControl>
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={5}>
                      <Controller
                        name={`additionalItems.${index}.quantity`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            fullWidth
                            required
                            label="Additional Item Quantity"
                            type="number"
                            InputProps={{ inputProps: { min: 1 } }}
                            {...field}
                            error={
                              !!errors.additionalItems?.[index]?.quantity
                            }
                            helperText={
                              errors.additionalItems?.[index]?.quantity
                                ?.message ?? ""
                            }
                          />
                        )}
                      />
                    </Grid>
                    {index !== 0 && (
                      <Grid item xs={12} md={1}>
                        <IconButton
                          aria-label="delete"
                          color="secondary"
                          onClick={() => removeAdditionalItem(index)}
                          sx={{ mt: 2, color: "black" }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Grid>
                    )}
                  </React.Fragment>
                ))}
                <Grid item xs={12}>
                  <Button
                    variant="outlined"
                    startIcon={<AddCircleOutlineIcon />}
                    disabled={additionalItemFields.length >= 4} // Updated check
                    onClick={() =>{
                      if(addAdditionalItem.length<4){
                        addAdditionalItem({ item: "", quantity: 1 })
                      }
                      else{
                        return;
                      }
                    }}
                                          
                  >
                    Add Additional Item
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="instructions"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        placeholder="Special instructions"
                        fullWidth
                        value={value}
                        onChange={onChange}
                        minRows={2}
                        multiline
                        error={!!errors.instructions}
                        helperText={errors.instructions?.message ?? ""}
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
                  backgroundColor: "#ECAB21",
                  color: "white",
                  paddingX: 4,
                  paddingY: 1,
                  mt: 2,
                  fontWeight: "bold",
                  "&:hover": {
                    backgroundColor: "#FFC107",
                    color: "white",
                  },
                }}
              >
                Submit Order
              </Button>
              {error && (
                <Alert severity="error" className="mt-2">
                  {error}
                </Alert>
              )}
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default MakeOrder;