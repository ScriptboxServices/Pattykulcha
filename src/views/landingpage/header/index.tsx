"use client";

import React from "react";
import Grid from "@mui/material/Grid";
import Image from "next/image";

const HeaderSection = () => {
  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
    >
      <div style={{ flex: 1, textAlign: "center", width: "100vw", height: "100vh", position: "relative" }}>
        <Image
          src="/images/landingpage/main1.png"
          alt="Pulled Pork"
          layout="fill"
          objectFit="cover"
        />
      </div>
    </Grid>
  );
};

export default HeaderSection;
