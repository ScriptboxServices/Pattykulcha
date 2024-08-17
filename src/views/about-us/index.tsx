"use client";

import React from "react";
import { Typography, Button, Grid, Box, Container } from "@mui/material";
import Image from "next/image";
import styled from "@emotion/styled";
import Link from "next/link";

const BackgroundContainer = styled(Box)`
  background-color: #ffffff;
  padding: 4rem;
  width: 100%;
  color: #000000;

  @media (max-width: 768px) {
    padding: 2rem;
  }
`;

const Title = styled(Typography)`
  font-weight: bold;
  font-size: 2rem;
  color: #000000;
  text-align: center;
`;

const TitleImage = styled.div`
  display: block;
  margin: 0 auto 2rem;
  width: 35%;
  height: auto;

  @media (max-width: 768px) {
    width: 50%;
  }

  @media (max-width: 480px) {
    width: 70%;
  }
`;

const CardContainer = styled(Grid)`
  justify-content: space-evenly;
`;

const Card = styled(Box)`
  max-width: 700px;
  text-align: left;
  margin: 1rem;
  border: 1px solid black;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.253);
  padding: 30px;
  border-radius: 15px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.7);
  }

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const CardImage = styled.div`
  display: block;
  width: 50px;
  height: 50px;
  margin: 0 auto 1rem;
`;

const CardTitle = styled(Typography)`
  font-weight: bold;
  margin-bottom: 1rem;
  color: #000000;
  text-decoration: underline;
`;

const CardDescription = styled(Typography)`
  color: #000000;
`;

const OrderButton = styled(Button)({
  backgroundColor: "#f39c12",
  color: "white",
  "&:hover": {
    backgroundColor: "#e67e22",
  },
});

const AboutUs: React.FC = () => {
  return (
    <Box
      sx={{
        paddingY: 5,
        paddingX: { xs: 2, sm: 4, md: 14 },
        backgroundColor: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        flexDirection: "column",
      }}
    >
      <Grid
        container
        spacing={4}
        sx={{
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "flex-start",
            padding: { xs: 2, sm: 4, md: 9 },
          }}
        >
          <Typography variant="h2" gutterBottom>
            We Champion Restaurants from Coast to Coast
          </Typography>
          <Typography variant="body1" paragraph>
            Restaurants sit at the heart of communities. It &apos; our mission to
            strengthen their roots, deepen their connections, and increase the
            positive impact they have on people and society.
          </Typography>
          <Link href="/home" passHref>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#ECAB21",
                color: "white",
                borderRadius: 20,
                marginTop: 2,
                paddingX: 4,
                paddingY: 1,
                fontWeight: "bold",
                "&:hover": {
                  backgroundColor: "#FFC107",
                  color: "white",
                },
              }}
            >
              Order Now
            </Button>
          </Link>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ position: "relative", height: { xs: 300, sm: 400, md: 630 }, width: "100%" }}>
            <Image
              src="/images/about-us/img.webp"
              alt="Restaurant delivery scene"
              layout="fill"
              objectFit="cover"
            />
          </Box>
        </Grid>
      </Grid>
      <BackgroundContainer>
        <Title variant="h4">ABOUT PATTYKULCHA</Title>
        <TitleImage>
          <Image
            src="/images/footersection/image.png"
            alt="Underline Image"
            layout="responsive"
            width={100}
            height={100}
          />
        </TitleImage>
        <Container>
          <CardContainer container spacing={6}>
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardImage>
                  <Image
                    src="/images/footersection/image2.png"
                    alt="Explore Our Menu"
                    width={50}
                    height={50}
                  />
                </CardImage>
                <CardTitle variant="h6">Explore Our Menu</CardTitle>
                <CardDescription variant="body1">
                  Discover the rich flavors of Punjab with our diverse
                  PattyKulcha menu. From classic Aloo to spicy Chana, each dish
                  is freshly made to order. We also offer unique fusion options
                  that blend traditional flavors with contemporary tastes,
                  making every meal an adventure. Whether you&apos;re in the
                  mood for something familiar or eager to try something new, our
                  menu has something for everyone.
                </CardDescription>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardImage>
                  <Image
                    src="/images/footersection/image1.png"
                    alt="Our Food"
                    width={50}
                    height={50}
                  />
                </CardImage>
                <CardTitle variant="h6">Our Food</CardTitle>
                <CardDescription variant="body1">
                  Quality and authenticity are at the heart of everything we do.
                  We stay true to the roots of Punjabi cuisine while adding a
                  contemporary touch, delivering a perfect balance of flavors in
                  every bite. Every PattyKulcha is hand-crafted with care,
                  ensuring that each bite is a perfect balance of flavors and
                  textures, designed to bring you the comforting taste of home,
                  no matter where you are.
                </CardDescription>
              </Card>
            </Grid>
          </CardContainer>
        </Container>
      </BackgroundContainer>
    </Box>
  );
};

export default AboutUs;
