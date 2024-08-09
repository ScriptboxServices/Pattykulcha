"use client";

import React from "react";
import Grid from "@mui/material/Grid";

const HeaderSection = () => {
  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
    >
      <div style={{ flex: 1, textAlign: "center" }}>
        <img
          src="/images/landingpage/main1.png"
          alt="Pulled Pork"
          style={{ width: "100vw", height: "100vh", objectFit: "cover" }}
        />
      </div>
    </Grid>
  );
};

export default HeaderSection;
