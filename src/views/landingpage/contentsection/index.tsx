'use client'

import React from 'react';
import { Container, Box, Typography, Button, Grid } from '@mui/material';
import styled from '@emotion/styled';

const BackgroundContainer = styled(Box)`
  background-color: #7BAED4;
  padding: 4rem;
  width: 100%;
  color: #000000;
`;

const Title = styled(Typography)`
  font-weight: bold;
  font-size: 2rem;
  color: #000000;
`;

const Description = styled(Typography)`
  font-weight: bold;
  color: #000000;
`;

const SignUpButton = styled(Button)`
  margin-top: 1rem;
  background-color: #FFA500;
  color: black;
  border-radius: 20px;
  padding: 10px 20px;
  font-weight: bold;
  &:hover {
    background-color: #FF8C00;
  }
`;

const ImageContainer = styled(Box)`
  text-align: right;
`;

const StyledImage = styled.img`
  max-width: 100%;
  height: auto;
`;

const ContentPage: React.FC = () => {
  return (
    <BackgroundContainer>
      <Grid container spacing={4} alignItems="center">
        <Grid item xs={12} md={6} paddingRight={12}>
          <Box>
            <Title variant="h5" gutterBottom fontSize={18}>
              REWARDS,<br/> DELIVERED TO<br/> YOUR DOORSTEP.
            </Title>
            <Description variant="subtitle1" gutterBottom className=' leading-10'>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </Description>
            <Typography
              variant="body2"
              gutterBottom
              style={{ fontWeight: 'bold', marginTop: '20px', marginBottom: '14px' }}
            >
              *See full offer <a href="#" style={{ color: '#0000EE', fontWeight: 'bold' }}>terms</a>
            </Typography>
            <SignUpButton variant="contained">
              Sign Up for Rewards
            </SignUpButton>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <ImageContainer>
            <StyledImage src="/images/contentsection/image.png" alt="Food Image" />
          </ImageContainer>
        </Grid>
      </Grid>
    </BackgroundContainer>
  );
};

export default ContentPage;
