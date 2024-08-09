'use client'

import React from 'react';
import { Container, Box, Typography, Grid } from '@mui/material';
import styled from '@emotion/styled';

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

const TitleImage = styled.img`
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
  margin-top: 2rem;
`;

const Card = styled(Box)`
  max-width: 400px;
  text-align: center;
  margin: 1rem;

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const CardImage = styled.img`
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

const ContentPage: React.FC = () => {
  return (
    <BackgroundContainer>
      <Title variant="h4">
        ABOUT NOODLES & COMPANY
      </Title>
      <TitleImage src="/images/footersection/image.png" alt="Underline Image" />
      <Container>
        <CardContainer container spacing={6} justifyContent="space-evenly">
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardImage src="/images/footersection/image2.png" alt="Explore Our Menu" />
              <CardTitle variant="h6">
                Explore Our Menu
              </CardTitle>
              <CardDescription variant="body1">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
              </CardDescription>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardImage src="/images/footersection/image1.png" alt="Our Food" />
              <CardTitle variant="h6">
                Our Food
              </CardTitle>
              <CardDescription variant="body1">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
              </CardDescription>
            </Card>
          </Grid>
        </CardContainer>
      </Container>
    </BackgroundContainer>
  );
};

export default ContentPage;
