"use client";

import React from "react";
import { Box, TextField, Typography, Button, Rating } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  comments: yup.string().required("Comments are required"),
  rating: yup
    .number()
    .required("Rating is required")
    .min(1, "Rating is required"),
});

const ReviewForm: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      comments: "",
      rating: 5,
    },
  });

  const onSubmit = (data: any) => {
    console.log("Form Data:", data);
  };

  return (
    <Box
      sx={{
        backgroundColor: "#fffaeb",
        height: "80vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Typography variant="h4" component="h1" textAlign="center" mb={2}>
        User feedback
      </Typography>

      <Box
        sx={{
          backgroundColor: "white",
          padding: "24px",
          width: { xs: "350px", lg: "400px" },
          borderRadius: "12px",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        }}
        component="form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Box sx={{ mb: 2 }}>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Name"
                variant="outlined"
                error={!!errors.name}
                helperText={errors.name ? errors.name.message : ""}
              />
            )}
          />
        </Box>

        <Typography variant="body1" sx={{ mt: 2, mb: 1 }}>
          Share your experience in scaling
        </Typography>
        <Controller
          name="rating"
          control={control}
          render={({ field }) => (
            <Rating
              {...field}
              name="rating"
              precision={0.25}
              value={field.value}
              onChange={(e, newValue) => field.onChange(newValue)}
              sx={{ mb: 2 }}
            />
          )}
        />
        {errors.rating && (
          <Typography color="error" variant="body2" sx={{ mb: 2 }}>
            {errors.rating.message}
          </Typography>
        )}

        <Box sx={{ mb: 3 }}>
          <Controller
            name="comments"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                multiline
                rows={4}
                placeholder="Add your comments..."
                variant="outlined"
                error={!!errors.comments}
                helperText={errors.comments ? errors.comments.message : ""}
              />
            )}
          />
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
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
            SUBMIT
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ReviewForm;
